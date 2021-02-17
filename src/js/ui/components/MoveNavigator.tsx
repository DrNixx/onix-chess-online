import { fromPairs } from 'lodash';
import * as React from 'react';
import { Move } from '../../chess/Move';

export interface MoveNavigatorProps {
    currentMove: Move,
    onChange: (move: Move) => void,
}

export class MoveNavigator extends React.Component<MoveNavigatorProps, {}> {
    /**
     * constructor
     */
    constructor(props: MoveNavigatorProps) {
        super(props);
    }

    private setCurrentMove = (move: Move) => {
        const { onChange } = this.props;
        if (onChange) {
            onChange(move);
        };
    }

    private moveFirst = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (e.currentTarget.getAttribute('disabled') === null) {
            const { currentMove } = this.props;
            if (!currentMove.isBegin()) {
                this.setCurrentMove(currentMove.Begin);
            }
        }
        
    }

    private movePrev = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (e.currentTarget.getAttribute('disabled') === null) {
            const { currentMove } = this.props;
            if (!currentMove.isBegin()) {
                this.setCurrentMove(currentMove.Prev);
            }
        }
    }

    private moveNext = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (e.currentTarget.getAttribute('disabled') === null) {
            const { currentMove } = this.props;
            if (!currentMove.isLast()) {
                this.setCurrentMove(currentMove.Next);
            }
        }
    }

    private moveLast = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (e.currentTarget.getAttribute('disabled') === null) {
            const { currentMove } = this.props;
            if (!currentMove.isLast()) {
                this.setCurrentMove(currentMove.Last);
            }
        }
    }

    render() {
        const { currentMove } = this.props;
        const { moveFirst, movePrev, moveNext, moveLast } = this;
        const btnClass = "btn btn-default";

        return (
            <div className="btn-toolbar" role="toolbar">
                <div className="btn-group move-nav my-2">
                    <button className={btnClass} disabled={currentMove.isBegin()} onClick={moveFirst}><i className="xi-page-first xi-lg"></i></button>
                    <button className={btnClass} disabled={currentMove.isBegin()} onClick={movePrev}><i className="xi-page-prev xi-lg"></i></button>
                    <button className={btnClass} disabled={currentMove.isLast()} onClick={moveNext}><i className="xi-page-next xi-lg"></i></button>
                    <button className={btnClass} disabled={currentMove.isLast()} onClick={moveLast}><i className="xi-page-last xi-lg"></i></button>
                </div>
            </div>
        );
    }
}