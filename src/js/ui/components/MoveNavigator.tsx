import { fromPairs } from 'lodash';
import * as React from 'react';
import { Button, ButtonGroup, ButtonToolbar } from 'react-bootstrap';
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
        const { currentMove, children } = this.props;
        const { moveFirst, movePrev, moveNext, moveLast } = this;

        return (
            <ButtonToolbar className="moves-nav my-2" aria-label="Game controls">
                <ButtonGroup aria-label="Move navigation">
                    <Button aria-label="First move" variant="default" disabled={currentMove.isBegin()} onClick={moveFirst}><i className="xi-page-first xi-lg"></i></Button>
                    <Button aria-label="Previous move" variant="default" disabled={currentMove.isBegin()} onClick={movePrev}><i className="xi-page-prev xi-lg"></i></Button>
                    <Button aria-label="Next move" variant="default" disabled={currentMove.isLast()} onClick={moveNext}><i className="xi-page-next xi-lg"></i></Button>
                    <Button aria-label="Last move" variant="default" disabled={currentMove.isLast()} onClick={moveLast}><i className="xi-page-last xi-lg"></i></Button>
                </ButtonGroup>
                { children }
            </ButtonToolbar>
        );
    }
}