import toSafeInteger from 'lodash/toSafeInteger';
import * as React from 'react';
import { Unsubscribe } from 'redux';
import { Container, Row, Col } from 'react-bootstrap';
import { ResponsiveContainer, BarChart, Bar, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Chess as ChessEngine } from '../../chess/Chess';
import { MovesGraphProps } from './MovesGraphProps';
import { i18n, _ } from '../../i18n/i18n';
import { formatTimer } from '../../fn/date/formatTimer';
import { GameActions } from '../../actions/GameActions';
import { GameRelatedStore } from '../../actions/GameStore';

interface IGraphData {
    turn: string|number;
    ply: number;
    white: number;
    black: number;
}

export default class MovesGraphDumb extends React.Component<MovesGraphProps, {}> {
    
    private store: GameRelatedStore;

    private storeUnsubscribe?: Unsubscribe = undefined;

    private _isMounted = false;

    constructor(props: MovesGraphProps) {
        super(props);

        i18n.register();

        this.store = props.store;
    }

    componentDidMount() {
        const { store, updateMovetimes } = this;

        this._isMounted = true;
        this.storeUnsubscribe = store.subscribe(() => {
            updateMovetimes();
        });
    }

    componentWillUnmount() {
        const { storeUnsubscribe } = this;
        
        this._isMounted = false;
        if (storeUnsubscribe) {
            storeUnsubscribe();
        }
    }

    private updateMovetimes = () => {
        if (this._isMounted) {
            this.forceUpdate();
        }
    };

    private formatTooltipValue = (...params: any[]) => {
        return (
            <span>{formatTimer(Math.abs(params[0]), true, "0")}</span>
        );
    }

    private formatTooltipLabel = (label: string | number) => {
        const str = (label === 0) ? _("chess", "startPos") : "#" + label.toString();
        return (<strong>{str}</strong>);
    }

    private formatYTick = (value: number) => {
        return formatTimer(Math.abs(value), true, "0");
    }

    private handleClick = (data: any) => {
        const apl = data.activePayload;
        if (apl && apl[0]) {
            const pl = apl[0];
            if (pl && pl.payload) {
                this.store.dispatch({ type: GameActions.NAVIGATE_TO_PLY, ply: pl.payload.ply } as GameActions.GameAction);
            }
        }
    }

    private getTimes = (engine: ChessEngine) => {
        const times: number[] = [];
        const { isLive } = this.props;            
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

        return times;
    }; 

    render() {
        const { height } = this.props;
        const { game }  = this.store.getState();
        const { engine } = game;

        const { StartPlyCount: startPly, CurrentPlyCount: currentPly } = engine;
        const times = this.getTimes(engine);

        let totalWhite = 0;
        let totalBlack = 0;
        
        const data: IGraphData[] = [{ turn: 0, ply: 0, white: 0, black: 0 }];
        
        if (times.length > 0) {
            for (let i = 0; i < times.length; i = i + 2) {
                const w = times[i];
                const b = times[i + 1];
                let ply = startPly + i;
                data.push({
                    turn: ChessEngine.plyToTurn(ply),
                    ply: ply,
                    white: w,
                    black: -b,
                });
    
                totalWhite += w;
                totalBlack += b;
            }
        }
        
        return (
            <div className="movetimes d-block d-lg-flex">
                <div className="graph-container flex-grow-1">
                    <ResponsiveContainer width="100%" height={height}>
                        <BarChart data={data} stackOffset="sign" margin={{top: 5, right: 30, left: 10, bottom: 5}} onClick={this.handleClick}>
                            <XAxis dataKey="turn" hide={true} />
                            <YAxis tickFormatter={this.formatYTick}/>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <Tooltip contentStyle={{ fontSize: ".75rem" }} formatter={this.formatTooltipValue} labelFormatter={this.formatTooltipLabel} />
                            <ReferenceLine y={0} stroke='#000'/>
                            <Bar dataKey="white" name={_("chess", "white")} className="white" stackId="stack" />
                            <Bar dataKey="black" name={_("chess", "black")} className="black" stackId="stack" />
                            { currentPly ? (<ReferenceLine x={ChessEngine.plyToTurn(currentPly)} stroke="green" />) : null }
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="graph-totals align-self-stretch">
                    <Container className="h-100">
                        <Row className="h-100">
                            <Col xs={6} lg={12} className="white py-3">
                                <span className="h-100 d-flex justify-content-center align-items-center">
                                    <label>{formatTimer(totalWhite)}</label>
                                </span>
                            </Col>
                            <Col xs={6} lg={12} className="black  py-3">
                                <span className="h-100 d-flex justify-content-center align-items-center">
                                    <label>{formatTimer(totalBlack)}</label>
                                </span>
                            </Col>
                        </Row>
                    </Container>
                </div>
                
            </div>
        );
    }
}