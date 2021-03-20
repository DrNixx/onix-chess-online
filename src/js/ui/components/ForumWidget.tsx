import * as React from 'react';
import * as ReactDOM from 'react-dom';
import classNames from 'classnames';
import Scrollbar from "react-scrollbars-custom";
import {Tab, Nav, Fade} from "react-bootstrap";
import { OnixStorage, storage } from '../../storage';
import { UserName } from '../user/UserName';
import { IChessUser } from '../../chess/types/Interfaces';
import { Logger } from '../../common/Logger';


interface IForumMessage {
    forumId: number;
    forumName: string;
    topicId?: number;
    topicName: string;
    msgId: number;
    timeAgo: string;
    poster: IChessUser;
}

type topic = "chatter" | "arena" | "official";
type TabIterator = (key: string) => void;

interface IIdentifiers {
    [key: string]: number[];
}

interface IForumPosts {
    [key: string]: IForumMessage[],
}

interface IForumDiffs {
    [key: string]: number,
}

interface IForumData {
    posts: IForumPosts,
    nextInterval: number
}

export interface IForumWidgetProps {
    language: string;
    apiUrl: string;
    i18n: {
        forums: string,
        tabs: {
            [key: string]: string
        }
    }
}

export interface IForumWidgetState {
    posts: IForumPosts,
    diffs: IForumDiffs,
    loading: boolean,
    fade: boolean
}

export class ForumWidget extends React.Component<IForumWidgetProps, IForumWidgetState> {
    private timeout: number = 0;

    private forumKeyStore: OnixStorage;

    private forumPrevStore: OnixStorage;

    private activeKey: string;

    public static defaultProps: IForumWidgetProps = {
        language: 'ru-ru',
        apiUrl: '/api/forums/widget?c=15',
        i18n: {
            forums: 'Forums',
            tabs: {
                chatter: 'Chatter',
                official: 'Official',
                arena: 'Arena',
            }
        }
    }

    /**
     * constructor
     */
    constructor(props: IForumWidgetProps) {
        super(props);

        this.forumPrevStore = storage.make('dashboard-forum-diff');
        this.forumKeyStore = storage.make('dashboard-forum-tab');
        this.activeKey = this.forumKeyStore.get() || 'chatter';

        this.state = {
            posts: {},
            diffs: {},
            loading: true,
            fade: true
        };

        this.forTabs((key) => {
            this.state.posts[key] = [];
            this.state.diffs[key] = 0;
        });
    }

    componentDidMount() {
        this.fetchForumData();
    }

