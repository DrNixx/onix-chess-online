import React, {useCallback, useEffect, useRef, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import { createRoot } from 'react-dom/client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from "@mui/material/Card";
import CardHeader from '@mui/material/CardHeader';
import CardContent from "@mui/material/CardContent";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import Icon from "@mui/material/Icon";
import Stack from "@mui/material/Stack";

import {Api} from 'chessground/api';
import {Config as CgConfig} from 'chessground/config';
import * as cg from 'chessground/types';

import {Color} from '../../chess/Color';

import {GameProps, defaultProps} from '../../chess/settings/GameProps';

import {GameActions as ga} from '../../actions/GameActions';
import {CombinedGameState} from '../../actions/CombinedGameState';

import BoardToolbar from '../components/BoardToolbar';
import Captures from '../components/Captures';
import ChessMoves from '../components/ChessMoves';
import GameInfo from './GameInfo';

import {MovesMode, NavigatorMode} from '../components/Constants';
import {renderTimer} from './GameUtils';

import {Squares} from '../../chess/types/Types';
import {Square} from '../../chess/Square';
import {Piece} from '../../chess/Piece';

import GamePgn from '../components/GamePgn';
import {FenString} from '../../chess/FenString';
import Chat from '../../chat/Chat';
import {Logger} from '../../common/Logger';
import {GameState} from "../../actions/GameState";
import {BoardState} from "../../actions/BoardState";
import GameWrapper from "./GameWrapper";
import DumbGame from "./DumbGame";
import {getLegalMovesMap} from "../../utils/chess";
import {useTranslation} from "react-i18next";
import {useRoom} from "../../hooks/useRoom";
import {GAME} from "../../models/stream/IStreamMessage";

enum BoardMode {
    Play = 0,
    Analyse = 1,
    Conditional = 2,
}

interface ProvisionalMove {
    from?: Squares.Square;
    to?: Squares.Square;
    promotion?: string;
    isValid?: boolean;
}

type PlayGameProps = GameProps;

const PlayGame: React.FC<PlayGameProps> = (props) => {
    const { board: boardCfg } = props;

    const { t } = useTranslation(['game', 'core']);

    const cgRef = useRef<Api>();
    const game = useSelector<CombinedGameState, GameState>((state) => state.game, shallowEqual );
    const board = useSelector<CombinedGameState, BoardState>((state) => state.board, shallowEqual );
    const dispatch = useDispatch();

    const [tabToolbar, setTabToolbar] = useState(game.engine.isStarted ? "moves" : "info");

    const [mode, setMode] = useState<BoardMode>(BoardMode.Play);
    const [provisionalMove, setProvisionalMove] = useState<ProvisionalMove>({});
    const [drawChecked, setDrawChecked] = useState(false);
    const [confirmMove, setConfirmMove] = useState(board.confirmMove);
    const [confirmResign, setConfirmResign] = useState(false);
    const [manualFrom, setManualFrom] = useState<string|undefined>();
    const [manualTo, setManualTo] = useState<string|undefined>();

    const [lastMessage, onlineUsers] = useRoom(`game:${game.engine.GameId}`);

    const isPlay = useCallback(() => {
        return mode === BoardMode.Play;
    }, [mode]);

    const isAnalyse = useCallback(() => {
        return mode === BoardMode.Analyse;
    }, [mode]);

    const isConditional = useCallback(() => {
        return mode === BoardMode.Conditional;
    }, [mode]);

    const baseConfig = (): CgConfig => {
        const { engine } = game;

        const wm = engine.ToMove;
        const turnColor = Color.toName(wm);

        if (engine.CurrentMove.isLast()) {
            const dests = getLegalMovesMap(engine);
            return {
                fen: game.fen,
                orientation: board.orientation,
                coordinates: board.coordinates,
                lastMove: game.lastMove,
                check: game.isCheck,
                turnColor: turnColor,
                viewOnly: isPlay() ? (!engine.isStarted || (wm !== engine.Player)) : false,
                movable: {
                    free: false,
                    color: isPlay() ? Color.toName(engine.Player) : 'both',
                    dests: dests,
                    showDests: isPlay() ? board.learnMode : true
                }
            };
        } else {
            return {
                fen: game.fen,
                lastMove: game.lastMove,
                check: game.isCheck,
                turnColor: turnColor,
                viewOnly: true,
                orientation: board.orientation,
                coordinates: board.coordinates,
            };
        }
    };

    const generateConfig = () => {
        return {
            ...baseConfig(),
            highlight: {
                lastMove: true,
                check: true
            },
            events: {
                // change: onPositionChange
                move: onMove,
                select: onSelect,
            },
        }
    };

    useEffect(() => {
        if (lastMessage?.t == GAME) {
            if (lastMessage?.ctx.c == "delete") {
                window.location.href = "/";
            } else if (lastMessage?.ctx.c == "reload") {
                window.location.reload();
            }
        }

    }, [lastMessage]);

    const validFrom = (sq: Squares.Square) => {
        const { engine } = game;

        if (engine.isStarted) {
            const pos = engine.CurrentPos;

            const movingPiece = pos.getPiece(sq);
            if (!Piece.isPiece(movingPiece)) {
                return false;
            }

            return Piece.color(movingPiece) == pos.WhoMove;
        }

        return false;
    };

    const canMove = (from?: Squares.Square, to?: Squares.Square) => {
        const { engine } = game;

        if (to !== undefined) {
            return from !== undefined;
        } else if (from !== undefined) {
            return validFrom(from);
        } else {
            return !isPlay() || engine.CurrentMove.provisional || (engine.isStarted && !engine.isFinished && engine.isMyMove);
        }
    };

    const sendMove = () => {
        const { csrfTokenName, csrfTokenValue } = boardCfg;
        const { engine } = game;

        const apiUrl = engine.RawData.url?.api;
        if (isPlay() && provisionalMove.from && provisionalMove.to && apiUrl) {
            const data: any = {
                from: Square.name(provisionalMove.from),
                to: Square.name(provisionalMove.to),
                promotion: provisionalMove.promotion,
                draw: drawChecked
            };

            if (csrfTokenName) {
                data[csrfTokenName] = csrfTokenValue;
            }

            fetch(
                apiUrl, {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify(data)
                })
                .then(function(response) {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                })
                .catch(function(error) {
                    Logger.error('Looks like there was a problem when posting move: \n', error);
                });
        }
    };

    const doMove = (from?: Squares.Square, to?: Squares.Square, promote?: string) => {
        if (from && to) {
            const { engine } = game;

            const sm = engine.makeMove(from, to);
            if (sm) {
                if (engine.CurrentPos.isLegalMove(sm)) {
                    if (engine.InPromotion) {

                    } else {
                        if (confirmMove || !isPlay) {
                            provisionalMove.from = from;
                            provisionalMove.to = to;
                            provisionalMove.isValid = true;

                            setProvisionalMove({...provisionalMove});
                            setManualFrom(undefined);
                            setManualTo(undefined);
                            dispatch({ type: ga.GAME_ADD_PROVISIONAL, sm: sm } as ga.AddProvisional);
                        } else {
                            setProvisionalMove({});
                            setManualFrom(undefined);
                            setManualTo(undefined);
                            sendMove();
                        }
                    }
                } else {
                    setProvisionalMove({});
                    setManualFrom(undefined);
                    setManualTo(undefined);
                }
            }
        }
    };

    const onMove = (orig: cg.Key, dest: cg.Key, capturedPiece?: cg.Piece) => {
        const from = Square.parse(orig);
        const to = Square.parse(dest);

        doMove(from, to);
    };

    const onSelect = (key: cg.Key) => {
        const from = Square.parse(key);
        if (canMove(from)) {
            provisionalMove.from = from;
            provisionalMove.to = undefined;
            provisionalMove.isValid = false;
            setProvisionalMove({...provisionalMove})
        }
    };

    const returnToPlay = () => {
        setProvisionalMove({});
        setManualFrom(undefined);
        setManualTo(undefined);
        setMode(BoardMode.Play);
        cgRef.current?.cancelMove();
        dispatch({ type: ga.GAME_REMOVE_PROVISIONAL } as ga.RemoveProvisional);
    };

    /**
     * Do move with confirm
     */
    const moveClick = () => {
        sendMove();
    };

    const modeTurnOn = (newMode: BoardMode) => {
        setMode(newMode);
    };

    const toggleForm = () => {
        setConfirmMove(!confirmMove);
    }

    const confirmToggler = () => {
        return (
            <div className="ms-auto">
                <div className="form-group field-advance required">
                    <div className="form-check switch switch-lg primary">
                        <input type="checkbox" id="advance" className="custom-check-input" name="advance" value="1" checked={confirmMove} onChange={toggleForm} />
                        <label htmlFor="advance">{t("confirm_move_form")}</label>
                    </div>
                </div>
            </div>
        );
    };

    const drawCheck = () => {
        setDrawChecked(!drawChecked);
    }

    //#region From - To handler
    const changeFrom = (e: React.ChangeEvent) => {
        let val: string | undefined = undefined;

        if (canMove()) {
            val = (e.target as HTMLInputElement).value;
            if (val && val.length == 2) {
                const from = Square.parse(val);
                if (from && validFrom(from)) {
                    provisionalMove.from = from;
                    if (provisionalMove.from) {
                        cgRef.current?.selectSquare(Square.name(provisionalMove.from) as cg.Key);
                    }
                }

                val = undefined;
            }
        }

        setProvisionalMove({...provisionalMove});
        setManualFrom(val);
    };

    const changeTo = (e: React.ChangeEvent) => {
        let val: string | undefined = (e.target as HTMLInputElement).value;
        if (val && (val.length == 2) && provisionalMove.from) {
            provisionalMove.to = Square.parse(val);
            doMove(provisionalMove.from, provisionalMove.to);
            val = undefined;
        }

        setProvisionalMove({...provisionalMove});
        setManualTo(val);
    };
    //#endregion From - To handler

    //#region Toolbar + forms
    const moveForm = () => {
        const fromVal = manualFrom ?? (provisionalMove?.from ? Square.name(provisionalMove.from) : "");
        const toVal = manualTo ?? (provisionalMove?.to ? Square.name(provisionalMove.to) : "");
        const disableForm = !canMove();

        return (
            <Box display="flex" justifyContent="flex-end" sx={{paddingBottom: 5}}>
                <div>
                    <div className="form-check primary">
                        <input type="checkbox" id="sendDraw" checked={drawChecked} onChange={drawCheck} disabled={disableForm} />
                        <label htmlFor="sendDraw">{t("send_draw")}</label>
                    </div>
                </div>
                { confirmMove ?  (
                    <div className="ms-auto ps-4 move-form">
                        <input aria-label={t('move_from')} type="text" value={fromVal} onChange={changeFrom} disabled={disableForm} />
                        <span className="px-2">&mdash;</span>
                        <input aria-label={t('move_to')} type="text" value={toVal} onChange={changeTo} disabled={disableForm} />
                        <Button color="success" className="ms-2" onClick={moveClick} disabled={!provisionalMove.isValid || disableForm}>{t("move_button")}</Button>
                        <Button className="ms-2" onClick={returnToPlay} disabled={disableForm || (!fromVal && !toVal)}>{t("reset_button")}</Button>
                    </div>
                ) : ""}
            </Box>
        );
    };

    const analyseForm = () => {
        return (
            <Box display="flex" justifyContent="space-between" flexWrap="nowrap" sx={{p: 1}}>
                <Stack direction="row" spacing={1}>
                    <Button onClick={returnToPlay}>{t("close_analyse")}</Button>
                </Stack>
            </Box>
        );
    };

    const conditionalForm = () => {
        return (
            <Box display="flex" justifyContent="space-between" flexWrap="nowrap" sx={{p: 1}}>
                <Stack direction="row" spacing={1}>
                    <Button onClick={returnToPlay}>{t("close_conditional")}</Button>
                </Stack>
            </Box>
        );
    };

    const showResignDialog = () => {
        setConfirmResign(true);
    };

    const resignDialog = () => {
        const {engine} = game;

        const hideResignDialog = () => {
            setConfirmResign(false);
        };

        const doResign = () => {
            const { csrfTokenName, csrfTokenValue } = boardCfg;

            const apiUrl = engine.RawData.url?.api;
            if (isPlay() && apiUrl) {
                const data: any = {
                    mode: "resign"
                };

                if (csrfTokenName) {
                    data[csrfTokenName] = csrfTokenValue;
                }

                fetch(
                    apiUrl, {
                        method: "POST",
                        mode: "cors",
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8'
                        },
                        body: JSON.stringify(data)
                    })
                    .then(function(response) {
                        if (!response.ok) {
                            throw Error(response.statusText);
                        }
                    })
                    .catch(function(error) {
                        Logger.error('Looks like there was a problem when send resign command: \n', error);
                    });
            }

            hideResignDialog();
        };

        return (
            <Dialog open={confirmResign} onClose={hideResignDialog}>
                <DialogTitle>
                    <Typography component="h5">{t("confirm_action", {ns: "core"})}</Typography>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t("do_resign_confirm")}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={hideResignDialog}>{t("cancel", {ns: "core"})}</Button>
                    <Button color="warning" onClick={doResign}>{t("do_resign")}</Button>
                </DialogActions>
            </Dialog>
        );
    };



    const renderToolbar = () => {
        const {engine} = game;
        const fen = FenString.fromPosition(engine.CurrentPos);

        let analink = `https://live.chess-online.com/analysis/${fen}?ccid=${engine.GameId}`;
        if (!game.engine.RawData.game?.advance) {
            analink += `&ha=${engine.GameId}`;
        }

        const items: JSX.Element[] = [];
        if (game.engine.isStarted) {
            items.push(
                <Stack direction="row" spacing={1} key="tbg_resign">
                    <IconButton
                        key="tb_resign"
                        color="warning"
                        size="small"
                        aria-label={t("do_resign")}
                        title={t("do_resign")}
                        onClick={showResignDialog}>
                        <Icon baseClassName="" className="xi-resign" fontSize="inherit" />
                    </IconButton>
                </Stack>
            );
            items.push(
                <Stack direction="row" spacing={1} key="tbg_analyse">
                    <IconButton
                        key="tb_inboard_analyse"
                        size="small"
                        aria-label={t("inboard_analyse")}
                        title={t("inboard_analyse")}
                        onClick={() => modeTurnOn(BoardMode.Analyse)}>
                        <Icon baseClassName="" className="xi-onboard" fontSize="inherit" />
                    </IconButton>
                    <IconButton
                        key="tb_external_analyse"
                        size="small"
                        aria-label={t("external_analyse")}
                        title={t("external_analyse")}
                        href={analink}>
                        <Icon baseClassName="" className="xi-analysis" fontSize="inherit" />
                    </IconButton>
                    <IconButton
                        key="tb_conditional"
                        size="small"
                        aria-label={t("conditional")}
                        title={t("conditional")}
                        onClick={() => modeTurnOn(BoardMode.Conditional)}>
                        <Icon baseClassName="" className="xi-qtree" fontSize="inherit" />
                    </IconButton>
                </Stack>
            );
        }

        items.push(
            <Stack direction="row" spacing={1} key="tbg_next_game">
                <IconButton
                    key="tb_next_game"
                    size="small"
                    aria-label={t("next_game")}
                    title={t("next_game")}
                    onClick={() => { return false; }}>
                    <Icon baseClassName="" className="xi-next-game" fontSize="inherit" />
                </IconButton>
            </Stack>
        );

        return items;
    };
    //#endregion Toolbar + forms

    //#region Moves
    const renderMovesTab = () => {
        return (game.engine.isStarted) ? (
            <Tab label={t("movesTab")} value="moves" />
        ) : null;
    };

    const renderMovesPane  = () => {
        if (game.engine.isStarted) {

            let toolbar: JSX.Element | null;
            switch (mode) {
                case BoardMode.Analyse:
                    toolbar = analyseForm();
                    break;
                case BoardMode.Conditional:
                    toolbar = conditionalForm();
                    break;
                default:
                    toolbar = moveForm();
            }

            return (
                <TabPanel sx={{p: 0}} value="moves">
                    <div className="d-flex flex-column h-100">
                        <div className="board-height auto-overflow">
                            <ChessMoves mode={board.moveTable ? MovesMode.Table : MovesMode.List} nav={NavigatorMode.Top} hasEvals={false} toolbars={toolbar} >
                                { isPlay() ? confirmToggler() : "" }
                            </ChessMoves>
                        </div>
                        <div className="mt-2 pt-2 border-top">
                            <Captures piece={board.piece} />
                        </div>
                    </div>
                </TabPanel>
            );
        }

        return null;
    };
    //#endregion Moves

    //#region PGN
    const renderPgnTab = () => {
        const {engine} = game;
        return (engine.isStarted && engine.RawData.game?.advance) ? (
            <Tab label="FEN &amp; PGN" value="fenpgn" />
        ) : null;
    };

    const renderPgnPane = () => {
        const {engine} = game;
        if (engine.isStarted && engine.RawData.game?.advance) {
            const fen = FenString.fromPosition(engine.CurrentPos);
            const pgn = engine.RawData.pgn;
            return (
                <TabPanel sx={{p: 0}} value="fenpgn">
                    <GamePgn fen={fen} pgn={pgn} />
                </TabPanel>
            );
        }

        return null;
    };
    //#endregion PGN

    //#region Chat
    const renderChatTab = () => {
        return (game.engine.isStarted) ? (
            <Tab label={t("chatTab")} value="chat" />
        ) : null;
    };

    const renderChatPane  = () => {
        const {engine} = game;
        if (engine.isStarted) {
            let chatChannel = `gamechat:${engine.GameId}`;
            if (engine.isMyGame) {
                chatChannel = "$" + chatChannel;
            }

            return (
                <TabPanel sx={{p: 0}} value="chat">
                    <Chat channel={chatChannel} apiUrl="/api/chat" messages={[]} userid={engine.ObserverId} />
                </TabPanel>
            );
        }

        return null;
    };
    //#endregion Chat

    //#region Notes
    const renderNotesTab = () => {
        return (game.engine.isStarted) ? (
            <Tab label={t("notesTab")} value="notes" />
        ) : null;
    };

    const renderNotes = () => {
        return (
            <div>Notes</div>
        );
    };

    const renderNotesPane = () => {
        return (game.engine.isStarted) ? (
            <TabPanel sx={{p: 0}} value="notes">
                {renderNotes()}
            </TabPanel>
        ) : null;
    };
    //#endregion Notes

    //#region Accept-reject form
    const acceptGame = () => {
        const {engine} = game;
        const { csrfTokenName, csrfTokenValue } = boardCfg;
        const apiUrl = engine.RawData.url?.api;

        if (apiUrl) {
            const data: any = {};

            if (csrfTokenName) {
                data[csrfTokenName] = csrfTokenValue;
            }

            fetch(
                apiUrl, {
                    method: "PUT",
                    mode: "cors",
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify(data)
                })
                .then(function(response) {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                })
                .catch(function(error) {
                    Logger.error('Looks like there was a problem when accept game: \n', error);
                });
        }
    };

    const rejectGame = () => {
        const {engine} = game;
        const { csrfTokenName, csrfTokenValue } = boardCfg;
        const apiUrl = engine.RawData.url?.api;

        if (apiUrl) {
            const data: any = {};

            if (csrfTokenName) {
                data[csrfTokenName] = csrfTokenValue;
            }

            fetch(
                apiUrl, {
                    method: "DELETE",
                    mode: "cors",
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify(data)
                })
                .then(function(response) {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                })
                .catch(function(error) {
                    Logger.error('Looks like there was a problem when reject game: \n', error);
                });
        }
    };

    const infoAddForm = () => {
        const {engine} = game;
        const form: JSX.Element | null = null;

        if (!engine.isStarted) {
            if (engine.isChallengeFromMe) {
                return (
                    <Card className="w-75 mx-auto mt-4">
                        <CardHeader className="separator">
                            <h3>{t("waitOpponent")}</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="mt-3"><i className="xi-hourglass xi-3x me-2 pull-left" />{t("waitOpponentNote")}</p>
                            <br/>
                            <Box className="text-center mt-2">
                                <Button color="warning" onClick={() => rejectGame()}>{ t("cancel_challenge") }</Button>
                            </Box>
                        </CardContent>
                    </Card>
                );
            } else if (engine.isChallengeToMe) {
                return (
                    <Card className="w-75 mx-auto mt-4">
                        <CardHeader className="separator">
                            <h3>{t("acceptChallenge")}</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="mt-3"><i className="xi-hourglass xi-3x me-2 pull-left" />{t("acceptChallengeNote")}</p>
                            <br/>
                            <Grid container spacing={2}>
                                <Grid item xs={6} className="text-right">
                                    <Button color="primary" onClick={() => acceptGame()}>{t("accept", {ns: "core"})}</Button>
                                </Grid>
                                <Grid item xs={6} className="text-right">
                                    <div className="text-right position-relative">
                                        <Button color="warning" onClick={() => rejectGame()}>{t("decline", {ns: "core"})}</Button>
                                    </div>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                );
            } else if (engine.isNewGame && engine.isMyGame) {
                return (
                    <Card className="w-75 mx-auto mt-4">
                        <CardHeader className="separator">
                            <h3>{t("waitJoin")}</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="mt-3"><i className="xi-hourglass xi-3x me-2 pull-left" />{t("waitJoinNote")}</p>
                            <br/>
                            <Box className="text-center">
                                <Button color="warning" onClick={() => rejectGame()}>{ t("cancel_game") }</Button>
                            </Box>
                        </CardContent>
                    </Card>
                );
            } else if (engine.isNewGame && !engine.isMyGame) {
                return (
                    <Card className="w-75 mx-auto mt-4">
                        <CardHeader className="separator">
                            <h3>{t("canJoin")}</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="mt-3"><i className="xi-hourglass xi-3x me-2 pull-left" />{t("canJoinNote")}</p>
                            <br/>
                            <Box className="text-center">
                                <Button color="primary" onClick={() => acceptGame()}>{t("join", {ns: "core"}) }</Button>
                            </Box>
                        </CardContent>
                    </Card>
                );
            }
        }

        return form;
    }
    //#endregion Accept-reject form

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabToolbar(newValue);
    };

    const renderControls = () => {
        return (
            <div className="controls flex-grow-1 d-flex flex-column ms-md-4">
                <BoardToolbar configUrl={boardCfg.configUrl}>{renderToolbar()}</BoardToolbar>

                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={tabToolbar}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleTabChange}>
                                { renderMovesTab() }
                                <Tab label={t("infoTab")} value="info" />
                                { renderPgnTab() }
                                { renderChatTab() }
                                { renderNotesTab() }
                            </TabList>
                        </Box>
                        { renderMovesPane() }
                        <TabPanel sx={{p: 0}} value="info">
                            <GameInfo>{ infoAddForm() }</GameInfo>
                        </TabPanel>
                        { renderPgnPane() }
                        { renderChatPane() }
                        { renderNotesPane() }
                    </TabContext>
                </Box>
                {resignDialog()}
            </div>
        );
    };

    return (
        <DumbGame
            cgRef={(api) => cgRef.current = (api ?? undefined)}
            onGenerateConfig={generateConfig}
            controlsLeft={renderControls()}
            controlsTop={renderTimer(game.engine, board.orientation, "top")}
            controlsBottom={renderTimer(game.engine, board.orientation, "bottom")} />
    );
};

PlayGame.defaultProps = {
    ...defaultProps
};

const GameRunner: React.FC<PlayGameProps> = (props) => {
    return (
        <GameWrapper GameComponent={PlayGame} {...props} />
    );
};

export const playGame = (props: PlayGameProps, container: HTMLElement) => {
    const root = createRoot(container);
    root.render(React.createElement(GameRunner, props));
};