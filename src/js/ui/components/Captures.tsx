import React, {useContext} from 'react';
import clsx from "clsx";
import toSafeInteger from 'lodash/toSafeInteger';
import * as Pieces from '../../chess/types/Pieces';
import { toName as colorToName, White } from '../../chess/Color';
import * as Piece from '../../chess/Piece';
import {GameContext} from "../../providers/GameProvider";

type CapturesProps = {
    piece?: string;
}

const Captures: React.FC<CapturesProps> = ({piece}) => {
    const { captured, navigateToPly } = useContext(GameContext);

    const moveToPly = (ply: number) => {
        navigateToPly(ply);
    }

    const pieceClick = (e: React.MouseEvent<HTMLDivElement>) => {
        moveToPly(toSafeInteger(e.currentTarget.dataset["ply"]));
    }

    const white = [];
    let whiteWeight = 0;
    const black = [];
    let blackWeight = 0;

    for (let i = 0; i < captured.length; i++) {
        const p = captured[i];
        if (p && (p !== Piece.None)) {
            const c = Piece.color(p as Pieces.Piece);
            const t = Piece.type(p as Pieces.Piece);
            const pieces = ["x", "king", "queen", "rook", "bishop", "knight", "pawn"]

            const pieceClass = [
                colorToName(c),
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

            if (c === White) {
                whiteWeight += Piece.Score[t];
                white.push(pc);
            } else {
                blackWeight += Piece.Score[t];
                black.push(pc);
            }
        }
    }

    return (
        <div className={clsx("size2 captures", piece)}>
            <div className="captures-white d-flex flex-row flex-wrap">({whiteWeight}) {white}</div>
            <div className="captures-black d-flex flex-row flex-wrap">({blackWeight}) {black}</div>
        </div>
    );
};

export default Captures;