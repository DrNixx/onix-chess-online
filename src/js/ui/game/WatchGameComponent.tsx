import React, {useState, useRef, useContext, useMemo, useCallback} from 'react';
import {useTranslation} from "react-i18next";

import Box from "@mui/material/Box";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import {Api } from 'chessground/api';

import {GameProps} from '../../chess/settings/GameProps';

import BoardToolbar from '../components/BoardToolbar';
import Captures from '../components/Captures';
import ChessMoves from '../components/moves/ChessMoves';
import GameInfo from './GameInfo';

import { NavigatorMode, MovesMode } from '../components/Constants';
import Chat from '../../chat/Chat';
import DumbGame from "./DumbGame";
import {BoardContext} from "../../providers/BoardProvider";
import {GameContext} from "../../providers/GameProvider";
import GameTimer from "../components/GameTimer";
import {AuthContext} from "../../providers/AuthProvider";


const WatchGameComponent: React.FC<GameProps> = (props) => {
    const { board: boardCfg } = props;
    const { t } = useTranslation(['game']);

    const { getUserId } = useContext(AuthContext);

    const {
        piece,
        moveTable
    } = useContext(BoardContext);

    const {
        gameId,
        isMyGame
    } = useContext(GameContext);

    const observerId = useMemo(() => getUserId(), [getUserId]);

    const [tabToolbar, setTabToolbar] = useState("moves");

    const cgRef = useRef<Api>();

    const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: string) => {
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
                            <TabList onChange={handleTabChange}>
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
                                        hasComments={false}
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
    }, [boardCfg?.configUrl, handleTabChange, moveTable, piece, renderChatContent, renderChatTab, t, tabToolbar]);

    return (
        <DumbGame
            cgRef={(api) => cgRef.current = api ?? undefined}
            controlsLeft={renderControls()}
            controlsTop={<GameTimer position={"top"} />}
            controlsBottom={<GameTimer position={"bottom"} />} />
    );
};

export default WatchGameComponent;