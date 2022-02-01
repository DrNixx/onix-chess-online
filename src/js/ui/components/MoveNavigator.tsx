import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import React from 'react';

import { Move } from '../../chess/Move';
import Button from "@mui/material/Button";
import Stack from '@mui/material/Stack';

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
            <Stack sx={{py: 1}} direction="row" spacing={2} aria-label="Game controls" ref={(el: HTMLDivElement) => this.elRef = el}>
                <ButtonGroup size="small" aria-label="Move navigation">
                    <Button aria-label="First move" disabled={currentMove.isBegin()} onClick={moveFirst}><i className="xi-page-first xi-lg" /></Button>
                    <Button aria-label="Previous move" disabled={currentMove.isBegin()} onClick={movePrev}><i className="xi-page-prev xi-lg" /></Button>
                    <Button aria-label="Next move" disabled={currentMove.isLast()} onClick={moveNext}><i className="xi-page-next xi-lg" /></Button>
                    <Button aria-label="Last move" disabled={currentMove.isLast()} onClick={moveLast}><i className="xi-page-last xi-lg" /></Button>
                </ButtonGroup>
                { children }
            </Stack>
        );
    }
}