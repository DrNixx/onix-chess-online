import React from 'react';
import * as cg from "chessground/types";

import clsx from "clsx";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import {renderPlayer} from "../game/GameUtils";
import {Chess as ChessEngine} from "../../chess/Chess";

type Props = {
    piece: string;
    engine: ChessEngine;
    orientation: cg.Color;
    controlsTop?: React.ReactNode;
    controlsBottom?: React.ReactNode;
    boardRef?: React.Ref<HTMLDivElement>;
}

const BoardWithPlayer: React.FC<Props> = (props) => {
    const {piece, engine, orientation, controlsTop, controlsBottom, boardRef, children} = props;
    return (
        <div className="d-block d-md-flex flex-wrap mb-2">
            <div>
                <div className={clsx("board-container", piece)}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            {renderPlayer(engine, orientation, "top")}
                        </Grid>
                        <Grid item xs={6}>
                            <div className="text-right position-relative">
                                {controlsTop}
                            </div>
                        </Grid>
                    </Grid>
                    <Box sx={{paddingY: 1}}>
                        <div className="main-board" ref={boardRef} />
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            {renderPlayer(engine, orientation, "bottom")}
                        </Grid>
                        <Grid item xs={6}>
                            <div className="text-right position-relative">
                                {controlsBottom}
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </div>
            { children }
        </div>
    );
};

export default BoardWithPlayer;