import React from 'react';

import { Move } from '../../chess/Move';
import { MovesMode, NavigatorMode } from './Constants';
import { DumbMoveList } from './DumbMoveList';
import { DumbMoveTable } from './DumbMoveTable';
import { GameRelatedStore } from '../../actions/GameStore';
import { GameActions } from '../../actions/GameActions';

export interface ChessMovesProps {
    mode: MovesMode,
    nav: NavigatorMode,
    store: GameRelatedStore,
    hasEvals?: boolean,
    toolbars?: React.ReactNode,
}

export class ChessMoves extends React.Component<ChessMovesProps, {}> {
    /**
     * constructor
     */
    constructor(props: ChessMovesProps) {
        super(props);
    }

    private onChangeKey = (key: string) => {
        const { store } = this.props;
        store.dispatch({ type: GameActions.NAVIGATE_TO_KEY, move: key } as GameActions.GameAction);
    }

    private onChangePos = (move: Move) => {
        const { store } = this.props;
        store.dispatch({ type: GameActions.NAVIGATE_TO_MOVE, move: move } as GameActions.GameAction);
    }

    render() {
        const { store, mode, nav, hasEvals, children, toolbars } = this.props;
        const state = store.getState();
        const { engine } = state.game;
        const currMove = engine.CurrentMove;

        if (mode === MovesMode.Table) {
            return (
                <DumbMoveTable 
                    startPly={engine.StartPlyCount}
                    game={engine}
                    opeinig={engine.Eco}
                    hasEvals={hasEvals}
                    currentMove={currMove}
                    nav={nav}
                    toolbars={toolbars}
                    onChangePos={this.onChangePos} 
                    onChangeKey={this.onChangeKey}>{ children }</DumbMoveTable>
                
            );
        } else if (mode === MovesMode.List) {
            return (
                <DumbMoveList 
                    startPly={engine.StartPlyCount}
                    game={engine}
                    opeinig={engine.Eco}
                    hasEvals={hasEvals}
                    currentMove={currMove} 
                    nav={nav}
                    toolbars={toolbars}
                    onChangePos={this.onChangePos} 
                    onChangeKey={this.onChangeKey}>{ children }</DumbMoveList>
            );
        }

        return null;
    }

}