import React, {useContext} from "react";
import * as cg from "chessground/types";
import {GameContext} from "../../providers/GameProvider";
import {isAdvanceClock, isBlitzClock, isCorrespondenceClock} from "../../chess/types/Interfaces";
import clsx from "clsx";
import {formatTimer} from "../../fn/date";
import {BoardContext} from "../../providers/BoardProvider";
import {useTranslation} from "react-i18next";

type Props = {
    position: "top" | "bottom";
};

const GameTimer: React.FC<Props> = ({position}) => {
    useTranslation(['timer']);
    const {orientation} = useContext(BoardContext);
    const {timer, turnColor} = useContext(GameContext);

    const renderTimer = () => {
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
                const isActive = (turnColor == color);
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

    return renderTimer();
};

export default GameTimer;
