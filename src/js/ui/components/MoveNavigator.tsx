import { fromPairs } from 'lodash';
import * as React from 'react';
import { Button, ButtonGroup, ButtonToolbar } from 'react-bootstrap';
import { Move } from '../../chess/Move';

export interface MoveNavigatorProps {
    currentMove: Move,
    onChange: (move: Move) => void,
}

export class MoveNavigator extends React.Component<MoveNavigatorProps, {}> {
    protected elRef: HTMLDivElement|null = null;

    /**
     * constructor
     */
    constructor(props: MoveNavigatorProps) {
        super(props);
    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown);    
    }

    private handleKeyDown = (e: KeyboardEvent) => {
        const { currentMove } = this.props;

        if (this.elRef?.clientHeight) {
            switch (e.key) {
                case "ArrowLeft":
                    if (!currentMove.isBegin()) {
                        if (e.ctrlKey) {
                            this.setCurrentMove(currentMove.Begin);
                        } else {
                            this.setCurrentMove(currentMove.Prev);
                        }
                    }
                    
                    break;
                case "ArrowRight":
                    if (!currentMove.isLast()) {
                        if (e.ctrlKey) {
                            this.setCurrentMove(currentMove.Last);
                        } else {
                            this.setCurrentMove(currentMove.Next);
                        }
                    }
                    break;
                default:
                    return;
            }
    
            e.preventDefault();
        }
    };

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
            <ButtonToolbar className="moves-nav my-2" aria-label="Game controls" ref={(el: HTMLDivElement) => this.elRef = el}>
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