import React from 'react';
import * as ReactDOM from 'react-dom';
import clsx from "clsx";

import Tooltip from '@mui/material/Tooltip';

import { notify } from 'pages-ts';
import { appInstance } from '../../app/IApplication';
import { Avatar } from '../user/Avatar';
import { CSSTransition } from 'react-transition-group';
import { Logger } from '../../common/Logger';
import { Scrollbar } from 'react-scrollbars-custom';
import { IChallengeAcceptContent, IChallengeCancelContent, IChallengeDeclineContent, IChallengeNewContent, IJoinAcceptContent, INotify, INotifyPmContent } from '../../notifications/Interfaces';

export interface NotificationCenterProps {
    language: string;
    apiUrl: string,
    i18n: {
        readAll: string,
        markRead: string,
        newMessage: string,
        challengeNew: string,
        challengeCancel: string,
        challengeDecline: string,
        challengeAccept: string,
        joinAccept: string,
    }
}

export interface NotificationCenterState {
    hasEvents: boolean,
    countEvents: number,
    notifications: INotify[]
    details: Map<string, boolean>
}

export class NotificationCenter extends React.Component<NotificationCenterProps, NotificationCenterState> {
    private originalTitle?: string;


    public static defaultProps: NotificationCenterProps = {
        language: 'ru-ru',
        apiUrl: '/api/notify/notify-center',
        i18n: {
            readAll: 'Mark all as read',
            markRead: 'Mark as read',
            newMessage: 'New message',
            challengeNew: "New challenge",
            challengeCancel: "Challenge canceled",
            challengeDecline: "Challenge declined",
            challengeAccept: "Challenge accepted",
            joinAccept: "Joined to a game",
        }
    }

    constructor(props: NotificationCenterProps) {
        super(props);

        this.state = {
            hasEvents: false,
            countEvents: 0,
            notifications: [],
            details: new Map<string, boolean>(),
        };
    }

    componentDidMount() {
        const that = this;
        that.originalTitle = document.title;

        if (appInstance) {
            const { stream } = appInstance;
            if (stream) {
                stream.on('publish', function(ctx: any) {
                    if (ctx?.data?.t == "notify") {
                        if (ctx?.data?.c == "privateMessage") {
                            notify({
                                message: that.props.i18n.newMessage,
                                position: "bottom-right",
                                style: 'simple' 
                            });
                        } else if (ctx?.data?.c == "telegram") {
                            if (window.location.href.indexOf('settings/telegram') !== -1) {
                                window.location.reload();
                            }

                            return;
                        }

                        that.fetchNotifyData();
                    }

                    Logger.debug('Notification recieved', ctx);
                });
            }
        }
        

        that.fetchNotifyData();
    }

