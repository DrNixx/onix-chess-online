import { toInteger } from 'lodash';
import React, {PropsWithChildren, Suspense, useCallback, useContext, useEffect, useRef, useState} from 'react';
import i18next from "i18next";

import Button from "@mui/material/Button";
import Grid from '@mui/material/Grid';

import { ResponsiveContainer, AreaChart, XAxis, YAxis, Area, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { Chess as ChessEngine } from '../../../chess/Chess';
import { IGameData } from '../../../chess/types/Interfaces';
import {IEvalItem} from "../../../chess/EvalItem";
import TotalItem from "./TotalItem";
import { BW } from '../../../chess/types/Colors';
import { White, Black } from '../../../chess/Color';
import Loader from "../../Loader";
import {GameContext} from "../../../providers/GameProvider";

type Props = {
    height?: number;
};

interface IGraphEvals extends IEvalItem {
    color: BW;
    ply: number;
    name: string;
}

const AnalyseGraphDumb: React.FC<PropsWithChildren<Props>> = (props) => {
    // const { t } = useTranslation(['analyse']);

    const {
        gameId,
        // startPly,
        currentPly,
        analysis,
        navigateToPly,
        loadPartial,
        getCurrentMove
    } = useContext(GameContext);

    const evals = useCallback(() => {
        const evals: IGraphEvals[] = [];
        let move = getCurrentMove().Begin;
        while (!move.END_MARKER) {
            const turn = move.PlyCount ? ChessEngine.plyToTurn(move.PlyCount) : null;
            const name = turn ? "" + turn + (move.sm.color === White ? ". " : "... ") + move.sm.san : i18next.t("startPos", { ns: "chess" });

            if (move.sm.eval) {
                evals.push({
                    ...move.sm.eval,
                    color: move.sm.color ?? White,
                    ply: move.PlyCount,
                    name: name
                });
            }

            move = move.Next;
        }

        return evals;
    }, [getCurrentMove]);

    const [status, setStatus] = useState(analysis.state);
    const [completed, setCompleted] = useState(0);

    const [abortController, setAbortController] = useState(new AbortController());

    const timeout = useRef(0);

    useEffect(() => {

        return () => {
            abortController.abort();
        };
    }, [abortController]);

    const requestAnalysis = useCallback(() => {
        if (!gameId) return;

        if (abortController.signal.aborted) {
            setAbortController(new AbortController());
        }

        fetch('https://www.chess-online.com/fishnet/create/' + gameId.toString(), { mode: "cors", signal: abortController.signal })
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
                console.error('Looks like there was a problem when request analysis: \n', error);
            });
    }, [abortController.signal, gameId]);

    const loadAnalysis = useCallback(() => {
        if (!gameId) return;

        if (abortController.signal.aborted) {
            setAbortController(new AbortController());
        }

        fetch('https://www.chess-online.com/api/analyse/game/' + gameId.toString() + "?v=2", { mode: "cors", signal: abortController.signal })
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
                        loadPartial(responseAsJson);
                    } else {
                        if (data.analysis?.state) {
                            setStatus(data.analysis?.state);
                        }

                        setCompleted(data.analysis?.completed ?? 0);
                    }
                }
            })
            .catch(function(error) {
                console.error('Looks like there was a problem when load analysis: \n', error);
            });
    }, [abortController.signal, gameId, loadPartial]);

    const anTooltipValFmt = useCallback((...params: any[]) => {
        const obj = params[2];
        return (
            <span>
                <strong>{obj.payload.desc}</strong><br/>
                <span>{obj.payload.name}</span>
            </span>
        );
    }, []);

    const anTooltipLblFmt = useCallback(() => {
        return "";
    }, []);

    const moveToPly = useCallback((ply?: number) => {
        if (ply !== undefined) {
            navigateToPly(ply);
        }
    }, [navigateToPly]);

    const handleClick = useCallback((data: any) => {
        const apl = data.activePayload;
        if (apl && apl[0]) {
            const pl = apl[0];
            if (pl && pl.payload) {
                moveToPly(pl.payload.ply);
            }
        }
    }, [moveToPly]);

    const renderProgress = useCallback((progress?: number) => {
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
    }, []);

    const renderRequestBtn = useCallback(() => {
        return (
            <span className="analysis-request">
                <Button color="info" tabIndex={-1} href="#" onClick={requestAnalysis}>
                    { i18next.t("request", { ns: "analyse" }).toString()}
                </Button>
            </span>
        );
    }, [requestAnalysis]);

    const renderGraph = useCallback(() => {
        return (
            <Suspense fallback={<Loader />} >
                <div className="analyse d-block d-lg-flex">
                    <div className="graph-container flex-grow-1">
                        <ResponsiveContainer width="100%" height={props.height}>
                            <AreaChart data={evals()} margin={{ top: 20, right: 20, left: 0, bottom: 0 }} onClick={handleClick}>
                                <XAxis dataKey="ply" hide={true} />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip contentStyle={{ "fontSize": ".75rem" }} formatter={anTooltipValFmt} labelFormatter={anTooltipLblFmt} />
                                <Area type="monotone" dataKey="advantage" name={ i18next.t("advantage", { ns: "analyse" })} stroke="#8884d8" fill="#8884d8" />
                                { currentPly ? (<ReferenceLine x={currentPly} stroke="green" />) : null }
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="graph-totals align-self-stretch">
                        <Grid container className="h-100">
                            <Grid item xs={6} lg={12} className="white">
                                <TotalItem color={White} item={analysis.white} />
                            </Grid>
                            <Grid item xs={6} lg={12} className="black">
                                <TotalItem color={Black} item={analysis.black} />
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </Suspense>
        );
    }, [anTooltipLblFmt, anTooltipValFmt, analysis.black, analysis.white, evals, currentPly, handleClick, props.height]);

    const renderElement = useCallback(() => {
        if (gameId && (status != "empty")) {
            if (status == "unanalysed") {
                return renderRequestBtn();
            } else if (status == "inprogress") {
                if (!timeout.current) {
                    timeout.current = window.setTimeout(() => {
                        timeout.current = 0;
                        loadAnalysis();
                    }, 5500);
                }

                return renderProgress(completed);
            } else if (status == "ready") {
                return renderGraph();
            }
        }

        return (
            <span className="analysis-loading"><>{ i18next.t("loading", { ns: "analyse" })}</></span>
        );
    }, [completed, gameId, loadAnalysis, renderGraph, renderProgress, renderRequestBtn, status]);


    return renderElement();
};

export default AnalyseGraphDumb;