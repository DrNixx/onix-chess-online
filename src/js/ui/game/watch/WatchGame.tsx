import classNames from 'classnames';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Unsubscribe } from 'redux';
import { Container, Row, Col, Tab, Nav } from 'react-bootstrap';

import { Chessground } from 'chessground';
import { Api } from 'chessground/api';

import { IStreamMessage } from '../../../net/IStreamMessage';

import { BoardSizeClass } from 'onix-board-assets';

import { GameProps, defaultProps } from '../../../chess/settings/GameProps';
import { createWatchGameStore, WatchGameStore } from './WatchGameStore';
import { createWatchGameState } from './WatchGameState';
import { ChessMoves } from '../../components/ChessMoves';
import { MovesMode, NavigatorMode } from '../../components/Constants';
import { Captures } from '../../components/Captures';
import { renderPlayer, renderTimer, renderBoardControls } from '../GameUtils';
import * as BoardActions from '../../../actions/BoardActions';
import { GameInfo } from '../GameInfo';
import { i18n, _ } from '../../../i18n/i18n';
import { Color } from '../../../chess/Color';
import { Logger } from '../../../common/Logger';

interface WatchGameState {
}

class WatchGameComponent extends React.Component<GameProps, WatchGameState> {
    public static defaultProps: GameProps = defaultProps;

    private storeUnsubscribe?: Unsubscribe = undefined;

    private store: WatchGameStore;

    private cg?: Api = undefined;

    private boardElement: HTMLDivElement | null = null;

    constructor(props: GameProps) {
        super(props);

        i18n.register();

        const state = createWatchGameState(this.props);

        this.store = createWatchGameStore(state);
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

    private updateState = () => {    
        this.forceUpdate();
    };


    gameDisconnect = () => {
        
    }

    gameMsgHandler = (msg: IStreamMessage) => {
        Logger.debug(msg);
    }

    pvtChatHandler = (msg: IStreamMessage) => {
        Logger.debug(msg);
    }

    pubChatHandler = (msg: IStreamMessage) => {
        Logger.debug(msg);
    }

    loadGame = () => {
        
    }


    private flipBoard = () => {
        this.store.dispatch({ type: BoardActions.FLIP_BOARD } as BoardActions.BoardAction)
    };

    private renderControls = () => {
        const { store } = this;
        const { game } = store.getState();

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
                                <div className="mb-auto board-height auto-overflow">
                                    <ChessMoves mode={game.moves} nav={NavigatorMode.Top} store={this.store} hasEvals={false} />
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

    render() {
        const { props, store, flipBoard } = this;
        const { board: boardCfg } = props;
        const { board, game } = store.getState();
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
                            { renderBoardControls(store, boardCfg.configUrl) }
                            { this.renderControls() }
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}


export const watchGame = (props: GameProps, container: HTMLElement) => {
    ReactDOM.render(React.createElement(WatchGameComponent, props), container, () => { });
};