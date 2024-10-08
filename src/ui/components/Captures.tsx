import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import clsx from "clsx";
import toSafeInteger from 'lodash/toSafeInteger';
import { GameActions } from '../../actions/GameActions';
import { Color } from '../../chess/Color';
import { Piece } from '../../chess/Piece';
import { Pieces } from '../../chess/types/Types';
import {CombinedGameState} from "../../actions/CombinedGameState";
import {GameState} from "../../actions/GameState";

type CapturesProps = {
    piece?: string;
}

const Captures: React.FC<CapturesProps> = ({piece}) => {
    const game = useSelector<CombinedGameState, GameState>((state) => state.game );
    const dispatch = useDispatch();

    const moveToPly = (ply: number) => {
        dispatch({ type: GameActions.NAVIGATE_TO_PLY, ply: ply } as GameActions.GameAction);
    }

    const pieceClick = (e: React.MouseEvent<HTMLDivElement>) => {
        moveToPly(toSafeInteger(e.currentTarget.dataset["ply"]));
    }

    const white = [];
    let whiteWeight = 0;
    const black = [];
    let blackWeight = 0;

    if (game.engine) {
        const captured = game.engine.CurrentPos.Captured;
        for (let i = 0; i < captured.length; i++) {
            const p = captured[i];
            if (p && (p !== Piece.None)) {
                const c = Piece.color(p as Pieces.Piece);
                const t = Piece.type(p as Pieces.Piece);
                const pieces = ["x", "king", "queen", "rook", "bishop", "knight", "pawn"]

                const pieceClass = [
                    Color.toName(c),
                    pieces[t],
                    "cursor"
                ];

                const pc = (
                    <div key={i} data-kind="square" className="no-square">
                        <div>
                            <div data-kind="piece" className={clsx(pieceClass)} onClick={pieceClick} data-ply={i} />
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
        game.engine ? (<div className={clsx("size2 captures", piece)}>
            <div className="captures-white d-flex flex-row flex-wrap">{white}</div>
            <div className="captures-black d-flex flex-row flex-wrap">{black}</div>
        </div>) : null
    );
};

export default Captures;