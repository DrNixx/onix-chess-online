import React, {PropsWithChildren, useContext} from 'react';
import { Move } from '../../chess/Move';
import { MovesMode, NavigatorMode } from './Constants';
import { DumbMoveList } from './DumbMoveList';
import { DumbMoveTable } from './DumbMoveTable';
import {GameContext} from "../../providers/GameProvider";

type ChessMovesProps = {
    mode: MovesMode,
    nav: NavigatorMode,
    hasEvals?: boolean,
    toolbars?: React.ReactNode,
}

const ChessMoves: React.FC<PropsWithChildren<ChessMovesProps>> = (props) => {
    const {
        mode,
        nav,
        hasEvals,
        children,
        toolbars
    } = props;

    const { navigateToKey, navigateToMove } = useContext(GameContext);

    const onChangeKey = (key: string) => {
        navigateToKey(key);
    }

    const onChangePos = (move: Move) => {
        navigateToMove(move);
    }

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