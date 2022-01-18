import clsx from "clsx";
import React, { useEffect} from 'react';
import * as ReactDOM from 'react-dom';
import Scrollbar from "react-scrollbars-custom";
import { Card, Container, Row, Col, OverlayTrigger, Tooltip, PopoverProps, Popover, Spinner } from 'react-bootstrap';
import { _ } from '../../i18n/i18n';
import { Logger } from '../../common/Logger';
import { UserName } from '../user/UserName';
import { IAdvanceClock, IChessGame, IChessPlayer, IGameData } from '../../chess/types/Interfaces';
import { formatTimer } from '../../fn/date/formatTimer';
import { formatInterval } from '../../fn/date/formatInterval';
import { timestampToInterval } from '../../fn/date/timestampToInterval';

interface IListData {
    games: IGameData[],
    nextInterval: number
}

export interface GameListProps {
    language: string;
    apiUrl: string;
    emptyText: string,
    isPostponed: boolean,
    i18n: {
        title?: string;
        newGame?: string;
        takeVacation?: string;
        cancelVacation?: string;
        viewTournament?: string;
        waitOpponent?: string;
        acceptChgWait?: string;
        acceptChgDo?: string;
        myMove?: string;
        oppMove?: string;
    }
}

export interface GameListState {
    games: IGameData[],
    loading: boolean,
    loaded: boolean,
    fade: boolean
}

class GameListComponent extends React.Component<GameListProps, GameListState> {
    private timeout: number = 0;

    public static defaultProps: GameListProps = {
        language: 'ru-ru',
        apiUrl: '/api/games/active',
        emptyText: '',
        isPostponed: false,
        i18n: {
            title: "Active games",
            newGame: "New game",
            takeVacation: "Take a vacation",
            cancelVacation: "Cancel a vacation",
            viewTournament: "View tournament table",
            waitOpponent: "Waiting for opponent...",
            acceptChgWait: "Waiting for challenge accept...",
            acceptChgDo: "Accept challenge?",
            myMove: "Is my move",
            oppMove: "Is opponent move",
        }
    }

    constructor(props: GameListProps) {
        super(props);

        this.state = {
            games: [],
            loading: true,
            loaded: false,
            fade: true
        };
    }

    componentDidMount() {
        this.fetchGamesData();
    }

    private fetchGamesData = (withFade: boolean = false) => {
        const that = this;
        const { loading, fade, ...other } = this.state;

        if (this.timeout) {
            clearTimeout(this.timeout)
        }

        this.setState({
            ...other,
            loading: true,
            fade: fade || withFade
        });

        fetch(this.props.apiUrl, {mode: "cors"})
            .then(function(response) {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then(function(responseAsJson) {
                that.fetchCallback(responseAsJson);
            })
            .catch(function(error) {
                Logger.error('Looks like there was a problem when reading games: \n', error);
            });
    }

    private fetchCallback = (data: IListData) => {
        this.setState({
            games: data.games,
            loaded: true,
            loading: false,
            fade: false
        });

        if (data.nextInterval > 0) {
            this.timeout = window.setTimeout(this.fetchGamesData, data.nextInterval * 1000);
        }
    }

    private isJoin = (game: IGameData) => {
        return game.observer && (game.observer == game.owner) && (game.game!.status.name == "new");
    };

    private isChallengeFromMe = (game: IGameData) => {
        return game.observer && (game.observer == game.owner) && (game.game!.status.name == "wait");
    };

    private isChallengeToMe = (game: IGameData) => {
        return game.observer && (game.observer != game.owner) && (game.game!.status.name == "wait");
    };

    private isMyMove = (game: IGameData) => {
        return game.observer && (game.game!.player === game.game!.mover);
    };

    private playerTime = (game: IGameData) => {
        const clock = ((game.clock as unknown) as IAdvanceClock);
        return (game.player?.color == "white") ? clock.white : clock.black;
    }

    private opponentTime = (game: IGameData) => {
        const clock = ((game.clock as unknown) as IAdvanceClock);
        return (game.player?.color == "white") ? clock.black : clock.white;
    }

    private refreshClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!this.state.loading) {
            this.fetchGamesData(true);
        }
    }

