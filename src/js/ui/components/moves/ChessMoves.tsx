import React, {PropsWithChildren, useContext} from 'react';
import { MovesMode, NavigatorMode } from '../Constants';
import DumbMoveList from './DumbMoveList';
import DumbMoveTable from './DumbMoveTable';
import {GameContext} from "../../../providers/GameProvider";

type ChessMovesProps = {
    mode: MovesMode,
    nav: NavigatorMode,
    hasComments?: boolean,
    toolbars?: React.ReactNode,
}

const ChessMoves: React.FC<PropsWithChildren<ChessMovesProps>> = (props) => {
    const {
        mode,
        nav,
        hasComments,
        children,
        toolbars
    } = props;

    const {
        getOpening
    } = useContext(GameContext);

    return (mode === MovesMode.Table) ? (
        <DumbMoveTable
            opeinig={getOpening()}
            hasComments={hasComments}
            nav={nav}
            toolbars={toolbars}>{ children }</DumbMoveTable>
    ) : (
        <DumbMoveList
            opeinig={getOpening()}
            hasComments={hasComments}
            nav={nav}
            toolbars={toolbars}>{ children }</DumbMoveList>
    );
};

export default ChessMoves;