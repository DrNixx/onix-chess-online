import React, {useCallback, useContext, useEffect, useState} from 'react';
import clsx from "clsx";
import toSafeInteger from 'lodash/toSafeInteger';
import * as Pieces from '../../chess/types/Pieces';
import { toName as colorToName, White } from '../../chess/Color';
import * as Piece from '../../chess/Piece';
import {GameContext} from "../../providers/GameProvider";
import sprintf from "../../fn/string/Sprintf";

type CapturesProps = {
    piece?: string;
}

const Captures: React.FC<CapturesProps> = ({piece}) => {
    const [whitePieces, setWhitePieces] = useState<React.JSX.Element[]>([]);
    const [blackPieces, setBlackPieces] = useState<React.JSX.Element[]>([]);
    const [colorDiff, setColorDiff] = useState(0);

    const {
        captured,
        navigateToPly
    } = useContext(GameContext);

    const pieceClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        navigateToPly(toSafeInteger(e.currentTarget.dataset["ply"]));
    }, [navigateToPly]);

    useEffect(() => {
        let whiteWeight = 0;
        let blackWeight = 0;
        const white = [];
        const black = [];

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

        white.push(<div key="w-empty" data-kind="square" className="no-square" style={{width: '1px'}}></div>);
        black.push(<div key="b-empty" data-kind="square" className="no-square" style={{width: '1px'}}></div>);

        setWhitePieces(white);
        setBlackPieces(black);
        setColorDiff(whiteWeight - blackWeight);
    }, [captured, pieceClick]);

    const whiteDiff = useCallback(() => {
        let diff: string | undefined = undefined;
        if (colorDiff > 0) {
            diff = sprintf('%+d', colorDiff);
        }

        return (
            <div key="w-diff" data-kind="square" className="no-square d-flex align-items-center bold">{diff}</div>
        );
    }, [colorDiff]);

    const blackDiff = useCallback(() => {
        let diff: string | undefined = undefined;
        if (colorDiff < 0) {
            diff = sprintf('%+d', (0 - colorDiff));
        }

        return (
            <div key="w-diff" data-kind="square" className="no-square d-flex align-items-center bold">{diff}</div>
        );
    }, [colorDiff]);

    return (
        <div className={clsx("size2 captures", piece)}>
            <div className="d-flex flex-row flex-nowrap">
                <div>
                    <div className="captures-white d-flex flex-row flex-wrap">{whitePieces}{whiteDiff()}</div>
                    <div className="captures-black d-flex flex-row flex-wrap">{blackPieces}{blackDiff()}</div>
                </div>
            </div>
        </div>
    );
};

export default Captures;