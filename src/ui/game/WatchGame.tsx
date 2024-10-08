import React, {useState, useRef} from 'react';
import {shallowEqual, useSelector} from "react-redux";
import { createRoot } from 'react-dom/client';
import {useTranslation} from "react-i18next";

import Box from "@mui/material/Box";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import {Api } from 'chessground/api';

import {GameProps, defaultProps} from '../../chess/settings/GameProps';

import {CombinedGameState} from '../../actions/CombinedGameState';
import {GameState} from "../../actions/GameState";

import BoardToolbar from '../components/BoardToolbar';
import Captures from '../components/Captures';
import ChessMoves from '../components/ChessMoves';
import GameInfo from './GameInfo';
import GameWrapper from "./GameWrapper";

import { NavigatorMode, MovesMode } from '../components/Constants';
import { renderTimer } from './GameUtils';
import {BoardState} from "../../actions/BoardState";
import Chat from '../../chat/Chat';
import DumbGame from "./DumbGame";


const WatchGame: React.FC<GameProps> = (props) => {
    const { board: boardCfg } = props;

    const { t } = useTranslation(['game']);

    const [tabToolbar, setTabToolbar] = useState("moves");

    const cgRef = useRef<Api>();
    const game = useSelector<CombinedGameState, GameState>((state) => state.game, shallowEqual );
    const board = useSelector<CombinedGameState, BoardState>((state) => state.board, shallowEqual );

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

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabToolbar(newValue);
    };

    const renderControls = () => {
        return (
            <div className="controls flex-grow-1 d-flex flex-column ms-md-4">
                <BoardToolbar configUrl={boardCfg.configUrl} />
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
                        { renderChatContent() }
                    </TabContext>
                </Box>
            </div>
        );
    };

    return (
        <DumbGame
            cgRef={(api) => cgRef.current = api ?? undefined}
            controlsLeft={renderControls()}
            controlsTop={renderTimer(game.engine, board.orientation, "top")}
            controlsBottom={renderTimer(game.engine, board.orientation, "bottom")} />
    );
};

WatchGame.defaultProps = defaultProps;

const GameRunner: React.FC<GameProps> = (props) => {
    return (
        <GameWrapper GameComponent={WatchGame} {...props} />
    );
};

export const watchGame = (props: GameProps, container: HTMLElement) => {
    const root = createRoot(container);
    root.render(React.createElement(GameRunner, props));
};