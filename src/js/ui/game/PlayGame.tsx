import clsx from "clsx";
import React from 'react';
import * as ReactDOM from 'react-dom';
import { Unsubscribe } from 'redux';
import { Container, Row, Col, Tab, Nav, Button, ButtonToolbar, ButtonGroup, Card, Form, Modal } from 'react-bootstrap';

import { Chessground } from 'chessground';
import { Api } from 'chessground/api';
import { Config as CgConfig } from 'chessground/config';
import * as cg from 'chessground/types';

import { i18n, _ } from '../../i18n/i18n';

import { Color } from '../../chess/Color';

import { BoardSizeClasses } from 'onix-board-assets';

import { GameProps, defaultProps } from '../../chess/settings/GameProps';

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
import { GamePgn } from '../components/GamePgn';
import { FenString } from '../../chess/FenString';
import { Chat } from '../../chat/Chat';
import { Logger } from '../../common/Logger';
import { Chess } from '../../chess/Chess';
import { appInstance } from '../../app/IApplication';
import { IGameMessage } from '../../chess/types/Interfaces';

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

interface PlayGameProps extends GameProps {
    i18n?: {
        canJoin: string;
        canJoinNote: string;
        waitJoin: string;
        waitJoinNote: string;
        waitOpponent: string;
        waitOpponentNote: string;
        acceptChallenge: string;
        acceptChallengeNote: string;
    }
}

interface GameState {
    mode: BoardMode;
    manualFrom?: string;
    manualTo?: string;
    confirmMove: boolean;
    drawChecked: boolean;
    provisionalMove: ProvisionalMove;
    confirmResign: boolean;
}

class PlayGameComponent extends React.Component<PlayGameProps, GameState> {
    public static defaultProps: PlayGameProps = {
        ...defaultProps,
        i18n: {
            canJoin: "Join to а game",
            canJoinNote: "You can join this game",
            waitJoin: "Waiting for opponent join",
            waitJoinNote: "The game will become available after any opponent join to your game",
            waitOpponent: "Waiting for a response from the opponent",
            waitOpponentNote: "The game will become available after the opponent accepts your challenge",
            acceptChallenge: "Accept challenge",
            acceptChallengeNote: "You must accept or reject the challenge",
        }
    };

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

    constructor(props: PlayGameProps) {
        super(props);

        i18n.register();

        const state = createCombinedGameState(this.props);

        this.store = createCombinedGameStore(state);
        this.state = {
            mode: BoardMode.Play,
            confirmResign: false,
            confirmMove: state.board.confirmMove,
            drawChecked: false,
            provisionalMove: {}
        };
    }

