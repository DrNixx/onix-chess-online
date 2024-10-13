import React, {PropsWithChildren, useCallback, useContext, useEffect, useRef} from 'react';
import Scrollbar from "react-scrollbars-custom";
import { NavigatorMode } from '../Constants';
import { White, Black } from '../../../chess/Color';
import { DumbMoveProps } from './DumbMoveProps';
import MoveToolbar from "./MoveToolbar";
import {GameContext} from "../../../providers/GameProvider";
import {getResultName} from "../../../chess/GameResult";
import {scrollElementIntoViewIfNeeded} from "../../../utils/scrollUtils";
import MoveListItem from "./MoveListItem";

const DumbMoveList: React.FC<PropsWithChildren<DumbMoveProps>> = (props) => {
    const { hasComments } = props;
    const elRef = useRef<HTMLDivElement|null>(null);
    const scrollerRef = useRef<HTMLDivElement|null>(null);
    const size = useRef(0);

    const {
        opening,
        startPly,
        gameResult,
        focusMove,
        navigateToKey,
        getCurrentMove
    } = useContext(GameContext);

    const activeMove = useCallback(() => {
        return getCurrentMove().uid;
    }, [getCurrentMove]);

    const ensureActiveItemVisible = useCallback((itemId?: string) => {
        if (itemId) {
            const domNode = document.getElementById(itemId);
            scrollElementIntoViewIfNeeded(domNode, scrollerRef.current);
        }
    }, []);

    const observerCallback = useCallback(() => {
        if (elRef.current) {
            const newSize = elRef.current.clientHeight;
            if (newSize !== size.current) {
                size.current = newSize;
                ensureActiveItemVisible(activeMove());
            }
        }

    }, [activeMove, ensureActiveItemVisible]);

    useEffect(() => {
        const observer = new IntersectionObserver(observerCallback);
        if (elRef.current) {
            observer.observe(elRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [observerCallback]);

    useEffect(() => {
        ensureActiveItemVisible(focusMove);
    }, [ensureActiveItemVisible, focusMove]);

    const onMoveClick = useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
        const key = e.currentTarget.getAttribute("data-key");
        if (key) {
            navigateToKey(key);
        }
    }, [navigateToKey]);

    const renderMoves = useCallback(() => {
        const currentMove = getCurrentMove();

        let moves = [];
        let move = currentMove.Begin.Next;

        if (opening && opening.name) {
            moves.push(
                <span id={currentMove.Begin.uid} key="opening" className="text-muted opening">{opening.code} {opening.name}</span>
            );
        } else {
            moves.push(
                <a id={currentMove.Begin.uid} key="opening"></a>
            );
        }

        if ((move) && !move.isEnd()) {
            if (move.sm?.color === Black) {
                const key = "mn0_" + startPly.toString();
                moves = moves.concat(
                    <MoveListItem key={key} activeKey={currentMove.moveKey} uid={undefined} ply={startPly} moveKey={key} color={White} san="..." />
                );
            }

            //let i = 1;
            do {
                const { sm, moveKey } = move;

                let nags: string[] = [];
                if (sm.glyphs) {
                    nags = sm.glyphs.map(g => g.symbol);
                }

                const comments: string[] = [];

                if (move.comments)  comments.push(move.comments);

                const classes = {
                    "best": false,
                    "blunder": false,
                    "mistake": false,
                    "inaccuracy": false,
                    "border": move.provisional,
                    "border-danger": move.provisional,
                    "provisional": move.provisional,
                };

                if (sm.eval) {
                    const ev = sm.eval;
                    if (ev.desc) {
                        comments.push(ev.desc);
                    }

                    const isBest = !ev.best;
                    if (!isBest) {
                        if (sm.judgments) {
                            for (let j = 0; j < sm.judgments.length; j++) {
                                const judgment = sm.judgments[j];
                                switch (judgment.name) {
                                    case "Blunder":
                                        classes['blunder'] = true;
                                        break;
                                    case "Mistake":
                                        classes['mistake'] = true;
                                        break;
                                    case "Inaccuracy":
                                        classes['inaccuracy'] = true;
                                        break;
                                }

                                comments.push(judgment.comment);
                            }
                        }

                        if (ev.variation) {
                            const sign = (ev.ceilPawn > 0) ? "+" : "";
                            comments.push(" { " +  ev.variation + " " + sign + ev.ceilPawn + " }");
                        }
                    } else {
                        classes['best'] = true;
                    }
                }

                const comment = (comments.length > 0) ? comments.join(" ") : undefined;

                moves = moves.concat(
                    <MoveListItem
                        key={moveKey}
                        activeKey={currentMove.moveKey}
                        uid={move.uid}
                        ply={sm.ply}
                        moveKey={moveKey}
                        color={sm.color ?? White}
                        san={sm.san ?? ''}
                        nags={nags}
                        comment={comment}
                        classes={classes}
                        hasComments={hasComments}
                        onMoveClick={onMoveClick}
                    />
                );

                move = move.Next;
                // i++;
            } while (move && !move.isEnd());
        }

        moves.push(
            <span key="game-result" className="game_result">{getResultName(gameResult, 'long')}</span>
        );

        return moves;
    }, [gameResult, getCurrentMove, hasComments, onMoveClick, opening, startPly])

    return (
        <div className="movelist moves d-flex flex-column h-100" ref={elRef}>
            {(props.nav === NavigatorMode.Top) && <MoveToolbar toolbars={props.toolbars} />}
            <div className="flex-grow-1">
                <Scrollbar trackYProps={{style: {width: 5}}} scrollerProps={{elementRef: (el) => scrollerRef.current = el}}>
                    <div className="movelist-wrap">
                        {renderMoves()}
                    </div>
                </Scrollbar>
            </div>
            {(props.nav === NavigatorMode.Top) && <MoveToolbar toolbars={props.toolbars} />}
        </div>
    );
};

export default DumbMoveList;