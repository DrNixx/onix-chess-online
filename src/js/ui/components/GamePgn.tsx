import React from 'react';
import Scrollbar from "react-scrollbars-custom";
import Box from '@mui/material/Box';
import { copy } from '../CopyToClipboard';
import TextWithCopy from '../controls/TextWithCopy';
import {useSnackbar} from "notistack";
import {useTranslation} from "react-i18next";

type GamePgnProps = {
    fen: string,
    pgn?: string
}

const GamePgn: React.FC<GamePgnProps> = (props) => {
    const { fen, pgn } = props;
    const { t } = useTranslation(['chess']);
    const { enqueueSnackbar } = useSnackbar();

    const copyPgn = () => {
        if (copy(pgn)) {
            enqueueSnackbar(t("copied"), {autoHideDuration: 1000});
        }
    };

    return (
        <>
            <Box sx={{padding: .5}}>
                <TextWithCopy fullWidth label={'FEN'} value={fen} placeholder={t("fen")} />
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