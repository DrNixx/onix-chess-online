import * as React from 'react';
import * as ReactDOM from 'react-dom';
import classNames from 'classnames';
import Scrollbar from "react-scrollbars-custom";
import {Tab, Nav, Fade} from "react-bootstrap";
import { OnixStorage, storage } from '../../storage';
import { UserName } from '../user/UserName';
import { IChessUser } from '../../chess/types/Interfaces';


interface IForumMessage {
    forumId: number;
    forumName: string;
    topicId?: number;
    topicName: string;
    msgId: number;
    timeAgo: string;
    poster: IChessUser;
}

interface IForumData {
    chatter: IForumMessage[],
    official: IForumMessage[],
    nextInterval: number
}

export interface IForumWidgetProps {
    language: string;
    apiUrl: string;
    i18n: {
        forums: string,
        chatters: string,
        official: string,
    }
}

export interface IForumWidgetState {
    chatter: IForumMessage[],
    chatterDiff: number,
    official: IForumMessage[],
    officialDiff:  number,
    loading: boolean,
    fade: boolean
}

export class ForumWidget extends React.Component<IForumWidgetProps, IForumWidgetState> {
    private timeout: number = 0;

    private forumKeyStore: OnixStorage;

    private forumPrevStore?: OnixStorage;

    private activeKey: string;

    public static defaultProps: IForumWidgetProps = {
        language: 'ru-ru',
        apiUrl: '/api/forums/widget?c=15',
        i18n: {
            forums: 'Forums',
            chatters: 'Chatter',
            official: 'Official',
        }
    }

    /**
     * constructor
     */
    constructor(props: IForumWidgetProps) {
        super(props);

        this.forumKeyStore = storage.make('forum-widget-tab');
        this.activeKey = this.forumKeyStore.get() || 'chatter';

        this.state = {
            chatter: [],
            chatterDiff: 0,
            official: [],
            officialDiff: 0,
            loading: true,
            fade: true
        };
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
            loading: true,
            fade: fade || withFade,
            ...other
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
                console.log('Looks like there was a problem when reading openings: \n', error);
            });
    };

    private arrayDiff = (a1: number[], a2: number[]) => {
        const diff = [];
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

    private fetchCallback = (data: IForumData) => {

        const chatter: number[] = [];
        const official: number[] = [];

        data.chatter.map(msg => chatter.push(msg.msgId));
        data.official.map(msg => official.push(msg.msgId));

        this.forumPrevStore = storage.make('forum-widget-diff');
        const diffStr = this.forumPrevStore.get() || "";
        let prev;
        try {
            prev = diffStr ? JSON.parse(diffStr) : {
                chatter: [],
                official: [],
            };
        } catch (e) {
            prev = {
                chatter: [],
                official: [],
            };
        }

        const diff = {
            chatter: 0,
            official: 0
        };

        diff.chatter = this.arrayDiff(chatter, prev.chatter).length;
        diff.official = this.arrayDiff(official, prev.official).length;

        switch (this.activeKey) {
            case "chatter":
                diff.chatter = 0;
                this.forumPrevStore.set(JSON.stringify({
                    chatter: chatter,
                    official: prev.official
                }));
                break;
            case "official":
                diff.official = 0;
                this.forumPrevStore.set(JSON.stringify({
                    chatter: prev.chatter,
                    official: official
                }));
                break;
        }

        this.setState({
            chatter: data.chatter,
            chatterDiff: diff.chatter,
            official: data.official,
            officialDiff: diff.official,
            loading: false,
            fade: false
        });

        if (data.nextInterval > 0) {
            this.timeout = setTimeout(this.fetchForumData, data.nextInterval * 1000);
        }
    }

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

    private renderForumBlock(messages: IForumMessage[]) {
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

    private clearDiff = (k:string) => {
        let { chatterDiff, officialDiff, ...other } = this.state;

        switch (k) {
            case "chatter":
                chatterDiff = 0;
                break;
            case "official":
                officialDiff = 0;
                break;
        }

        this.setState({
            chatterDiff: chatterDiff,
            officialDiff: officialDiff,
            ...other
        });
    };

    private setKey = (k: string|null) => {
        if (k) {
            this.forumKeyStore.set(k);
            this.activeKey = k;
            this.clearDiff(k);
        }
    };

    private refreshClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!this.state.loading) {
            this.fetchForumData(true);
        }
    }

    render() {
        const { state, props, activeKey, renderRefreshIcon, refreshClick, renderDiff } = this;
        const { forums, chatters, official } = props.i18n;

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
                            <Nav.Item>
                                <Nav.Link eventKey="chatter">{chatters}{renderDiff('chatter', activeKey, state.chatterDiff)}</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="official">{official}{renderDiff('official', activeKey, state.officialDiff)}</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Tab.Content className="px-0 flex-grow-1">
                            <Tab.Pane eventKey="chatter" className="w-100 h-100">
                                <Scrollbar>
                                    <div className="container striped">
                                        {this.renderForumBlock(state.chatter)}
                                    </div>
                                </Scrollbar>
                            </Tab.Pane>
                            <Tab.Pane eventKey="official" className="w-100 h-100">
                                <Scrollbar>
                                    <div className="container striped">
                                        {this.renderForumBlock(state.official)}
                                    </div>
                                </Scrollbar>
                            </Tab.Pane>
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
