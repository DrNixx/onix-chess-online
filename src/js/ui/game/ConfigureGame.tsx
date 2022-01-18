import clsx from "clsx";
import React from 'react';
import * as ReactDOM from 'react-dom';
import { Unsubscribe } from 'redux';
import { Container, Row, Col, FormGroup, FormLabel, FormCheck, Form, Button } from 'react-bootstrap';
import { BoardSize, BoardSizeClasses } from 'onix-board-assets';

import { Chessground } from 'chessground';
import { Api } from 'chessground/api';
import { Config as CgConfig } from 'chessground/config';
import * as cg from 'chessground/types';

import { i18n, _ } from '../../i18n/i18n';

import { FenString } from '../../chess/FenString';
import { BoardSettings, defaultSettings } from '../../chess/settings/BoardSettings';

import * as BoardActions from '../../actions/BoardActions';
import { BoardStore, createBoardStore } from '../../actions/BoardReducer';

import SizeSelector from '../controls/SizeSelector';
import { PieceSelector } from '../controls/PieceSelector';
import { SquareSelector } from '../controls/SquareSelector';
import { Chess } from '../../chess/Chess';
import { Square } from '../../chess/Square';

class ConfigureGameComponent extends React.Component<BoardSettings, {}> {
    public static defaultProps: BoardSettings = defaultSettings;

    private storeUnsubscribe?: Unsubscribe = undefined;

    private store: BoardStore;

    private cg?: Api = undefined;

    private engine: Chess;

    private boardElement: HTMLDivElement | null = null;

    constructor(props: BoardSettings) {
        super(props);

        i18n.register();

        this.engine = new Chess();

        const { is3d, size, square, piece, orientation, coordinates, learnMode, confirmMove, moveTable } = this.props;
        this.store = createBoardStore({
            is3d: !!is3d,
            size: size,
            square: square!,
            piece: piece!,
            orientation: orientation ?? 'white',
            coordinates: !!coordinates,
            learnMode: !!learnMode,
            confirmMove: !!confirmMove,
            moveTable: !!moveTable
        });
    }

    componentDidMount() {
        const { store, onMove, generateConfig } = this;
        const { orientation, coordinates }  = store.getState();

        this.storeUnsubscribe = this.store.subscribe(() =>
            this.updateState()
        );

        this.cg = Chessground(this.boardElement!, {
            ...generateConfig(),
            highlight: {
                lastMove: true,
                check: true
            },
            events: {
                move: onMove
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
        const { store, engine } = this;
        const { orientation, coordinates, learnMode }  = store.getState();

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
            fen: FenString.fromPosition(engine.CurrentPos),
            orientation: orientation,
            coordinates: coordinates,
            viewOnly: false,
            movable: {
                free: false,
                color: 'both',
                dests: dests,
                showDests: learnMode
            }
        };
    };

    private onMove = (orig: cg.Key, dest: cg.Key, capturedPiece?: cg.Piece) => {
        const sm = this.engine.makeMove(Square.parse(orig)!, Square.parse(dest)!);

        if (sm) {
            this.engine.addMove(sm);
            this.forceUpdate();
        }
    };

    private redrawBoard = () => {
        const { cg } = this;
        if (cg !== undefined) {
            cg.redrawAll();
        }
    };

    updateState = () => {
        this.forceUpdate();
    };

    private onConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.store.dispatch({ type: BoardActions.CONFIRM_MOVE } as BoardActions.BoardAction)
    };

    private onLearnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.store.dispatch({ type: BoardActions.LEARN_BOARD } as BoardActions.BoardAction)
    };

