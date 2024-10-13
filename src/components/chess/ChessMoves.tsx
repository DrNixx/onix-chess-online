import React, {PropsWithChildren} from 'react';

import { MovesMode, NavigatorMode } from './Constants';
import DumbMoveList from './move/DumbMoveList';
import DumbMoveTable from './move/DumbMoveTable';

type ChessMovesProps = {
    mode: MovesMode,
    nav: NavigatorMode,
    hasEvals?: boolean,
    toolbars?: React.ReactNode,
}

const ChessMoves: React.FC<PropsWithChildren<ChessMovesProps>> = (props) => {
    const { mode, nav, children, toolbars } = props;

    return (mode === MovesMode.Table) ? (
        <DumbMoveTable
            nav={nav}
            toolbars={toolbars}>{children}</DumbMoveTable>
    ) : (
        <DumbMoveList
            nav={nav}
            toolbars={toolbars}>{children}</DumbMoveList>
    );
};

export default ChessMoves;