    private renderRefreshIcon = (loading: boolean) => {
        if (loading) {
            return (
                <i className="card-icon card-icon-refresh-lg-master-animated" style={{ opacity: 1 }} />
            );
        } else {
            return (
                <i className="card-icon card-icon-refresh-lg-master" />
            );
        }
    };

    private renderRoundLink = (game: IGameData) => {
        const { props } = this;
        const { language } = props;
        const { viewTournament } = props.i18n;

        if (game.tournament?.round) {
            return (
                <OverlayTrigger placement="right" overlay={<Tooltip id={`round-tooltip-${game.game!.id}`}>{viewTournament}</Tooltip>}>
                    <a href={`/${language}/tournaments/round/${game.tournament.round}`}>
                        <span className="p-l-5" title={viewTournament}><i className="xi-grid1"></i></span>
                    </a>
                </OverlayTrigger>
            );
        }

        return null;
    };

    private renderTimerIcon = (player: IChessPlayer | undefined, game: IGameData, turn: boolean) => {
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
                        <OverlayTrigger placement="right" overlay={<Tooltip id={`timer-tooltip-${player.user.id}-${game.game!.id}`}>{_("game", "postpone_rest", {n : left})}</Tooltip>}>
                            <i className={clsx(ppClass)} data-icon="Z"></i>
                        </OverlayTrigger>
                    );
                }
            }
        }

        return (
            <i className={clsx(turnClass)} data-icon="p"></i>
        );
    };

    private renderGameStatus = (game: IGameData) => {
        const { props, isJoin, isChallengeFromMe, isChallengeToMe, isMyMove, playerTime, renderTimerIcon } = this;
        const { waitOpponent, acceptChgWait, acceptChgDo, myMove } = props.i18n;

        if (isJoin(game)) {
            return (
                <span className="p-l-5 small-text hint-text">{waitOpponent}</span>
            );
        }

        if (isChallengeFromMe(game)) {
            return (
                <span className="p-l-5 small-text hint-text">{acceptChgWait}</span>
            );
        }

        if (isChallengeToMe(game)) {
            return (
                <span className="p-l-5 small-text text-orange">{acceptChgDo}</span>
            );
        }

        const clock = ((game.clock as unknown) as IAdvanceClock);

        if (isMyMove(game)) {
            return (
                <React.Fragment>
                    {renderTimerIcon(game.player, game, true)}
                    <span className="p-l-5 bold">{formatTimer(playerTime(game))}</span>
                    <span className="p-l-5 small-text hint-text">&larr; {myMove}</span>
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

    private renderOpponentStatus = (game: IGameData) => {
        const { props, isJoin, isChallengeFromMe, isChallengeToMe, isMyMove, opponentTime, renderTimerIcon } = this;
        const { oppMove } = props.i18n;

        if (!isJoin(game) && !isChallengeFromMe(game) && !isChallengeToMe(game)) {
            if (!isMyMove(game)) {
                return (
                    <React.Fragment>
                        <span className="p-r-5 small-text hint-text">{oppMove} &rarr;</span>
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

    private popoverFen = (game: IGameData) => {
        const UpdatingPopover = React.forwardRef(
            ({ popper, children, show: _, ...props }:  PopoverProps, ref) => {
                useEffect(() => {
                    popper.scheduleUpdate();
                }, [children, popper]);

                return (
                    <Popover ref={ref} {...props}>
                        {children}
                    </Popover>
                );
            },
        );


        return (
            <UpdatingPopover id={game.game!.id.toString()} className="gamefen-popup">
                <div className="p-2"><img className="w-100" src={`https://www.chess-online.com/fen.png?fen=${game.finalFen}&mv=${game.game!.lastMove}`} alt="" /></div>
            </UpdatingPopover>
        );
    }

    
    private renderColorIcon = (game: IChessGame) => {
        if (game.player == "white") {
            return (
                <i className="ci-alpha-wpw ci-lg" />
            );
        } else {
            return (
                <i className="ci-alpha-bpw ci-lg" />
            );
        }
    } 

    private renderGame = (game: IGameData) => {
        const { props, renderRoundLink, renderGameStatus, renderOpponentStatus, renderColorIcon } = this;

        const clock = ((game.clock as unknown) as IAdvanceClock);

        return (
            <Row key={game.game!.id.toString()} className="py-1">
                <Col md={8}>
                    <Row>
                        <Col xs={6}>
                            <OverlayTrigger rootClose={true} trigger={["hover", "focus"]} placement="auto" overlay={this.popoverFen(game)}>
                                <a href={`/${game.game!.id}`}>
                                    {renderColorIcon(game.game!)}
                                    <span className="p-l-5">{ game.game!.event }</span>
                                </a>
                            </OverlayTrigger>
                            { renderRoundLink(game) }
                        </Col>
                        <Col xs={6}>
                            { renderGameStatus(game) }
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6}>
                            <span className="small-text hint-text" title={clock.limit}>{clock.limit}</span>
                        </Col>
                        <Col xs={6} className="text-right">
                            { renderOpponentStatus(game) }
                        </Col>
                    </Row>
                </Col>
                <Col md={4}>
                    { game.opponent ? (<UserName user={game.opponent.user} size="Tiny" compact={false} />) : null }
                </Col>
            </Row>
        );
    };

    private renderList = (games: IGameData[]) => {
        const { renderGame } = this;
        const result: JSX.Element[] = [];

        games.forEach((game) => {
            result.push(renderGame(game));
        });

        return result;
    };

    private renderGames = () => {
        const { state, props, renderList } = this;
        const { emptyText, isPostponed } = props;
        const { games, loaded } = state;
        const { newGame, takeVacation, cancelVacation } = props.i18n;

        if (games.length) {
            const listHeight = games.length * 6; 
            return (
                <React.Fragment>
                    <Card.Body className="gamelist-wrapper px-0" style={{height: `${listHeight}em`}}>
                        <Scrollbar trackYProps={{style: {width: 5}}}>
                            <Container className="striped">
                                { renderList(games) }
                            </Container>
                        </Scrollbar>
                    </Card.Body>
                    <Card.Footer>
                        <div className="d-flex justify-content-between">
                            <div>
                                <a href="https://www.chess-online.com/ru-ru/chess/create" className="btn btn-icon-left"><i className="xi-play-one text-blue"></i> {newGame}</a>
                            </div>
                            <div>
                                { !isPostponed ? 
                                    (<a href="https://www.chess-online.com/user/postpones" className="btn btn-icon-left"><i className="card-icon text-orange xi-palm"></i> {takeVacation}</a>) : 
                                    (<a href="https://www.chess-online.com/user/postpones" className="btn btn-warning btn-icon-left"><i className="card-icon xi-palm"></i> {cancelVacation}</a>)
                                }
                            </div>
                        </div>
                    </Card.Footer>
                </React.Fragment>
            )
        } else {
            return loaded ? (
                <Card.Body>
                    <div dangerouslySetInnerHTML={ {__html: emptyText!} } />
                </Card.Body>
            ) : (
                <Card.Body>
                    <div className="text-center">
                        <Spinner animation="border" role="status">
                            <span className="sr-only">{_("game", "infoLoading")}</span>
                        </Spinner>
                    </div>
                </Card.Body>
            );
        }
    };

    render() {
        const { state, props, renderRefreshIcon, refreshClick, renderGames } = this;
        const { title } = props.i18n;
        
        const refrechClass = clsx([
            'card-refresh',
            {
                'refreshing': state.loading
            }
        ]);

        return (
            <Card className="widget-body no-border no-shadow full-height no-margin widget-loader-circle-lg">
                <Card.Header className="reset-min-height">
                    <Card.Title className="card-title"><i data-icon="Х" className="text-orange" />{title}</Card.Title>
                    <div className="card-controls">
                        <ul>
                            <li>
                                <a href={`/${props.language}`}
                                   className={refrechClass}
                                   data-toggle="refresh"
                                   onClick={refreshClick}>
                                    {renderRefreshIcon(state.loading)}
                                </a>
                            </li>
                        </ul>
                    </div>
                </Card.Header>
                { renderGames() }
            </Card>
        );
    }
}

export const gameList = (props: GameListProps, container: HTMLElement) => {
    ReactDOM.render(React.createElement(GameListComponent, props), container, () => { });
};