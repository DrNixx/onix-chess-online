import classNames from 'classnames';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Scrollbar from "react-scrollbars-custom";
import { Unsubscribe } from 'redux';
import { Container, Row, Col, Tabs, Tab, FormGroup, FormLabel, Nav } from 'react-bootstrap';

import { Chessground } from 'chessground';
import { Api } from 'chessground/api';

import { BoardSizeClass } from 'onix-board-assets';

import { GameProps, defaultProps } from '../../../chess/settings/GameProps';
import { createAnalyseGameStore, AnalyseGameStore } from './AnalyseGameStore';
import { createAnalyseGameState } from './AnalyseGameState';
import { renderPlayer, renderResult } from '../GameUtils';

import { GameInfo } from '../GameInfo';
import * as BoardActions from '../../../actions/BoardActions';
import { i18n, _ } from '../../../i18n/i18n';
import { Color } from '../../../chess/Color';
import { Chess as ChessEngine } from '../../../chess/Chess';
import { IStreamMessage } from '../../../net/IStreamMessage';
import { FenString } from '../../../chess/FenString';

import { TextWithCopy } from '../../controls/TextWithCopy';

import { ChessMoves } from '../../components/ChessMoves';
import { MovesMode, NavigatorMode } from '../../components/Constants';
import { Captures } from '../../components/Captures';
import { AnalyseGraphAsync } from '../../components/AnalyseGraphAsync';
import { MovesGraphAsync } from '../../components/MovesGraphAsync';

interface AnalyseGameState {
}

class AnalyseGameComponent extends React.Component<GameProps, AnalyseGameState> {
    public static defaultProps: GameProps = defaultProps;

    private storeUnsubscribe?: Unsubscribe = undefined;

    private store: AnalyseGameStore;

    private cg?: Api = undefined;

    private boardElement: HTMLDivElement | null = null;

    constructor(props: GameProps) {
        super(props);

        i18n.register();

        const state = createAnalyseGameState(this.props);

        this.store = createAnalyseGameStore(state);
    }

