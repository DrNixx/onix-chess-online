import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import toSafeInteger from 'lodash/toSafeInteger';
import clsx from "clsx";

import {useTranslation} from "react-i18next";

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import * as cg from 'chessground/types';
import {Config as CgConfig} from 'chessground/config';
import {dragNewPiece} from 'chessground/drag';
import {DrawShape} from 'chessground/draw';
import {eventPosition, isRightButton as isRightButtonEvent} from 'chessground/util';

import {BoardSize, BoardSizeClasses} from 'onix-board-assets';
import {IChessOpening} from '../../chess/types/Interfaces';
import {Castling, CastlingSide, CastlingStr} from '../../chess/Castling';
import {FenFormat, FenString} from '../../chess/FenString';
import {pushif} from '../../fn/array';
import {Position} from '../../chess/Position';
import {Chess} from '../../chess/Chess';
import { toName as colorToName, toChar as colorToChar, White, Black } from '../../chess/Color';
import { isSquare, name as squareName, parse as squareParse } from '../../chess/Square';
import { toChar as pieceToChar, create as pieceCreate, King, Queen } from '../../chess/Piece';
import SizeSelector from './controls/SizeSelector';
import SquareSelector from './controls/SquareSelector';
import PieceSelector from './controls/PieceSelector';
import WhoMoveSelector from './controls/WhoMoveSelector';
import StartPosSelector from './controls/StartPosSelector';
import TextWithCopy from '../../ui/TextWithCopy';

import {postMessage} from '../../net/PostMessage';
import {Api} from "chessground/api";
import Chessground from "./board/Chessground";
import AlertContext from '../../context/AlertContext';
import {BW} from "../../chess/types/Colors";


type Selected = "pointer" | "trash" | [cg.Color, cg.Role];

// can be 'pointer', 'trash', or [color, role]
function joinSelected(s: Selected, delimeter: string): string {
    return (s === "pointer" || s === "trash") ? s : s.join(delimeter);
}

function selectedToClass(s: Selected): string {
    return joinSelected(s, " ");
}

function selectedToCursor(s: Selected): string {
    return "cursor-" + joinSelected(s, "-")
}

/*
function classToSelected(c: string): Selected | undefined {
    if ((c === "pointer" || c === "trash")) {
        return c;
    } else {
        const parts = c.split(/\s/);
        if (parts.length === 2) {
            return ([parts[0] as cg.Color, parts[1] as cg.Role]);
        }
    }
    
    return undefined;
}
*/

let lastTouchMovePos: cg.NumberPair | undefined;

type Props = {
    locale?: string,
    url?: string,
    dialog?: boolean,

    fen?: string,

    orientation?: cg.Color,
    showTurn?: boolean,
    coordinates?: boolean,

    size: BoardSize,
    piece?: string,
    square?: string,
    markers?: string,

    openings?: IChessOpening[],
};

const defaultProps = {
    locale: "ru-ru",
    url: "https://www.chess-online.com/fen.png",
    dialog: false,

    fen: FenString.standartStart,

    orientation: 'white' as cg.Color,
    showTurn: false,
    coordinates: true,

    size: BoardSize.Normal,
    piece: "alpha",
    square: "color-blue",
    markers: "",
    openings: []
};

