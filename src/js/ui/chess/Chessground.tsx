import * as React from 'react';
import classNames from 'classnames';
import { Container, Modal, CardGroup } from 'react-bootstrap';
import * as cg from 'chessground/types';
import { Chessground as ChessgroundNative } from 'chessground';
import { Api } from 'chessground/api';
import { Config } from 'chessground/config';
import { BoardSize, BoardSizeClass } from 'onix-board-assets';

export interface BoardProps {
    locale?: string,
    size: BoardSize,
    piece?: string,
    square?: string,

    myColor?: cg.Color,
    turnColor?: number,
    flip?: boolean,

    inPromotion?: boolean,

    board: Config,
}

export interface BoardState {
    inPromotion: boolean,
}

export class Chessground extends React.Component<BoardProps, BoardState> {
    public static defaultProps: BoardProps = {
        locale: "ru-ru",
        size: BoardSize.Normal,
        piece: "alpha",
        square: "color-blue",
        inPromotion: false,
        board: {},
    }

    private boardElement: HTMLDivElement | null = null;
    private cg?: Api = undefined;

    constructor(props: BoardProps) {
        super(props);

        this.state = {
            inPromotion: !!props.inPromotion
        };

    }

    componentDidMount() {
        this.cg = ChessgroundNative(this.boardElement!, this.props.board);        
        window.addEventListener("resize", this.redrawBoard);
    }

    componentWillUnmount() {
        const { cg } = this;
        if (cg !== undefined) {
            cg.destroy();
        }
        
        window.removeEventListener("resize", this.redrawBoard);
    }

    private redrawBoard = () => {
        const { cg } = this;
        if (cg !== undefined) {
            cg.redrawAll();
        }
    };

    private renderPromotion = () => {
        const { inPromotion } = this.state;
        const pieces = ["queen", "rook", "bishop", "knight"].map((role) => {
            return 1; //[color, role as cg.Role];
        });

        if (inPromotion) {
            return (
                <Modal show={inPromotion}>
                    <Modal.Body>
                        <div className="promotion-block">
                            
                        </div>
                    </Modal.Body>
                </Modal>
            );
        }

        return null;
    }

    public render() {
        const { props, renderPromotion } = this;
        const { size, square, piece, board } = props;

        const containerClass = [
            "pos-builder", 
            "is2d",
            square,
            BoardSizeClass[size],
            { "coords-no": !(board.coordinates) }
        ];

        return (
            <Container className={classNames(containerClass)}>
                <div className={classNames("board-container", piece)}>
                    <div className="main-board" ref={el => this.boardElement = el} />
                    { renderPromotion() }
                </div>
            </Container>
        );
    }
}