    componentDidMount() {
        const { store } = this;
        const { board, game }  = store.getState();

        this.storeUnsubscribe = this.store.subscribe(() =>
            this.updateState()
        );

        this.cg = Chessground(this.boardElement!, {
            fen: game.fen,
            orientation: board.orientation,
            coordinates: board.coordinates,
            turnColor: Color.toName(game.engine.ToMove),
            viewOnly: true,
            resizable: true,
            lastMove: game.lastMove,
            check: game.isCheck,
            highlight: {
                lastMove: true,
                check: true
            },
            events: {
                // change: onPositionChange
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

    private redrawBoard = () => {
        const { cg } = this;
        if (cg !== undefined) {
            cg.redrawAll();
        }
    };

    private flipBoard = () => {
        this.store.dispatch({ type: BoardActions.FLIP_BOARD } as BoardActions.BoardAction)
    };

    updateState = () => {
        
        this.forceUpdate();
    }

    private gameConnect = () => {
        
    }

    gameDisconnect = () => {
        
    }

    gameMsgHandler = (msg: IStreamMessage) => {
        console.log(msg);
    }

    pvtChatHandler = (msg: IStreamMessage) => {
        console.log(msg);
    }

    pubChatHandler = (msg: IStreamMessage) => {
        console.log(msg);
    }

    loadGame = (id: number, insite: boolean) => {
        
    }

    private renderTimer = () => {

    }

    private renderControls = () => {
        return (
            <div className="controls flex-grow-1 d-flex flex-column">
                <Tab.Container defaultActiveKey="info">
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
                                <div className="mb-auto board-height auto-overflow">
                                    <ChessMoves mode={MovesMode.List} nav={NavigatorMode.Top} store={this.store} />
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

    private onPlyClick = (ply: number) => {
        const { store } = this;
        // gameNavigateToPly(store, ply);
    }

    private renderAnalysisTab = (engine: ChessEngine) => {
        if (engine.RawData.game?.insite) {
            return (
                <Nav.Item>
                    <Nav.Link eventKey="analysis">{_("analyse", "title")}</Nav.Link>
                </Nav.Item>
            );
        } else {
            return null;
        }
    };

    private renderAnalysis = (store: AnalyseGameStore, engine: ChessEngine) => {
        if (engine.RawData.game?.insite) {
            return (
                <Tab.Pane eventKey="analysis">
                    <AnalyseGraphAsync 
                        store={store} 
                        height={400} />
                </Tab.Pane>
            );
        } else {
            return null;
        }
    };

    private renderMovetimeTab = (engine: ChessEngine) => {
        if (engine.RawData.game?.moveCentis) {
            return (
                <Nav.Item>
                    <Nav.Link eventKey="movetime">Затраченное время</Nav.Link>
                </Nav.Item>
            );
        } else {
            return null;
        }
    };

    private renderMovetime = (store: AnalyseGameStore, engine: ChessEngine) => {
        if (engine.RawData.game?.moveCentis) {
            return (
                <Tab.Pane eventKey="movetime">
                    <div style={{ width: '100%', height: 400 }}>
                    <MovesGraphAsync 
                        height={400} 
                        store={this.store} />
                    </div>
                </Tab.Pane>
            );
        } else {
            return null;
        }
    };

    private renderFenPgnTab = (engine: ChessEngine) => {
        return (
            <Nav.Item>
                <Nav.Link eventKey="fenpgn">FEN &amp; PGN</Nav.Link>
            </Nav.Item>
        );
    };

    private renderFenPgn = (engine: ChessEngine) => {
        const fen = FenString.fromPosition(engine.CurrentPos);
        const pgn = engine.RawData.pgn;

        return (
            <Tab.Pane eventKey="fenpgn">
                <Row>
                    <Col md={12}>
                        <FormGroup>
                            <FormLabel>{_("chess", "fen")}</FormLabel>
                            <TextWithCopy value={fen} placeholder={_("chess", "fen")} />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <div className="pgn-text">
                            <Scrollbar trackYProps={{style: {width: 5}}}>
                                <pre>{pgn}</pre>
                            </Scrollbar>
                        </div>
                    </Col>
                </Row>
            </Tab.Pane>
        );
    };

    private renderCountersTab = (engine: ChessEngine) => {
        return null;
    }

    private renderCounters = (store: AnalyseGameStore, engine: ChessEngine) => {
        return null;
    }

    private renderUnderboard = (store: AnalyseGameStore, engine: ChessEngine) => {
        const { renderAnalysis, renderAnalysisTab, renderMovetime, renderMovetimeTab, renderFenPgn, renderFenPgnTab, renderCounters, renderCountersTab } = this;

        return (
            <Row>
                <Col lg={12}>
                    <div className="underboard">
                        <Tab.Container defaultActiveKey="fenpgn">
                            <Nav variant="tabs" className="nav-tabs-simple">
                                { renderAnalysisTab(engine) }
                                { renderMovetimeTab(engine) }
                                { renderFenPgnTab(engine) }
                                { renderCountersTab(engine) }
                            </Nav>
                            <Tab.Content>
                                { renderAnalysis(store, engine) }
                                { renderMovetime(store, engine) }
                                { renderFenPgn(engine) }
                                { renderCounters(store, engine) }
                            </Tab.Content>
                        </Tab.Container>
                    </div>
                </Col>
            </Row>
        );
    };

    render() {
        const { props, store, flipBoard } = this;
        const { board: boardCfg } = props;
        const { board, game } = store.getState();
        const { engine } = game;
        const { square, piece, size, coordinates, is3d } = board;
        
        if (this.cg) {
            this.cg.set({
                fen: game.fen,
                lastMove: game.lastMove,
                check: game.isCheck,
                orientation: board.orientation,
                coordinates: board.coordinates,
            });
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
                                        <Col md={6}>
                                            {renderPlayer(game.engine, board.orientation, "top")} 
                                        </Col>
                                        <Col className="text-right" md={6}>
                                            {renderResult(game.engine, board.orientation, "top")}
                                        </Col>
                                    </Row>
                                    <Row className="py-2">
                                        <Col>
                                            <div className="main-board" ref={el => this.boardElement = el} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            {renderPlayer(game.engine, board.orientation, "bottom")}
                                        </Col>
                                        <Col className="text-right" md={6}>
                                            {renderResult(game.engine, board.orientation, "bottom")}
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                            <div className="mini-controls mx-md-3 mt-3 mt-md-5 mb-4">
                                <div className="btn-toolbar flex-wrap" role="toolbar">
                                    <div className="btn-group">
                                        { boardCfg.configUrl ? (<a aria-label={_("game", "config")} className="btn btn-link" title={_("game", "config")} href={boardCfg.configUrl + "?returnUrl=" + window.location.href}><i className="xi-config"></i></a>) : "" }
                                        <button aria-label={_("game", "flip")} className="btn btn-link" title={_("game", "flip")} onClick={flipBoard}><i className="xi-refresh"></i></button>
                                    </div>
                                </div>
                            </div>
                            {this.renderControls()}
                        </div>
                    </Col>
                </Row>
                { this.renderUnderboard(store, engine) }
            </Container>
        );
    }
}

export const AnalyseGame = (props: GameProps, container: HTMLElement) => {
    ReactDOM.render(React.createElement(AnalyseGameComponent, props), container, () => { });
};