import * as React from 'react';
import Scrollbar from "react-scrollbars-custom";
import classNames from 'classnames';
import { NavigatorMode } from './Constants';
import { MoveNavigator } from './MoveNavigator';
import { Chess } from '../../chess/Chess';
import { IChessOpening } from '../../chess/types/Interfaces';
import { Move } from '../../chess/Move';
import { Colors } from '../../chess/types/Types';
import { Color } from '../../chess/Color';


export interface DumbMoveListProps {
    nav: NavigatorMode,
    game: Chess,
    opeinig?: IChessOpening,
    hasEvals?: boolean,
    startPly: number,
    currentMove: Move,
    onChangePos: (move: Move) => void,
    onChangeKey: (move: string) => void,
}

interface DumbMoveListState {
    evals: boolean
}

export class DumbMoveList extends React.Component<DumbMoveListProps, DumbMoveListState> {
    private activeMove?: string;
    private scrollerRef: HTMLDivElement|null = null;

    /**
     * constructor
     */
    constructor(props: DumbMoveListProps) {
        super(props);

        this.state = {
            evals: !!props.hasEvals
        };
    }

    componentDidMount() {
        this.ensureActiveItemVisible();
    }

    componentDidUpdate(prevProps: DumbMoveListProps, prevState: DumbMoveListState) {
        const { props, state } = this;
        // only scroll into view if the active item changed last render
        if ((props.currentMove.moveKey !== prevProps.currentMove.moveKey) || (state.evals !== prevState.evals)) {
            this.ensureActiveItemVisible();
        }
    }

    ensureActiveItemVisible() {
        const itemId = this.activeMove;
        if (itemId) {
            const domNode = document.getElementById(itemId);
            this.scrollElementIntoViewIfNeeded(domNode, this.scrollerRef);
        }
    }

    scrollElementIntoViewIfNeeded(domNode: HTMLElement|null, parent: HTMLElement|null) {
        if (domNode && parent) {
            const centerIfNeeded = true;
            var parentComputedStyle = window.getComputedStyle(parent, null),
                parentBorderTopWidth = parseInt(parentComputedStyle.getPropertyValue('border-top-width')),
                parentBorderLeftWidth = parseInt(parentComputedStyle.getPropertyValue('border-left-width')),
                overTop = domNode.offsetTop - parent.offsetTop < parent.scrollTop,
                overBottom = (domNode.offsetTop - parent.offsetTop + domNode.clientHeight - parentBorderTopWidth) > (parent.scrollTop + parent.clientHeight),
                overLeft = domNode.offsetLeft - parent.offsetLeft < parent.scrollLeft,
                overRight = (domNode.offsetLeft - parent.offsetLeft + domNode.clientWidth - parentBorderLeftWidth) > (parent.scrollLeft + parent.clientWidth),
                alignWithTop = overTop && !overBottom;

            if ((overTop || overBottom) && centerIfNeeded) {
                parent.scrollTop = domNode.offsetTop - parent.offsetTop - parent.clientHeight / 2 - parentBorderTopWidth + domNode.clientHeight / 2;
            }

            if ((overLeft || overRight) && centerIfNeeded) {
                parent.scrollLeft = domNode.offsetLeft - parent.offsetLeft - parent.clientWidth / 2 - parentBorderLeftWidth + domNode.clientWidth / 2;
            }

            if ((overTop || overBottom || overLeft || overRight) && !centerIfNeeded) {
                domNode.scrollIntoView(alignWithTop);
            }
        }
    }

    private toggleEvals = (e: React.MouseEvent<HTMLButtonElement>) => {
        const { state } = this;
        this.setState({
            ...state,
            evals: !state.evals
        });
    };

    private renderToggleEval = () => {
        const { props, state, toggleEvals } = this;

        if (!!props.hasEvals) {
            const btnClass = classNames(
                "btn btn-default",
                {
                    active: state.evals
                }
            );

            return (
                <div className="btn-group move-nav my-2">
                    <button className={btnClass}  onClick={toggleEvals}><i className="xi-info-c"></i></button>
                </div>
            );
        } else {
            return null;
        }
    };

    private renderNav= (pos: NavigatorMode) => {
        const { props, renderToggleEval } = this;
        const { nav, currentMove, onChangePos } = props;

        return nav ===  pos? (
                <MoveNavigator currentMove={currentMove} onChange={onChangePos} key={currentMove.moveKey}>
                    { renderToggleEval() }
                </MoveNavigator>
        ) : null;
    }

    onMoveClick = (e: React.MouseEvent<HTMLSpanElement>) => {
        const key = e.currentTarget.getAttribute("data-key");
        if (key) {
            const { onChangeKey } = this.props;
            if (onChangeKey) {
                onChangeKey(key);
            }
        }
    }

    private renderMoveNo = (color: Colors.BW, ply: number) => {
        if (color === Color.White) {
            var moveNo = ((ply + 1) >> 1);
            return (
                <span className="moveno" data-moveno={moveNo} key={"mn" + moveNo.toString() }>{moveNo}.</span>
            );
        }

        return (<></>);
    }

    private renderMove = (x: Move, uid: string|undefined, i: number, p: string, c: Colors.BW, s: string, n?: string[], m?: string, classes?: any) => {
        const { state } = this;
        let result = [];
        if (c === Color.White) {
            result.push(this.renderMoveNo(c, i));
        }

        const myclass = {
            ['white']: (c === Color.White),
            ['black']: (c === Color.Black),
            ['active']: (x.moveKey === p)
        };

        const moveClasses = classNames('move', myclass, classes);

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
            if (move.sm?.color === Color.Black) {
                moves = moves.concat(
                    this.renderMove(currentMove, undefined, game.StartPlyCount, "mn0_" + game.StartPlyCount.toString(), Color.White, "...")
                );
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
                    this.renderMove(currentMove, move.uid, sm.ply, moveKey, sm.color!, sm.san!, nags, comment, classes)
                );

                move = move.Next;
                i++;
            } while (move && !move.isEnd());
        }
        
        moves.push(
            <span key="game-result" className="game_result">{game.getResultName('long')}</span>
        );

        return moves;
    }

    render() {
        const { renderNav } = this;

        let s;
        
        return (
            <div className="movelist moves d-flex flex-column h-100">
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