import React, {useCallback, useMemo} from 'react';
import * as cg from 'chessground/types';

import UserBadge from "../user/UserBadge";
import {IChessPlayer} from "../../chess/types/Interfaces";
import {GamePlayers} from "../../chess/Chess";

type Props = {
    players: GamePlayers;
    orientation?: cg.Color;
    
    position: 'top' | 'bottom';
};
const BoardPlayer: React.FC<Props> = ({players, orientation, position}) => {
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
        player ? <UserBadge user={player.user} size="small" popover={false}>{player.rating}</UserBadge> : null
    );
};

export default BoardPlayer;