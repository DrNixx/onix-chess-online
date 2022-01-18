import React, { Fragment } from 'react';
import clsx from "clsx";
import { Card, Col, Row, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { sprintf } from '../../fn/string/Sprintf';
import { _ } from '../../i18n/i18n';
import { Chess as ChessEngine } from '../../chess/Chess';
import { GameRelatedStore } from '../../actions/GameStore';
import { IChessPlayer, isAdvanceClock } from '../../chess/types/Interfaces';
import { GameResult } from '../../chess/GameResult';

export interface GameInfoProps {
    store: GameRelatedStore
}

export class GameInfo extends React.Component<GameInfoProps, {}> {
    constructor(props: GameInfoProps) {
        super(props);
    }

    private renderDates = (engine: ChessEngine) => {
        let result: JSX.Element | null = null;
        const { game, correspondence } = engine.RawData;
        if ((engine.Result > 0) && game) {
            const from = new Date(game.createdAt ?? 'now');
            if (isAdvanceClock(correspondence) && correspondence.lastMoveAt) {
                const to = new Date(correspondence.lastMoveAt);
                const fmt = _("game", "datesFmt");

                const diff = to.getTime() - from.getTime();

                const strDates = (diff > 86400000) ? 
                    sprintf(fmt, from.toLocaleDateString(), to.toLocaleDateString()) :
                    sprintf(fmt, from.toLocaleString(), to.toLocaleString());

                result = (
                    <span>{strDates}</span>
                );
            } else {
                result = (
                    <span>{_("game", "completeState")}</span>
                );
            }
        }

        if (!result) {
            if (engine.isStarted) {
                result = (
                    <span>{_("game", "startDate")}: <span>{new Date(game?.createdAt ?? 'now').toLocaleDateString()}</span></span>
                );
            } else {
                result = (
                    <span>{_("game", "createDate")}: <span>{new Date(game?.createdAt ?? 'now').toLocaleDateString()}</span></span>
                );
            }
            
        }

        return (
            <Row>
                <Col className="mb-1" md={12}>{ result }</Col>
            </Row>
        );
        
    };

    private playerDisplay = (player?: IChessPlayer) => {
        if (player) {
            const { display, name } = player.user;
            return (
                <span className="username">{ display ?? name }</span>
            );
        } else {
            return null;
        }
    };

    private winnerName = (engine: ChessEngine) => {
        if (engine.Result == GameResult.Color.White) {
            return this.playerDisplay(engine.White);
        } else if (engine.Result == GameResult.Color.Black) {
            return this.playerDisplay(engine.Black);
        } else {
            return null;
        }
    };

    private looserName = (engine: ChessEngine) => {
        if (engine.Result == GameResult.Color.White) {
            return this.playerDisplay(engine.Black);
        } else if (engine.Result == GameResult.Color.Black) {
            return this.playerDisplay(engine.White);
        } else {
            return null;
        }
    };

    private resultColor = (engine: ChessEngine) => {
        if (engine.Result == GameResult.Color.White) {
            return (
                <h4 className="result-color white">{ _("game", "whiteWin") } (1 &ndash; 0)</h4>
            );
        } else if (engine.Result == GameResult.Color.Black) {
            return (
                <h4 className="result-color black">{ _("game", "blackWin") } (0 &ndash; 1)</h4>
            );
        } else {
            return (
                <h4 className="result-color draw">{ _("game", "drawWin") } (&frac12; &ndash; &frac12;)</h4>
            );
        }
    };

    private renderResult = (engine: ChessEngine) => {
        if (engine.Result) {
            return (
                <React.Fragment>
                    { this.resultColor(engine) }
                </React.Fragment>
            );
        } else {
            return null;
        }
    };

    private renderState = (engine: ChessEngine) => {
        let result: JSX.Element | null = null;
        const { game } = engine.RawData;
        if (game) {
            // 'created' | 'new' | 'wait' | 'started' | 'aborted' | 'mate' | 'resign' | 'stalemate' | 'timeout' | 'draw' | 'outoftime' | 'noStart' | 'cheat' | 'variantEnd' | 'paused' | 'external'
            const { status } = game;
            if (status.name == "created") {
                result = (
                    <span>{_("game", "resCreated")}</span>
                );
            } else if (status.name == "new") {
                result = (
                    <span>{_("game", "resNew")}</span>
                );
            } else if (status.name == "wait") {
                result = (
                    <span>{_("game", "resWait")}</span>
                );
            } else if (status.name == "aborted") {
                result = (
                    <span>{_("game", "resAborted")}</span>
                );
            } else if (status.name == "started") {
                result = (
                    <span>{_("game", "resStarted")}</span>
                );
            } else if (status.name == "paused") {
                result = (
                    <span>{_("game", "resPaused")}</span>
                );
            } else if (status.name == "mate") {
                result = (
                    <span>{this.winnerName(engine)} {_("game", "resCheckmate")}</span>
                );
            } else if (status.name == "resign") {
                result = (
                    <span>{this.looserName(engine)} {_("game", "resResign")}</span>
                );
            } else if (status.name == "outoftime") {
                result = (
                    <span>{this.winnerName(engine)} {_("game", "resOutOfTime")}</span>
                );
            } else if (status.name == "timeout") {
                result = (
                    <span>{this.looserName(engine)} {_("game", "resNotMoved")}</span>
                );
            } else if (status.name == "noStart") {
                result = (
                    <span>{_("game", "resNotStarted")}</span>
                );
            } else if (status.name == "cheat") {
                result = (
                    <span>{_("game", "resArbiter")}</span>
                );
            } else if (status.name == "draw") {
                if (status.subtype == 5) {
                    result = (
                        <span>{_("game", "resRepeat")}</span>
                    );
                } else if (status.subtype == 6) {
                    result = (
                        <span>{_("game", "res50move")}</span>
                    );
                } else if (status.subtype == 7) {
                    result = (
                        <span>{_("game", "resDrawArbiter")}</span>
                    );
                } else if (status.subtype == 8) {
                    result = (
                        <span>{_("game", "resStalemate")}</span>
                    );
                } else if (status.subtype == 9) {
                    result = (
                        <span>{_("game", "resMaterial")}</span>
                    );
                } else {
                    result = (
                        <span>{_("game", "resDraw")}</span>
                    );
                }
            } else if (status.name == "stalemate") {
                result = (
                    <span>{_("game", "resStalemate")}</span>
                );
            } else {
                result = (
                    <span>{_("game", "resEnd")}</span>
                );
            }
        }
        
        if (result) {
            return (
                <Row>
                    <Col className="mb-1" md={12}>{ result }</Col>
                </Row>
            );
        }

        return null;
    };

    private renderTC = (engine: ChessEngine) => {
        let result: JSX.Element | null = null;
        const { correspondence, clock } = engine.RawData;

        const gameClock = correspondence ?? clock;
        
        if (isAdvanceClock(gameClock)) {
            const canPP = (gameClock.can_pause) ? "canPostpone" : "noPostpone";
            const ppClass = [
                "label", 
                "ml-2",
                {
                    "label-default": gameClock.can_pause,
                    "label-warning": !gameClock.can_pause,
                }
            ];
            
            result = (
                <Row>
                    <Col className="mb-1" md={12}>
                        <span>
                            <span>{_("game", "timeControl")}</span>: <span className="label">{gameClock.limit}</span>
                            <span className={clsx(ppClass)}>{_("game", canPP)}</span>
                        </span>
                    </Col>
                </Row>
                
            );
        }

        if (result) {
            return (
                <Row>
                    <Col className="mb-1" md={12}>{ result }</Col>
                </Row>
            );
        }

        return null;
    };

    private renderRZ = (engine: ChessEngine) => {
        let result: JSX.Element | null = null;
        const { game } = engine.RawData;
        if (game && game.insite) {
            const rated = (game.rated) ? "ratedGame" : "unratedGame";
            if (game.speed == "correspondence") {
                const varName = (game.advance) ? "varAdvance" : "varCorrs";
                const compName = (game.advance) ? "allow" : "denied";
                const ucClass = [
                    "label", 
                    {
                        "label-default": !!game.advance,
                        "label-warning": !game.advance,
                    }
                ];

                result = (
                    <Fragment>
                        <Row>
                            <Col className="mb-1" md={12}>
                                <span>
                                    <span>{_("game", "variantVsSpeed")}</span>: <span className="label">{_("game", varName)}</span>
                                    <span className="label ml-2">{_("game", rated)}</span>
                                </span>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="mb-1" md={12}>
                                <span>
                                    <span>{_("game", "useCompHints")}</span>: <span className={clsx(ucClass)}>{_("game", compName)}</span>
                                </span>
                            </Col>
                        </Row>
                    </Fragment> 
                );
            }
        }

        return result;
    };

    private renderName = (engine: ChessEngine) => {
        let result: JSX.Element | null = null;
        const { game, tournament } = engine.RawData;
        if (tournament) {
            const url = tournament.round ? `https://www.chess-online.com/tournaments/round/${tournament.round}` : `https://www.chess-online.com/tournaments/${tournament.id}`;
            result = (
                <Row>
                    <Col className="mb-1" md={12}>
                        <span className="bold">
                            <a href={url}><span className="p-r-5">
                                <OverlayTrigger
                                    key={tournament.id}
                                    overlay={
                                        <Tooltip id={`tooltip-${tournament.id}`}>{_("game", "viewTournTable")}</Tooltip>
                                    }
                                    >
                                    <i className="xi-grid1"></i>
                                </OverlayTrigger>
                            </span>{tournament.name}</a>
                        </span>
                    </Col>
                </Row>
            );
        } else if (game) {
            result = (
                <Row>
                    <Col className="mb-1" md={12}>
                        <span className="bold">{game.event}</span>
                    </Col>
                </Row>
            );
        }

        return result;
    };

    render() {
        const { props, renderResult, renderDates, renderState, renderRZ, renderTC, renderName } = this;
        const { store, children } = props;
        const { game } = store.getState();
        const { engine } = game;

        return (
            <Card className="card-transparent">
                { renderResult(engine) }    
                { renderState(engine) }
                <Row>
                    <Col className="mb-1" md={12}>{ renderDates(engine) }</Col>
                </Row>
                { renderRZ(engine) }
                { renderTC(engine) }
                { renderName(engine) }
                { children }
            </Card>
        );
    }
}