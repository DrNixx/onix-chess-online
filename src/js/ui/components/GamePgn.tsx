import React from 'react';
import Scrollbar from "react-scrollbars-custom";

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

import { copy } from '../CopyToClipboard';
import TextWithCopy from '../controls/TextWithCopy';
import {useSnackbar} from "notistack";
import {useTranslation} from "react-i18next";

type GamePgnProps = {
    fen: string,
    pgn?: string
}

const GamePgn: React.VFC<GamePgnProps> = (props) => {
    const { fen, pgn } = props;

    const { t } = useTranslation(['chess']);

    const { enqueueSnackbar } = useSnackbar();

    const copyPgn = (e: React.MouseEvent<HTMLPreElement>) => {
        if (copy(pgn)) {
            enqueueSnackbar(t("copied"), {autoHideDuration: 1000});
        }
    };

    return (
        <>
            <Box sx={{padding: .5}}>
                <FormControl variant="standard">
                    <InputLabel shrink htmlFor="bootstrap-input">
                        FEN
                    </InputLabel>
                    <TextWithCopy fullWidth value={fen} placeholder={t("fen")} />
                </FormControl>
            </Box>
            <Box sx={{padding: .5}}>
                <div className="pgn-text">
                    <Scrollbar trackYProps={{style: {width: 5}}}>
                        <pre onClick={copyPgn} className="py-0 ps-0">{pgn}</pre>
                    </Scrollbar>
                </div>
            </Box>
        </>
    );
}

export default GamePgn;