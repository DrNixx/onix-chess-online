import React from 'react';
import i18next from 'i18next';

import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Grid from '@mui/material/Grid';

import { Unsubscribe } from 'redux';
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Area, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { AnalyseGraphProps } from './AnalyseGraphProps';
import { Chess as ChessEngine } from '../../chess/Chess';
import { Logger } from '../../common/Logger';
import { Colors } from '../../chess/types/Types';
import { AnalyseStatus, IGameData, IUserAnalysis } from '../../chess/types/Interfaces';
import { GameRelatedStore } from '../../actions/GameStore';
import { GameActions } from '../../actions/GameActions';
import { Color } from '../../chess/Color';
import sprintf from '../../fn/string/Sprintf';
import { toInteger } from 'lodash';

export interface IAnalysisState {
    status: AnalyseStatus,
    completed?: number,
}

export default class AnalyseGraphDumb extends React.Component<AnalyseGraphProps, IAnalysisState> {
    private id?: string | number;

    private store: GameRelatedStore;

    private timer: any = null;

    private storeUnsubscribe: Unsubscribe | null = null;

    private abortController = new AbortController();

    private _isMounted = false;

    constructor(props: AnalyseGraphProps) {
        super(props);

        const { store } = this.props;

        this.store = store;
        const { game } = store.getState();
        this.id = game?.engine.GameId;

        this.state = {
            status: game?.engine.Analysis.state ?? "empty",
            completed: 0
        };
    }

