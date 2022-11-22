import React, {useRef, useState} from 'react';
import {shallowEqual, useSelector} from "react-redux";
import { createRoot } from 'react-dom/client';

import Box from "@mui/material/Box";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";

import {Api } from 'chessground/api';

import {FenString} from '../../chess/FenString';

import {GameProps, defaultProps} from '../../chess/settings/GameProps';

import {CombinedGameState} from '../../actions/CombinedGameState';
import {renderResult} from './GameUtils';

import Captures from '../components/Captures';
import ChessMoves from '../components/ChessMoves';
import GameInfo from './GameInfo';

import {MovesMode, NavigatorMode} from '../components/Constants';
import GamePgn from '../components/GamePgn';
import {GameState} from "../../actions/GameState";
import {BoardState} from "../../actions/BoardState";
import GameWrapper from "./GameWrapper";
import DumbGame from "./DumbGame";
import {useTranslation} from "react-i18next";

const PgnGame: React.FC<GameProps> = (props) => {
    const { board: boardCfg } = props;

    const { t } = useTranslation(['game']);

    const [tabToolbar, setTabToolbar] = useState("moves");

    const cgRef = useRef<Api>();
    const game = useSelector<CombinedGameState, GameState>((state) => state.game, shallowEqual );
    const board = useSelector<CombinedGameState, BoardState>((state) => state.board, shallowEqual );

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabToolbar(newValue);
    };

    const renderControls = () => {
        const { engine } = game;

        const fen = FenString.fromPosition(engine.CurrentPos);
        const pgn = engine.RawData.pgn;

        return (
            <div className="controls flex-grow-1 d-flex flex-column ms-md-4">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={tabToolbar}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleTabChange}>
                                <Tab label={t("movesTab")} value="moves" />
                                <Tab label={t("infoTab")} value="info" />
                                <Tab label="FEN &amp; PGN" value="fenpgn" />
                            </TabList>
                        </Box>
                        <TabPanel sx={{p: 0}} value="moves">
                            <div className="d-flex flex-column h-100">
                                <div className="board-height auto-overflow">
                                    <ChessMoves mode={board.moveTable ? MovesMode.Table : MovesMode.List} nav={NavigatorMode.Top} hasEvals={false} />
                                </div>
                                <div className="mt-2 pt-2 border-top">
                                    <Captures piece={boardCfg.piece} />
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel sx={{p: 0}} value="info">
                            <GameInfo />
                        </TabPanel>
                        <TabPanel sx={{p: 0}} value="fenpgn">
                            <GamePgn fen={fen} pgn={pgn} />
                        </TabPanel>
                    </TabContext>
                </Box>
            </div>
        );
    };

    return (
        <DumbGame
            cgRef={(api) => cgRef.current = api ?? undefined}
            controlsLeft={renderControls()}
            controlsTop={renderResult(game.engine, board.orientation, "top")}
            controlsBottom={renderResult(game.engine, board.orientation, "bottom")} />
    );
};

PgnGame.defaultProps = defaultProps;

const GameRunner: React.FC<GameProps> = (props) => {
    return (
        <GameWrapper GameComponent={PgnGame} {...props} />
    );
};

export const pgnGame = (props: GameProps, container: HTMLElement) => {
    const root = createRoot(container);
    root.render(React.createElement(GameRunner, props));
};