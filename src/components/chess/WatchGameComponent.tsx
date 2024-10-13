import React, {useState, useRef, useContext, useCallback} from 'react';
import {useTranslation} from "react-i18next";

import Box from "@mui/material/Box";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import {Api } from 'chessground/api';

import {GameProps} from '../../chess/settings/GameProps';

import { NavigatorMode, MovesMode } from './Constants';
import BoardToolbar from './board/BoardToolbar';
import Captures from './board/Captures';
import GameTimer from "./board/GameTimer";
import ChessMoves from './move/ChessMoves';
import GameInfo from './GameInfo';

import DumbGame from "./DumbGame";
import {BoardContext} from "../../providers/BoardProvider";

import GameChatTab from "../../components/chess/chat/GameChatTab";
import GameChatPanel from "../../components/chess/chat/GameChatPanel";

const WatchGameComponent: React.FC<GameProps> = (props) => {
    const { board: boardCfg } = props;
    const { t } = useTranslation(['game']);

    const {
        piece,
        moveTable
    } = useContext(BoardContext);

    const [tabToolbar, setTabToolbar] = useState("moves");

    const cgRef = useRef<Api>();

    const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: string) => {
        setTabToolbar(newValue);
    }, []);

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
                                <GameChatTab />
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
                        <GameChatPanel />
                    </TabContext>
                </Box>
            </div>
        );
    }, [boardCfg?.configUrl, handleTabChange, moveTable, piece, t, tabToolbar]);

    return (
        <DumbGame
            cgRef={(api) => cgRef.current = api ?? undefined}
            controlsLeft={renderControls()}
            controlsTop={<GameTimer position={"top"} />}
            controlsBottom={<GameTimer position={"bottom"} />} />
    );
};

export default WatchGameComponent;