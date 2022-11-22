import { toInteger } from 'lodash';
import React, {PropsWithChildren, Suspense, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import i18next from 'i18next';
import {useTranslation} from "react-i18next";

import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from '@mui/material/Grid';

import { ResponsiveContainer, AreaChart, XAxis, YAxis, Area, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { Chess as ChessEngine } from '../../../chess/Chess';
import { Logger } from '../../../common/Logger';
import { Colors } from '../../../chess/types/Types';
import {IGameAnalysis, IGameData} from '../../../chess/types/Interfaces';
import { GameActions } from '../../../actions/GameActions';
import { Color } from '../../../chess/Color';
import sprintf from '../../../fn/string/Sprintf';

import {CombinedGameState} from "../../../actions/CombinedGameState";
import {IEvalItem} from "../../../chess/EvalItem";
import TotalItem from "./TotalItem";

type Props = {
    height?: number;
};

interface IGraphEvals extends IEvalItem {
    color: Colors.BW;
    ply: number;
    name: string;
}

interface IGraphInfo {
    GameId: number | string;
    startPly: number;
    currentPly: number;
}

const AnalyseGraphDumb: React.FC<PropsWithChildren<Props>> = (props) => {
    const { t, ready } = useTranslation(['analyse']);

    const analysis = useSelector<CombinedGameState, IGameAnalysis>(
        (state) => state.game.engine.Analysis
    );

    const graphInfo = useSelector<CombinedGameState, IGraphInfo>((state) => {
        const game = state.game;
        const {engine} = game;

        return {
            GameId: engine.GameId ?? 0,
            startPly: engine.StartPlyCount,
            currentPly: engine.CurrentPlyCount
        }
    });

    const evals = useSelector<CombinedGameState, IGraphEvals[]>((state) => {
        const game = state.game;
        const {engine} = game;
        const evals: IGraphEvals[] = [];
        let move = engine.CurrentMove.Begin;
        while (!move.END_MARKER) {
            const turn = move.PlyCount ? ChessEngine.plyToTurn(move.PlyCount) : null;
            const name = turn ? "" + turn + (move.sm.color === Color.White ? ". " : "... ") + move.sm.san : i18next.t("startPos", { ns: "chess" });

            if (move.sm.eval) {
                evals.push({
                    ...move.sm.eval,
                    color: move.sm.color ?? Color.White,
                    ply: move.PlyCount,
                    name: name
                });
            }

            move = move.Next;
        }

        return evals;
    });

    const dispatch = useDispatch();

    const [status, setStatus] = useState(analysis.state);
    const [completed, setCompleted] = useState(0);

    const [abortController, setAbortController] = useState(new AbortController());

    let timeout = 0;

    useEffect(() => {

        return () => {
            abortController.abort();
        };
    }, []);

    const requestAnalysis = () => {
        if (!graphInfo.GameId) return;

        if (abortController.signal.aborted) {
            setAbortController(new AbortController());
        }

        fetch('https://www.chess-online.com/fishnet/create/' + graphInfo.GameId.toString(), { mode: "cors", signal: abortController.signal })
            .then(function(response) {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                // Read the response as json.
                return response.json();
            })
            .then(function() {
                setStatus("inprogress");
            })
            .catch(function(error) {
                Logger.error('Looks like there was a problem when request analysis: \n', error);
            });
    }

    const loadAnalysis = () => {
        if (!graphInfo.GameId) return;

        if (abortController.signal.aborted) {
            setAbortController(new AbortController());
        }

        fetch('https://www.chess-online.com/api/analyse/game/' + graphInfo.GameId.toString() + "?v=2", { mode: "cors", signal: abortController.signal })
            .then(function(response) {
                if (!response.ok) {
                    throw Error(response.statusText);
                }

                return response.json();
            })
            .then(function(responseAsJson) {
                if (responseAsJson) {
                    const data = responseAsJson as IGameData;
                    if (data.analysis?.state == "ready") {
                        dispatch({type: GameActions.GAME_LOAD_PARTIAL, game: responseAsJson} as GameActions.GameAction);
                    } else {
                        if (data.analysis?.state) {
                            setStatus(data.analysis?.state);
                        }

                        setCompleted(data.analysis?.completed ?? 0);
                    }
                }
            })
            .catch(function(error) {
                Logger.error('Looks like there was a problem when load analysis: \n', error);
            });
    }

    const anTooltipValFmt = (...params: any[]) => {
        const obj = params[2];
        return (
            <span>
                <strong>{obj.payload.desc}</strong><br/>
                <span>{obj.payload.name}</span>
            </span>
        );
    }

    const anTooltipLblFmt = (...params: any[]) => {
        return "";
    }

    const moveToPly = (ply?: number) => {
        if (ply !== undefined) {
            dispatch({ type: GameActions.NAVIGATE_TO_PLY, ply: ply } as GameActions.GameAction);
        }
    };

    const handleClick = (data: any) => {
        const apl = data.activePayload;
        if (apl && apl[0]) {
            const pl = apl[0];
            if (pl && pl.payload) {
                moveToPly(pl.payload.ply);
            }
        }
    }

    const renderProgress = (progress?: number) => {
        const fmt = i18next.t("completed", { ns: "analyse" });
        const progressStr = sprintf(fmt, progress ?? 0);
        const progressInt = toInteger(progress);
        return (
            <div className="analysis-inprogress">
                <>
                { i18next.t("inprogress", { ns: "analyse" })}
                { progress ? (
                        <div className="progress">
                            <div className="progress-bar progress-bar-primary" style={{width: `${progressInt}%`}} />
                        </div>)
                    : null }
                </>
            </div>
        );
    }

    const renderRequestBtn = () => {
        return (
            <span className="analysis-request">
                <Button color="info" tabIndex={-1} href="#" onClick={requestAnalysis}>
                    { i18next.t("request", { ns: "analyse" }).toString()}
                </Button>
            </span>
        );
    };

    if (graphInfo.GameId && (status != "empty")) {
        if (status == "unanalysed") {
            return renderRequestBtn();
        } else if (status == "inprogress") {
            if (!timeout) {
                timeout = window.setTimeout(() => {
                    timeout = 0;
                    loadAnalysis();
                }, 5500);
            }

            return renderProgress(completed);
        } else if (status == "ready") {
            return (
                <Suspense fallback={<CircularProgress />} >
                    <div className="analyse d-block d-lg-flex">
                        <div className="graph-container flex-grow-1">
                            <ResponsiveContainer width="100%" height={props.height}>
                                <AreaChart data={evals} margin={{ top: 20, right: 20, left: 0, bottom: 0 }} onClick={handleClick}>
                                    <XAxis dataKey="ply" hide={true} />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip contentStyle={{ "fontSize": ".75rem" }} formatter={anTooltipValFmt} labelFormatter={anTooltipLblFmt} />
                                    <Area type="monotone" dataKey="advantage" name={ i18next.t("advantage", { ns: "analyse" })} stroke="#8884d8" fill="#8884d8" />
                                    { graphInfo.currentPly ? (<ReferenceLine x={graphInfo.currentPly} stroke="green" />) : null }
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="graph-totals align-self-stretch">
                            <Grid container className="h-100">
                                <Grid item xs={6} lg={12} className="white">
                                    <TotalItem color={Color.White} item={analysis.white} />
                                </Grid>
                                <Grid item xs={6} lg={12} className="black">
                                    <TotalItem color={Color.Black} item={analysis.black} />
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </Suspense>
            );
        }
    }

    return (
        <span className="analysis-loading"><>{ i18next.t("loading", { ns: "analyse" })}</></span>
    );
};

export default AnalyseGraphDumb;