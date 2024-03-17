import React, {useCallback, useContext, useMemo, useRef, useState} from 'react';
import { createRoot } from 'react-dom/client';
import {useTranslation} from "react-i18next";

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import { Api } from 'chessground/api';
import { GameProps, defaultProps } from '../../chess/settings/GameProps';

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
import DumbGame from "./DumbGame";
import {BoardContext} from "../../providers/BoardProvider";
import {GameContext} from "../../providers/GameProvider";
import {AuthContext} from "../../providers/AuthProvider";
import {useTheme} from "@mui/material";

const AnalyseGame: React.FC<GameProps> = (props) => {
    const { board: boardCfg } = props;
    const { t } = useTranslation(['game', 'analyse']);
    const theme = useTheme();

    const { getUserId } = useContext(AuthContext);
    const { orientation, moveTable } = useContext(BoardContext);
    const {
        engine,
        fen,
        pgn ,
        gameResult
    } = useContext(GameContext);

    const observerId = useMemo(() => getUserId(), [getUserId]);

    const [tabToolbar, setTabToolbar] = useState("moves");
    const [tabAnalysis, setTabAnalysis] = useState("fenpgn");

    //const store = useStore<CombinedGameState>();
    const cgRef = useRef<Api>();

    // const [mounted, setMounted] = useState(false);;

    const renderChatTab = () => {
        if (observerId) {
            return (
                <Tab label={t("chatTab")} value="chat" />
            );
        }

        return null;
    };

    const renderChatContent = () => {
        if (observerId) {
            let chatChannel = `gamechat:${engine.GameId}`;
            if (engine.isMyGame) {
                chatChannel = "$" + chatChannel;
            }

            return (
                <TabPanel sx={{p: 0}} value="chat">
                    <Chat channel={chatChannel} apiUrl="/api/chat" messages={[]} userid={observerId} />
                </TabPanel>
            );
        }

        return null;
    };

    const handleTabToolbarChange = (_event: React.SyntheticEvent, newValue: string) => {
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
                                    <ChessMoves mode={moveTable ? MovesMode.Table : MovesMode.List} nav={NavigatorMode.Top} hasEvals={true} />
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

    const renderFenPgn = useCallback(() => {
        return (
            <TabPanel value="fenpgn">
                <GamePgn fen={fen} pgn={pgn} />
            </TabPanel>
        );
    }, [fen, pgn]);

    const renderCountersTab = () => {
        return null;
    }

    const renderCounters = () => {
        return null;
    }

    const handleTabAnalysisChange = (_event: React.SyntheticEvent, newValue: string) => {
        setTabAnalysis(newValue);
    };

    const renderUnderboard = () => {
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
                controlsTop={renderResult(gameResult, orientation, "top")}
                controlsBottom={renderResult(gameResult, orientation, "bottom")}
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