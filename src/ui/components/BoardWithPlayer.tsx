import React, {PropsWithChildren} from 'react';

import Grid from "@mui/material/Grid";

import {Chess as ChessEngine} from "../../chess/Chess";
import Chessground from "../chess/Chessground";
import {Api} from "chessground/api";
import {Config as CgConfig} from "chessground/config";
import BoardPlayer from "./BoardPlayer";

type Props = {
    piece: string;
    engine: ChessEngine;
    config: CgConfig;
    controlsTop?: React.ReactNode;
    controlsBottom?: React.ReactNode;
    cgRef: React.RefCallback<Api>;
}

const BoardWithPlayer: React.FC<PropsWithChildren<Props>> = (props) => {
    const {piece, engine, config, controlsTop, controlsBottom, cgRef, children} = props;
    return (
        <div className="d-block d-md-flex flex-wrap mb-2">
            <div>
                <Chessground
                    sx={{paddingY: 1}}
                    piece={piece}
                    config={config}
                    cgRef={cgRef}
                    contentTop={
                        <Grid container spacing={2}>
                            <Grid item xs={7}>
                                <BoardPlayer players={engine.getPlayers()} orientation={config.orientation} position="top" />
                            </Grid>
                            <Grid item xs={5}>
                                <div className="text-right position-relative">
                                    {controlsTop}
                                </div>
                            </Grid>
                        </Grid>
                    }
                    contentBottom={
                        <Grid container spacing={2}>
                            <Grid item xs={7}>
                                <BoardPlayer players={engine.getPlayers()} orientation={config.orientation} position="bottom" />
                            </Grid>
                            <Grid item xs={5}>
                                <div className="text-right position-relative">
                                    {controlsBottom}
                                </div>
                            </Grid>
                        </Grid>
                    }
                />
            </div>
            { children }
        </div>
    );
};

export default BoardWithPlayer;