import classNames from 'classnames';
import toSafeInteger from 'lodash/toSafeInteger';
import * as React from 'react';
import { GameActions } from '../../actions/GameActions';
import { GameRelatedStore } from '../../actions/GameStore';
import { Color } from '../../chess/Color';
import { Piece } from '../../chess/Piece';
import { Pieces } from '../../chess/types/Types';

export interface CapturesProps {
    store: GameRelatedStore,
    piece: string
}

export class Captures extends React.Component<CapturesProps, {}> {
    /**
     * constructor
     */
    constructor(props: CapturesProps) {
        super(props);
    }

    private moveToPly = (ply: number) => {
        const { store } = this.props;
        store.dispatch({ type: GameActions.NAVIGATE_TO_PLY, ply: ply } as GameActions.GameAction);
    }

    private pieceClick = (e: React.MouseEvent<HTMLDivElement>) => {
        this.moveToPly(toSafeInteger(e.currentTarget.dataset["ply"]));
    }


    render() {
        const { props, pieceClick } = this;
        const { store } = props;
        const state = store.getState();
        const { engine } = state.game;

        if (engine) {
            let white = [];
            let whiteWeight = 0;
            let black = [];
            let blackWeight = 0;
    
            if (engine) {
                const captured = engine.CurrentPos.Captured;
                for (var i = 0; i < captured.length; i++) {
                    var p = captured[i];
                    if (p && (p !== Piece.None)) {
                        const c = Piece.color(p as Pieces.Piece);
                        const t = Piece.type(p as Pieces.Piece);
                        const pieces = ["x", "king", "queen", "rook", "bishop", "knight", "pawn"]

                        const squareClass = [
                            "no-square"
                        ];

                        const pieceClass = [
                            Color.toName(c),
                            pieces[t],
                            "cursor"
                        ];

                        const pc = (
                            <div key={i} data-kind="square" className="no-square">
                                <div>
                                    <div data-kind="piece" className={classNames(pieceClass)} onClick={pieceClick} data-ply={i} />
                                </div>
                            </div>
                        );

                        if (c === Color.White) {
                            whiteWeight += Piece.Score[t];
                            white.push(pc);
                        } else {
                            blackWeight += Piece.Score[t];
                            black.push(pc);
                        }
                    }
                } 
            }

            return (
                <div className={classNames("size2 captures", this.props.piece)}>
                    <div className="captures-white d-flex flex-row flex-wrap">{white}</div>
                    <div className="captures-black d-flex flex-row flex-wrap">{black}</div>
                </div>
            );
        }
        
        return null;
    }
}