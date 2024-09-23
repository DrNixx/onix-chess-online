import React, {useContext, useMemo} from 'react';

import UserBadge from "../user/UserBadge";
import {IChessPlayer} from "../../chess/types/Interfaces";
import {GameContext} from "../../providers/GameProvider";
import {BoardContext} from "../../providers/BoardProvider";

type Props = {
    position: 'top' | 'bottom';
};
const BoardPlayer: React.FC<Props> = ({position}) => {
    const { orientation  } = useContext(BoardContext);
    const { getPlayers } = useContext(GameContext);
    const players = useMemo(() => getPlayers(), [getPlayers]);

    const player = useMemo(() => {
        let result: IChessPlayer | undefined;
        if (orientation == "black") {
            result = (position == "bottom") ? players.black : players.white;
        } else {
            result = (position == "bottom") ? players.white : players.black;
        }

        return result;
    }, [orientation, players.black, players.white, position]);
    
    return (
        player ? <UserBadge key={player.user.id} user={player.user} size="small" popover={false}>{player.rating}</UserBadge> : null
    );
};

export default BoardPlayer;