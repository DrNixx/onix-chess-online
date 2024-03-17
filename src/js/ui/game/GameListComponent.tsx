import React, {useEffect, useState} from 'react';

import clsx from "clsx";
import {useTranslation} from "react-i18next";
import Scrollbar from "react-scrollbars-custom";

import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Card from "@mui/material/Card";
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import {styled, ThemeProvider} from "@mui/material/styles";
import Tooltip from '@mui/material/Tooltip';

import { IAdvanceClock, IChessPlayer, IGameData } from '../../chess/types/Interfaces';
import { formatTimer, formatInterval, timestampToInterval } from '../../fn/date';
import UserBadge from "../user/UserBadge";

import {ChessTheme} from "../ChessTheme";
import GameLink from "./GameLink";
import Loader from "../Loader";
import {GameListProps} from "./GameListProps";

interface IListData {
    games: IGameData[],
    nextInterval: number
}

const GameListComponent: React.FC<GameListProps> = (props) => {
    const {language, apiUrl, emptyText, isPostponed} = props;

    const { t } = useTranslation(['game', 'timer']);

    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [games, setGames] = useState<IGameData[]>([]);

    let timeout = 0;

    const fetchCallback = (data: IListData) => {
        setGames(data.games);
        setLoading(false);
        setLoaded(true);

        if (data.nextInterval > 0) {
            timeout = window.setTimeout(fetchGamesData, data.nextInterval * 1000);
        }
    }

    const fetchGamesData = () => {
        if (timeout) {
            clearTimeout(timeout)
        }

        setLoading(true);

        fetch(apiUrl, {mode: "cors"})
            .then(function(response) {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then(function(responseAsJson) {
                fetchCallback(responseAsJson);
            })
            .catch(function(error) {
                console.error('Looks like there was a problem when reading games: \n', error);
            });
    }

    useEffect(() => {
        if (!loading) {
            fetchGamesData();
        }

    }, [fetchGamesData, loading]);

    const renderRefreshIcon = React.useCallback(
        () => {
            return loading ? (
                <i className="card-icon card-icon-refresh-lg-master-animated" style={{ opacity: 1 }} />
            ) : (
                <i className="card-icon card-icon-refresh-lg-master" />
            );
        },
        [loading]
    );

    const refreshClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!loading) {
            fetchGamesData();
        }
    }

    const renderRoundLink = (game: IGameData) => {
        const viewTournament = t('viewTournament');

        if (game.tournament?.round) {
            return (
                <Tooltip arrow title={viewTournament}>
                    <a href={`/${language}/tournaments/round/${game.tournament.round}`}>
                        <span className="p-l-5" title={viewTournament}><i className="xi-grid1" /></span>
                    </a>
                </Tooltip>
            );
        }

        return null;
    };

    const isJoin = (game: IGameData) => {
        return game.observer && (game.observer == game.owner) && (game.game?.status.name == "new");
    };

    const isChallengeFromMe = (game: IGameData) => {
        return game.observer && (game.observer == game.owner) && (game.game?.status.name == "wait");
    };

    const isChallengeToMe = (game: IGameData) => {
        return game.observer && (game.observer != game.owner) && (game.game?.status.name == "wait");
    };

    const isMyMove = (game: IGameData) => {
        return game.observer && (game.game?.player === game.game?.mover);
    };

    const playerTime = (game: IGameData) => {
        const clock = ((game.clock as unknown) as IAdvanceClock);
        return (game.player?.color == "white") ? clock.white : clock.black;
    }

    const opponentTime = (game: IGameData) => {
        const clock = ((game.clock as unknown) as IAdvanceClock);
        return (game.player?.color == "white") ? clock.black : clock.white;
    }

    const renderTimerIcon = (player: IChessPlayer | undefined, game: IGameData, turn: boolean) => {
        const turnClass = {
            'text-orange': !!turn,
            'hidden': !turn
        };

        const ppClass = {
            'text-orange': !!turn,
            'hint-text': !turn
        };

        if (player) {
            if (player.user.postpone) {
                const clock = ((game.clock as unknown) as IAdvanceClock);
                if (clock.can_pause) {
                    const left = formatInterval(timestampToInterval(player.user.postpone.rest), 1)
                    return (
                        <Tooltip arrow title={t('postpone_rest', {n : left})}>
                            <i className={clsx(ppClass)} data-icon="Z" />
                        </Tooltip>
                    );
                }
            }
        }

        return (
            <i className={clsx(turnClass)} data-icon="p" />
        );
    };

    const renderGameStatus = (game: IGameData) => {
        if (isJoin(game)) {
            return (
                <span className="p-l-5 small-text hint-text">{t('waitOpponent')}</span>
            );
        }

        if (isChallengeFromMe(game)) {
            return (
                <span className="p-l-5 small-text hint-text">{t('acceptChgWait')}</span>
            );
        }

        if (isChallengeToMe(game)) {
            return (
                <span className="p-l-5 small-text text-orange">{t('acceptChgDo')}</span>
            );
        }

        if (isMyMove(game)) {
            return (
                <React.Fragment>
                    {renderTimerIcon(game.player, game, true)}
                    <span className="p-l-5 bold">{formatTimer(playerTime(game))}</span>
                    <span className="p-l-5 small-text hint-text">&larr; {t('myMove')}</span>
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    {renderTimerIcon(game.player, game, false)}
                    <span className="p-l-5">{formatTimer(playerTime(game))}</span>
                </React.Fragment>

            );
        }
    };

    const renderOpponentStatus = (game: IGameData) => {
        if (!isJoin(game) && !isChallengeFromMe(game) && !isChallengeToMe(game)) {
            if (!isMyMove(game)) {
                return (
                    <React.Fragment>
                        <span className="p-r-5 small-text hint-text">{t('oppMove')} &rarr;</span>
                        <span className="p-r-5 bold">{formatTimer(opponentTime(game))}</span>
                        {renderTimerIcon(game.opponent, game, true)}
                    </React.Fragment>
                );
            } else {
                return (
                    <React.Fragment>
                        <span className="p-r-5">{formatTimer(opponentTime(game))}</span>
                        {renderTimerIcon(game.opponent, game, false)}
                    </React.Fragment>
                );
            }
        }

        return null;
    };

    const StripedListItem = styled(ListItem)(({ theme }) => ({
        paddingTop: 0,
        paddingBottom: 0,
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        }
    }));

    const renderGame = (game: IGameData) => {
        const clock = ((game.clock as unknown) as IAdvanceClock);

        return (
            <StripedListItem key={game.game?.id}>
                <ListItemText>
                    <Grid container spacing={2}>
                        <Grid item md={8}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <GameLink game={game} />
                                    { renderRoundLink(game) }
                                </Grid>
                                <Grid item xs={6}>
                                    { renderGameStatus(game) }
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <span className="small-text hint-text" title={clock.limit}>{clock.limit}</span>
                                </Grid>
                                <Grid item xs={6} className="text-right">
                                    { renderOpponentStatus(game) }
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item md={4}>
                            { game.opponent ? (<UserBadge user={game.opponent.user} size="small" compact={false} />) : null }
                        </Grid>
                    </Grid>
                </ListItemText>
            </StripedListItem>
        );
    };

    const renderList = (games: IGameData[]) => {
        const result: JSX.Element[] = [];

        games.forEach((game) => {
            result.push(renderGame(game));
        });

        return result;
    };

    const renderGames = () => {
        if (games.length) {
            const listHeight = games.length * 5;
            return (
                <React.Fragment>
                    <CardContent className="gamelist-wrapper" sx={{ p: 0 }} style={{height: `${listHeight}rem`}}>
                        <Scrollbar trackYProps={{style: {width: 5}}}>
                            <List>
                                { renderList(games) }
                            </List>
                        </Scrollbar>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'space-between', px: ""}}>
                        <div>
                            <a href="https://www.chess-online.com/ru-ru/chess/create" className="btn btn-icon-left"><i className="xi-play-one text-blue" /> {t('createGame')}</a>
                        </div>
                        <div>
                            { !isPostponed ?
                                (<a href="https://www.chess-online.com/user/postpones" className="btn btn-icon-left"><i className="card-icon text-orange xi-palm" /> {t('takeVacation')}</a>) :
                                (<a href="https://www.chess-online.com/user/postpones" className="btn btn-warning btn-icon-left"><i className="card-icon xi-palm" /> {t('cancelVacation')}</a>)
                            }
                        </div>
                    </CardActions>
                </React.Fragment>
            )
        } else {
            return loaded ? (
                <CardContent>
                    <div dangerouslySetInnerHTML={ {__html: emptyText} } />
                </CardContent>
            ) : (
                <CardContent>
                    <div className="text-center">
                        <Loader />
                    </div>
                </CardContent>
            );
        }
    };

    return (
        <ThemeProvider theme={ChessTheme}>
            <Card variant="outlined"
                  className="widget-body"
                  sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%"
                  }}>
                <CardHeader
                    disableTypography
                    action={
                        <IconButton aria-label="refresh" onClick={refreshClick}>
                            {renderRefreshIcon()}
                        </IconButton>
                    }
                    title={
                        <h3 className="title"><i data-icon="Х" className="text-orange pe-2" />{t('activeGames')}</h3>
                    }
                    sx={{ paddingBottom: 0 }}
                />
                { renderGames() }
            </Card>
        </ThemeProvider>
    );
};

export default GameListComponent;