    componentDidMount() {
        this._isMounted = true;

        const { store } = this;
        this.storeUnsubscribe = store.subscribe(() => {
            this.updateAnalysis();
        });

        const { game } = store.getState();

        if (game && game.engine.Analysis.state === "empty") {
            const that = this;
            that.loadAnalysis();
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        
        const { storeUnsubscribe, abortController } = this;

        abortController.abort();

        if (storeUnsubscribe) {
            storeUnsubscribe();
        }
    }

    private updateAnalysis = () => {
        if (this._isMounted) {
            const { store, state } = this;
            const { game } = store.getState();
            const { status } = state;

            this.setState({
                status: game?.engine.Analysis.state ?? status
            });
        }
    };

    private requestAnalysis = () => {
        const that = this;
        const { store, state, id } = that;

        if (!id) return;

        if (this.abortController.signal.aborted) {
            this.abortController =  new AbortController();
        }
        
        fetch('https://www.chess-online.com/fishnet/create/' + id.toString(), { mode: "cors", signal: this.abortController.signal })
            .then(function(response) {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                // Read the response as json.
                return response.json();
            })
            .then(function() {
                that.setState({
                    status: "inprogress"
                });
            })
            .catch(function(error) {
                Logger.error('Looks like there was a problem when request analysis: \n', error);
            });
    }

    private loadAnalysis = () => {
        const that = this;
        const { store, state, id } = that;

        if (!id) return;

        if (this.abortController.signal.aborted) {
            this.abortController =  new AbortController();
        }

        fetch('https://www.chess-online.com/api/analyse/game/' + id.toString() + "?v=2", { mode: "cors", signal: this.abortController.signal })
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
                        store.dispatch({type: GameActions.GAME_LOAD_PARTIAL, game: responseAsJson} as GameActions.GameAction);
                    } else {
                        const { status } = state;
                        that.setState({
                            status: (data.analysis?.state ?? status),
                            completed: data.analysis?.completed
                        });
                    }   
                }
            })
            .catch(function(error) {
                Logger.error('Looks like there was a problem when load analysis: \n', error);
            });
    }

    private anTooltipValFmt = (...params: any[]) => {
        let obj = params[2];
        return (
            <span>
                <strong>{obj.payload.desc}</strong><br/>
                <span>{obj.payload.name}</span>
            </span>
        );
    }

    private anTooltipLblFmt = (...params: any[]) => {
        return "";
    }

    private moveToPly = (ply?: number) => {
        if (ply !== undefined) {
            this.store.dispatch({ type: GameActions.NAVIGATE_TO_PLY, ply: ply } as GameActions.GameAction);
        }
    };

    private handleClick = (data: any) => {
        const apl = data.activePayload;
        if (apl && apl[0]) {
            const pl = apl[0];
            if (pl && pl.payload) {
                this.moveToPly(pl.payload.ply);
            }
        }
    }

    renderProgress(progress?: number) {
        const fmt = i18next.t("completed", { ns: "analyse" });
        const progressStr = sprintf(fmt, progress ?? 0);
        const progressInt = toInteger(progress);
        return (
            <div className="analysis-inprogress">
                { i18next.t("inprogress", { ns: "analyse" })}
                { progress ? (
                    <div className="progress">
                        <div className="progress-bar progress-bar-primary" style={{width: `${progressInt}%`}} />
                    </div>)
                    : null }
            </div>
        );
    }

    private renderRequestBtn = () => {
        const { requestAnalysis } = this;
        return (
            <span className="analysis-request">
                <Button color="info" tabIndex={-1} href="#" onClick={requestAnalysis}>{ i18next.t("request", { ns: "analyse" })}</Button>
            </span>
        );
    };

    private getCurrentPly = (): number => {
        const { game } = this.store.getState();
        return game?.engine.CurrentPlyCount ?? 0;
    }

    private renderTotalItem = (color: Colors.BW, item: IUserAnalysis, engine?: ChessEngine) => {
        const makeLink = (type: "blunder" | "mistake" | "inaccuracy") => {
            return () => {
                this.moveToPly(engine?.findNextMistake(color, this.getCurrentPly(), type));
            };
        }

        return (
            <ul className="list-unstyled h-100 d-flex flex-column justify-content-center text-right">
                <li>
                    <Button variant="text" onClick={makeLink("inaccuracy")}>{ i18next.t("inaccuracies", { ns: "analyse" })}:<label>{item.inaccuracy}</label></Button>
                </li>
                <li>
                    <Button variant="text" onClick={makeLink("mistake")}>{ i18next.t("mistakes", { ns: "analyse" })}:<label>{item.mistake}</label></Button>
                </li>
                <li>
                    <Button variant="text" onClick={makeLink("blunder")}>{ i18next.t("blunders", { ns: "analyse" })}:<label>{item.blunder}</label></Button>
                </li>
                <li>
                    { i18next.t("averageCentipawnLoss", { ns: "analyse" })}:<label title={i18next.t("averageCentipawnLossTitle", { ns: "analyse" })}>{item.acpl}</label>
                </li>
            </ul>
        );
    }

    render() {
        const that = this;
        const { renderRequestBtn, renderProgress, handleClick, anTooltipValFmt, anTooltipLblFmt, renderTotalItem, props, state, store } = that;
        const { height } = props;
        const { game }  = store.getState();
        const { engine } = game;

        const { StartPlyCount: startPly, CurrentPlyCount: currentPly, GameId: id, Analysis: analysis  } = engine;
        const { white, black } = analysis
        const { status, completed } = state;
        //const { state: status, completed, white, black } = evals;

        if (id && (status != "empty")) {
            if (status == "unanalysed") {
                return renderRequestBtn();
            } else if (status == "inprogress") {
                if (!that.timer) {
                    that.timer = setTimeout(() => {
                        that.timer = null;
                        that.loadAnalysis();
                    }, 5500);
                }
                
                return renderProgress(completed);
            } else if (status == "ready") {
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
                return (
                    <div className="analyse d-block d-lg-flex">
                        <div className="graph-container flex-grow-1">
                            <ResponsiveContainer width="100%" height={height}>
                                <AreaChart data={evals} margin={{ top: 20, right: 20, left: 0, bottom: 0 }} onClick={handleClick}>
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
            <span className="analysis-loading">{ i18next.t("loading", { ns: "analyse" })}</span>
        );
    }
}
