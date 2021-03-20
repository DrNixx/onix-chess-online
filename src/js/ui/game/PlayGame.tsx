import classNames from 'classnames';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Unsubscribe } from 'redux';
import { Container, Row, Col, Tab, Nav, Form, Button, ButtonToolbar, ButtonGroup } from 'react-bootstrap';

import { Chessground } from 'chessground';
import { Api } from 'chessground/api';
import { Config as CgConfig } from 'chessground/config';
import * as cg from 'chessground/types';

import { i18n, _ } from '../../i18n/i18n';

import { Color } from '../../chess/Color';

import { BoardSizeClass } from 'onix-board-assets';

import { GameProps, defaultProps } from '../../chess/settings/GameProps';

import * as BoardActions from '../../actions/BoardActions';
import { GameActions as ga } from '../../actions/GameActions';
import { createCombinedGameStore, CombinedGameStore } from '../../actions/CombinedGameStore';
import { createCombinedGameState } from '../../actions/CombinedGameState';

import { ChessMoves } from '../components/ChessMoves';
import { MovesMode, NavigatorMode } from '../components/Constants';
import { Captures } from '../components/Captures';

import { renderPlayer, renderTimer } from './GameUtils';
import { GameInfo } from './GameInfo';
import { Squares } from '../../chess/types/Types';
import { Square } from '../../chess/Square';
import { Piece } from '../../chess/Piece';
import { BoardToolbar } from '../components/BoardToolbar';
import { FenString } from '../../chess/FenString';

enum BoardMode {
    Play = 0,
    Analyse = 1,
    Conditional = 2,
}

interface ProvisionalMove {
    from?: Squares.Square;
    to?: Squares.Square;
    promotion?: string;
    isValid?: boolean;
}

interface GameState {
    mode: BoardMode;
    manualFrom?: string;
    manualTo?: string;
    confirmMove: boolean;
    drawChecked: boolean;
    provisionalMove: ProvisionalMove;
}

class PlayGameComponent extends React.Component<GameProps, GameState> {
    public static defaultProps: GameProps = defaultProps;

    private storeUnsubscribe?: Unsubscribe = undefined;

    private store: CombinedGameStore;

    private cg?: Api = undefined;

    private boardElement: HTMLDivElement | null = null;

    private get isPlay() {
        return this.state.mode === BoardMode.Play;
    }

    private get isAnalyse() {
        return this.state.mode === BoardMode.Analyse;
    }

    private get isConditional() {
        return this.state.mode === BoardMode.Conditional;
    }

    constructor(props: GameProps) {
        super(props);

        i18n.register();

        const state = createCombinedGameState(this.props);

        this.store = createCombinedGameStore(state);
        this.state = {
            mode: BoardMode.Play,
            confirmMove: state.board.confirmMove,
            drawChecked: false,
            provisionalMove: {}
        };
    }

    componentDidMount() {
        const { store, onMove, onSelect } = this;
        const { board, game }  = store.getState();

        this.storeUnsubscribe = this.store.subscribe(() =>
            this.updateState()
        );

        
        this.cg = Chessground(this.boardElement!, {
            ...this.generateConfig(),
            resizable: true,
            highlight: {
                lastMove: true,
                check: true
            },
            events: {
                // change: onPositionChange
                move: onMove,
                select: onSelect,
            },
        });

        window.addEventListener("resize", this.redrawBoard);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.redrawBoard);

        const { cg } = this;
        if (cg !== undefined) {
            cg.destroy();
        }

