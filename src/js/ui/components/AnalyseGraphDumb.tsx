import React, {PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import i18next from 'i18next';

import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Grid from '@mui/material/Grid';

import { ResponsiveContainer, AreaChart, XAxis, YAxis, Area, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { Chess as ChessEngine } from '../../chess/Chess';
import { Logger } from '../../common/Logger';
import { Colors } from '../../chess/types/Types';
import {AnalyseStatus, IGameAnalysis, IGameData, IUserAnalysis} from '../../chess/types/Interfaces';
import { GameActions } from '../../actions/GameActions';
import { Color } from '../../chess/Color';
import sprintf from '../../fn/string/Sprintf';
import { toInteger } from 'lodash';
import {CombinedGameState} from "../../actions/CombinedGameState";
import {GameState} from "../../actions/GameState";

type Props = {
    height?: number;
};

type GameData = {

};

const AnalyseGraphDumb: React.FC<PropsWithChildren<Props>> = (props) => {
    const analysis = useSelector<CombinedGameState, IGameAnalysis>(
        (state) => state.game.engine.Analysis
    );

    const game = useSelector<CombinedGameState, GameState>((state) => state.game );
    const {engine} = game;
    const dispatch = useDispatch();

    const id = useMemo(() => game.engine.GameId, [game.engine.GameId]);
    const [mounted, setMounted] = useState(false);
    const [status, setStatus] = useState(analysis.state);
    const [completed, setCompleted] = useState(0);

    const [abortController, setAbortController] = useState(new AbortController());

    let timeout = 0;

    useEffect(() => {
        setMounted(true);

        return () => {
            abortController.abort();
        };
    }, []);

    const updateAnalysis = () => {
        if (mounted) {
            if (analysis.state) {
                setStatus(analysis.state);
            }
        }
    };

    const requestAnalysis = () => {
        if (!id) return;

        if (abortController.signal.aborted) {
            setAbortController(new AbortController());
        }

        fetch('https://www.chess-online.com/fishnet/create/' + id.toString(), { mode: "cors", signal: abortController.signal })
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
        if (!id) return;

        if (abortController.signal.aborted) {
            setAbortController(new AbortController());
        }

        fetch('https://www.chess-online.com/api/analyse/game/' + id.toString() + "?v=2", { mode: "cors", signal: abortController.signal })
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
        let obj = params[2];
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
                    <>{ i18next.t("request", { ns: "analyse" })}</>
                </Button>
            </span>
        );
    };

    const getCurrentPly = (): number => {
        return engine.CurrentPlyCount ?? 0;
    }

    const renderTotalItem = (color: Colors.BW, item: IUserAnalysis, engine?: ChessEngine) => {
        const makeLink = (type: "blunder" | "mistake" | "inaccuracy") => {
            return () => {
                moveToPly(engine?.findNextMistake(color, getCurrentPly(), type));
            };
        }

        return (
            <ul className="list-unstyled h-100 d-flex flex-column justify-content-center text-right">
                <li>
                    <Button variant="text" onClick={makeLink("inaccuracy")}>
                        <>{ i18next.t("inaccuracies", { ns: "analyse" })}:<label>{item.inaccuracy}</label></>
                    </Button>
                </li>
                <li>
                    <Button variant="text" onClick={makeLink("mistake")}>
                        <>{ i18next.t("mistakes", { ns: "analyse" })}:<label>{item.mistake}</label></>
                    </Button>
                </li>
                <li>
                    <Button variant="text" onClick={makeLink("blunder")}>
                        <>
                        { i18next.t("blunders", { ns: "analyse" })}:<label>{item.blunder}</label>
                        </>
                    </Button>
                </li>
                <li>
                    <>
                    { i18next.t("averageCentipawnLoss", { ns: "analyse" })}:<label title={i18next.t("averageCentipawnLossTitle", { ns: "analyse" })}>{item.acpl}</label>
                    </>
                </li>
            </ul>
        );
    }

    const getEvals = useCallback(() => {
        const evals = [];
        let move = engine.CurrentMove.Begin;
        while (!move.END_MARKER) {
            const turn = move.PlyCount ? ChessEngine.plyToTurn(move.PlyCount) : null;
            const name = turn ? "" + turn + (move.sm.color === Color.White ? ". " : "... ") + move.sm.san : i18next.t("startPos", { ns: "chess" });

            evals.push({
                ...move.sm.eval!,
                color: move.sm.color!,
                ply: move.PlyCount,
                name: name
            });

            move = move.Next;
        }

        return evals;
    }, [status, engine.RawData])

    if (id && (status != "empty")) {
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
            const { StartPlyCount: startPly, CurrentPlyCount: currentPly  } = engine;
            const { white, black } = analysis;

            return (
                <div className="analyse d-block d-lg-flex">
                    <div className="graph-container flex-grow-1">
                        <ResponsiveContainer width="100%" height={props.height}>
                            <AreaChart data={getEvals()} margin={{ top: 20, right: 20, left: 0, bottom: 0 }} onClick={handleClick}>
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
                        <Box className="h-100">
                            <Grid container spacing={2} className="h-100">
                                <Grid item xs={6} lg={12} className="white">
                                    { renderTotalItem(Color.White, white!, engine) }
                                </Grid>
                                <Grid item xs={6} lg={12} className="black">
                                    { renderTotalItem(Color.Black, black!, engine) }
                                </Grid>
                            </Grid>
                        </Box>
                    </div>
                </div>
            );
        }
    }

    return (
        <span className="analysis-loading"><>{ i18next.t("loading", { ns: "analyse" })}</></span>
    );
};

export default AnalyseGraphDumb;