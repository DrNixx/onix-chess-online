import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import clsx from "clsx";
import { Chessground as ChessgroundNative } from 'chessground';
import {Api as CgApi} from 'chessground/api';
import {Config as CgConfig} from "chessground/config";

import Box from "@mui/material/Box";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material";

import {BoardContext} from "../../providers/BoardProvider";
import {GameContext} from "../../providers/GameProvider";


type Props = {
    inPromotion?: boolean;
    cgRef?: React.RefCallback<CgApi>;
    contentTop?: React.ReactNode;
    contentBottom?: React.ReactNode;
    sx?: SxProps<Theme>;
    onGenerateConfig?: () => CgConfig;
};

const defaultProps = {
    inPromotion: false,
};

const Chessground: React.FC<Props> = (propsIn) => {
    const props = {...defaultProps, ...propsIn};
    const {
        cgRef: cgRefCallback,
        contentTop,
        contentBottom,
        sx,
        onGenerateConfig
    } = props;

    const {
        piece,
        orientation,
        coordinates
    } = useContext(BoardContext);

    const {
        fen,
        turnColor,
        lastMove,
        isCheck
    } = useContext(GameContext);

    const cg = useRef<CgApi|null>(null);
    const [inPromotion,] = useState(props.inPromotion);

    const generateConfig = useCallback(() => {
        return onGenerateConfig ? onGenerateConfig() : {
            fen: fen,
            lastMove: lastMove,
            check: isCheck,
            orientation: orientation,
            coordinates: coordinates,
            turnColor: turnColor,
            viewOnly: true,
            highlight: {
                lastMove: true,
                check: true
            },
        };
    }, [coordinates, fen, isCheck, lastMove, onGenerateConfig, orientation, turnColor]);

    const handleRef = useCallback((node: HTMLDivElement) => {
        if (!cg.current) {
            cg.current = node ? ChessgroundNative(node, generateConfig()) : null;
        } else {
            cg.current?.set(generateConfig());
        }

        cgRefCallback && cgRefCallback(cg.current);
    }, [cgRefCallback, generateConfig]);

    const redrawBoard = useCallback(() => {
        cg.current && cg.current.redrawAll();
    }, []);

    useEffect(() => {
        window.addEventListener("resize", redrawBoard);

        return () => {
            window.removeEventListener("resize", redrawBoard);
            cg.current && cg.current.destroy();
        };
    }, [cg, redrawBoard]);

    const renderPromotion = () => {
        /*
        const pieces = ["queen", "rook", "bishop", "knight"].map((role) => {
            return 1; //[color, role as cg.Role];
        });
         */

        if (inPromotion) {
            return (
                <></>
            );
        }

        return null;
    }

    return (
        <Box className={clsx("board-container", piece)} sx={sx}>
            {contentTop}
            <Box sx={{paddingY: 1}}>
                <div className="main-board" ref={handleRef} />
                { renderPromotion() }
            </Box>
            {contentBottom}
        </Box>
    );
};

export default Chessground;