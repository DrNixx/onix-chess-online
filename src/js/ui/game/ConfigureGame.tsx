import React, {useRef} from 'react';
import ReactDOM from 'react-dom';

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import FormControl from '@mui/material/FormControl';
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import Switch from "@mui/material/Switch";
import Typography from '@mui/material/Typography';

import {BoardSize} from 'onix-board-assets';

import { Api } from 'chessground/api';
import { Config as CgConfig } from 'chessground/config';
import * as cg from 'chessground/types';

import { _ } from '../../i18n/i18n';

import {FenString} from '../../chess/FenString';
import {BoardSettings} from '../../chess/settings/BoardSettings';
import {GameProps, defaultProps as gameDefaults} from '../../chess/settings/GameProps';

import * as BoardActions from '../../actions/BoardActions';

import SizeSelector from '../controls/SizeSelector';
import PieceSelector from '../controls/PieceSelector';
import SquareSelector from '../controls/SquareSelector';
import { Square } from '../../chess/Square';
import DumbGame from "./DumbGame";
import {renderTimer} from "./GameUtils";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {CombinedGameState} from "../../actions/CombinedGameState";
import {GameState} from "../../actions/GameState";
import {BoardState} from "../../actions/BoardState";
import GameWrapper from "./GameWrapper";
import {GameActions as ga} from "../../actions/GameActions";
import {getLegalMovesMap} from "../../utils/chess";
import IOSSwitch from "../controls/IOSSwitch";
import UsingOptions from "../controls/TestSwitch";

