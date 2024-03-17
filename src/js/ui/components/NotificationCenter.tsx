import React, {useEffect, useState} from 'react';
import { createRoot } from 'react-dom/client';
import clsx from "clsx";

import Tooltip from '@mui/material/Tooltip';

import { notify } from 'pages-ts';
import Avatar from '../user/Avatar';
import { CSSTransition } from 'react-transition-group';
import { IChallengeAcceptContent, IChallengeCancelContent, IChallengeDeclineContent, IChallengeNewContent, IJoinAcceptContent, INotify, INotifyPmContent } from '../../notifications/Interfaces';
import {useCentrifuge} from "../../hooks/useCentrifuge";
import {NOTIFY} from "../../models/stream/IStreamMessage";
import {apiDelete, apiGet, apiHead} from "../../api/Api";

type Props = {
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
};

export interface NotificationCenterState {
    hasEvents: boolean,
    countEvents: number,
    notifications: INotify[]
    details: Map<string, boolean>
}

const defaultProps = {
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
};

const NotificationCenter: React.FC<Props> = (propsIn) => {
    const props = {...defaultProps, ...propsIn};

    const [hasEvents, setHasEvents] = useState(false);
    const [countEvents, setCountEvents] = useState(0);
    const [notifications, setNotifications] = useState<INotify[]>([]);
    const [details, setDetails] = useState(new Map<string, boolean>());

    const [lastMessage] = useCentrifuge();

    let originalTitle: string;

    const fetchNotifyData = () => {
        apiGet(props.apiUrl)
            .then(data => {
                setNotifications(data.notifications);
                setCountEvents(data.countEvents);
                setHasEvents(data.countEvents > 0);
            })
            .catch(function(error) {
                console.error('Looks like there was a problem when reading notifications: \n', error);
            });
    };

    useEffect(() => {
        originalTitle = document.title;
        fetchNotifyData();
    }, [1]);

    useEffect(() => {
        if (lastMessage?.t === NOTIFY) {
            if (lastMessage.ctx.c == 'privateMessage') {
                notify({
                    message: props.i18n.newMessage,
                    position: 'bottom-right',
                    style: 'simple'
                });
            } else if (lastMessage.ctx.c == 'telegram') {
                if (window.location.href.indexOf('settings/telegram') !== -1) {
                    window.location.reload();
                }

                return;
            }

            fetchNotifyData();
        }
    }, [lastMessage]);

    const markRead = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        apiHead(`${props.apiUrl}/${id}`).then(() => true);
    };

    const markReadAll = (e: React.MouseEvent) => {
        e.preventDefault();
        apiDelete(props.apiUrl).then(() => {
            document.body.click();
        });
    }

    const reloadList = (e: React.MouseEvent) => {
        e.preventDefault();
        fetchNotifyData();
    }

    const toggleDetail = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        details.set(id, !details.get(id));
        setDetails(details);
    };

    const renderMarkRead = (notify: INotify) => {
        if (notify.read) {
            return (<div className="option"><span className="mark" /></div>);
        } else {
            return (
                <Tooltip title={props.i18n.markRead}>
                    <a href="#" className="mark" onClick={(e) => markRead(e, notify.id)} />
                </Tooltip>
            );
        }
    };

    const timeAgo = (notify: INotify) => {
        return (
            <div className="lh-normal">
                <div className="text-right">
                    <span className="time">{ notify.timeAgo }</span>
                </div>
            </div>
        );
    };

    const renderPmItem = (notify: INotify, content: INotifyPmContent) => {
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
                                <Avatar user={content.sender} size="tiny" />
                            </div>
                            <span className="bold">{props.i18n.newMessage}</span>
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

    const renderChallengeNew = (notify: INotify, content: IChallengeNewContent) => {
        const itemClass = clsx("notification-item", "clearfix", {
            "unread": !notify.read
        });

        return (
            <div className={itemClass} key={notify.id}>
                <div className="heading">
                    <div className="clearfix">
                        <div className="thumbnail-wrapper d24 circular b-white b-a b-white m-t-10 m-r-10">
                            <Avatar user={content.opponent} size="tiny" />
                        </div>
                        <a href={`/${content.id}`} className="text-complete pull-left">
                            <span className="bold">{props.i18n.challengeNew}</span>
                            <span className="fs-12 m-l-10">{content.opponent.display}</span>
                        </a>
                    </div>
                    { timeAgo(notify) }                    
                </div>
                { renderMarkRead(notify) }
            </div>
        );
    };

    const renderChallengeCancel = (notify: INotify, content: IChallengeCancelContent) => {
        const itemClass = clsx("notification-item", "clearfix", {
            "unread": !notify.read
        });

        return (
            <div className={itemClass} key={notify.id}>
                <div className="heading">
                    <div className="clearfix">
                        <div className="thumbnail-wrapper d24 circular b-white b-a b-white m-t-10 m-r-10">
                            <Avatar user={content.opponent} size="tiny" />
                        </div>
                        <span className="text-complete pull-left">
                            <span className="bold">{props.i18n.challengeCancel}</span>
                            <span className="fs-12 m-l-10">{content.opponent.display}</span>
                        </span>
                    </div>
                    { timeAgo(notify) }
                </div>
                { renderMarkRead(notify) }
            </div>
        );
    };

    const renderChallengeDecline = (notify: INotify, content: IChallengeDeclineContent) => {
        const itemClass = clsx("notification-item", "clearfix", {
            "unread": !notify.read
        });

        return (
            <div className={itemClass} key={notify.id}>
                <div className="heading">
                    <div className="clearfix">
                        <div className="thumbnail-wrapper d24 circular b-white b-a b-white m-t-10 m-r-10">
                            <Avatar user={content.opponent} size="tiny" />
                        </div>
                        <span className="text-complete pull-left">
                            <span className="bold">{props.i18n.challengeDecline}</span>
                            <span className="fs-12 m-l-10">{content.opponent.display}</span>
                        </span>
                    </div>
                    { timeAgo(notify) }
                </div>
                { renderMarkRead(notify) }
            </div>
        );
    };

    const renderChallengeAccept = (notify: INotify, content: IChallengeAcceptContent) => {
        const itemClass = clsx("notification-item", "clearfix", {
            "unread": !notify.read
        });

        return (
            <div className={itemClass} key={notify.id}>
                <div className="heading">
                    <div className="clearfix">
                        <div className="thumbnail-wrapper d24 circular b-white b-a b-white m-t-10 m-r-10">
                            <Avatar user={content.opponent} size="tiny" />
                        </div>
                        <a href={`/${content.id}`} className="text-complete pull-left">
                            <span className="bold">{props.i18n.challengeAccept}</span>
                            <span className="fs-12 m-l-10">{content.opponent.display}</span>
                        </a>
                    </div>
                    { timeAgo(notify) }                    
                </div>
                { renderMarkRead(notify) }
            </div>
        );
    };

    const renderJoinAccept = (notify: INotify, content: IJoinAcceptContent) => {
        const itemClass = clsx("notification-item", "clearfix", {
            "unread": !notify.read
        });

        return (
            <div className={itemClass} key={notify.id}>
                <div className="heading">
                    <div className="clearfix">
                        <div className="thumbnail-wrapper d24 circular b-white b-a b-white m-t-10 m-r-10">
                            <Avatar user={content.opponent} size="tiny" />
                        </div>
                        <a href={`/${content.id}`} className="text-complete pull-left">
                            <span className="bold">{props.i18n.joinAccept}</span>
                            <span className="fs-12 m-l-10">{content.opponent.display}</span>
                        </a>
                    </div>
                    { timeAgo(notify) }                    
                </div>
                { renderMarkRead(notify) }
            </div>
        );
    };

    const renderList = () => {
        const items: JSX.Element[] = [];

        notifications.forEach((n) => {
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

    return (
        <></>
    );

    /*
    render() {
        const { props, state, renderList, markReadAll, reloadList } = this;
        const { i18n } = props;
        const { hasEvents, countEvents } = state;

        if (originalTitle) {
            if (hasEvents) {
                document.title = `(${countEvents}) ${originalTitle}`;
            } else {
                document.title = originalTitle;
            }
        }


        // { hasEvents ? (<span className="bubble"></span>) : "" }
        return (
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
        );
    }
    */
}

export const notificationCenter = (props: Props, container: HTMLElement) => {
    const root = createRoot(container);
    root.render(React.createElement(NotificationCenter, props));
};
