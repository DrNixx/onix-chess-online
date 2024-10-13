import React, {PropsWithChildren, useContext} from "react";
import { useTranslation } from 'react-i18next';
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import {BoardContext} from "../../../providers/BoardProvider";

type BoardToolbarProps = {
    configUrl?: string
}

const BoardToolbar: React.FC<PropsWithChildren<BoardToolbarProps>> = (props) => {
    const { configUrl, children } = props;
    const { t } = useTranslation(['game']);
    const {
        // moveTable,
        toggleMoves,
        flipBoard
    } = useContext(BoardContext);

    /*
    const movesClass = clsx("btn btn-default", {
        'active': moveTable
    });
     */

    return (
        <div className="mini-controls mt-3 mt-md-0 bg-contrast-low">
            <Box display="flex" justifyContent="space-between" flexWrap="nowrap" sx={{p: 0.5}}>
                <Stack direction="row" alignItems="center" spacing={1} key="tbg_config">
                    { configUrl && (
                        <IconButton
                            size="small"
                            aria-label={t("board_config")}
                            title={t("board_config")}
                            href={configUrl + "?returnUrl=" + window.location.href}>
                            <Icon baseClassName="" className="xi-bddiag" fontSize="inherit" />
                        </IconButton>
                    )}
                    <IconButton
                        size="small"
                        aria-label={t("toggle_moves")}
                        title={t("toggle_moves")}
                        onClick={toggleMoves}>
                        <Icon baseClassName="" className="xi-mlist" fontSize="inherit" />
                    </IconButton>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1} key="tbg_refresh">
                    <IconButton
                        size="small"
                        aria-label={t("flip")}
                        title={t("flip")}
                        onClick={() => flipBoard() }>
                        <Icon baseClassName="" className="xi-refresh" fontSize="inherit" />
                    </IconButton>
                </Stack>
                {children}
            </Box>
        </div>
    );
};

export default BoardToolbar;
