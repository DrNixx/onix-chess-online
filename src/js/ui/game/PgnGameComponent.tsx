import React, {Suspense, useContext, useRef, useState} from 'react';
import {useTranslation} from "react-i18next";

import Box from "@mui/material/Box";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";

import {Api} from 'chessground/api';

import {GameProps} from '../../chess/settings/GameProps';
import {renderResult} from './GameUtils';

import Captures from '../components/Captures';
import ChessMoves from '../components/moves/ChessMoves';
import GameInfo from './GameInfo';

import {MovesMode, NavigatorMode} from '../components/Constants';
import GamePgn from '../components/GamePgn';
import DumbGame from "./DumbGame";
import {BoardContext} from "../../providers/BoardProvider";
import {GameContext} from "../../providers/GameProvider";
import Loader from "../Loader";
import BoardToolbar from "../components/BoardToolbar";

const PgnGameComponent: React.FC<GameProps> = (props) => {
    const { board: boardCfg } = props;
    const { t } = useTranslation(['game']);

    const {
        piece,
        orientation,
        moveTable
    } = useContext(BoardContext);

    const {
        fen,
        pgn,
        gameResult
    } = useContext(GameContext);

    const [tabToolbar, setTabToolbar] = useState("moves");

    const cgRef = useRef<Api>();

    const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
        setTabToolbar(newValue);
    };

    const renderControls = () => {
        return (
            <div className="controls flex-grow-1 d-flex flex-column ms-md-4">
                <BoardToolbar configUrl={boardCfg?.configUrl} />

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
                        <TabPanel sx={{px: 0}} value="fenpgn">
                            <Suspense fallback={<Loader />}>
                                <GamePgn fen={fen} pgn={pgn} />
                            </Suspense>
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
            controlsTop={renderResult(gameResult, orientation, "top")}
            controlsBottom={renderResult(gameResult, orientation, "bottom")} />
    );
};

export default PgnGameComponent;
