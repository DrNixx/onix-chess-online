import React, {PropsWithChildren, useContext} from 'react';
import clsx from 'clsx';
import {useTranslation} from "react-i18next";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import sprintf from '../../fn/string/Sprintf';
import { IChessPlayer, isAdvanceClock } from '../../chess/types/Interfaces';
import * as GameResult from '../../chess/GameResult';
import {GameContext} from "../../providers/GameProvider";


const GameInfo: React.FC<PropsWithChildren> = (props) => {
    const { t } = useTranslation(['game']);
    const { children } = props;

    const {
        eventName,
        isExternal,
        timer,
        gameResult,
        createdAt,
        isRated,
        isCorrespondence,
        isAdvance,
        isStarted,
        getGameStatus,
        getPlayers,
        getTournamentInfo
    } = useContext(GameContext);

    const resultColor = () => {
        switch (gameResult) {
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

    const renderResult = () => {
        return (gameResult || (gameResult !== GameResult.Color.None)) && resultColor();
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

    const winnerName = () => {
        if (gameResult == GameResult.Color.White) {
            return playerDisplay(getPlayers().white);
        } else if (gameResult == GameResult.Color.Black) {
            return playerDisplay(getPlayers().black);
        } else {
            return null;
        }
    };

    const looserName = () => {
        if (gameResult == GameResult.Color.White) {
            return playerDisplay(getPlayers().black);
        } else if (gameResult == GameResult.Color.Black) {
            return playerDisplay(getPlayers().white);
        } else {
            return null;
        }
    };

    const renderState = () => {
        let result: JSX.Element | null = null;
        const status = getGameStatus();
        if (status) {
            // 'created' | 'new' | 'wait' | 'started' | 'aborted' | 'mate' | 'resign' | 'stalemate' | 'timeout' | 'draw' | 'outoftime' | 'noStart' | 'cheat' | 'variantEnd' | 'paused' | 'external'
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
                    <span>{winnerName()} {t("resCheckmate")}</span>
                );
            } else if (status.name == "resign") {
                result = (
                    <span>{looserName()} {t("resResign")}</span>
                );
            } else if (status.name == "outoftime") {
                result = (
                    <span>{winnerName()} {t("resOutOfTime")}</span>
                );
            } else if (status.name == "timeout") {
                result = (
                    <span>{looserName()} {t("resNotMoved")}</span>
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

    const renderTC = () => {
        let result: JSX.Element | null = null;

        if (isAdvanceClock(timer)) {
            const canPP = (timer.can_pause) ? "canPostpone" : "noPostpone";
            const ppClass = [
                "label",
                "ms-2",
                {
                    "label-default": timer.can_pause,
                    "label-warning": !timer.can_pause,
                }
            ];

            result = (
                <Box className="mb-1">
                    <span>
                        <span>{t("timeControl")}</span>: <span className="label">{timer.limit}</span>
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

    const renderRZ = () => {
        let result: JSX.Element | null = null;

        if (!isExternal) {
            const rated = (isRated) ? "ratedGame" : "unratedGame";
            if (isCorrespondence) {
                const varName = (isAdvance) ? "varAdvance" : "varCorrs";
                const compName = (isAdvance) ? "allow" : "denied";
                const ucClass = [
                    "label",
                    {
                        "label-default": !!isAdvance,
                        "label-warning": !isAdvance,
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

    const renderName = () => {
        let result: JSX.Element | null;
        const tournament = getTournamentInfo();

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
        } else {
            result = (
                <Box className="mb-1">
                    <span className="bold">{t(eventName ?? '')}</span>
                </Box>
            );
        }

        return result;
    };

    const renderDates = () => {
        let result: JSX.Element | null = null;

        if (gameResult > 0) {
            const from = new Date(createdAt ?? 'now');
            if (isAdvanceClock(timer) && timer.lastMoveAt) {
                const to = new Date(timer.lastMoveAt);
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
            if (isStarted) {
                result = (
                    <span>{t("startDate")}: <span>{new Date(createdAt ?? 'now').toLocaleDateString()}</span></span>
                );
            } else {
                result = (
                    <span>{t("createDate")}: <span>{new Date(createdAt ?? 'now').toLocaleDateString()}</span></span>
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
                { renderResult() }
                { renderState() }
                <Box className="mb-1">{ renderDates() }</Box>
                { renderRZ() }
                { renderTC() }
                { renderName() }
                { children }
            </CardContent>
        </Card>

    );
};

export default GameInfo;