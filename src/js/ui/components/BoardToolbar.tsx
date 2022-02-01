import React from "react";
import {useDispatch} from "react-redux";
import clsx from "clsx";
import { _ } from "../../i18n/i18n";
import * as BoardActions from "../../actions/BoardActions";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import {useSelector} from "react-redux";
import {CombinedGameState} from "../../actions/CombinedGameState";
import {BoardState} from "../../actions/BoardState";


type BoardToolbarProps = {
    configUrl?: string
}

const BoardToolbar: React.FC<BoardToolbarProps> = (props) => {
    const { configUrl, children } = props;

    const board = useSelector<CombinedGameState, BoardState>((state) => state.board );
    const dispatch = useDispatch();

    const flipBoard = () => {
        dispatch({ type: BoardActions.FLIP_BOARD } as BoardActions.BoardAction)
    };

    const toggleMoves = () => {
        dispatch({ type: BoardActions.MOVE_TABLE } as BoardActions.BoardAction)
    };

    const movesClass = clsx("btn btn-default", {
        'active': board.moveTable
    });

    return (
        <div className="mini-controls mt-3 mt-md-0 bg-contrast-low">
            <Box display="flex" justifyContent="space-between" flexWrap="nowrap" sx={{p: 0.5}}>
                <Stack direction="row" alignItems="center" spacing={1} key="tbg_config">
                    { configUrl && (
                        <IconButton
                            size="small"
                            aria-label={_("game", "board_config")}
                            title={_("game", "board_config")}
                            href={configUrl + "?returnUrl=" + window.location.href}>
                            <Icon baseClassName="" className="xi-bddiag" fontSize="inherit" />
                        </IconButton>
                    )}
                    <IconButton
                        size="small"
                        aria-label={_("game", "toggle_moves")}
                        title={_("game", "toggle_moves")}
                        onClick={toggleMoves}>
                        <Icon baseClassName="" className="xi-mlist" fontSize="inherit" />
                    </IconButton>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1} key="tbg_refresh">
                    <IconButton
                        size="small"
                        aria-label={_("game", "flip")}
                        title={_("game", "flip")}
                        onClick={flipBoard}>
                        <Icon baseClassName="" className="xi-refresh" fontSize="inherit" />
                    </IconButton>
                </Stack>
                {children}
            </Box>
        </div>
    );
};

export default BoardToolbar;
