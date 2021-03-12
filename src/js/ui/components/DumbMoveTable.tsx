import * as React from 'react';
import { nanoid } from 'nanoid';
import Scrollbar from 'react-scrollbars-custom';
import classNames from 'classnames';
import { Move } from '../../chess/Move';

import { NavigatorMode } from './Constants';
import { Colors } from '../../chess/types/Types';
import { Color } from '../../chess/Color';
import { DumbMoveElement, DumbMoveProps } from './DumbMoveElement';
import { GameResult } from '../../chess/GameResult';


export class DumbMoveTable extends DumbMoveElement {
    /**
     * constructor
     */
    constructor(props: DumbMoveProps) {
        super(props);
    }

    private renderMoveNo = (color: Colors.BW, ply: number) => {
        if (color === Color.White) {
            var moveNo = ((ply + 1) >> 1);
            return (
                <div className="moveno" data-moveno={moveNo} key={"mn" + moveNo.toString() }>{moveNo}</div>
            );
        }

        return (<></>);
    }

    public renderDummy = (color: Colors.BW, ply: number) => {
        let result: JSX.Element[] = [];

        if (color === Color.White) {
            result.push(this.renderMoveNo(color, ply));
        }

        const myclass = {
            ['white']: (color === Color.White),
            ['black']: (color === Color.Black)
        };

        result.push(
            <div className={classNames('move', myclass)} key={nanoid(8)}>
                <div className="san">...</div>
            </div>
        );

        return result;
    };

    private renderMove = (cm: Move, 
        m: Move, 
        classes?: any
    ) => {
        let result = [];

        const { state } = this;
        const { sm, moveKey } = m;
        
        if (cm.moveKey === moveKey) {
            this.activeMove = m.uid;
        }

        if (sm.color === Color.White) {
            result.push(this.renderMoveNo(sm.color, sm.ply));
        }

        const myclass = {
            ['white']: (sm.color === Color.White),
            ['black']: (sm.color === Color.Black),
            ['active']: (cm.moveKey === moveKey)
        };

        let nags: JSX.Element[] = [];
        let evals: JSX.Element[] = [];

        if (sm.glyphs) {
            nags = sm.glyphs.map((g, i) => {
                return (<div className="nag" key={`nag_${moveKey}_${i}`}>{g.symbol}</div>);
            });
        }

        if (state.evals && sm.eval) {
            const ev = sm.eval;
            const sign = (ev.advantage > 0) ? "+" : "";
            evals.push(<div className="eval" key={`eval_${moveKey}`}>{sign}{ev.advantage}</div>);
        }

        const moveClasses = classNames('move', myclass, classes);

        result.push(
            <div
                id={m.uid}
                className={moveClasses} 
                data-ply={sm.ply} 
                data-key={moveKey} 
                key={moveKey}
                onClick={this.onMoveClick}>
                <div className="san" key={`san_${moveKey}`}>{sm.san}</div>    
                { nags }
                { evals }
            </div>
        );

        /*
        if (comment && state.evals) {
            const evalKey = `cm_${moveKey}`;
            result.push(
                <span key={evalKey} className="comment">{comment}</span>
            );
        }
        */

        return result;
    }

    private renderMoves = () => {
        const { currentMove, game, opeinig } = this.props;
        let moves: JSX.Element[] = []; 
        let move = currentMove.Begin.Next;

        if (currentMove.isBegin()) {
            this.activeMove = currentMove.uid;
        }

        if ((move) && !move.isEnd()) {
            if (move.sm?.color === Color.Black) {
                moves = moves.concat(this.renderDummy(Color.White, game.StartPlyCount));
            }

            let i = 1;
            do {
                const { sm, moveKey } = move!;
                
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
                    "inaccuracy": false
                };

                if (sm.eval) {
                    const ev = sm.eval;
                    comments.push(ev.desc!);

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
                    //this.renderMove(currentMove, move.uid, sm.ply, moveKey, sm.color!, sm.san!, nags, comment, classes)
                    this.renderMove(currentMove, move, classes)
                );

                move = move.Next;
                i++;
            } while (move && !move.isEnd());
        }
        
        return moves;
    }

    private renderOpening = () => {
        const { currentMove, opeinig } = this.props;

        if (opeinig && opeinig.name) {
            return (
                <div id={currentMove.Begin.uid} key="opening" className="text-muted opening">{opeinig.code} {opeinig.name}</div>
            );
        } else {
            return (
                <div id={currentMove.Begin.uid}></div>
            );
        }
    };

    private renderResult = () => {
        const { game } = this.props;

        return (game.Result !== GameResult.Color.None) ? (
            <div key="game-result" className="game_result">{game.getResultName('long')}</div>
        ) : null;
    };


    render() {
        const { renderNav,  renderOpening, renderMoves, renderResult, setElRef } = this;

        return (
            <div className="movetable moves d-flex flex-column h-100" ref={(el) => setElRef(el)}>
                {renderNav(NavigatorMode.Top)}
                <div className="flex-grow-1">
                    <Scrollbar trackYProps={{style: {width: 5}}} scrollerProps={{elementRef: (el) => this.scrollerRef = el}}>
                        <div className="movetable-wrap">
                            { renderOpening() }
                            { renderMoves() }
                            { renderResult() }
                        </div>
                    </Scrollbar>
                </div>
                {renderNav(NavigatorMode.Bottom)}
            </div>
        );
    }
}