import React from 'react';
import clsx from "clsx";
import * as cg from 'chessground/types';
import { formatTimer } from '../../fn/date/formatTimer';
import { Chess as ChessEngine } from "../../chess/Chess";
import { isAdvanceClock, isBlitzClock, isCorrespondenceClock } from '../../chess/types/Interfaces';
import * as GameResult from '../../chess/GameResult';

export const renderTimer = (engine: ChessEngine, orientation: cg.Color, position: "top" | "bottom") => {
    const rawData = engine.RawData;

    const timer = rawData.correspondence ? rawData.correspondence : rawData.clock;
    if (timer) {
        let time: number|undefined;
        let color: cg.Color|undefined;

        if (isBlitzClock(timer) || isCorrespondenceClock(timer)) {
            if (orientation == "white") {
                time = (position == "bottom") ? timer.white : timer.black; 
                color = (position == "bottom") ? "white" : "black"; 
            } else {
                time = (position == "bottom") ? timer.black : timer.white; 
                color = (position == "bottom") ? "black" : "white"; 
            }
        } else if (isAdvanceClock(timer)) {
            let playerTime: number;
            if (orientation == "white") {
                playerTime = (position == "bottom") ? timer.white : timer.black; 
                color = (position == "bottom") ? "white" : "black"; 
            } else {
                playerTime = (position == "bottom") ? timer.black : timer.white; 
                color = (position == "bottom") ? "black" : "white"; 
            }

            if (timer.lastMoveAt && timer.serverNow) {
                time = playerTime - (timer.serverNow - timer.lastMoveAt);
            }
        }

        if (time) {
            const isActive = (rawData.game?.player == color);
            const timerClass = [
                "timer",
                { "active": isActive }
            ];

            const timerIcon = (active: boolean) => {
                if (active) {
                    return (<i className="xi-time pe-2" />);
                }

                return null;
            }

            return (<div className={clsx(timerClass)} >{timerIcon(isActive)}<span>{formatTimer(time)}</span></div>);
        }
    }

    return null;
};

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
