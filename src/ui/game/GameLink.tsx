import React, {useState, useMemo} from 'react';
import {nanoid} from "nanoid";

import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import {IChessGame, IGameData} from "../../chess/types/Interfaces";

type Props = {
    game: IGameData,
    withColor?: boolean
};

const GameLink: React.FC<Props> = ({ game, withColor = true }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const popupId = useMemo(() => nanoid(8), [])

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const renderColorIcon = (game: IChessGame) => {
        return (game.player == "white") ?
            (<i className="ci-alpha-wpw ci-lg" />) :
            (<i className="ci-alpha-bpw ci-lg" />);
    };

    return (
        <>
            <a href={`/${game.game?.id}`}
               aria-owns={open ? popupId : undefined}
               aria-haspopup="true"
               onMouseEnter={handlePopoverOpen}
               onMouseLeave={handlePopoverClose}>
                {withColor && !!game.game && renderColorIcon(game.game)}
                <span className="p-l-5">{ game.game?.event }</span>
            </a>
            <Popover
                id={popupId}
                sx={{
                    pointerEvents: 'none',
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus>
                <Typography sx={{ p: 1 }}>I use Popover.</Typography>
            </Popover>
        </>
    );
};

export default GameLink;