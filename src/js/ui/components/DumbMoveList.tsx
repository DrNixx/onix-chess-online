import React from 'react';
import Scrollbar from "react-scrollbars-custom";
import clsx from "clsx";
import { NavigatorMode } from './Constants';
import { Move } from '../../chess/Move';
import * as Colors from '../../chess/types/Colors';
import { White, Black } from '../../chess/Color';
import { DumbMoveElement, DumbMoveProps } from './DumbMoveElement';


export class DumbMoveList extends DumbMoveElement {
    /**
     * constructor
     */
    constructor(props: DumbMoveProps) {
        super(props);
    }

    private renderMoveNo = (color: Colors.BW, ply: number) => {
        if (color === White) {
            const moveNo = ((ply + 1) >> 1);
            return (
                <span className="moveno" data-moveno={moveNo} key={"mn" + moveNo.toString() }>{moveNo}.</span>
            );
        }

        return (<></>);
    }

    private renderMove = (x: Move, uid: string|undefined, i: number, p: string, c: Colors.BW, s: string, n?: string[], m?: string, classes?: any) => {
        const { state } = this;
        const result = [];
        if (c === White) {
            result.push(this.renderMoveNo(c, i));
        }

        const myclass = {
            ['white']: (c === White),
            ['black']: (c === Black),
            ['active']: (x.moveKey === p)
        };

        const moveClasses = clsx('move', myclass, classes);

        if (x.moveKey === p) {
            this.activeMove = uid;
        }

        result.push(
            <span
                id={uid}
                className={moveClasses} 
                data-ply={i} 
                data-key={p} 
                key={p}
                onClick={this.onMoveClick}>{s}</span>
        );

        if (n && n.length) {
            for (let i = 0; i < n.length; i++) {
                const nagKey = `ng_${i}_${p}`;
                result.push(
                    <span key={nagKey} className="nag">{n[i]}</span>
                );
            }
        }

        if (m && state.evals) {
            const evalKey = `cm_${p}`;
            result.push(
                <span key={evalKey} className="comment">{m}</span>
            );
        }

        return result;
    }

    private renderMoves = () => {
        const { currentMove, game, opeinig } = this.props;
        let moves = []; 
        let move = currentMove.Begin.Next;

        if (currentMove.isBegin()) {
            this.activeMove = currentMove.uid;
        }

        if (opeinig && opeinig.name) {
            moves.push(
                <span id={currentMove.Begin.uid} key="opening" className="text-muted opening">{opeinig.code} {opeinig.name}</span>
            );
        } else {
            moves.push(
                <a id={currentMove.Begin.uid}></a>
            );
        }

        if ((move) && !move.isEnd()) {
            if (move.sm?.color === Black) {
                moves = moves.concat(
                    this.renderMove(currentMove, undefined, game.StartPlyCount, "mn0_" + game.StartPlyCount.toString(), White, "...")
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
                
                if (move.comments) {
                    comments.push(move.comments);
                }

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
                    !!ev.desc && comments.push(ev.desc);

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
                    this.renderMove(currentMove, move.uid, sm.ply, moveKey, sm.color ?? White, sm.san ?? '', nags, comment, classes)
                );

                move = move.Next;
                // i++;
            } while (move && !move.isEnd());
        }
        
        moves.push(
            <span key="game-result" className="game_result">{game.getResultName('long')}</span>
        );

        return moves;
    }

    render() {
        const { renderNav, setElRef } = this;

        return (
            <div className="movelist moves d-flex flex-column h-100" ref={(el) => setElRef(el)}>
                {renderNav(NavigatorMode.Top)}
                <div className="flex-grow-1">
                    <Scrollbar trackYProps={{style: {width: 5}}} scrollerProps={{elementRef: (el) => this.scrollerRef = el}}>
                        <div className="movelist-wrap">
                            {this.renderMoves()}
                        </div>
                    </Scrollbar>
                </div>
                {renderNav(NavigatorMode.Bottom)}
            </div>
        );
    }
}