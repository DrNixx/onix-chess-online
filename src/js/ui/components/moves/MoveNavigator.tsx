import React, {useContext, useEffect, useRef} from 'react';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from "@mui/material/Button";
import Stack from '@mui/material/Stack';
import {GameContext} from "../../../providers/GameProvider";

type Props = {
    children?: React.ReactNode
};

const MoveNavigator: React.FC<Props> = ({children}) => {
    const elRef = useRef<HTMLDivElement>(null);
    const {
        canNavBackward,
        canNavForward,
        navigateFirst,
        navigateBackward,
        navigateForward,
        navigateLast,
    } = useContext(GameContext);

    const handleKeyDown = (e: KeyboardEvent) => {
        if (elRef.current?.clientHeight) {
            switch (e.key) {
                case "ArrowLeft":
                    if (canNavBackward) {
                        if (e.ctrlKey) {
                            navigateFirst();
                        } else {
                            navigateBackward();
                        }
                    }

                    break;
                case "ArrowRight":
                    if (canNavForward) {
                        if (e.ctrlKey) {
                            navigateLast();
                        } else {
                            navigateForward();
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
            if (canNavBackward) {
                navigateFirst();
            }
        }

    }

    const movePrev = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (e.currentTarget.getAttribute('disabled') === null) {
            if (canNavBackward) {
                navigateBackward();
            }
        }
    }

    const moveNext = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (e.currentTarget.getAttribute('disabled') === null) {
            if (canNavForward) {
               navigateForward();
            }
        }
    }

    const moveLast = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (e.currentTarget.getAttribute('disabled') === null) {
            if (canNavForward) {
                navigateLast();
            }
        }
    }

    return (
        <Stack sx={{py: 1}} direction="row" spacing={2} aria-label="Game controls" ref={elRef}>
            <ButtonGroup size="small" aria-label="Move navigation">
                <Button aria-label="First move" disabled={!canNavBackward} onClick={moveFirst}><i className="xi-page-first xi-lg" /></Button>
                <Button aria-label="Previous move" disabled={!canNavBackward} onClick={movePrev}><i className="xi-page-prev xi-lg" /></Button>
                <Button aria-label="Next move" disabled={!canNavForward} onClick={moveNext}><i className="xi-page-next xi-lg" /></Button>
                <Button aria-label="Last move" disabled={!canNavForward} onClick={moveLast}><i className="xi-page-last xi-lg" /></Button>
            </ButtonGroup>
            { children }
        </Stack>
    );
};

export default MoveNavigator;