import classNames from 'classnames';
import * as React from 'react';
import { _ } from '../../i18n/i18n';
import * as BoardActions from '../../actions/BoardActions';
import { CombinedGameStore } from '../../actions/CombinedGameStore';
import { ButtonToolbar } from 'react-bootstrap';


export interface BoardToolbarProps {
    store: CombinedGameStore,
    configUrl?: string
}

export class BoardToolbar extends React.Component<BoardToolbarProps, {}> {
    /**
     * constructor
     */
    constructor(props: BoardToolbarProps) {
        super(props);
    }

    render() {
        const { store, configUrl, children } = this.props;
        const s = store.getState();
        const flipBoard = () => {
            store.dispatch({ type: BoardActions.FLIP_BOARD } as BoardActions.BoardAction)
        };

        const toggleMoves = () => {
            store.dispatch({ type: BoardActions.MOVE_TABLE } as BoardActions.BoardAction)
        }

        const movesClass = classNames("btn btn-link", {
            'active': !!s.board.moveTable
        })

        return (
            <div className="mini-controls mx-md-3 mt-3 mt-md-5 mb-3 mb-md-5 bg-contrast-low px-md-1 pt-md-2">
                <ButtonToolbar className="flex-wrap">
                    <div className="btn-group">
                        { configUrl ? (<a aria-label={_("game", "board_config")} className="btn btn-link" title={_("game", "board_config")} href={configUrl + "?returnUrl=" + window.location.href}><i className="xi-bddiag"></i></a>) : "" }
                        <button aria-label={_("game", "toggle_moves")} className={movesClass} title={_("game", "toggle_moves")} onClick={toggleMoves}><i className="xi-mlist"></i></button>
                    </div>
                    <div className="btn-group">
                        <button aria-label={_("game", "flip")} className="btn btn-link" title={_("game", "flip")} onClick={flipBoard}><i className="xi-refresh"></i></button>
                    </div>
                    {children}                
                </ButtonToolbar>
            </div>
        );
    }
}