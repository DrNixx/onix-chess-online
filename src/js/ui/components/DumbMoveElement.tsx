import * as React from 'react';
import classNames from 'classnames';
import { Chess } from '../../chess/Chess';
import { Move } from '../../chess/Move';
import { IChessOpening } from '../../chess/types/Interfaces';

import { NavigatorMode } from './Constants';
import { MoveNavigator } from './MoveNavigator';
import { Button, ButtonGroup, ToggleButton } from 'react-bootstrap';


export interface DumbMoveProps {
    nav: NavigatorMode,
    game: Chess,
    opeinig?: IChessOpening,
    hasEvals?: boolean,
    startPly: number,
    currentMove: Move,
    onChangePos: (move: Move) => void,
    onChangeKey: (move: string) => void,
    toolbars?: React.ReactNode,
}

export interface DumbMoveState {
    evals: boolean
}

export class DumbMoveElement extends React.Component<DumbMoveProps, DumbMoveState> {
    protected activeMove?: string;
    protected scrollerRef: HTMLDivElement|null = null;
    protected elRef: HTMLDivElement|null = null;

    private observer: IntersectionObserver|null = null;
    private size: number = 0;
    
    /**
     * constructor
     */
    constructor(props: DumbMoveProps) {
        super(props);
        
        this.state = {
            evals: !!props.hasEvals
        };
    }

    protected setElRef = (el: HTMLDivElement|null) => {
        this.elRef = el;
        if (this.observer !== null) {
            this.observer.disconnect();
            this.observer = null;
        }

        if (this.elRef) {
            const that = this;
            that.observer = new IntersectionObserver(() => {
                const newSize = that.elRef!.clientHeight;
                if (newSize !== that.size) {
                    that.size = newSize;
                    that.ensureActiveItemVisible();
                }
            });

            that.observer.observe(that.elRef!);
        }
    }

    componentDidMount() {
        this.ensureActiveItemVisible();
    }

    componentWillUnmount() {
        if (this.observer !== null) {
            this.observer.disconnect();
            this.observer = null;
        }
    }

    componentDidUpdate(prevProps: DumbMoveProps, prevState: DumbMoveState) {
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

    protected toggleEvals = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { state } = this;
        this.setState({
            ...state,
            evals: !state.evals
        });
    };

    protected renderToggleEval = () => {
        const { props, state, toggleEvals } = this;

        if (!!props.hasEvals) {
            return (
                <ButtonGroup toggle>
                    <ToggleButton variant="default" type="checkbox" checked={state.evals} value={1} onChange={toggleEvals}><i className="xi-info-c"></i></ToggleButton>
                </ButtonGroup>
            );
        } else {
            return null;
        }
    };

    protected renderNav= (pos: NavigatorMode) => {
        const { props, renderToggleEval } = this;
        const { nav, currentMove, children, toolbars, onChangePos } = props;

        return nav ===  pos? (
                <React.Fragment>
                        <MoveNavigator currentMove={currentMove} onChange={onChangePos} key={currentMove.moveKey}>
                        { renderToggleEval() }
                        { children }
                    </MoveNavigator>
                    { toolbars }
                </React.Fragment>
                
        ) : null;
    }

    protected onMoveClick = (e: React.MouseEvent<HTMLSpanElement>) => {
        const key = e.currentTarget.getAttribute("data-key");
        if (key) {
            const { onChangeKey } = this.props;
            if (onChangeKey) {
                onChangeKey(key);
            }
        }
    }
}