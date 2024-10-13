import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import clsx from "clsx";
import Tooltip from '@mui/material/Tooltip';
import { CSSTransition } from 'react-transition-group';
import Popover from '@mui/material/Popover';
import { usePopupState, bindTrigger, bindPopover } from 'material-ui-popup-state/hooks';

import { notify } from '../app/AppNotify';
import Avatar from './user/Avatar';
import {
    IChallengeAcceptContent,
    IChallengeCancelContent,
    IChallengeDeclineContent,
    IChallengeNewContent,
    IJoinAcceptContent,
    INotify,
    INotifyPmContent
} from '../notifications/Interfaces';

import {NotificationCenterProps} from "./NotificationCenterProps";
import {defaultOf} from "../utils/propsUtils";
import {useDefaults} from "../hooks/useDefaults";
import {CentrifugeContext} from "../providers/CentrifugeProvider";
import {AuthContext} from "../providers/AuthProvider";
import {useApi} from "../hooks/useApi";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import NotificationIcon from '@mui/icons-material/Notifications';
import ReloadIcon from '@mui/icons-material/PublishedWithChanges';

type propsWithDefaults = 'language' | 'apiUrl' | 'i18n';
const defaultProps: defaultOf<NotificationCenterProps, propsWithDefaults> = {
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

const NotificationCenterComponent: React.FC<NotificationCenterProps> = (propsIn) => {
    const props = useDefaults(propsIn, defaultProps);

    const { isAuthenticated } = useContext(AuthContext);
    const { lastNotify } = useContext(CentrifugeContext);
    const { apiUrl } = props;

    const originalTitle = useMemo(() => document.title, []);
    const [countEvents, setCountEvents] = useState(0);
    const [notifications, setNotifications] = useState<INotify[]>([]);
    const [details, setDetails] = useState(new Map<string, boolean>());

    const { apiGet, apiHead, apiDelete } = useApi();

    const popupState = usePopupState({
        variant: 'popover',
        popupId: 'notification-center',
    });

    const fetchNotifyData = useCallback(() => {
        apiGet<INotify[]>(apiUrl)
            .then((data) => {
                setNotifications(data.model ?? []);
                setCountEvents(data.total ?? 0);
            })
            .catch(function (error) {
                console.error(error);
            });
    }, [apiGet, apiUrl]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchNotifyData();
        }
    }, [fetchNotifyData, isAuthenticated]);

    const hasEvents = useCallback(() => {
        return countEvents > 0;
    }, [countEvents]);

    useEffect(() => {
        if (hasEvents()) {
            document.title = `(${countEvents}) ${originalTitle}`;
        } else {
            document.title = originalTitle;
        }
    }, [countEvents, hasEvents, originalTitle]);

    useEffect(() => {
        if (lastNotify && lastNotify) {
            notify('Новое событие', {'variant': 'info'});
            fetchNotifyData();
        }
    }, [fetchNotifyData, lastNotify]);

    const markRead = useCallback(
        (id: string, callback?: () => void) => {
            apiHead(`${apiUrl}/${id}`)
                .then(() => {
                    if (callback) {
                        callback();
                    } else {
                        fetchNotifyData();
                    }
                })
                .catch(function (error) {
                    console.error(error);
                });
        },
        [apiHead, apiUrl, fetchNotifyData],
    );

    const markReadAll = useCallback(() => {
        apiDelete(apiUrl)
            .then(() => {
                popupState.close();
                fetchNotifyData();
            })
            .catch(function (error) {
                console.error(error);
            });
    }, [apiDelete, apiUrl, popupState, fetchNotifyData]);

    const reloadList = useCallback(() => {
        fetchNotifyData();
    }, [fetchNotifyData]);

    const toggleDetail = useCallback((id: string) => {
        setDetails((map) => new Map(map.set(id, !map.get(id))));
    }, []);

    const renderMarkRead = useCallback(
        (notify: INotify) => {
            if (notify.read) {
                return (
                    <div className="option">
                        <span className="mark" />
                    </div>
                );
            } else {
                return (
                    <div className="option">
                        <Tooltip title={props.i18n.markRead}>
                            <a
                                href="#"
                                className="mark"
                                onClick={(e) => {
                                    e.preventDefault();
                                    markRead(notify.id);
                                }}
                            />
                        </Tooltip>
                    </div>
                );
            }
        },
        [markRead, props.i18n.markRead],
    );

    const timeAgo = useCallback((notify: INotify) => {
        return (
            <div className="text-end">
                <span className="time">{notify.timeAgo}</span>
            </div>
        );
    }, []);

    const renderPmItem = useCallback((notify: INotify, content: INotifyPmContent) => {
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
                            <div className="thumbnail-wrapper d16 circular inline m-t-15 m-r-10" onClick={() => toggleDetail(notify.id)}>
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
    }, [details, props.i18n.newMessage, renderMarkRead, timeAgo, toggleDetail]);

    const renderChallengeNew = useCallback((notify: INotify, content: IChallengeNewContent) => {
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
    }, [props.i18n.challengeNew, renderMarkRead, timeAgo]);

    const renderChallengeCancel = useCallback((notify: INotify, content: IChallengeCancelContent) => {
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
    }, [props.i18n.challengeCancel, renderMarkRead, timeAgo]);

    const renderChallengeDecline = useCallback((notify: INotify, content: IChallengeDeclineContent) => {
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
    }, [props.i18n.challengeDecline, renderMarkRead, timeAgo]);

    const renderChallengeAccept = useCallback((notify: INotify, content: IChallengeAcceptContent) => {
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
    }, [props.i18n.challengeAccept, renderMarkRead, timeAgo]);

    const renderJoinAccept = useCallback((notify: INotify, content: IJoinAcceptContent) => {
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
    }, [props.i18n.joinAccept, renderMarkRead, timeAgo]);

    const renderList = useCallback(() => {
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
                    console.log('move');
                }
            }
        });
        
        return items;
    }, [notifications, renderChallengeAccept, renderChallengeCancel, renderChallengeDecline, renderChallengeNew, renderJoinAccept, renderPmItem]);

    const render = useCallback(() => {
        return (
            <div className="notification-center">
                <IconButton {...bindTrigger(popupState)} className={hasEvents() ? 'active' : ''}>
                    <NotificationIcon />
                </IconButton>
                <Popover
                    {...bindPopover(popupState)}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <Box sx={{ width: { md: 400 } }} className="notification-panel">
                        <div className="notification-body" style={{ maxHeight: '75vh', minHeight: 100 }}>
                            {renderList()}
                        </div>

                        <div className="notification-footer text-center">
                            <Button variant="text" size="small" onClick={() => markReadAll()}>
                                { props.i18n.readAll }
                            </Button>
                            <IconButton className={'float-end'} size={'medium'} onClick={() => reloadList()}>
                                <ReloadIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                        </div>
                    </Box>
                </Popover>
            </div>
        );
    }, [hasEvents, markReadAll, popupState, props.i18n.readAll, reloadList, renderList]);

    return render();
}

export default NotificationCenterComponent;