    private fetchForumData = (withFade: boolean = false) => {
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
                // Read the response as json.
                return response.json();
            })
            .then(function(responseAsJson) {
                that.fetchCallback(responseAsJson);
            })
            .catch(function(error) {
                Logger.error('Looks like there was a problem when reading forums: \n', error);
            });
    };

    private arrayDiff = (a1: number[], a2: number[]) => {
        const diff: number[] = [];
        for (const k1 in a1) {
            let found = false;
            for (const k2 in a2) {
                if (a2[k2] == a1[k1]) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                diff.push(a1[k1]);
            }
        }

        return diff;
    };

    private forTabs = (fn: TabIterator) => {
        Object.keys(this.props.i18n.tabs).forEach(fn);
    };

    private prevStored = () => {
        const empty: IIdentifiers = {};
        
        this.forTabs((key) => {
            empty[key] = [];
        });

        let prev: IIdentifiers;
        const diffStr = this.forumPrevStore.get() || "";
        try {
            prev = diffStr ? JSON.parse(diffStr) : empty;
        } catch (e) {
            prev = empty;
        }

        return prev;
    };

    private fetchCallback = (data: IForumData) => {
        const ids: IIdentifiers = {};
        const diffs: IForumDiffs = {};

        const prev = this.prevStored();

        this.forTabs((key) => {
            ids[key] = [];
            if (data.posts && data.posts[key]) {
                data.posts[key].map(msg => ids[key].push(msg.msgId));
            }

            diffs[key] = this.arrayDiff(ids[key], prev[key]).length;
        });
        
        diffs[this.activeKey] = 0;
        prev[this.activeKey] = ids[this.activeKey];
        this.forumPrevStore.set(JSON.stringify(prev));

        this.setState({
            posts: data.posts,
            diffs: diffs,
            loading: false,
            fade: false
        });

        if (data.nextInterval > 0) {
            this.timeout = setTimeout(this.fetchForumData, data.nextInterval * 1000);
        }
    }

    private clearDiff = (k: string) => {
        let { ...other } = this.state;

        const prev = this.prevStored();
        prev[k] = [];
        other.posts[k].map(msg => prev[k].push(msg.msgId));
        this.forumPrevStore.set(JSON.stringify(prev));

        other.diffs[k] = 0;
        this.setState(other);
    };

    private setKey = (k: string|null) => {
        if (k) {
            this.forumKeyStore.set(k);
            this.activeKey = k;
            this.clearDiff(k);
        }
    };

    private renderLoader = () => {
        const { state } = this;
        if (state.loading && state.fade) {
            return (
                <Fade in={true}>
                    <div className="card-progress"
                         style={{ backgroundColor: 'rgba(255,255,255, 0.5)', display: 'block' }} />
                </Fade>
            );
        }

        return "";
    }

    private renderMessageRow = (message: IForumMessage) => {
        const { language } = this.props;
        const forumLink = `/${language}/forums/forum/${message.forumId}`;
        const postLink = `/${language}/forums/post/${message.msgId}#${message.msgId}`;
        return  (
            <div className="row py-1" key={message.msgId}>
                <div className="col-md-8">
                    <div className="text-nowrap text-truncate">
                        <a href={forumLink}
                           className="font-weight-bold pr-1">{message.forumName}:</a>
                        <a href={postLink}
                           className="font-weight-normal pr-1">{message.topicName}</a>
                    </div>
                    <time className="d-block small">{message.timeAgo}</time>
                </div>
                <div className="col-md-4">
                    <div>
                        <UserName user={message.poster} size={'Tiny'} compact={true} />
                    </div>
                </div>
            </div>
        );
    };

    private renderForumBlock = (messages: IForumMessage[]) => {
        const rows: JSX.Element[] = [];

        messages.forEach((item) => {
            rows.push(this.renderMessageRow(item));
        });

        return rows;
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

    private renderDiff = (key: string, activeKey: string, diff: number) => {
        if (diff > 0) {
            if (key != activeKey) {
                return (
                    <span className="ml-2">{diff}</span>
                );
            }
        }

        return null;
    };

    private refreshClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!this.state.loading) {
            this.fetchForumData(true);
        }
    }

    private renderTabs = () => {
        const { props, state, activeKey, renderDiff } = this;
        const { tabs } = props.i18n;

        return Object.keys(tabs).map((key) => {
            return (
                <Nav.Item key={key}>
                    <Nav.Link eventKey={key}>{tabs[key]}{renderDiff(key, activeKey, state.diffs[key])}</Nav.Link>
                </Nav.Item>
            );
        });
    };

    private renderPanes = () => {
        const { props, state, renderForumBlock } = this;
        const { tabs } = props.i18n;

        return Object.keys(tabs).map((key) => {
            return (
                <Tab.Pane key={key} eventKey={key} className="w-100 h-100">
                    <Scrollbar trackYProps={{style: {width: 5}}}>
                        <div className="container striped">
                            {renderForumBlock(state.posts[key])}
                        </div>
                    </Scrollbar>
                </Tab.Pane>
            );
        });
    };

    render() {
        const { state, props, activeKey, renderRefreshIcon, refreshClick, renderTabs, renderPanes } = this;
        const { forums } = props.i18n;

        const refrechClass = classNames([
            'card-refresh',
            {
                'refreshing': state.loading
            }
        ]);

        return (
            <div className="widget-body card no-border no-shadow full-height no-margin widget-loader-circle-lg">
                <div className="card-header reset-min-height">
                    <div className="card-title">
                        <a href={`/${props.language}/forums`}><i className="xi-forum-o text-orange pr-2" />{forums}</a>
                    </div>
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
                </div>
                <div className="card-body p-0 h-100 w-100 d-flex flex-column">
                    <Tab.Container id="forum-widget" defaultActiveKey={activeKey} onSelect={this.setKey}>
                        <Nav variant="tabs" className="nav-tabs-linetriangle d-flex">
                            { renderTabs() }
                        </Nav>
                        <Tab.Content className="px-0 flex-grow-1">
                            { renderPanes() }
                        </Tab.Content>
                    </Tab.Container>
                </div>
                {this.renderLoader()}
            </div>
        );
    }
}

export const forumWidget = (props: IForumWidgetProps, container: HTMLElement) => {
    ReactDOM.render(React.createElement(ForumWidget, props), container);
};
