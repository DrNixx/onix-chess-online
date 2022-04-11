import React, {useEffect, useRef} from 'react';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';

import { Move } from '../../chess/Move';
import Button from "@mui/material/Button";
import Stack from '@mui/material/Stack';

type Props = {
    currentMove: Move,
    onChange: (move: Move) => void,
};

const MoveNavigator: React.FC<Props> = (props) => {
    const { currentMove, onChange, children } = props;
    const elRef = useRef<HTMLDivElement>(null);

    const setCurrentMove = (move: Move) => {
        onChange(move);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (elRef.current?.clientHeight) {
            switch (e.key) {
                case "ArrowLeft":
                    if (!currentMove.isBegin()) {
                        if (e.ctrlKey) {
                            setCurrentMove(currentMove.Begin);
                        } else {
                            setCurrentMove(currentMove.Prev);
                        }
                    }

                    break;
                case "ArrowRight":
                    if (!currentMove.isLast()) {
                        if (e.ctrlKey) {
                            setCurrentMove(currentMove.Last);
                        } else {
                            setCurrentMove(currentMove.Next);
                        }
                    }
                    break;
                default:
                    return;
            }

            e.preventDefault();
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    });

    const moveFirst = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (e.currentTarget.getAttribute('disabled') === null) {
            if (!currentMove.isBegin()) {
                setCurrentMove(currentMove.Begin);
            }
        }

    }

    const movePrev = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (e.currentTarget.getAttribute('disabled') === null) {
            if (!currentMove.isBegin()) {
                setCurrentMove(currentMove.Prev);
            }
        }
    }

    const moveNext = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (e.currentTarget.getAttribute('disabled') === null) {
            if (!currentMove.isLast()) {
                setCurrentMove(currentMove.Next);
            }
        }
    }

    const moveLast = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (e.currentTarget.getAttribute('disabled') === null) {
            if (!currentMove.isLast()) {
                setCurrentMove(currentMove.Last);
            }
        }
    }

    return (
        <Stack sx={{py: 1}} direction="row" spacing={2} aria-label="Game controls" ref={elRef}>
            <ButtonGroup size="small" aria-label="Move navigation">
                <Button aria-label="First move" disabled={currentMove.isBegin()} onClick={moveFirst}><i className="xi-page-first xi-lg" /></Button>
                <Button aria-label="Previous move" disabled={currentMove.isBegin()} onClick={movePrev}><i className="xi-page-prev xi-lg" /></Button>
                <Button aria-label="Next move" disabled={currentMove.isLast()} onClick={moveNext}><i className="xi-page-next xi-lg" /></Button>
                <Button aria-label="Last move" disabled={currentMove.isLast()} onClick={moveLast}><i className="xi-page-last xi-lg" /></Button>
            </ButtonGroup>
            { children }
        </Stack>
    );
};

export default MoveNavigator;