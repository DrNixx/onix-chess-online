import React from 'react';
import {useDispatch, useSelector} from "react-redux";

import { Move } from '../../chess/Move';
import { MovesMode, NavigatorMode } from './Constants';
import { DumbMoveList } from './DumbMoveList';
import { DumbMoveTable } from './DumbMoveTable';
import { GameActions } from '../../actions/GameActions';
import {CombinedGameState} from "../../actions/CombinedGameState";
import {GameState} from "../../actions/GameState";

type ChessMovesProps = {
    mode: MovesMode,
    nav: NavigatorMode,
    hasEvals?: boolean,
    toolbars?: React.ReactNode,
}

const ChessMoves: React.FC<ChessMovesProps> = (props) => {
    const { mode, nav, hasEvals, children, toolbars } = props;

    const game = useSelector<CombinedGameState, GameState>((state) => state.game );
    const dispatch = useDispatch();

    const onChangeKey = (key: string) => {
        dispatch({ type: GameActions.NAVIGATE_TO_KEY, move: key } as GameActions.GameAction);
    }

    const onChangePos = (move: Move) => {
        dispatch({ type: GameActions.NAVIGATE_TO_MOVE, move: move } as GameActions.GameAction);
    }

    const {engine} = game;
    const currMove = engine.CurrentMove;

    return (mode === MovesMode.Table) ? (
        <DumbMoveTable
            startPly={engine.StartPlyCount}
            game={engine}
            opeinig={engine.Eco}
            hasEvals={hasEvals}
            currentMove={currMove}
            nav={nav}
            toolbars={toolbars}
            onChangePos={onChangePos}
            onChangeKey={onChangeKey}>{ children }</DumbMoveTable>
    ) : (
        <DumbMoveList
            startPly={engine.StartPlyCount}
            game={engine}
            opeinig={engine.Eco}
            hasEvals={hasEvals}
            currentMove={currMove}
            nav={nav}
            toolbars={toolbars}
            onChangePos={onChangePos}
            onChangeKey={onChangeKey}>{ children }</DumbMoveList>
    );
};

export default ChessMoves;