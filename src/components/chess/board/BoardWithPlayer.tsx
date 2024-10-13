import React, {PropsWithChildren} from 'react';

import Grid from "@mui/material/Grid2";

import Chessground from "./Chessground";
import {Api} from "chessground/api";
import BoardPlayer from "./BoardPlayer";
import {Config as CgConfig} from "chessground/config";

type Props = {
    controlsTop?: React.ReactNode;
    controlsBottom?: React.ReactNode;
    cgRef: React.RefCallback<Api>;
    onGenerateConfig?: () => CgConfig;
}

const BoardWithPlayer: React.FC<PropsWithChildren<Props>> = (props) => {
    const {
        controlsTop,
        controlsBottom,
        cgRef,
        onGenerateConfig,
        children
    } = props;
    return (
        <div className="d-block d-md-flex align-items-md-start flex-wrap mb-2">
            <div>
                <Chessground
                    sx={{paddingY: 1}}
                    cgRef={cgRef}
                    onGenerateConfig={onGenerateConfig}
                    contentTop={
                        <Grid container spacing={2}>
                            <Grid size={{xs: 7}}>
                                <BoardPlayer position="top" />
                            </Grid>
                            <Grid size={{xs: 5}}>
                                <div className="text-right position-relative">
                                    {controlsTop}
                                </div>
                            </Grid>
                        </Grid>
                    }
                    contentBottom={
                        <Grid container spacing={2}>
                            <Grid size={{xs: 7}}>
                                <BoardPlayer position="bottom" />
                            </Grid>
                            <Grid size={{xs: 5}}>
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