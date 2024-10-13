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

    return (mode === MovesMode.Table) ? (
        <DumbMoveTable
            hasComments={hasComments}
            nav={nav}
            toolbars={toolbars}>{ children }</DumbMoveTable>
    ) : (
        <DumbMoveList
            hasComments={hasComments}
            nav={nav}
            toolbars={toolbars}>{ children }</DumbMoveList>
    );
};

export default ChessMoves;