        if (this.storeUnsubscribe) {
            this.storeUnsubscribe();
        }
        
    }

    private generateConfig = (): CgConfig => {
        const { store, isPlay, isAnalyse, isConditional } = this;
        const { board, game } = store.getState();
        const { engine } = game;
        
        const wm = engine.ToMove;
        const turnColor = Color.toName(wm);

        if (engine.CurrentMove.isLast()) {
            const mlist = engine.CurrentPos.generateMoves();

            const dests: cg.Dests = mlist.reduce((map, m) => {
                const from = Square.name(m.from!) as cg.Key;
                const to = Square.name(m.to!) as cg.Key;

                const toa: cg.Key[] = map.get(from) ?? [];
                toa.push(to);
                map.set(from, toa);

                return map;
            }, new Map());
    
            return {
                fen: game.fen,
                orientation: board.orientation,
                coordinates: board.coordinates,
                lastMove: game.lastMove,
                check: game.isCheck,
                turnColor: turnColor,
                viewOnly: isPlay ? (wm !== engine.Player) : false,
                movable: {
                    free: false,
                    color: isPlay ? Color.toName(engine.Player) : 'both',
                    dests: dests,
                    showDests: isPlay ? board.learnMode : true
                }
            };
        } else {
            return {
                fen: game.fen,
                lastMove: game.lastMove,
                check: game.isCheck,
                turnColor: turnColor,
                viewOnly: true,
                orientation: board.orientation,
                coordinates: board.coordinates,
            };
        }
    };

    private updateBoard = () => {
        if (this.cg) {
            this.cg.set(this.generateConfig());
        }
    };

    private redrawBoard = () => {
        const { cg } = this;
        if (cg !== undefined) {
            cg.redrawAll();
        }
    };

    private updateState = () => {    
        this.updateBoard();
        this.forceUpdate();
    };


    gameDisconnect = () => {
        
    }

    loadGame = () => {
        
    }

    private onSelect = (key: cg.Key) => {
        const { store } = this;
        const { board, game } = store.getState();
        const { engine } = game;

        const { provisionalMove, ...other } = this.state;

        const from = Square.parse(key);
        if (this.canMove(from)) {
            provisionalMove.from = from;
            provisionalMove.to = undefined;
            provisionalMove.isValid = false;

            this.setState({
                ...other,
                provisionalMove: provisionalMove
            });
        }
        
    };

    private onMove = (orig: cg.Key, dest: cg.Key, capturedPiece?: cg.Piece) => {
        const from = Square.parse(orig);
        const to = Square.parse(dest);
        
        this.doMove(from, to);
    };

    private doMove = (from?: Squares.Square, to?: Squares.Square, promote?: string) => {
        if (from && to) {
            const { store, state, isPlay } = this;
            const { game } = store.getState();
            const { engine } = game;

            const sm = engine.makeMove(from, to);
            if (sm) {
                const { provisionalMove, manualFrom, manualTo, ...other } = state;
                if (engine.CurrentPos.isLegalMove(sm)) {
                    if (engine.InPromotion) {

                    } else {
                        if (state.confirmMove || !isPlay) {
                            provisionalMove.from = from;
                            provisionalMove.to = to;
                            provisionalMove.isValid = true;
        
                            this.setState({
                                ...other,
                                provisionalMove: provisionalMove,
                                manualFrom: undefined,
                                manualTo: undefined
                            }, () => {
                                this.store.dispatch({ type: ga.GAME_ADD_PROVISIONAL, sm: sm } as ga.AddProvisional);
                            });
                        } else {
        
                        }
                    }
                } else {
                    this.setState({
                        ...other,
                        provisionalMove: {},
                        manualFrom: undefined,
                        manualTo: undefined
                    });
                }
            }
        }
    };

    private canMove = (from?: Squares.Square, to?: Squares.Square) => {
        if (to) {
            return true;
        } else if (from) {
            return this.validFrom(from);
        } else {
            return true;
        }
    };

    private validFrom = (sq: Squares.Square) => {
        const { props, store, state } = this;
        const { game } = store.getState();
        const { engine } = game;

        const pos = engine.CurrentPos;

        const movingPiece = pos.getPiece(sq);
        if (!Piece.isPiece(movingPiece)) {
            return false;
        }

        return Piece.color(movingPiece) == pos.WhoMove;
    };

    private returnToPlay = () => {
        const { state } = this;
        const { provisionalMove, manualFrom, manualTo, mode, ...other } = state;

        this.setState({
            ...other,
            provisionalMove: {},
            manualFrom: undefined,
            manualTo: undefined,
            mode: BoardMode.Play
        }, () => {
            this.cg!.cancelMove();
            this.store.dispatch({ type: ga.GAME_REMOVE_PROVISIONAL } as ga.RemoveProvisional);
        });
    };

    private modeTurnOn = (newMode: BoardMode) => {
        const { state } = this;
        const { mode, ...other } = state;

        this.setState({
            ...other,
            mode: newMode
        });
    };

    private toggleForm = () => {
        const { confirmMove, ...other } = this.state;

        this.setState({
            ...other,
            confirmMove: !confirmMove
        });

    }

    private confirmToggler = () => {
        const { state, toggleForm } = this;
        return (
            <div className="ml-auto">
                <div className="form-group field-advance required">
                    <div className="form-check switch switch-lg primary">
                        <input type="checkbox" id="advance" className="custom-check-input" name="advance" value="1" checked={state.confirmMove} onChange={toggleForm} />
                        <label htmlFor="advance">{_("game", "confirm_move_form")}</label>
                    </div>
                </div>
            </div>
        );
    };

    private drawCheck = () => {
        const { drawChecked, ...other } = this.state;

        this.setState({
            ...other,
            drawChecked: !drawChecked
        });
    }

    private changeFrom = (e: React.ChangeEvent) => {
        const { provisionalMove, manualFrom, ...other } = this.state;

        let val: string | undefined = undefined;

        if (this.canMove()) {
            val = (e.target as HTMLInputElement).value;
            if (val && val.length == 2) {
                const from = Square.parse(val);
                if (from && this.validFrom(from)) {
                    provisionalMove.from = from;
                    if (provisionalMove.from) {
                        this.cg!.selectSquare(Square.name(provisionalMove.from) as cg.Key);
                    }
                }
                
                val = undefined;
            }
        }

        this.setState({
            ...other,
            provisionalMove: provisionalMove,
            manualFrom: val
        });
    };

    private changeTo = (e: React.ChangeEvent) => {
        const { provisionalMove, manualFrom, manualTo, ...other } = this.state;

        let val: string | undefined = (e.target as HTMLInputElement).value;
        if (val && (val.length == 2) && provisionalMove.from) {
            provisionalMove.to = Square.parse(val);
            this.doMove(provisionalMove.from, provisionalMove.to);
            val = undefined;
        }        
        
        this.setState({
            ...other,
            provisionalMove: provisionalMove,
            manualTo: val
        });
    };

    private moveForm = () => {
        const { state, drawCheck, changeFrom, changeTo, returnToPlay, canMove } = this;
        const { confirmMove, drawChecked, provisionalMove, manualFrom, manualTo } = state;

        const fromVal = manualFrom ?? (provisionalMove?.from ? Square.name(provisionalMove.from) : "");
        const toVal = manualTo ?? (provisionalMove?.to ? Square.name(provisionalMove.to) : "");
        const disableForm = !canMove();

        return (
            <ButtonToolbar className="mb-2 justify-content-end">
                <div>
                    <div className="form-check primary">
                        <input type="checkbox" id="sendDraw" checked={drawChecked} onChange={drawCheck} disabled={disableForm} />
                        <label htmlFor="sendDraw">{_("game", "send_draw")}</label>
                    </div>
                </div>
                { confirmMove ?  (
                    <div className="ml-auto pl-4 move-form">
                        <input aria-label="Move from" type="text" value={fromVal} onChange={changeFrom} disabled={disableForm} />
                        <span className="px-2">&mdash;</span>
                        <input aria-label="Move to" type="text" value={toVal} onChange={changeTo} disabled={disableForm} />
                        <Button variant="success" className="ml-2" disabled={!provisionalMove.isValid || disableForm}>{_("game", "move_button")}</Button>
                        <Button variant="default" className="ml-2" onClick={returnToPlay} disabled={disableForm || (!fromVal && !toVal)}>{_("game", "reset_button")}</Button>
                    </div>
                ) : ""}
            </ButtonToolbar>
        );
    };

    private analyseForm = () => {
        return (
            <ButtonToolbar>
                <ButtonGroup className="mx-auto p-4">
                    <Button onClick={this.returnToPlay}>Закрыть анализ</Button>
                </ButtonGroup>
            </ButtonToolbar>
        );
    };

    private conditionalForm = () => {
        return (
            <ButtonToolbar>
                <ButtonGroup className="mx-auto p-4">
                    <Button onClick={this.returnToPlay}>Закрыть запись вариантов</Button>
                </ButtonGroup>
            </ButtonToolbar>
        );
    };

    private renderControls = () => {
        const { state, store, analyseForm, conditionalForm, moveForm, confirmToggler, isPlay } = this;
        const { board } = store.getState();

        let toolbar: JSX.Element;
        switch (state.mode) {
            case BoardMode.Analyse:
                toolbar = analyseForm();
                break;
            case BoardMode.Conditional:
                toolbar = conditionalForm();
                break;
            default:
                toolbar = moveForm();
        }

        return (
            <div className="controls flex-grow-1 d-flex flex-column">
                <Tab.Container defaultActiveKey="moves">
                    <Nav variant="tabs" className="nav-tabs-simple">
                        <Nav.Item>
                            <Nav.Link eventKey="moves">{_("game", "movesTab")}</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="info">{_("game", "infoTab")}</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Tab.Content className="p-0">
                        <Tab.Pane eventKey="moves">
                            <div className="d-flex flex-column h-100">
                                <div className="board-height auto-overflow">
                                    <ChessMoves mode={board.moveTable ? MovesMode.Table : MovesMode.List} nav={NavigatorMode.Top} store={this.store} hasEvals={false} toolbars={toolbar} >
                                        { isPlay ? confirmToggler() : "" }
                                    </ChessMoves>
                                </div>
                                <div className="mt-2 pt-2 border-top">
                                    <Captures store={this.store} piece={this.props.board.piece!} />
                                </div>
                            </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="info">
                            <GameInfo store={this.store} />
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </div>
        );
    };

    private renderToolbar = () => {
        const { store, modeTurnOn } = this;
        const { game } = store.getState();
        const { engine } = game;

        const fen = FenString.fromPosition(engine.CurrentPos);

        let analink = `https://live.chess-online.com/analysis/${fen}?ccid=${engine.GameId}"`;
        if (!engine.RawData.game?.advance) {
            analink += `&ha=${engine.GameId}`;
        }

        return (
            <React.Fragment>
                <div className="btn-group">
                    <button aria-label="resign" className="btn btn-link" title="resign" onClick={() => {}}><i className="xi-resign"></i></button>
                </div>

                <div className="btn-group ml-auto ml-md-0 mt-0 mt-md-auto">
                    <button aria-label="inboard analyse" className="btn btn-link" title="inboard analyse" onClick={() => modeTurnOn(BoardMode.Analyse)}><i className="xi-onboard"></i></button>
                    <a aria-label="external analyse" className="btn btn-link" title="external analyse" href={analink}><i className="xi-analysis"></i></a>
                    <button aria-label="conditional" className="btn btn-link" title="conditional" onClick={() => modeTurnOn(BoardMode.Conditional)}><i className="xi-qtree"></i></button>
                </div>
                <div className="btn-group ml-auto ml-md-0 mt-0 mt-md-auto">
                    <button aria-label="next game" className="btn btn-link" title="next game" onClick={() => {}}><i className="xi-next-game"></i></button>
                </div>
            </React.Fragment>
        );
    };

    render() {
        const { props, store, renderToolbar } = this;
        const { board: boardCfg } = props;
        const { board, game } = store.getState();
        const { square, piece, size, coordinates, is3d } = board;
        
        if (this.cg) {
            // this.cg.set(this.generateConfig());
        }

        const containerClass = [
            square,
            BoardSizeClass[size],
            { 
                "coords-no": !coordinates,
                "is2d": !is3d,
                "is3d": is3d
            }
        ];

        return (
            <Container fluid={true} className={classNames(containerClass)}>
                <Row>
                    <Col md={12}>
                        <div className="d-block d-md-flex flex-wrap mb-2">
                            <div>
                                <div className={classNames("board-container", piece)}>
                                    <Row>
                                        <Col xs={6}>
                                            {renderPlayer(game.engine, board.orientation, "top")} 
                                        </Col>
                                        <Col className="text-right" xs={6}>
                                            {renderTimer(game.engine, board.orientation, "top")} 
                                        </Col>
                                    </Row>
                                    <Row className="py-2">
                                        <Col>
                                            <div className="main-board" ref={el => this.boardElement = el} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={6}>
                                            {renderPlayer(game.engine, board.orientation, "bottom")}
                                        </Col>
                                        <Col className="text-right" xs={6}>
                                            {renderTimer(game.engine, board.orientation, "bottom")} 
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                            <BoardToolbar store={store} configUrl={boardCfg.configUrl}>{renderToolbar()}</BoardToolbar>
                            { this.renderControls() }
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}


export const playGame = (props: GameProps, container: HTMLElement) => {
    ReactDOM.render(React.createElement(PlayGameComponent, props), container, () => { });
};