const ConfigureGame: React.VFC<GameProps> = (props) => {
    const { board: boardCfg } = props;

    const cgRef = useRef<Api>();
    const game = useSelector<CombinedGameState, GameState>((state) => state.game, shallowEqual );
    const board = useSelector<CombinedGameState, BoardState>((state) => state.board, shallowEqual );
    const dispatch = useDispatch();

    const onMove = (orig: cg.Key, dest: cg.Key) => {
        const {engine} = game;
        const sm = engine.makeMove(Square.parse(orig)!, Square.parse(dest)!);

        if (sm) {
            dispatch({ type: ga.GAME_ADD_PROVISIONAL, sm: sm } as ga.AddProvisional);
        }
    };

    const generateConfig = (): CgConfig => {
        const {engine} = game;

        const dests = getLegalMovesMap(engine);

        return {
            fen: FenString.fromPosition(engine.CurrentPos),
            orientation: board.orientation,
            coordinates: board.coordinates,
            viewOnly: false,
            movable: {
                free: false,
                color: 'both',
                dests: dests,
                showDests: board.learnMode
            },
            highlight: {
                lastMove: true,
                check: true
            },
            events: {
                move: onMove
            },
        };
    };

    const onConfirmChange = () => {
        dispatch({ type: BoardActions.CONFIRM_MOVE } as BoardActions.BoardAction)
    };

    const onLearnChange = () => {
        dispatch({ type: BoardActions.LEARN_BOARD } as BoardActions.BoardAction)
    };

    const onCoordsChange = () => {
        dispatch({ type: BoardActions.SET_COORDS } as BoardActions.BoardAction)
    };

    const onSizeChange = (size: BoardSize) => {
        dispatch({ type: BoardActions.CHANGE_SIZE, size: size } as BoardActions.BoardAction);
    };

    const onPieceChange = (piece: string) => {
        dispatch({ type: BoardActions.SET_PIECE, piece: piece } as BoardActions.BoardAction);
    };

    const onSquareChange = (square: string) => {
        dispatch({ type: BoardActions.SET_SQUARE, square: square } as BoardActions.BoardAction);
    };

    const onMoveTableChange = () => {
        dispatch({ type: BoardActions.MOVE_TABLE } as BoardActions.BoardAction)
    };

    const renderControls = () => {
        return (
            <Card className="ms-md-4">
                <CardContent>
                    <form method="post">
                        { (boardCfg.csrfTokenName && boardCfg.csrfTokenValue) ? (<input type="hidden" name={boardCfg.csrfTokenName} value={boardCfg.csrfTokenValue} />) : "" }
                        { (boardCfg.returnUrl) ? (<input type="hidden" name="returnUrl" value={boardCfg.returnUrl} />) : "" }
                        <h3>{_("game", "board_and_pieces")}</h3>
                        <Box sx={{marginBottom: 2}}>
                            <FormControl fullWidth>
                                <InputLabel>{_("game", "board_size")}</InputLabel>
                                <SizeSelector
                                    fullWidth
                                    label={_("game", "board_size")}
                                    name="size"
                                    value={board.size}
                                    onChangeSize={onSizeChange} />
                            </FormControl>
                        </Box>
                        <Box sx={{marginBottom: 2}}>
                            <FormControl fullWidth>
                                <InputLabel>{_("chess", "pieces")}</InputLabel>
                                <PieceSelector
                                    fullWidth
                                    label={_("chess", "pieces")}
                                    name="piece"
                                    value={board.piece}
                                    onChangePiece={onPieceChange} />
                            </FormControl>
                        </Box>
                        <Box sx={{marginBottom: 2}}>
                            <FormControl fullWidth>
                                <InputLabel>{_("chess", "squares")}</InputLabel>
                                <SquareSelector
                                    fullWidth
                                    label={_("chess", "squares")}
                                    name="square" value={board.square}
                                    onChangeSquare={onSquareChange} />
                            </FormControl>
                        </Box>
                        <Box sx={{marginBottom: 2}}>
                            <FormControlLabel
                                control={
                                    <IOSSwitch
                                        sx={{m: 1}}
                                        id="coords"
                                        name="coords"
                                        color="primary"
                                        size="small"
                                        value="1"
                                        defaultChecked={boardCfg.coordinates}
                                        onChange={onCoordsChange}
                                    />
                                }
                                label={_("game", "display_coord")}
                            />
                        </Box>

                        <h3>{_("game", "other_settings")}</h3>
                        <Grid container spacing={2}>
                            <Grid item md={6}>
                                <FormControlLabel
                                    control={
                                        <Switch id="hints"
                                                name="hints"
                                                color="primary"
                                                value="1"
                                                defaultChecked={boardCfg.learnMode}
                                                onChange={onLearnChange}
                                        />
                                    }
                                    label={_("game", "display_move_hints")}
                                />
                            </Grid>
                            <Grid item md={6}>
                                <FormControlLabel
                                    control={
                                        <Switch id="confirm"
                                                name="confirm"
                                                value="1"
                                                defaultChecked={boardCfg.confirmMove}
                                                onChange={onConfirmChange}
                                        />
                                    }
                                    label={_("game", "confirm_move_form")}
                                />
                            </Grid>
                            <UsingOptions />
                            <Grid item md={12}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography>{_("game", "moves_mode")}:</Typography>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography>{_("game", "moves_mode_list")}</Typography>
                                        <Switch id="movetable"
                                                name="movetable"
                                                value="1"
                                                defaultChecked={boardCfg.moveTable}
                                                onChange={onMoveTableChange}
                                        />
                                        <Typography>{_("game", "moves_mode_table")}</Typography>
                                    </Stack>
                                </Stack>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
                <CardActions sx={{justifyContent: "flex-end"}}>
                    <Button variant="contained" color="primary" type="submit">{_("app", "save")}</Button>
                </CardActions>
            </Card>
        );
    };


    return (
        <DumbGame
            cgRef={(api) => cgRef.current = api ?? undefined}
            onGenerateConfig={generateConfig}
            controlsLeft={renderControls()}
            controlsTop={renderTimer(game.engine, board.orientation, "top")}
            controlsBottom={renderTimer(game.engine, board.orientation, "bottom")} />
    );
};

ConfigureGame.defaultProps = gameDefaults;

const GameRunner: React.VFC<GameProps> = (props) => {
    return (
        <GameWrapper GameComponent={ConfigureGame} {...props} />
    );
};

export const configureGame = (props: BoardSettings, container: HTMLElement) => {
    const gp: GameProps = {
        ...gameDefaults,
        board: {...props}
    };

    ReactDOM.render(React.createElement(GameRunner, gp), container, () => { });
};