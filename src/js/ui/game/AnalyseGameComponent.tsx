import React, {Suspense, useCallback, useContext, useMemo, useRef, useState} from 'react';
import {useTranslation} from "react-i18next";

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import { Api } from 'chessground/api';
import { GameProps } from '../../chess/settings/GameProps';

import {renderResult} from './GameUtils';
import { MovesMode, NavigatorMode } from '../components/Constants';
import BoardToolbar from '../components/BoardToolbar';
import ChessMoves from '../components/moves/ChessMoves';
import Captures from '../components/Captures';
import GameInfo from './GameInfo';

import GamePgn from '../components/GamePgn';
import Chat from '../../chat/Chat';

import DumbGame from "./DumbGame";
import {BoardContext} from "../../providers/BoardProvider";
import {GameContext} from "../../providers/GameProvider";
import {AuthContext} from "../../providers/AuthProvider";
import {useTheme} from "@mui/material";
import Loader from "../Loader";

const AnalyseGraphComponent = React.lazy(() => import('../components/analyse/AnalyseGraphDumb'));
const MoveTimesComponent = React.lazy(() => import('../components/movetime/MovesGraphDumb'));

const AnalyseGameComponent: React.FC<GameProps> = (props) => {
    const { board: boardCfg } = props;
    const { t } = useTranslation(['game', 'analyse', 'timer']);
    const theme = useTheme();

    const { getUserId } = useContext(AuthContext);
    const {
        piece,
        orientation,
        moveTable
    } = useContext(BoardContext);

    const {
        gameId,
        fen,
        pgn ,
        gameResult,
        isMyGame,
        isExternal,
        hasMovetimes
    } = useContext(GameContext);

    const observerId = useMemo(() => getUserId(), [getUserId]);

    const [tabToolbar, setTabToolbar] = useState("moves");
    const [tabAnalysis, setTabAnalysis] = useState("fenpgn");

    const cgRef = useRef<Api>();

    const handleTabToolbarChange = useCallback((_event: React.SyntheticEvent, newValue: string) => {
        setTabToolbar(newValue);
    }, []);

    const renderChatTab = useCallback(() => {
        if (observerId) {
            return (
                <Tab label={t("chatTab")} value="chat" />
            );
        }

        return null;
    }, [observerId, t]);

    const renderChatContent = useCallback(() => {
        if (observerId) {
            let chatChannel = `gamechat:${gameId}`;
            if (isMyGame) {
                chatChannel = "$" + chatChannel;
            }

            return (
                <TabPanel sx={{p: 0}} value="chat">
                    <Chat channel={chatChannel} apiUrl="/api/chat" messages={[]} userid={observerId} />
                </TabPanel>
            );
        }

        return null;
    }, [gameId, isMyGame, observerId]);

    const renderControls = useCallback(() => {
        return (
            <div className="controls flex-grow-1 d-flex flex-column ms-md-4">
                <BoardToolbar configUrl={boardCfg?.configUrl} />

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
                                    <ChessMoves
                                        mode={moveTable ? MovesMode.Table : MovesMode.List}
                                        nav={NavigatorMode.Top}
                                        hasComments={true}
                                    />
                                </div>
                                <div className="mt-2 pt-2 border-top">
                                    <Captures piece={piece} />
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
    }, [boardCfg?.configUrl, handleTabToolbarChange, moveTable, piece, renderChatContent, renderChatTab, t, tabToolbar]);

    const renderAnalysisTab = useCallback(() => {
        return (
            <Tab label={t("title", {ns: 'analyse'})} value="analysis" />
        );
    }, [t]);

    const renderAnalysis = useCallback(() => {
        const mh = 400 + parseFloat(theme.spacing(3)) * 2;
        return (
            <TabPanel value="analysis" sx={{ minHeight: mh }}>
                <Suspense fallback={null}>
                    <AnalyseGraphComponent height={mh} />
                </Suspense>
            </TabPanel>
        );
    }, [theme]);

    const renderMovetimeTab = useCallback(() => {
        return (
            <Tab label={"Затраченное время"} value="movetime" />
        );
    }, []);

    const renderMovetime = useCallback(() => {
        const mh = 400 + parseFloat(theme.spacing(3)) * 2;
        return (
            <TabPanel value="movetime" sx={{ minHeight: mh }}>
                <Suspense fallback={null}>
                <MoveTimesComponent height={400} />
                </Suspense>
            </TabPanel>
        );
    }, [theme]);

    const renderFenPgnTab = useCallback(() => {
        return (
            <Tab label={"FEN & PGN"} value="fenpgn" />
        );
    }, []);

    const renderFenPgn = useCallback(() => {
        return (
            <TabPanel value="fenpgn">
                <Suspense fallback={<Loader />}>
                    <GamePgn fen={fen} pgn={pgn} />
                </Suspense>
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
                                    { !isExternal && renderAnalysisTab() }
                                    { hasMovetimes && renderMovetimeTab() }
                                    { renderFenPgnTab() }
                                    { renderCountersTab() }
                                </TabList>
                            </Box>
                            { !isExternal && renderAnalysis() }
                            { hasMovetimes && renderMovetime() }
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

export default AnalyseGameComponent;