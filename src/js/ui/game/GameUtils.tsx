import React from 'react';
import * as cg from 'chessground/types';
import * as GameResult from '../../chess/GameResult';

export const renderResult = (result: GameResult.Color, orientation: cg.Color, position: "top" | "bottom") => {
    if (result) {
        const whiteResult = result;
        const blackResult = GameResult.OppositeColor[whiteResult];

        const className = `game-result _${position}`;
        let score: number;
        if (orientation == "white") {
            score = (position == "bottom") ? GameResult.score[whiteResult] : GameResult.score[blackResult];
        } else {
            score = (position == "bottom") ? GameResult.score[blackResult] : GameResult.score[whiteResult]; 
        }

        return (
            <div className={className}>{score}</div>
        );
    }
    
    return null;
};
