import React from 'react';
import {useSelector} from "react-redux";
import clsx from 'clsx';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import sprintf from '../../fn/string/Sprintf';
import { Chess as ChessEngine } from '../../chess/Chess';
import { IChessPlayer, isAdvanceClock } from '../../chess/types/Interfaces';
import { GameResult } from '../../chess/GameResult';
import {CombinedGameState} from "../../actions/CombinedGameState";
import {GameState} from "../../actions/GameState";
import {useTranslation} from "react-i18next";

const GameInfo: React.FC = (props) => {

    const { t } = useTranslation(['game']);

    const { children } = props;
    const game = useSelector<CombinedGameState, GameState>((state) => state.game );
    const { engine } = game;

    const resultColor = (result: GameResult.Color) => {
        switch (result) {
            case GameResult.Color.White:
                return (
                    <h4 className="result-color white">{t("whiteWin") } (1 &ndash; 0)</h4>
                );
            case GameResult.Color.Black:
                return (
                    <h4 className="result-color black">{t("blackWin") } (0 &ndash; 1)</h4>
                );
            default:
                return (
                    <h4 className="result-color draw">{t("drawWin") } (&frac12; &ndash; &frac12;)</h4>
                );
        }
    };

    const renderResult = (result: GameResult.Color) => {
        return (result || (result !== GameResult.Color.None)) && resultColor(result);

    };

    const playerDisplay = (player?: IChessPlayer) => {
        if (player) {
            const { display, name } = player.user;
            return (
                <span className="username">{ display ?? name }</span>
            );
        } else {
            return null;
        }
    };

    const winnerName = (engine: ChessEngine) => {
        if (engine.Result == GameResult.Color.White) {
            return playerDisplay(engine.White);
        } else if (engine.Result == GameResult.Color.Black) {
            return playerDisplay(engine.Black);
        } else {
            return null;
        }
    };

    const looserName = (engine: ChessEngine) => {
        if (engine.Result == GameResult.Color.White) {
            return playerDisplay(engine.Black);
        } else if (engine.Result == GameResult.Color.Black) {
            return playerDisplay(engine.White);
        } else {
            return null;
        }
    };

    const renderState = (engine: ChessEngine) => {
        let result: JSX.Element | null = null;
        const { game } = engine.RawData;
        if (game) {
            // 'created' | 'new' | 'wait' | 'started' | 'aborted' | 'mate' | 'resign' | 'stalemate' | 'timeout' | 'draw' | 'outoftime' | 'noStart' | 'cheat' | 'variantEnd' | 'paused' | 'external'
            const { status } = game;
            if (status.name == "created") {
                result = (
                    <span>{t("resCreated")}</span>
                );
            } else if (status.name == "new") {
                result = (
                    <span>{t("resNew")}</span>
                );
            } else if (status.name == "wait") {
                result = (
                    <span>{t("resWait")}</span>
                );
            } else if (status.name == "aborted") {
                result = (
                    <span>{t("resAborted")}</span>
                );
            } else if (status.name == "started") {
                result = (
                    <span>{t("resStarted")}</span>
                );
            } else if (status.name == "paused") {
                result = (
                    <span>{t("resPaused")}</span>
                );
            } else if (status.name == "mate") {
                result = (
                    <span>{winnerName(engine)} {t("resCheckmate")}</span>
                );
            } else if (status.name == "resign") {
                result = (
                    <span>{looserName(engine)} {t("resResign")}</span>
                );
            } else if (status.name == "outoftime") {
                result = (
                    <span>{winnerName(engine)} {t("resOutOfTime")}</span>
                );
            } else if (status.name == "timeout") {
                result = (
                    <span>{looserName(engine)} {t("resNotMoved")}</span>
                );
            } else if (status.name == "noStart") {
                result = (
                    <span>{t("resNotStarted")}</span>
                );
            } else if (status.name == "cheat") {
                result = (
                    <span>{t("resArbiter")}</span>
                );
            } else if (status.name == "draw") {
                if (status.subtype == 5) {
                    result = (
                        <span>{t("resRepeat")}</span>
                    );
                } else if (status.subtype == 6) {
                    result = (
                        <span>{t("res50move")}</span>
                    );
                } else if (status.subtype == 7) {
                    result = (
                        <span>{t("resDrawArbiter")}</span>
                    );
                } else if (status.subtype == 8) {
                    result = (
                        <span>{t("resStalemate")}</span>
                    );
                } else if (status.subtype == 9) {
                    result = (
                        <span>{t("resMaterial")}</span>
                    );
                } else {
                    result = (
                        <span>{t("resDraw")}</span>
                    );
                }
            } else if (status.name == "stalemate") {
                result = (
                    <span>{t("resStalemate")}</span>
                );
            } else {
                result = (
                    <span>{t("resEnd")}</span>
                );
            }
        }

        if (result) {
            return (
                <Box className="mb-1">{ result }</Box>
            );
        }

        return null;
    };

    const renderTC = (engine: ChessEngine) => {
        let result: JSX.Element | null = null;
        const { correspondence, clock } = engine.RawData;

        const gameClock = correspondence ?? clock;

        if (isAdvanceClock(gameClock)) {
            const canPP = (gameClock.can_pause) ? "canPostpone" : "noPostpone";
            const ppClass = [
                "label",
                "ms-2",
                {
                    "label-default": gameClock.can_pause,
                    "label-warning": !gameClock.can_pause,
                }
            ];

            result = (
                <Box className="mb-1">
                    <span>
                        <span>{t("timeControl")}</span>: <span className="label">{gameClock.limit}</span>
                        <span className={clsx(ppClass)}>{t(canPP)}</span>
                    </span>
                </Box>
            );
        }

        if (result) {
            return (
                <Box className="mb-1">{ result }</Box>
            );
        }

        return null;
    };

    const renderRZ = (engine: ChessEngine) => {
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
                    <>
                        <Box className="mb-1">
                            <span>
                                <span>{t("variantVsSpeed")}</span>: <span className="label">{t(varName)}</span>
                                <span className="label ms-2">{t(rated)}</span>
                            </span>
                        </Box>
                        <Box className="mb-1">
                            <span>
                                <span>{t("useCompHints")}</span>: <span className={clsx(ucClass)}>{t(compName)}</span>
                            </span>
                        </Box>
                    </>
                );
            }
        }

        return result;
    };

    const renderName = (engine: ChessEngine) => {
        let result: JSX.Element | null = null;
        const { game, tournament } = engine.RawData;
        if (tournament) {
            const url = tournament.round ? `https://www.chess-online.com/tournaments/round/${tournament.round}` : `https://www.chess-online.com/tournaments/${tournament.id}`;
            result = (
                <Box className="mb-1">
                    <span className="bold">
                        <a href={url}><span className="p-r-5">
                            <Tooltip arrow title={t("viewTournTable")} >
                                <i className="xi-grid1" />
                            </Tooltip>
                        </span>{tournament.name}</a>
                    </span>
                </Box>
            );
        } else if (game) {
            result = (
                <Box className="mb-1">
                    <span className="bold">{game.event}</span>
                </Box>
            );
        }

        return result;
    };

    const renderDates = (engine: ChessEngine) => {
        let result: JSX.Element | null = null;
        const { game, correspondence } = engine.RawData;
        if ((engine.Result > 0) && game) {
            const from = new Date(game.createdAt ?? 'now');
            if (isAdvanceClock(correspondence) && correspondence.lastMoveAt) {
                const to = new Date(correspondence.lastMoveAt);
                const fmt = t("datesFmt");

                const diff = to.getTime() - from.getTime();

                const strDates = (diff > 86400000) ?
                    sprintf(fmt, from.toLocaleDateString(), to.toLocaleDateString()) :
                    sprintf(fmt, from.toLocaleString(), to.toLocaleString());

                result = (
                    <span>{strDates}</span>
                );
            } else {
                result = (
                    <span>{t("completeState")}</span>
                );
            }
        }

        if (!result) {
            if (engine.isStarted) {
                result = (
                    <span>{t("startDate")}: <span>{new Date(game?.createdAt ?? 'now').toLocaleDateString()}</span></span>
                );
            } else {
                result = (
                    <span>{t("createDate")}: <span>{new Date(game?.createdAt ?? 'now').toLocaleDateString()}</span></span>
                );
            }
        }

        return (
            <Box className="mb-1">{ result }</Box>
        );

    };

    return (
        <Card className="card-transparent">
            <CardContent>
                { renderResult(engine.Result) }
                { renderState(engine) }
                <Box className="mb-1">{ renderDates(engine) }</Box>
                { renderRZ(engine) }
                { renderTC(engine) }
                { renderName(engine) }
                { children }
            </CardContent>
        </Card>

    );
};

export default GameInfo;