    componentDidMount() {
        const that = this;
        const { store, onMove, onSelect } = that;
        const { board, game }  = store.getState();

        that.storeUnsubscribe = that.store.subscribe(() =>
            that.updateState()
        );

        
        that.cg = Chessground(that.boardElement!, {
            ...that.generateConfig(),
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

        window.addEventListener("resize", that.redrawBoard);

        const id = game.engine.GameId;
        if (appInstance && id) {
            const { stream } = appInstance;
            const channel = `game:${id}`;
            if (stream) {
                stream.subscribe(channel, function(ctx: any) {
                    if (ctx?.data) {
                        that.gameMessage(ctx?.data as IGameMessage);
                    }
                });
            }
        }
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

    private gameMessage = (msg: IGameMessage) => {
        if (msg.c == "delete") {
            window.location.href = "/";
        } else if (msg.c == "reload") {
            window.location.reload();
        }
    };

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
                viewOnly: isPlay ? (!engine.isStarted || (wm !== engine.Player)) : false,
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

    private validFrom = (sq: Squares.Square) => {
        const { props, store, state } = this;
        const { game } = store.getState();
        const { engine } = game;

        if (engine.isStarted) {
            const pos = engine.CurrentPos;

            const movingPiece = pos.getPiece(sq);
            if (!Piece.isPiece(movingPiece)) {
                return false;
            }

            return Piece.color(movingPiece) == pos.WhoMove;
        }
        
        return false;
    };

    private canMove = (from?: Squares.Square, to?: Squares.Square) => {
        const { store } = this;
        const { game } = store.getState();
        const { engine } = game;

        if (to !== undefined) {
            return from !== undefined;
        } else if (from !== undefined) {
            return this.validFrom(from);
        } else {
            return !this.isPlay || engine.CurrentMove.provisional || (engine.isStarted && !engine.isFinished && engine.isMyMove);
        }
    };

    private sendMove = () => {
        const { props, store, state, isPlay } = this;
        const { csrfTokenName, csrfTokenValue } = props.board;
        const { provisionalMove, ...other } = state;
        const { game } = store.getState();
        const { engine } = game;

        const apiUrl = engine.RawData.url?.api;
        if (isPlay && provisionalMove.from && provisionalMove.to && apiUrl) {
            const data: any = {
                from: Square.name(provisionalMove.from),
                to: Square.name(provisionalMove.to),
                promotion: provisionalMove.promotion,
                draw: state.drawChecked
            };

            if (csrfTokenName) {
                data[csrfTokenName] = csrfTokenValue;
            }

            fetch(
                apiUrl, {
                    method: "POST", 
                    mode: "cors", 
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify(data)
                })
                .then(function(response) {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                })
                .catch(function(error) {
                    Logger.error('Looks like there was a problem when posting move: \n', error);
                });
        }
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
                            this.setState({
                                ...other,
                                provisionalMove: provisionalMove,
                                manualFrom: undefined,
                                manualTo: undefined
                            }, () => {
                                this.sendMove();
                            });
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

    private onMove = (orig: cg.Key, dest: cg.Key, capturedPiece?: cg.Piece) => {
        const from = Square.parse(orig);
        const to = Square.parse(dest);
        
        this.doMove(from, to);
    };

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

    /**
     * Do move with confirm
     */
    private moveClick = () => {
        this.sendMove();
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

    //#region From - To handler
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
    //#endregion From - To handler

    //#region Toolbar + forms
    private moveForm = (engine: Chess) => {
        if (engine.isStarted) {
            const { state, drawCheck, changeFrom, changeTo, returnToPlay, canMove, moveClick } = this;
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
                            <input aria-label={_("game", "move_from")} type="text" value={fromVal} onChange={changeFrom} disabled={disableForm} />
                            <span className="px-2">&mdash;</span>
                            <input aria-label={_("game", "move_to")} type="text" value={toVal} onChange={changeTo} disabled={disableForm} />
                            <Button variant="success" className="ml-2" onClick={moveClick} disabled={!provisionalMove.isValid || disableForm}>{_("game", "move_button")}</Button>
                            <Button variant="default" className="ml-2" onClick={returnToPlay} disabled={disableForm || (!fromVal && !toVal)}>{_("game", "reset_button")}</Button>
                        </div>
                    ) : ""}
                </ButtonToolbar>
            );
        } else {
            return null;
        }
    };

    private analyseForm = (started: Boolean) => {
        if (started) {
            return (
                <ButtonToolbar>
                    <ButtonGroup className="mx-auto p-4">
                        <Button onClick={this.returnToPlay}>{_("game", "close_analyse")}</Button>
                    </ButtonGroup>
                </ButtonToolbar>
            );
        } else {
            return null;
        }
    };

    private conditionalForm = (started: Boolean) => {
        if (started) {
            return (
                <ButtonToolbar>
                    <ButtonGroup className="mx-auto p-4">
                        <Button onClick={this.returnToPlay}>{_("game", "close_conditional")}</Button>
                    </ButtonGroup>
                </ButtonToolbar>
            );
        } else {
            return null;
        }
    };

    private showResignDialog = () => {
        const { confirmResign, ...other } = this.state;
        this.setState({
            ...other,
            confirmResign: true
        });
    };

    private resignDialog = (engine: Chess) => {
        const that = this;
        const { state } = that;

        const hideResignDialog = () => {
            const { confirmResign, ...other } = state;
            that.setState({
                ...other,
                confirmResign: false
            });
        };
    
        const doResign = () => {
            const { props, isPlay } = this;
            const { csrfTokenName, csrfTokenValue } = props.board;

            const apiUrl = engine.RawData.url?.api;
            if (isPlay && apiUrl) {
                const data: any = {
                    mode: "resign"
                };

                if (csrfTokenName) {
                    data[csrfTokenName] = csrfTokenValue;
                }
    
                fetch(
                    apiUrl, {
                        method: "POST",
                        mode: "cors",
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8'
                        },
                        body: JSON.stringify(data)
                    })
                    .then(function(response) {
                        if (!response.ok) {
                            throw Error(response.statusText);
                        }
                    })
                    .catch(function(error) {
                        Logger.error('Looks like there was a problem when send resign command: \n', error);
                    });
            }

            hideResignDialog();
        };

        return (
            <Modal centered={true} size="sm" show={state.confirmResign} onHide={hideResignDialog}>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">{_("core", "confirm_action")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{_("game", "do_resign_confirm")}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={hideResignDialog}>{_("core", "cancel")}</Button>
                    <Button variant="warning" onClick={doResign}>{_("game", "do_resign")}</Button>
                </Modal.Footer>
            </Modal>
        );
    };

    

    private renderToolbar = (engine: Chess) => {
        const { modeTurnOn, showResignDialog } = this;
        
        const fen = FenString.fromPosition(engine.CurrentPos);

        let analink = `https://live.chess-online.com/analysis/${fen}?ccid=${engine.GameId}`;
        if (!engine.RawData.game?.advance) {
            analink += `&ha=${engine.GameId}`;
        }

        const items: JSX.Element[] = [];
        if (engine.isStarted) {
            items.push(
                <div className="btn-group" key="resign-group">
                    <button aria-label={_("game", "do_resign")} className="btn btn-warning" title={_("game", "do_resign")} onClick={showResignDialog}><i className="xi-resign"></i></button>
                </div>
            );
            items.push(
                <div className="btn-group"  key="gametools-group">
                    <button aria-label={_("game", "inboard_analyse")} className="btn btn-default" title={_("game", "inboard_analyse")} onClick={() => modeTurnOn(BoardMode.Analyse)}><i className="xi-onboard"></i></button>
                    <a aria-label={_("game", "external_analyse")} className="btn btn-default" title={_("game", "external_analyse")} href={analink}><i className="xi-analysis"></i></a>
                    <button aria-label={_("game", "conditional")} className="btn btn-default" title={_("game", "conditional")} onClick={() => modeTurnOn(BoardMode.Conditional)}><i className="xi-qtree"></i></button>
                </div>
            );
        }

        return (
            <React.Fragment>
                { items }
                <div className="btn-group" key="next-game-group">
                    <button aria-label={_("game", "next_game")} className="btn btn-default" title={_("game", "next_game")} onClick={() => {}}><i className="xi-next-game"></i></button>
                </div>
            </React.Fragment>
        );
    };
    //#endregion Toolbar + forms

    //#region Moves
    private renderMovesTab = (engine: Chess) => {
        if (engine.isStarted) {
            return (
                <Nav.Item>
                    <Nav.Link eventKey="moves">{_("game", "movesTab")}</Nav.Link>
                </Nav.Item>
            );
        }

        return null;
    };

    private renderMovesPane  = (engine: Chess) => {
        if (engine.isStarted) {
            const { props, state, store, isPlay, confirmToggler, analyseForm, conditionalForm, moveForm } = this;
            const { board } = store.getState();

            let toolbar: JSX.Element | null;
            switch (state.mode) {
                case BoardMode.Analyse:
                    toolbar = analyseForm(engine.isStarted);
                    break;
                case BoardMode.Conditional:
                    toolbar = conditionalForm(engine.isStarted);
                    break;
                default:
                    toolbar = moveForm(engine);
            }

            return (
                <Tab.Pane eventKey="moves">
                    <div className="d-flex flex-column h-100">
                        <div className="board-height auto-overflow">
                            <ChessMoves mode={board.moveTable ? MovesMode.Table : MovesMode.List} nav={NavigatorMode.Top} store={store} hasEvals={false} toolbars={toolbar} >
                                { isPlay ? confirmToggler() : "" }
                            </ChessMoves>
                        </div>
                        <div className="mt-2 pt-2 border-top">
                            <Captures store={store} piece={board.piece!} />
                        </div>
                    </div>
                </Tab.Pane>
            );
        }

        return null;
    };
    //#endregion Moves

    //#region PGN
    private renderPgnTab = (engine: Chess) => {
        if (engine.isStarted && engine.RawData.game?.advance) {
            return (
                <Nav.Item>
                    <Nav.Link eventKey="fenpgn">FEN &amp; PGN</Nav.Link>
                </Nav.Item>
            );
        }

        return null;
    };

    private renderPgnPane  = (engine: Chess) => {
        if (engine.isStarted && engine.RawData.game?.advance) {
            const fen = FenString.fromPosition(engine.CurrentPos);
            const pgn = engine.RawData.pgn;
            return (
                <Tab.Pane eventKey="fenpgn" className="pt-4">
                    <GamePgn fen={fen} pgn={pgn} />
                </Tab.Pane>
            );
        }

        return null;
    };
    //#endregion PGN

    //#region Chat
    private renderChatTab = (engine: Chess) => {
        if (engine.isStarted) {
            return (
                <Nav.Item>
                    <Nav.Link eventKey="chat">{_("game", "chatTab")}</Nav.Link>
                </Nav.Item>
            );
        }

        return null;
    };

    private renderChatPane  = (engine: Chess) => {
        if (engine.isStarted) {
            let chatChannel = `gamechat:${engine.GameId}`;
            if (engine.isMyGame) {
                chatChannel = "$" + chatChannel;
            }

            return (
                <Tab.Pane eventKey="chat">
                    <Chat channel={chatChannel} apiUrl="/api/chat" messages={[]} userid={engine.ObserverId} />
                </Tab.Pane>
            );
        }

        return null;
    };
    //#endregion Chat

    //#region Notes
    private renderNotesTab = (engine: Chess) => {
        if (engine.isStarted) {
            return (
                <Nav.Item>
                    <Nav.Link eventKey="notes">{_("game", "notesTab")}</Nav.Link>
                </Nav.Item>
            );
        }

        return null;
    };

    private renderNotes = () => {
        return (
            <div>Notes</div>    
        );
    };

    private renderNotesPane = (engine: Chess) => {
        if (engine.isStarted) {
            return (
                <Tab.Pane eventKey="notes" className="pt-4">
                    {this.renderNotes()}
                </Tab.Pane>
            );
        }

        return null;
    };
    //#endregion Notes

    //#region Accept-reject form
    private acceptGame = (engine: Chess) => {
        const { csrfTokenName, csrfTokenValue } = this.props.board;
        const apiUrl = engine.RawData.url?.api;

        if (apiUrl) {
            const data: any = {};

            if (csrfTokenName) {
                data[csrfTokenName] = csrfTokenValue;
            }
            
            fetch(
                apiUrl, {
                    method: "PUT", 
                    mode: "cors", 
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify(data)
                })
                .then(function(response) {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                })
                .catch(function(error) {
                    Logger.error('Looks like there was a problem when accept game: \n', error);
                });    
        }
    };

    private rejectGame = (engine: Chess) => {
        const { csrfTokenName, csrfTokenValue } = this.props.board;
        const apiUrl = engine.RawData.url?.api;

        if (apiUrl) {
            const data: any = {};

            if (csrfTokenName) {
                data[csrfTokenName] = csrfTokenValue;
            }

            fetch(
                apiUrl, {
                    method: "DELETE", 
                    mode: "cors", 
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify(data)
                })
                .then(function(response) {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                })
                .catch(function(error) {
                    Logger.error('Looks like there was a problem when reject game: \n', error);
                });    
        }
    };

    private infoAddForm = (engine: Chess) => {
        const { props, acceptGame, rejectGame } = this;
        let form: JSX.Element | null = null;

        if (!engine.isStarted) {
            if (engine.isChallengeFromMe) {
                return (
                    <Card className="w-75 mx-auto mt-4" bg="info">
                        <Card.Header className="separator">
                            <Card.Title>{props.i18n?.waitOpponent}</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <p className="mt-3"><i className="xi-hourglass xi-3x mr-2 pull-left"></i>{props.i18n?.waitOpponentNote}</p>
                            <br/>
                            <Row className="mt-2">
                                <Col xs={12} className="text-center">
                                    <Button variant="warning" onClick={() => rejectGame(engine)}>{ _("game", "cancel_challenge") }</Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                );
            } else if (engine.isChallengeToMe) {
                return (
                    <Card className="w-75 mx-auto mt-4" bg="contrast">
                        <Card.Header className="separator">
                            <Card.Title>{props.i18n?.acceptChallenge}</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <p className="mt-3"><i className="xi-hourglass xi-3x mr-2 pull-left"></i>{props.i18n?.acceptChallengeNote}</p>
                            <br/>
                            <Row className="mt-2">
                                <Col xs={6} className="text-right">
                                    <Button variant="primary" onClick={() => acceptGame(engine)}>{ _("core", "accept") }</Button>
                                </Col>
                                <Col xs={6} className="text-left">
                                    <Button variant="warning" onClick={() => rejectGame(engine)}>{ _("core", "decline") }</Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                );    
            } else if (engine.isNewGame && engine.isMyGame) {
                return (
                    <Card className="w-75 mx-auto mt-4" bg="info">
                        <Card.Header className="separator">
                            <Card.Title>{props.i18n?.waitJoin}</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <p className="mt-3"><i className="xi-hourglass xi-3x mr-2 pull-left"></i>{props.i18n?.waitJoinNote}</p>
                            <br/>
                            <Row className="mt-2">
                                <Col xs={12} className="text-center">
                                    <Button variant="warning" onClick={() => rejectGame(engine)}>{ _("game", "cancel_game") }</Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                );
            } else if (engine.isNewGame && !engine.isMyGame) {
                return (
                    <Card className="w-75 mx-auto mt-4" bg="contrast">
                        <Card.Header className="separator">
                            <Card.Title>{props.i18n?.canJoin}</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <p className="mt-3"><i className="xi-hourglass xi-3x mr-2 pull-left"></i>{props.i18n?.canJoinNote}</p>
                            <br/>
                            <Row className="mt-2">
                                <Col xs={12} className="text-center">
                                    <Button variant="primary" onClick={() => acceptGame(engine)}>{ _("core", "join") }</Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                );    
            }
        }

        return form;
    }
    //#endregion Accept-reject form

    private renderControls = () => {
        const { props, store, renderToolbar, renderMovesTab, renderMovesPane, renderPgnTab, renderPgnPane, renderChatTab, renderChatPane, renderNotesTab, renderNotesPane, infoAddForm } = this;
        const { board: boardCfg } = props;
        const { game } = store.getState();
        const { engine } = game;

        const defaultKey = engine.isStarted ? "moves" : "info";

        return (
            <div className="controls flex-grow-1 d-flex flex-column ml-md-4">
                <BoardToolbar store={store} configUrl={boardCfg.configUrl}>{renderToolbar(engine)}</BoardToolbar>
                <Tab.Container defaultActiveKey={defaultKey}>
                    <Nav variant="tabs" className="nav-tabs-simple" onSelect={(eventKey: any, event: React.SyntheticEvent<unknown>) => { (event.target as HTMLElement).blur(); }}>
                        { renderMovesTab(engine) }
                        <Nav.Item>
                            <Nav.Link eventKey="info">{_("game", "infoTab")}</Nav.Link>
                        </Nav.Item>
                        { renderPgnTab(engine) }
                        { renderChatTab(engine) }
                        { renderNotesTab(engine) }
                    </Nav>
                    <Tab.Content className="p-0">
                        { renderMovesPane(engine) }
                        <Tab.Pane eventKey="info" className="pt-4">
                            <GameInfo store={this.store}>{ infoAddForm(engine) }</GameInfo>
                        </Tab.Pane>
                        { renderPgnPane(engine) }
                        { renderChatPane(engine) }
                        { renderNotesPane(engine) }
                    </Tab.Content>
                </Tab.Container>
                {this.resignDialog(engine)}
            </div>
        );
    };

    render() {
        const { store } = this;
        const { board, game } = store.getState();
        const { square, piece, size, coordinates, is3d } = board;
        
        const containerClass = [
            square,
            BoardSizeClasses[size],
            { 
                "coords-no": !coordinates,
                "is2d": !is3d,
                "is3d": is3d
            }
        ];

        return (
            <Container fluid={true} className={clsx(containerClass)}>
                <Row>
                    <Col md={12}>
                        <div className="d-block d-md-flex flex-wrap mb-2">
                            <div>
                                <div className={clsx("board-container", piece)}>
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