const PosBuilder: React.FC<Props> = (propsIn) => {
    const props = {...defaultProps, ...propsIn};

    const [piece, setPiece] = useState(props.piece);
    const [square, setSquare] = useState(props.square);
    const [size, setSize] = useState(props.size);
    const [coordinates, setCoordinates] = useState(props.coordinates);
    const [flipped, setFlipped] = useState(props.orientation == 'black');
    const [showTurn, setShowTurn] = useState(props.showTurn);

    const pos = useMemo(() => {
        return new Position(props.fen);
    }, [props.fen]);

    const [fen, setFen] = useState(FenString.fromPosition(pos, FenFormat.board));
    const [whoMove, setWhoMove] = useState(pos.WhoMove);
    const [castling, setCastling] = useState(pos.Castling.asFen());
    const [ep_target, setEpTarget] = useState(pos.EpTarget);
    const [halfMove, setHalfMove] = useState(pos.HalfMoveCount);
    const [moveNo, setMoveNo] = useState(Chess.plyToTurn(pos.PlyCount));
    const [markers, setMarkers] = useState(props.markers);
    const [selected, setSelected] = useState<Selected>('pointer');

    const cgRef = useRef<Api>();

    const { t } = useTranslation(['builder', 'chess', 'core']);

    const markersToShapes = (str?: string) => {
        const shapes: DrawShape[] = [];

        if (str !== undefined) {
            const r = /(\w+\[\w{2,4}])/g;
            const ri = /(?<brush>[a-zA-Z]+)\[(?<orig>[a-h][1-8])(?<dest>[a-h][1-8])?]/;
            const matches = str.match(r);
            if (matches) {
                for (let i = 0; i < matches.length; i++) {
                    const p = matches[i].match(ri);
                    if (p && p.groups) {
                        shapes.push({
                            orig: p.groups.orig as cg.Key,
                            dest: p.groups.dest as cg.Key,
                            brush: p.groups.brush,
                        });
                    }
                }
            }
        }
        
        return shapes;
    };

    const shapesToMarkers = (shapes: DrawShape[]) => {
        const marks: string[] = [];
        shapes.forEach((shape) => {
            let str = shape.brush + "[" + shape.orig;
            if (shape.dest !== undefined) {
                str += shape.dest;
            }

            str += "]";


            marks.push(str);
        });

        return marks.join(";");
    };

    const assignShapes = (shapes?: string | DrawShape[]) => {
        let result = "";
        if (cgRef.current) {
            let sh: DrawShape[] = [];
            if (shapes !== undefined) {
                if (typeof shapes === "string") {
                    sh = markersToShapes(shapes);
                } else {
                    sh = shapes;
                }
            }

            cgRef.current.setShapes(sh.filter(s => !!s.brush && !!cgRef.current?.state.drawable.brushes[s.brush]));
            result = shapesToMarkers(cgRef.current.state.drawable.shapes);
        }

        return result;
    };

    const onPositionChange = () => {
        if (cgRef.current) {
            setFen(FenString.trim(cgRef.current.getFen(), FenFormat.board));
        }

        return true;
    };

    const onDrawShape = (shapes: DrawShape[]) => {
        const ms = shapesToMarkers(shapes);
        setMarkers(ms);
    };

    const initialConfig = useCallback((): CgConfig => {
        const p = new Position(props.fen);
        return {
            fen: FenString.fromPosition(p, FenFormat.board),
            orientation: props.orientation,
            turnColor: colorToName(p.WhoMove),
            coordinates: !!props.coordinates,
            autoCastle: false,
            movable: {
                free: true,
                color: 'both'
            },
            premovable: {
                enabled: false
            },
            drawable: {
                enabled: true,
                visible: true,
                eraseOnClick: false
            },
            draggable: {
                showGhost: true,
                deleteOnDropOff: true
            },
            selectable: {
                enabled: false
            },
            highlight: {
                lastMove: false
            },
            events: {
                change: onPositionChange
            },
        }
    }, [props.coordinates, props.fen, props.orientation]);

    useEffect(() => {
        if (cgRef.current) {
            cgRef.current.state.drawable.onChange = onDrawShape;
            assignShapes(markers);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cgRef.current]);

    useEffect(() => {
        const shapes = markers;
        if (cgRef.current) {
            cgRef.current?.set({
                coordinates: coordinates,
                turnColor: colorToName(whoMove),
                fen: fen
            });
        }

        assignShapes(shapes);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [coordinates, whoMove, fen]);

    useEffect(() => {
        if (cgRef.current) {
            const orientation = flipped ? 'black' : 'white';
            if (cgRef.current.state.orientation != orientation) {
                cgRef.current.toggleOrientation();
            }
        }
    }, [flipped]);

    const onFlipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const orientation = e.target.checked ? 'black' : 'white';
        setFlipped(orientation == 'black');
    };

    const onStartChange = (fen: string) => {
        const def = FenString.toDefenition(fen);
        let cast = castling;
        if (def.castlingSet) {
            cast = def.castling.asFen();
        }

        setMoveNo(def.moveNo);
        setHalfMove(def.halfMoves);
        setEpTarget(def.eptarget);
        setCastling(cast);
        setWhoMove(def.color);
        setFen(def.board);
    };

    const onCastleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const cast = new Castling(castling);
        if (e.target.checked) {
            cast.on(e.target.value);
        } else {
            cast.off(e.target.value);
        }

        setCastling(cast.asFen());
    };

    const onMarkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMarkers(e.target.value);
        assignShapes(e.target.value);
    }

    const renderCastlingGroup = (color: BW, castling?: CastlingStr) => {
        const cast = new Castling(castling);
        
        return (
            <Card>
                <CardHeader title={t(colorToName(color), { ns: "chess" })} sx={{ pb: 0 }} />
                <CardContent sx={{ pt: 0 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={5}>
                            <FormControlLabel 
                                control={
                                    <Switch id ="wck" 
                                        value={pieceToChar(pieceCreate(color, King))}
                                        onChange={onCastleChange}
                                        defaultChecked={cast.has(color, CastlingSide.King)} />
                                } 
                                label={Castling.K} />
                        </Grid>
                        <Grid item xs={7}>
                            <FormControlLabel 
                                control={
                                    <Switch id ="wcq" 
                                        value={pieceToChar(pieceCreate(color, Queen))}
                                        onChange={onCastleChange}
                                        defaultChecked={cast.has(color, CastlingSide.Queen)} />
                                } 
                                label={Castling.Q} />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        );
    }

    const renderDialogButton = (visible: boolean, code: string) => {
        const executeDialog = () => {
            if (window.parent) {
                const parent_url = decodeURIComponent(document.location.hash.replace(/^#/, ""));
                postMessage(code, parent_url, parent);
            }
        };

        return (visible) ? (
            <Box className="py-3">
                <Button variant="contained" onClick={executeDialog}>
                    {t("paste_forum_code", { ns: "builder" }).toString()}
                </Button>
            </Box>
        ) : null;
    }

    const onSelectSparePiece = (s: Selected, upEvent: "mouseup" | "touchend"): (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => void => {
        return function(e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) {
            e.preventDefault();
            if (s === 'pointer' || s === 'trash') {
                setSelected(s);
            } else {
                setSelected('pointer');

                if (cgRef.current) {
                    dragNewPiece(cgRef.current.state, {
                        color: s[0],
                        role: s[1]
                    }, e.nativeEvent as cg.MouchEvent, true);

                    document.addEventListener(upEvent, (e: MouseEvent | TouchEvent) => {
                        const eventPos = eventPosition(e as cg.MouchEvent) || lastTouchMovePos;
                        if (eventPos && cgRef.current?.getKeyAtDomPos(eventPos)) {
                            setSelected('pointer');
                        } else {
                            setSelected(s);
                        }
                    }, { once: true });
                }
            }
        }
    };

    const renderSpare = (color: cg.Color, position: "top" | "bottom") => {
        const selectedClass = selectedToClass(selected);
        const pieces = ["king", "queen", "rook", "bishop", "knight", "pawn"].map((role): Selected => {
            return [color, role as cg.Role];
        });

        const squares: Selected[] = ["pointer", ...pieces, "trash"];

        const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
            lastTouchMovePos = eventPosition(e as any);
        };

        const renderPieces = () => {
            return squares.map((s: Selected, i) => {
                const pieceClass = selectedToClass(s);
                const selectedSquare = selectedClass === pieceClass && (
                    !cgRef.current ||
                    !cgRef.current.state.draggable.current ||
                    !cgRef.current.state.draggable.current.newPiece);

                const attrs = {
                    ...((s !== "pointer" && s !== "trash") ? {
                        "data-color": s[0],
                        "data-role": s[1]
                    } : {})
                };

                const sqClass = [
                    "no-square",
                    {
                        "pointer": s === "pointer",
                        "trash": s === "trash",
                        "selected-square": selectedSquare
                    }
                ];

                return (
                    <div key={i} className={clsx(sqClass)}>
                        <div>
                            <div className={clsx(pieceClass)} data-kind="piece"
                                onMouseDown={onSelectSparePiece(s, "mouseup")} 
                                onTouchStart={onSelectSparePiece(s, "touchend")} 
                                onTouchMove={onTouchMove} {...attrs}></div>
                        </div>
                    </div>
                );
            });
        }

        const spareClass = [
            "spare",
            `spare-${position}`, 
            `spare-${color}`
        ];


        return (
            <div className={clsx(spareClass)}>
                { renderPieces() }
            </div>
        );
    };

    let downKey: cg.Key | undefined;
    let lastKey: cg.Key | undefined;
    let placeDelete: boolean | undefined;

    const deleteOrHidePiece = (key: cg.Key, e: Event) => {
        if (e.type === 'touchstart') {
            if (cgRef.current?.state.pieces.get(key)) {
                (cgRef.current.state.draggable.current?.element as HTMLElement).style.display = 'none';
                cgRef.current.cancelMove();
            }

            document.addEventListener('touchend', () => deletePiece(key), { once: true });
        } else if (e.type === 'mousedown' || key !== downKey) {
            deletePiece(key);
        }
    };

    const deletePiece = (key: cg.Key): void => {
        cgRef.current?.setPieces(new Map([
          [key, undefined]
        ]));
        
        onPositionChange();
    };

    const boardEvent = (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
        function isLeftButton(e: MouseEvent | TouchEvent): boolean {
            return (e instanceof MouseEvent) && (e.buttons === 1 || e.button === 1);
        }
          
        function isLeftClick(e: MouseEvent | TouchEvent): boolean {
            return isLeftButton(e) && !e.ctrlKey;
        }

        function isRightClick(e: MouseEvent | TouchEvent): boolean {
            return ((e instanceof MouseEvent) && isRightButtonEvent(e)) || (e.ctrlKey && isLeftButton(e));
        }

        const sel = selected;
        // do not generate corresponding mouse event
        // (https://developer.mozilla.org/en-US/docs/Web/API/Touch_events/Supporting_both_TouchEvent_and_MouseEvent)
        if (sel !== 'pointer' && e.cancelable && (e.type === 'touchstart' || e.type === 'touchmove')) {
            e.preventDefault();
        }

        if (isLeftClick(e.nativeEvent) || e.type === 'touchstart' || e.type === 'touchmove') {
            if (sel === 'pointer' || (cgRef.current && cgRef.current.state.draggable.current && cgRef.current.state.draggable.current.newPiece)) {
                return;
            }

            const pos = eventPosition(e.nativeEvent as cg.MouchEvent);
            if (!pos) {
                return;
            }

            const key = cgRef.current?.getKeyAtDomPos(pos);
            if (!key) {
                return;
            }

            if (e.type === 'mousedown' || e.type === 'touchstart') downKey = key;
            if (sel === 'trash') {
                deleteOrHidePiece(key, e.nativeEvent);
            } else {
                const existingPiece = cgRef.current?.state.pieces.get(key);
                const piece = {
                    color: sel[0] as cg.Color,
                    role: sel[1] as cg.Role
                };
                
                const samePiece = existingPiece && piece.color == existingPiece.color && piece.role == existingPiece.role;

                if ((e.type === 'mousedown' || e.type === 'touchstart') && samePiece) {
                    deleteOrHidePiece(key, e.nativeEvent);
                    placeDelete = true;
                    const endEvents = { mousedown: 'mouseup', touchstart: 'touchend' };
                    document.addEventListener(endEvents[e.type], () => placeDelete = false, { once: true });
                } else if (!placeDelete && (e.type === 'mousedown' || e.type === 'touchstart' || key !== lastKey)) {
                    cgRef.current?.setPieces(new Map([
                        [key, piece]
                    ]));

                    onPositionChange();
                    cgRef.current?.cancelMove();
                }
            }

            lastKey = key;


        } else if (isRightClick(e.nativeEvent)) {
            //TODO: Block
        }
    }

    const fullFen = useMemo((): string => {
        const cast = new Castling(castling);
        const ep = isSquare(ep_target) ? squareName(ep_target) : "-";
        return fen + " " + colorToChar(whoMove ?? White) + " " + cast.asFen() + " " + ep + " " + halfMove?.toString() + " " + moveNo?.toString();
    }, [castling, ep_target, fen, halfMove, moveNo, whoMove]);

    const containerClass = useMemo(() => {
        return [
            "pos-builder",
            "is2d",
            square,
            BoardSizeClasses[size],
            { "coords-no": !coordinates }
        ];
    }, [coordinates, size, square]);

    const fenParams = useCallback(() => {
        const shapes = markersToShapes(markers);
        const marks = shapesToMarkers(shapes);

        const params: any[] = [];
        pushif(params, (size !== 2), ["size", size]);
        pushif(params, flipped, ["fb", 1]);
        pushif(params, !!showTurn, ["who", 1]);
        pushif(params, !coordinates, ["hl", 1]);
        pushif(params, (piece !== defaultProps.piece), ["pset", encodeURIComponent(piece ?? '')]);
        pushif(params, (square !== defaultProps.square), ["sset", encodeURIComponent(square ?? '')]);
        pushif(params, !!markers, ["mv", encodeURIComponent(marks)]);

        return params;
    }, [coordinates, flipped, markers, piece, showTurn, size, square]);

    const makeCode = useCallback((): string => {
        const el = document.createElement("div");
        el.innerHTML = encodeURIComponent(fullFen);

        const params = fenParams();

        params.forEach(element => {
            el.setAttribute(element[0], element[1]);
        });

        return el.outerHTML.replace(/div/g, "gc:fen");
    }, [fenParams, fullFen]);

    const makeLink = useCallback((): string => {
        let img = props.url || "https://www.chess-online.com/fen.png"
        img += "?fen=" + encodeURIComponent(fullFen);

        const params = fenParams();

        if (params.length > 0) {
            img += "&" + params.map(function(val){
                return val.join("=");
            }).join("&")
        }

        return img;
    }, [fenParams, fullFen, props.url]);

    return (
        <Container maxWidth="xl" className={clsx(containerClass)}>
            <Box>
                <div className="d-block d-lg-flex">
                    <div className={clsx("board-container", piece)}>
                        <div className="holder-container">
                            { renderSpare((flipped ? "white": "black"), "top") }
                        </div>
                        <div className={clsx(selectedToCursor(selected))}
                             onTouchStart={boardEvent}
                             onTouchMove={boardEvent}
                             onMouseDown={boardEvent}
                             onMouseMove={boardEvent}
                             onContextMenu={boardEvent}>
                            <Chessground onGenerateConfig={initialConfig} cgRef={(api) => cgRef.current = (api ?? undefined)} />
                        </div>
                        <div className="holder-container">
                            { renderSpare((flipped ? "black": "white"), "bottom") }
                        </div>

                        {renderDialogButton(!!props.dialog, makeCode())}
                        <Stack spacing={2} sx={{my: 2}}>
                            <TextWithCopy 
                                label={t("fen", { ns: "chess" }).toString()}
                                value={fullFen} 
                                size="small" 
                                fullWidth 
                                variant="outlined" 
                                placeholder={t("fen", { ns: "chess" })} />
                            <TextWithCopy 
                                label={t("image_link", { ns: "builder" }).toString()}
                                value={makeLink()} 
                                size="small" 
                                fullWidth 
                                variant="outlined"
                                placeholder={t("image_link", { ns: "builder" })} />
                            <TextWithCopy 
                                label={t("forum_code", { ns: "builder" }).toString()}
                                value={makeCode()} 
                                size="small" 
                                fullWidth 
                                variant="outlined"
                                placeholder={t("forum_code", { ns: "builder" })} />
                        </Stack>
                    </div>
                    <div className="controls flex-grow-1 ps-lg-4 py-4">
                        <div className="pos-sets mb-4">
                            <Grid container spacing={2}>
                                <Grid item md={4}>
                                    <FormControl fullWidth>
                                        <InputLabel>{t("board_size", { ns: "builder" }).toString()}</InputLabel>
                                        <SizeSelector 
                                            label={t("board_size", { ns: "builder" }).toString()} 
                                            value={size}
                                            onChangeSize={(e) => setSize(e)} />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4}>
                                    <FormControl fullWidth>
                                        <InputLabel>{t("pieces", { ns: "chess" }).toString()}</InputLabel>
                                        <PieceSelector 
                                            label={t("pieces", { ns: "chess" }).toString()} 
                                            value={piece} 
                                            onChangePiece={(e) => setPiece(e)} />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4}>
                                    <FormControl fullWidth>
                                        <InputLabel>{t("squares", { ns: "chess" }).toString()}</InputLabel>
                                        <SquareSelector 
                                            label={t("squares", { ns: "chess" }).toString()} 
                                            value={square} 
                                            onChangeSquare={(e) => setSquare(e)} />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </div>

                        <div className="pos-start mb-4">
                            <Grid container spacing={2}>
                                <Grid item md={8} sm={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>{t("position_label", { ns: "builder" }).toString()}</InputLabel>
                                        <StartPosSelector
                                            label={t("position_label", { ns: "builder" }).toString()}
                                            fen={fullFen}
                                            openingsPos={props.openings}
                                            onChangeFen={onStartChange}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} sm={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>{t("who_move", { ns: "chess" }).toString()}</InputLabel>
                                        <WhoMoveSelector 
                                            label={t("who_move", { ns: "chess" }).toString()}
                                            value={whoMove} 
                                            onChangeTurn={(color) => {
                                                setWhoMove(color);
                                            }} />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </div>

                        <div className="pos-params mb-4">
                            <div><strong>{t("pos_param", { ns: "builder" }).toString()}</strong></div>
                            <Grid container spacing={2}>
                                <Grid item md={3} sm={6}>
                                    <FormControl>
                                        <InputLabel>{t("move_no", { ns: "chess" }).toString()}</InputLabel>
                                        <FormControl
                                            size="small"
                                            defaultValue={moveNo?.toString()}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setMoveNo(toSafeInteger(e.target.value));
                                            }} />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} sm={6}>
                                    <FormControl>
                                        <InputLabel>{t("ep_target", { ns: "chess" }).toString()}</InputLabel>
                                        <FormControl
                                            size="small"
                                            defaultValue={ep_target}
                                            title={t("ep_target_hint", { ns: "builder" })}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setEpTarget(squareParse(e.target.value));
                                            }} />
                                    </FormControl>
                                </Grid>
                                <Grid item md={6}>
                                    <FormControl>
                                        <InputLabel>{t("marks", { ns: "builder" }).toString()}</InputLabel>
                                        <Input
                                            size="small"
                                            value={markers ?? ''}
                                            title={t("marks_hint", { ns: "builder" })}
                                            onChange={onMarkChange} />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </div>

                        <div className="pos-castle">
                            <div><strong>{t("castle", { ns: "chess" }).toString()}</strong></div>
                            <Grid container spacing={2}>
                                <Grid item md={6}>
                                    {renderCastlingGroup(White, castling)}
                                </Grid>
                                <Grid item md={6}>
                                    {renderCastlingGroup(Black, castling)}
                                </Grid>
                            </Grid>
                        </div>
                        <div className="pos-display">
                            <Grid container spacing={2}>
                                <Grid item md={3} sm={6}>
                                    <FormControlLabel
                                        control={
                                            <Switch checked={flipped} onChange={onFlipChange} />
                                        }
                                        label={t("display_flip", { ns: "builder" }).toString()}
                                    />
                                </Grid>
                                <Grid item md={3} sm={6}>
                                    <FormControlLabel
                                        control={
                                            <Switch checked={coordinates} onChange={(e) => {
                                                setCoordinates(e.target.checked);
                                            }} />
                                        }
                                        label={t("display_coord", { ns: "builder" }).toString()}
                                    />
                                </Grid>
                                <Grid item md={3} sm={6}>
                                    <FormControlLabel
                                        control={
                                            <Switch checked={showTurn} onChange={(e) => {
                                                setShowTurn(e.target.checked);
                                            }} />
                                        }
                                        label={t("display_showturn", { ns: "builder" }).toString()}
                                    />
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </div>
            </Box>
        </Container>
    );
}

const PosBuilderComponent: React.FC<Props> = (props) => {
    return (
        <AlertContext>
            <PosBuilder {...props} />
        </AlertContext>
    );
};

export const setupPosition = (props: Props, container: HTMLElement) => {
    const root = createRoot(container);
    root.render(React.createElement(PosBuilderComponent, props));
};