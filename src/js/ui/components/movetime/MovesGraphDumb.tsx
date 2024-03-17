import toSafeInteger from 'lodash/toSafeInteger';

import React, {Suspense, useCallback} from 'react';
import i18next from 'i18next';
import {useTranslation} from "react-i18next";

import Grid from "@mui/material/Grid";

import { ResponsiveContainer, BarChart, Bar, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Chess as ChessEngine } from '../../../chess/Chess';
import { MovesGraphProps } from './MovesGraphProps';
import { formatTimer } from '../../../fn/date';
import Loader from "../../Loader";

interface IGraphData {
    turn: string|number;
    ply: number;
    white: number;
    black: number;
}

interface IGraphInfo {
    GameId: number | string;
    startPly: number;
    currentPly: number;
}

const MovesGraphDumb: React.FC<MovesGraphProps> = (props) => {
    const {height} = props;

    const { } = useTranslation(['timer']);

    const graphInfo = useSelector<CombinedGameState, IGraphInfo>((state) => {
        const game = state.game;
        const {engine} = game;

        return {
            GameId: engine.GameId ?? 0,
            startPly: engine.StartPlyCount,
            currentPly: engine.CurrentPlyCount
        }
    });

    const graphData = useSelector<CombinedGameState, IGraphData[]>((state) => {
        const game = state.game;
        const {engine} = game;

        const times: number[] = [];
        const { isLive } = props;
        const scale = isLive ? 10 : 1;

        if (isLive) {
            times.push(0);
        }

        let move = engine.CurrentMove.First;
        while (!move.END_MARKER) {
            if (move.sm?.time) {
                times.push(toSafeInteger(move.sm?.time * scale));
            } else {
                times.push(0);
            }

            move = move.Next;
        }

        if (times.length % 2 !== 0) {
            times.push(0);
        }

        const data: IGraphData[] = [{turn: 0, ply: 0, white: 0, black: 0}];

        if (times.length > 0) {
            for (let i = 0; i < times.length; i = i + 2) {
                const w = times[i];
                const b = times[i + 1];
                const ply = graphInfo.startPly + i;
                data.push({
                    turn: ChessEngine.plyToTurn(ply),
                    ply: ply,
                    white: w,
                    black: -b,
                });
            }
        }

        return data;
    });

    const totalWhite = useCallback(() => {
        return graphData.reduce((v, d) => {
            return v + d.white;
        }, 0);
    }, [graphData]);

    const totalBlack = useCallback(() => {
        return graphData.reduce((v, d) => {
            return v + Math.abs(d.black);
        }, 0);
    }, [graphData]);

    const formatTooltipValue = (...params: any[]) => {
        return (
            <span>{formatTimer(Math.abs(params[0]), "0")}</span>
        );
    }

    const formatTooltipLabel = (label: string | number) => {
        const str = (label === 0) ? i18next.t("startPos", { ns: "chess" }) : "#" + label.toString();
        return (<strong>{str}</strong>);
    }

    const formatYTick = (value: number) => {
        return formatTimer(Math.abs(value), "0");
    }

    const handleClick = (data: any) => {
        const apl = data.activePayload;
        if (apl && apl[0]) {
            const pl = apl[0];
            if (pl && pl.payload) {
                dispatch({ type: GameActions.NAVIGATE_TO_PLY, ply: pl.payload.ply } as GameActions.GameAction);
            }
        }
    }

    return (
        <Suspense fallback={<Loader />}>
            <div className="movetimes d-block d-lg-flex">
                <div className="graph-container flex-grow-1">
                    <ResponsiveContainer width="100%" height={height}>
                        <BarChart data={graphData} stackOffset="sign" margin={{top: 5, right: 30, left: 10, bottom: 5}} onClick={handleClick}>
                            <XAxis dataKey="turn" hide={true} />
                            <YAxis tickFormatter={formatYTick}/>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <Tooltip contentStyle={{ fontSize: ".75rem" }} formatter={formatTooltipValue} labelFormatter={formatTooltipLabel} />
                            <ReferenceLine y={0} stroke='#000'/>
                            <Bar dataKey="white" name={i18next.t("white", { ns: "chess"})} className="white" stackId="stack" />
                            <Bar dataKey="black" name={i18next.t("black", { ns: "chess"})} className="black" stackId="stack" />
                            { graphInfo.currentPly ? (<ReferenceLine x={ChessEngine.plyToTurn(graphInfo.currentPly)} stroke="green" />) : null }
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="graph-totals align-self-stretch">
                    <Grid container className="h-100">
                        <Grid item xs={6} lg={12} className="white py-3">
                            <span className="h-100 px-2 d-flex justify-content-center align-items-center">
                                <label>{formatTimer(totalWhite())}</label>
                            </span>
                        </Grid>
                        <Grid item xs={6} lg={12} className="black py-3">
                            <span className="h-100 px-2 d-flex justify-content-center align-items-center">
                                <label>{formatTimer(totalBlack())}</label>
                            </span>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </Suspense>
    );
};

export default MovesGraphDumb;