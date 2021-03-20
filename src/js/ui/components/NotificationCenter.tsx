import * as React from 'react';
import * as ReactDOM from 'react-dom';
import classNames from 'classnames';
import { notify } from 'pages-ts';
import { appInstance } from '../../app/IApplication';
import { IUser } from '../../app/IUser';
import { Avatar } from '../user/Avatar';
import { CSSTransition } from 'react-transition-group';
import { Logger } from '../../common/Logger';
import { Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Scrollbar } from 'react-scrollbars-custom';

export interface INotify {
    id: string,
    read: boolean,
    ago: number,
    timeAgo: string,
    content?: INotifyContent | INotifyPmContent | INotifyMoveContent,
}

export interface INotifyContent {
    type: string;
}

export interface INotifyPmContent extends INotifyContent
{
    sender: IUser;

    id: number;

    subject: string;

    text: string;
}

export interface INotifyMoveContent extends INotifyContent
{
    id: number;

    opponent: IUser;

    san: string;
}

export interface NotificationCenterProps {
    language: string;
    apiUrl: string,
    i18n: {
        readAll: string,
        newMessage: string,
        markRead: string,
    }
}

export interface NotificationCenterState {
    hasEvents: boolean,
    notifications: INotify[]
    details: Map<string, boolean>
}

export class NotificationCenter extends React.Component<NotificationCenterProps, NotificationCenterState> {
    public static defaultProps: NotificationCenterProps = {
        language: 'ru-ru',
        apiUrl: '/api/notify/notify-center',
        i18n: {
            readAll: 'Mark all as read',
            newMessage: 'New message',
            markRead: 'Mark as read'
        }
    }

    constructor(props: NotificationCenterProps) {
        super(props);

        this.state = {
            hasEvents: false,
            notifications: [],
            details: new Map<string, boolean>(),
        };
    }

    componentDidMount() {
        Logger.debug('Notification mount');
        const that = this;
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
        fetch(this.props.apiUrl, {method: "DELETE"}).then(() => {});
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
        state.hasEvents = data.filter((n) => !n.read).length > 0;

        this.setState(state);
    }

    private toggleDetail = (e: React.MouseEvent, id: string) => {
        e.preventDefault();

        const { ...state } = this.state;
        state.details.set(id, !state.details.get(id));

        this.setState(state);
    };

    private renderPmItem = (notify: INotify, content: INotifyPmContent) => {
        const { props, state, toggleDetail } = this;
        const { i18n } = props;
        const { details } = state;

        const renderMarkRead = () => {
            if (notify.read) {
                return (<div className="option"><span className="mark"></span></div>);
            } else {
                return (
                    <OverlayTrigger placement="right" overlay={<Tooltip id={`notify-tooltip-${notify.id}`}>{i18n.markRead}</Tooltip>}>
                        <div className="option" data-toggle="tooltip" data-placement="left" title={i18n.markRead}>
                            <a href="#" className="mark" onClick={(e) => this.markRead(e, notify.id)}></a>
                        </div>
                    </OverlayTrigger>
                );
            }
        };

        const itemClass = classNames("notification-item", "clearfix", {
            "unread": !notify.read
        });

        const detailVisible = !!details.get(notify.id);
        const headingClass = classNames("heading", { "open": detailVisible });

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
                                <div><i className="fa fa-angle-left"></i></div>
                            </div>
                        </div>
                    </div>
                    <div className="lh-normal">
                        <div className="text-right">
                            <span className="time">{ notify.timeAgo }</span>
                        </div>
                    </div>

                    <CSSTransition in={detailVisible} classNames="slide-down" timeout={500}>
                        <div className="more-details">
                            <div className="more-details-inner">
                                <h5 className="semi-bold fs-16">{ content.subject }</h5>
                                <p className="small hint-text">{ content.text }</p>
                            </div>
                        </div>
                    </CSSTransition>
                </div>
                { renderMarkRead() }
            </div>
        );
    };

    private renderList = () => {
        const { state, renderPmItem } = this;

        const items: JSX.Element[] = [];

        state.notifications.forEach((n) => {
            if (n.content) {
                if (n.content.type == "privateMessage") {
                    items.push(renderPmItem(n, n.content as INotifyPmContent))
                } else if (n.content.type == "gameMove") {
    
                }
            }
        });
        
        return items;
    };

    render() {
        const { props, state, renderList, markReadAll, reloadList } = this;
        const { i18n } = props;
        const { hasEvents } = state;

        return (
            <Dropdown>
                <Dropdown.Toggle as="a" href="#" className="header-icon btn-icon-link" bsPrefix="notification">
                    <i className="pg-icon">world</i>
                    { hasEvents ? (<span className="bubble"></span>) : "" }
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
}

export const notificationCenter = (props: NotificationCenterProps, container: HTMLElement) => {
    ReactDOM.render(React.createElement(NotificationCenter, props), container);
};