    private onCoordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.store.dispatch({ type: BoardActions.SET_COORDS } as BoardActions.BoardAction)
    };

    private onSizeChange = (size: BoardSize) => {
        this.store.dispatch({ type: BoardActions.CHANGE_SIZE, size: size } as BoardActions.BoardAction);
    };

    private onPieceChange = (piece: string) => {
        this.store.dispatch({ type: BoardActions.SET_PIECE, piece: piece } as BoardActions.BoardAction);
    };

    private onSquareChange = (square: string) => {
        this.store.dispatch({ type: BoardActions.SET_SQUARE, square: square } as BoardActions.BoardAction);
    };

    private onMoveTableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.store.dispatch({ type: BoardActions.MOVE_TABLE } as BoardActions.BoardAction)
    };
    
    private renderControls = () => {
        const { props, store, onSizeChange, onPieceChange, onSquareChange, onCoordsChange, onLearnChange, onConfirmChange, onMoveTableChange } = this;
        const { size, piece, square, coordinates, learnMode, confirmMove, moveTable } = store.getState();
        return (
            <div className="controls flex-grow-1">
                <Form method="post">
                    { (props.csrfTokenName && props.csrfTokenValue) ? (<input type="hidden" name={props.csrfTokenName} value={props.csrfTokenValue} />) : "" }
                    { (props.returnUrl) ? (<input type="hidden" name="returnUrl" value={props.returnUrl} />) : "" }
                    <h3>{_("game", "board_and_pieces")}</h3>
                    <Row>
                        <Col md={12}>
                            <FormGroup controlId="size">
                                <FormLabel>{_("game", "board_size")}</FormLabel>
                                <SizeSelector name="size" defaultValue={size} onChangeSize={onSizeChange} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <FormGroup controlId="piece">
                                <FormLabel>{_("chess", "pieces")}</FormLabel>
                                <PieceSelector name="piece" defaultValue={piece} onChangePiece={onPieceChange} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <FormGroup controlId="square">
                                <FormLabel>{_("chess", "squares")}</FormLabel>
                                <SquareSelector name="square" defaultValue={square} onChangeSquare={onSquareChange} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <FormCheck 
                                id ="coords" 
                                name="coords"
                                type="checkbox"
                                className="switch switch-lg primary"
                                value="1"
                                onChange={onCoordsChange} 
                                defaultChecked={coordinates}
                                label={_("game", "display_coord")} />
                        </Col>
                    </Row>
                    <h3>{_("game", "other_settings")}</h3>
                    <Row>
                        <Col md={6}>
                            <FormCheck 
                                id ="hints" 
                                name="hints"
                                type="checkbox"
                                className="switch switch-lg primary"
                                value="1"
                                onChange={onLearnChange} 
                                defaultChecked={learnMode}
                                label={_("game", "display_move_hints")} />
                        </Col>
                        <Col md={6}>
                            <FormCheck 
                                id ="confirm" 
                                name="confirm"
                                type="checkbox"
                                className="switch switch-lg primary"
                                value="1"
                                onChange={onConfirmChange} 
                                defaultChecked={confirmMove}
                                label={_("game", "confirm_move_form")} />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <div className="d-flex flex-nowrap">
                                <span className="mr-2">{_("game", "moves_mode")}:</span>
                                <span className="mr-2">{_("game", "moves_mode_list")}</span>
                                <FormCheck 
                                    id ="movetable" 
                                    name="movetable"
                                    type="checkbox"
                                    className="switch switch-lg primary"
                                    value="1"
                                    onChange={onMoveTableChange} 
                                    defaultChecked={moveTable}
                                    label={_("game", "moves_mode_table")} />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="text-right" md={12}>
                            <Button type="submit">{_("app", "save")}</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    };

    render() {
        const { store, generateConfig } = this;
        const { square, piece, size, coordinates, orientation, is3d } = store.getState();
        
        if (this.cg) {
            this.cg.set(generateConfig());
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
                        <div className="d-block d-lg-flex mb-2">
                            <div>
                                <div className={clsx("board-container", piece)}>
                                    <div className="py-2">
                                        <div className="main-board" ref={el => this.boardElement = el} />
                                    </div>
                                </div>
                            </div>
                            <div className="mini-controls mx-3 mt-5">
                            </div>
                            {this.renderControls()}
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export const configureGame = (props: BoardSettings, container: HTMLElement) => {
    ReactDOM.render(React.createElement(ConfigureGameComponent, props), container, () => { });
};