import clsx from "clsx";
import React from 'react';
import * as ReactDOM from 'react-dom';
import { Unsubscribe } from 'redux';
import { Container, Row, Col, Tabs, Tab, Nav } from 'react-bootstrap';

import { Chessground } from 'chessground';
import { Api } from 'chessground/api';
import { BoardSizeClasses } from 'onix-board-assets';

import { i18n, _ } from '../../i18n/i18n';

import { Color } from '../../chess/Color';
import { FenString } from '../../chess/FenString';

import { GameProps, defaultProps } from '../../chess/settings/GameProps';

import { createCombinedGameStore, CombinedGameStore } from '../../actions/CombinedGameStore';
import { createCombinedGameState } from '../../actions/CombinedGameState';

import { renderPlayer, renderResult } from './GameUtils';
import { GameInfo } from './GameInfo';

import { ChessMoves } from '../components/ChessMoves';
import { MovesMode, NavigatorMode } from '../components/Constants';
import { Captures } from '../components/Captures';
import { BoardToolbar } from '../components/BoardToolbar';
import { GamePgn } from '../components/GamePgn';


interface GameState {
}

class PgnGameComponent extends React.Component<GameProps, GameState> {
    public static defaultProps: GameProps = defaultProps;

    private storeUnsubscribe?: Unsubscribe = undefined;

    private store: CombinedGameStore;

    private cg?: Api = undefined;

    private boardElement: HTMLDivElement | null = null;

    constructor(props: GameProps) {
        super(props);

        i18n.register();

        const state = createCombinedGameState(this.props);

        this.store = createCombinedGameStore(state);
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

    updateState = () => {    
        this.forceUpdate();
    }

    private renderControls = () => {
        const { store, props } = this;
        const { board: boardCfg } = props;
        const { board, game } = store.getState();
        const { engine } = game;

        const fen = FenString.fromPosition(engine.CurrentPos);
        const pgn = engine.RawData.pgn;

        return (
            <div className="controls flex-grow-1 d-flex flex-column ml-md-4">
                <Tab.Container defaultActiveKey="moves">
                    <Nav variant="tabs" className="nav-tabs-simple" onSelect={(eventKey: any, event: React.SyntheticEvent<unknown>) => { (event.target as HTMLElement).blur(); }}>
                        <Nav.Item>
                            <Nav.Link eventKey="moves">{_("game", "movesTab")}</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="info">{_("game", "infoTab")}</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="fenpgn">FEN &amp; PGN</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Tab.Content className="p-0">
                        <Tab.Pane eventKey="moves">
                            <div className="d-flex flex-column h-100">
                                <div className="board-height auto-overflow">
                                    <ChessMoves mode={board.moveTable ? MovesMode.Table : MovesMode.List} nav={NavigatorMode.Top} store={this.store} hasEvals={false} />
                                </div>
                                <div className="mt-2 pt-2 border-top">
                                    <Captures store={this.store} piece={this.props.board.piece!} />
                                </div>
                            </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="info">
                            <GameInfo store={this.store} />
                        </Tab.Pane>
                        <Tab.Pane eventKey="fenpgn">
                            <GamePgn fen={fen} pgn={pgn} />
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </div>
        );
    };

    render() {
        const { store } = this;
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
                                        <Col md={6}>
                                            {renderPlayer(game.engine, board.orientation, "top")} 
                                        </Col>
                                        <Col className="text-right position-relative" md={6}>
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
                            { this.renderControls() }
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export const pgnGame = (props: GameProps, container: HTMLElement) => {
    ReactDOM.render(React.createElement(PgnGameComponent, props), container, () => { });
};