    private markRead = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        fetch(`${this.props.apiUrl}/${id}`, {method: "HEAD"}).then(() => {});
    };

    private markReadAll = (e: React.MouseEvent) => {
        e.preventDefault();
        fetch(this.props.apiUrl, {method: "DELETE"}).then(() => {
            document.body.click();
        });
    }

    private reloadList = (e: React.MouseEvent) => {
        e.preventDefault();
        this.fetchNotifyData();
    }

    private fetchNotifyData = () => {
        const { fetchCallback } = this;
        
        fetch(this.props.apiUrl)
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
                Logger.error('Looks like there was a problem when reading notifications: \n', error);
            });
    };

    private fetchCallback = (data: INotify[]) => {
        const { ...state } = this.state;

        state.notifications = data;
        state.countEvents = data.filter((n) => !n.read).length; 
        state.hasEvents = state.countEvents > 0;

        this.setState(state);
    }

    private toggleDetail = (e: React.MouseEvent, id: string) => {
        e.preventDefault();

        const { ...state } = this.state;
        state.details.set(id, !state.details.get(id));

        this.setState(state);
    };

    private renderMarkRead = (notify: INotify) => {
        const { i18n } = this.props;

        if (notify.read) {
            return (<div className="option"><span className="mark" /></div>);
        } else {
            return (
                <Tooltip title={i18n.markRead}>
                    <a href="#" className="mark" onClick={(e) => this.markRead(e, notify.id)} />
                </Tooltip>
            );
        }
    };

    private timeAgo = (notify: INotify) => {
        return (
            <div className="lh-normal">
                <div className="text-right">
                    <span className="time">{ notify.timeAgo }</span>
                </div>
            </div>
        );
    };

    private renderPmItem = (notify: INotify, content: INotifyPmContent) => {
        const { props, state, toggleDetail, renderMarkRead, timeAgo } = this;
        const { i18n } = props;
        const { details } = state;

        const itemClass = clsx("notification-item", "clearfix", {
            "unread": !notify.read
        });

        const detailVisible = !!details.get(notify.id);
        const headingClass = clsx("heading", { "open": detailVisible });

        return (
            <div className={itemClass} key={notify.id}>
                <div className={headingClass}>
                    <div className="clearfix">
                        <a href={`/pm/read/${content.id}`} className="text-complete pull-left">
                            <div className="thumbnail-wrapper d24 circular b-white b-a b-white m-t-10 m-r-10">
                                <Avatar user={content.sender} size="Tiny" />
                            </div>
                            <span className="bold">{i18n.newMessage}</span>
                            <span className="fs-12 m-l-10">{content.sender.display}</span>
                        </a>
                        <div className="pull-right">
                            <div className="thumbnail-wrapper d16 circular inline m-t-15 m-r-10" onClick={(e) => toggleDetail(e, notify.id)}>
                                <div><i className="fa fa-angle-left" /></div>
                            </div>
                        </div>
                    </div>
                    { timeAgo(notify) }
                    
                    <CSSTransition in={detailVisible} classNames="slide-down" timeout={500}>
                        <div className="more-details">
                            <div className="more-details-inner">
                                <h5 className="semi-bold fs-16">{ content.subject }</h5>
                                <p className="small hint-text">{ content.text }</p>
                            </div>
                        </div>
                    </CSSTransition>
                </div>
                { renderMarkRead(notify) }
            </div>
        );
    };

    private renderChallengeNew = (notify: INotify, content: IChallengeNewContent) => {
        const { props, renderMarkRead, timeAgo } = this;
        const { i18n } = props;

        const itemClass = clsx("notification-item", "clearfix", {
            "unread": !notify.read
        });

        return (
            <div className={itemClass} key={notify.id}>
                <div className="heading">
                    <div className="clearfix">
                        <div className="thumbnail-wrapper d24 circular b-white b-a b-white m-t-10 m-r-10">
                            <Avatar user={content.opponent} size="Tiny" />
                        </div>
                        <a href={`/${content.id}`} className="text-complete pull-left">
                            <span className="bold">{i18n.challengeNew}</span>
                            <span className="fs-12 m-l-10">{content.opponent.display}</span>
                        </a>
                    </div>
                    { timeAgo(notify) }                    
                </div>
                { renderMarkRead(notify) }
            </div>
        );
    };

    private renderChallengeCancel = (notify: INotify, content: IChallengeCancelContent) => {
        const { props, renderMarkRead, timeAgo } = this;
        const { i18n } = props;

        const itemClass = clsx("notification-item", "clearfix", {
            "unread": !notify.read
        });

        return (
            <div className={itemClass} key={notify.id}>
                <div className="heading">
                    <div className="clearfix">
                        <div className="thumbnail-wrapper d24 circular b-white b-a b-white m-t-10 m-r-10">
                            <Avatar user={content.opponent} size="Tiny" />
                        </div>
                        <span className="text-complete pull-left">
                            <span className="bold">{i18n.challengeCancel}</span>
                            <span className="fs-12 m-l-10">{content.opponent.display}</span>
                        </span>
                    </div>
                    { timeAgo(notify) }
                </div>
                { renderMarkRead(notify) }
            </div>
        );
    };

    private renderChallengeDecline = (notify: INotify, content: IChallengeDeclineContent) => {
        const { props, renderMarkRead, timeAgo } = this;
        const { i18n } = props;

        const itemClass = clsx("notification-item", "clearfix", {
            "unread": !notify.read
        });

        return (
            <div className={itemClass} key={notify.id}>
                <div className="heading">
                    <div className="clearfix">
                        <div className="thumbnail-wrapper d24 circular b-white b-a b-white m-t-10 m-r-10">
                            <Avatar user={content.opponent} size="Tiny" />
                        </div>
                        <span className="text-complete pull-left">
                            <span className="bold">{i18n.challengeDecline}</span>
                            <span className="fs-12 m-l-10">{content.opponent.display}</span>
                        </span>
                    </div>
                    { timeAgo(notify) }
                </div>
                { renderMarkRead(notify) }
            </div>
        );
    };

    private renderChallengeAccept = (notify: INotify, content: IChallengeAcceptContent) => {
        const { props, renderMarkRead, timeAgo } = this;
        const { i18n } = props;

        const itemClass = clsx("notification-item", "clearfix", {
            "unread": !notify.read
        });

        return (
            <div className={itemClass} key={notify.id}>
                <div className="heading">
                    <div className="clearfix">
                        <div className="thumbnail-wrapper d24 circular b-white b-a b-white m-t-10 m-r-10">
                            <Avatar user={content.opponent} size="Tiny" />
                        </div>
                        <a href={`/${content.id}`} className="text-complete pull-left">
                            <span className="bold">{i18n.challengeAccept}</span>
                            <span className="fs-12 m-l-10">{content.opponent.display}</span>
                        </a>
                    </div>
                    { timeAgo(notify) }                    
                </div>
                { renderMarkRead(notify) }
            </div>
        );
    };

    private renderJoinAccept = (notify: INotify, content: IJoinAcceptContent) => {
        const { props, renderMarkRead, timeAgo } = this;
        const { i18n } = props;

        const itemClass = clsx("notification-item", "clearfix", {
            "unread": !notify.read
        });

        return (
            <div className={itemClass} key={notify.id}>
                <div className="heading">
                    <div className="clearfix">
                        <div className="thumbnail-wrapper d24 circular b-white b-a b-white m-t-10 m-r-10">
                            <Avatar user={content.opponent} size="Tiny" />
                        </div>
                        <a href={`/${content.id}`} className="text-complete pull-left">
                            <span className="bold">{i18n.joinAccept}</span>
                            <span className="fs-12 m-l-10">{content.opponent.display}</span>
                        </a>
                    </div>
                    { timeAgo(notify) }                    
                </div>
                { renderMarkRead(notify) }
            </div>
        );
    };

    private renderList = () => {
        const { state, renderPmItem, renderChallengeNew, renderChallengeCancel, renderChallengeDecline, renderChallengeAccept, renderJoinAccept } = this;

        const items: JSX.Element[] = [];

        state.notifications.forEach((n) => {
            if (n.content) {
                if (n.content.type == "privateMessage") {
                    items.push(renderPmItem(n, n.content as INotifyPmContent));
                } else if (n.content.type == "challengeNew") {
                    items.push(renderChallengeNew(n, n.content as IChallengeNewContent));
                } else if (n.content.type == "challengeCancel") {
                    items.push(renderChallengeCancel(n, n.content as IChallengeCancelContent));
                } else if (n.content.type == "challengeDecline") {
                    items.push(renderChallengeDecline(n, n.content as IChallengeDeclineContent));
                } else if (n.content.type == "challengeAccept") {
                    items.push(renderChallengeAccept(n, n.content as IChallengeAcceptContent));
                } else if (n.content.type == "joinGame") {
                    items.push(renderJoinAccept(n, n.content as IJoinAcceptContent));
                } else if (n.content.type == "gameMove") {
    
                }
            }
        });
        
        return items;
    };

    render() {
        const { props, state, renderList, markReadAll, reloadList } = this;
        const { i18n } = props;
        const { hasEvents, countEvents } = state;

        if (this.originalTitle) {
            if (hasEvents) {
                document.title = `(${countEvents}) ${this.originalTitle}`;
            } else {
                document.title = this.originalTitle;   
            }
        }


        // { hasEvents ? (<span className="bubble"></span>) : "" }
        return (
            <></>
            /*
            <Dropdown className="notification-center">
                <Dropdown.Toggle as="a" href="#" className="header-icon btn-icon-link" bsPrefix="notification">
                    <i data-icon="" data-count={countEvents} className={ hasEvents ? "active" : ""} />
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu notification-toggle">
                    <div className="notification-panel">
                        <Scrollbar className="notification-body" style={{ height: 350 }} trackYProps={{style: {width: 5}}}>
                            { renderList() }
                        </Scrollbar>
                        
                        <div className="notification-footer text-center">
                            <a href="#" className="" onClick={(e) => markReadAll(e) }>{ i18n.readAll }</a>
                            <a data-toggle="refresh" className="portlet-refresh text-black pull-right" href="#" onClick={(e) => reloadList(e) }>
                                <i className="pg-icon">refresh_alt1</i>
                            </a>
                        </div>
                    </div>
                </Dropdown.Menu>            
            </Dropdown>
             */
        );
    }
}

export const notificationCenter = (props: NotificationCenterProps, container: HTMLElement) => {
    ReactDOM.render(React.createElement(NotificationCenter, props), container);
};
