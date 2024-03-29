import React, {useRef, useState, useEffect} from 'react';
import { createRoot } from 'react-dom/client';
import {shallowEqual, useSelector, useStore} from "react-redux";
import {useTranslation} from "react-i18next";

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { createTheme } from '@mui/material/styles';

import { Api } from 'chessground/api';
import { FenString } from '../../chess/FenString';
import { GameProps, defaultProps } from '../../chess/settings/GameProps';
import {CombinedGameState} from '../../actions/CombinedGameState';

import {renderResult} from './GameUtils';
import { MovesMode, NavigatorMode } from '../components/Constants';
import BoardToolbar from '../components/BoardToolbar';
import ChessMoves from '../components/ChessMoves';
import Captures from '../components/Captures';
import GameInfo from './GameInfo';
import AnalyseGraphAsync from '../components/analyse/AnalyseGraphAsync';
import MovesGraphAsync from '../components/movetime/MovesGraphAsync';

import GamePgn from '../components/GamePgn';
import Chat from '../../chat/Chat';

import GameWrapper from "./GameWrapper";
import {BoardState} from "../../actions/BoardState";
import {GameState} from "../../actions/GameState";
import DumbGame from "./DumbGame";


const theme = createTheme();

const AnalyseGame: React.FC<GameProps> = (props) => {
    const { board: boardCfg } = props;

    const { t, ready } = useTranslation(['game', 'analyse']);

    const [tabToolbar, setTabToolbar] = useState("moves");
    const [tabAnalysis, setTabAnalysis] = useState("fenpgn");

    const store = useStore<CombinedGameState>();
    const cgRef = useRef<Api>();
    const game = useSelector<CombinedGameState, GameState>((state) => state.game, shallowEqual );
    const board = useSelector<CombinedGameState, BoardState>((state) => state.board, shallowEqual );

    // const [mounted, setMounted] = useState(false);;

    const renderChatTab = () => {
        if (game.engine.ObserverId) {
            return (
                <Tab label={t("chatTab")} value="chat" />
            );
        }

        return null;
    };

    const renderChatContent = () => {
        const { engine } = game;

        if (engine.ObserverId) {
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

    const handleTabToolbarChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabToolbar(newValue);
    };

    const renderControls =  () => {
        return (
            <div className="controls flex-grow-1 d-flex flex-column ms-md-4">
                <BoardToolbar configUrl={boardCfg.configUrl} />

                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={tabToolbar}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleTabToolbarChange}>
                                <Tab label={t("movesTab")} value="moves" />
                                <Tab label={t("infoTab")} value="info" />
                                { renderChatTab() }
                            </TabList>
                        </Box>
                        <TabPanel sx={{p: 0}} value="moves">
                            <div className="d-flex flex-column h-100">
                                <div className="board-height auto-overflow">
                                    <ChessMoves mode={board.moveTable ? MovesMode.Table : MovesMode.List} nav={NavigatorMode.Top} hasEvals={true} />
                                </div>
                                <div className="mt-2 pt-2 border-top">
                                    <Captures piece={boardCfg.piece} />
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel sx={{p: 0}} value="info">
                            <GameInfo />
                        </TabPanel>
                        { renderChatContent() }
                    </TabContext>
                </Box>
            </div>
        );
    };

    const renderAnalysisTab = () => {
        return (
            <Tab label={t("title", {ns: 'analyse'})} value="analysis" />
        );
    };

    const renderAnalysis = () => {
        const mh = 400 + parseFloat(theme.spacing(3)) * 2;
        return (
            <TabPanel value="analysis" sx={{ minHeight: mh }}>
                <AnalyseGraphAsync
                    height={400} />
            </TabPanel>
        );
    };

    const renderMovetimeTab = () => {
        return (
            <Tab label={"Затраченное время"} value="movetime" />
        );
    };

    const renderMovetime = () => {
        const mh = 400 + parseFloat(theme.spacing(3)) * 2;
        return (
            <TabPanel value="movetime" sx={{ minHeight: mh }}>
                <MovesGraphAsync
                    height={400} />
            </TabPanel>
        );
    };

    const renderFenPgnTab = () => {
        return (
            <Tab label={"FEN & PGN"} value="fenpgn" />
        );
    };

    const renderFenPgn = () => {
        const {engine} = game;
        const fen = FenString.fromPosition(engine.CurrentPos);
        const pgn = engine.RawData.pgn;

        return (
            <TabPanel value="fenpgn">
                <GamePgn fen={fen} pgn={pgn} />
            </TabPanel>
        );
    };

    const renderCountersTab = () => {
        return null;
    }

    const renderCounters = () => {
        return null;
    }

    const handleTabAnalysisChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabAnalysis(newValue);
    };

    const renderUnderboard = () => {
        const {engine} = game;
        return (
            <Box>
                <div className="underboard">
                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext value={tabAnalysis}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleTabAnalysisChange} aria-label="lab API tabs example">
                                    { engine.RawData.game?.insite && renderAnalysisTab() }
                                    { engine.RawData.game?.moveCentis && renderMovetimeTab() }
                                    { renderFenPgnTab() }
                                    { renderCountersTab() }
                                </TabList>
                            </Box>
                            { engine.RawData.game?.insite && renderAnalysis() }
                            { engine.RawData.game?.moveCentis && renderMovetime() }
                            { renderFenPgn() }
                            { renderCounters() }
                        </TabContext>
                    </Box>
                </div>
            </Box>
        );
    };

    return (
        <DumbGame
                cgRef={(api) => cgRef.current = api ?? undefined}
                controlsLeft={renderControls()}
                controlsTop={renderResult(game.engine, board.orientation, "top")}
                controlsBottom={renderResult(game.engine, board.orientation, "bottom")}
            >{ renderUnderboard() }</DumbGame>

    );
};

AnalyseGame.defaultProps = defaultProps;

const GameRunner: React.FC<GameProps> = (props) => {
    return (
        <GameWrapper GameComponent={AnalyseGame} {...props} />
    );
};

export const analyseGame = (props: GameProps, container: HTMLElement) => {
    const root = createRoot(container);
    root.render(React.createElement(GameRunner, props));
};