import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import clsx from "clsx";
import Box from "@mui/material/Box";

import { Chessground as ChessgroundNative } from 'chessground';

import { Api as CgApi } from 'chessground/api';
import {Config as CgConfig} from "chessground/config";

import {SxProps} from "@mui/system";
import {Theme} from "@mui/material";

type Props = {
    piece?: string;
    square?: string;

    inPromotion?: boolean;

    config?: CgConfig;

    cgRef?: React.RefCallback<CgApi>;

    contentTop?: React.ReactNode;

    contentBottom?: React.ReactNode;

    sx?: SxProps<Theme>;
};

const defaultProps = {
    piece: "alpha",
    square: "color-blue",
    inPromotion: false,
    config: {},
};

const Chessground: React.FC<Props> = (propsIn) => {
    const props = {...defaultProps, ...propsIn};

    const { cgRef: cgRefCallback, config, square, piece, contentTop, contentBottom, sx } = props;

    const [inPromotion, setInPromotion] = useState(props.inPromotion);
    const boardElement = useRef<HTMLDivElement>(null);

    const cg = useMemo(() => {
        cg && cg.destroy();
        const result = boardElement.current ? ChessgroundNative(boardElement.current, config) : null;
        cgRefCallback && cgRefCallback(result);
        return result;
    }, [cgRefCallback, config]);

    const redrawBoard = useCallback(() => {
        cg && cg.redrawAll();
    }, [cg]);

    useEffect(() => {
        window.addEventListener("resize", redrawBoard);

        return () => {
            window.removeEventListener("resize", redrawBoard);
            cg && cg.destroy();
        };
    }, [cg, redrawBoard]);

    const renderPromotion = () => {
        const pieces = ["queen", "rook", "bishop", "knight"].map((role) => {
            return 1; //[color, role as cg.Role];
        });

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
                <div className="main-board" ref={boardElement} />
                { renderPromotion() }
            </Box>
            {contentBottom}
        </Box>
    );
};

export default Chessground;