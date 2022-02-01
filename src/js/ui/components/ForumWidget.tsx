import React, {useState} from 'react';
import * as ReactDOM from 'react-dom';
import clsx from "clsx";
import Scrollbar from "react-scrollbars-custom";
import { storage } from '../../storage';
import { UserName } from '../user/UserName';
import { IChessUser } from '../../chess/types/Interfaces';
import { Logger } from '../../common/Logger';
import Fade from "@mui/material/Fade";
import TabContext from "@mui/lab/TabContext";
import Box from "@mui/material/Box";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";


interface IForumMessage {
    forumId: number;
    forumName: string;
    topicId?: number;
    topicName: string;
    msgId: number;
    timeAgo: string;
    poster: IChessUser;
}

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

type ForumWidgetProps = {
    language: string;
    apiUrl: string;
    i18n: {
        forums: string,
        tabs: {
            [key: string]: string
        }
    }
}

const ForumWidget: React.VFC<ForumWidgetProps> = (props) => {
    const {language, apiUrl, i18n} = props;

    const forumPrevStore = storage.make('dashboard-forum-diff');
    const forumKeyStore = storage.make('dashboard-forum-tab');

    const [activeKey, setActiveKey] = useState(forumKeyStore.get() || 'chatter');
    const [loading, setLoading] = useState(false);
    const [fade, setFade] = useState(false);
    const [posts, setPosts] = useState<IForumPosts>({});
    const [diffs, setDiffs] = useState<IForumDiffs>({});

    let timeout = 0;

    const arrayDiff = (a1: number[], a2: number[]) => {
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

    const forTabs = (fn: TabIterator) => {
        Object.keys(i18n.tabs).forEach(fn);
    };

    const prevStored = () => {
        const empty: IIdentifiers = {};

        forTabs((key) => {
            empty[key] = [];
        });

        let prev: IIdentifiers;
        const diffStr = forumPrevStore.get() || "";
        try {
            prev = diffStr ? JSON.parse(diffStr) : empty;
        } catch (e) {
            prev = empty;
        }

        return prev;
    };

    const clearDiff = (k: string) => {
        const prev = prevStored();
        prev[k] = [];
        posts[k].map(msg => prev[k].push(msg.msgId));
        forumPrevStore.set(JSON.stringify(prev));
        diffs[k] = 0;
        setPosts({...posts});
        setDiffs({...diffs});
    };

    const fetchCallback = (data: IForumData) => {
        const ids: IIdentifiers = {};
        const diffs: IForumDiffs = {};

        const prev = prevStored();

        forTabs((key) => {
            ids[key] = [];
            if (data.posts && data.posts[key]) {
                data.posts[key].map(msg => ids[key].push(msg.msgId));
            }

            diffs[key] = arrayDiff(ids[key], prev[key]).length;
        });

        diffs[activeKey] = 0;
        prev[activeKey] = ids[activeKey];
        forumPrevStore.set(JSON.stringify(prev));

        setPosts(data.posts);
        setDiffs(diffs);
        setLoading(false);
        setFade(false);

        if (data.nextInterval > 0) {
            timeout = window.setTimeout(fetchForumData, data.nextInterval * 1000);
        }
    }

    const fetchForumData = (withFade: boolean = false) => {
        if (timeout) {
            clearTimeout(timeout)
        }

        setLoading(true);
        if (!fade && withFade) {
            setFade(true);
        }

        fetch(apiUrl, {mode: "cors"})
            .then(function(response) {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                // Read the response as json.
                return response.json();
            })
            .then(function(responseAsJson) {
                fetchCallback(responseAsJson);
            })
            .catch(function(error) {
                Logger.error('Looks like there was a problem when reading forums: \n', error);
            });
    };


    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        if (newValue) {
            forumKeyStore.set(newValue);
            setActiveKey(newValue);
            clearDiff(newValue);
        }
    };

    const renderLoader = React.useCallback(
        () => {
            return (loading && fade) ? (
                <Fade in={true}>
                    <div className="card-progress"
                         style={{ backgroundColor: 'rgba(255,255,255, 0.5)', display: 'block' }} />
                </Fade>
            ): null;
        },
        [loading, fade]
    );

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
            fetchForumData(true);
        }
    }

    const refrechClass = clsx([
        'card-refresh',
        {
            'refreshing': loading
        }
    ]);

    const renderDiff = (key: string, activeKey: string, diff: number) => {
        if (diff > 0) {
            if (key != activeKey) {
                return (
                    <span className="ms-2">{diff}</span>
                );
            }
        }

        return null;
    };

    const renderTabs = () => {
        return Object.keys(i18n.tabs).map((key) => {
            return (
                <Tab label={i18n.tabs[key] + renderDiff(key, activeKey, diffs[key])} value={key} />
            );
        });
    };

    const renderMessageRow = (message: IForumMessage) => {
        const forumLink = `/${language}/forums/forum/${message.forumId}`;
        const postLink = `/${language}/forums/post/${message.msgId}#${message.msgId}`;
        return  (
            <div className="row py-1" key={message.msgId}>
                <div className="col-md-8">
                    <div className="text-nowrap text-truncate">
                        <a href={forumLink}
                           className="font-weight-bold pe-1">{message.forumName}:</a>
                        <a href={postLink}
                           className="font-weight-normal pe-1">{message.topicName}</a>
                    </div>
                    <time className="d-block small">{message.timeAgo}</time>
                </div>
                <div className="col-md-4">
                    <div>
                        <UserName user={message.poster} size={'Tiny'} compact={false} />
                    </div>
                </div>
            </div>
        );
    };

    const renderForumBlock = (messages: IForumMessage[]) => {
        const rows: JSX.Element[] = [];

        messages.forEach((item) => {
            rows.push(renderMessageRow(item));
        });

        return rows;
    }

    const renderPanes = () => {
        return Object.keys(i18n.tabs).map((key) => {
            return (
                <TabPanel value={key} className="w-100 h-100">
                    <Scrollbar trackYProps={{style: {width: 5}}}>
                        <div className="container striped">
                            {renderForumBlock(posts[key])}
                        </div>
                    </Scrollbar>
                </TabPanel>
            );
        });
    };

    return (
        <div className="widget-body card no-border no-shadow full-height no-margin widget-loader-circle-lg">
            <div className="card-header reset-min-height">
                <div className="card-title">
                    <a href={`/${props.language}/forums`}><i className="xi-forum-o text-orange pe-2" />{i18n.forums}</a>
                </div>
                <div className="card-controls">
                    <ul>
                        <li>
                            <a href={`/${props.language}`}
                               className={refrechClass}
                               data-toggle="refresh"
                               onClick={refreshClick}>
                               {renderRefreshIcon()}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="card-body p-0 h-100 w-100 d-flex flex-column">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={activeKey}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleTabChange}>
                                { renderTabs() }
                            </TabList>
                        </Box>
                        { renderPanes() }
                    </TabContext>
                </Box>
            </div>
            {renderLoader()}
        </div>
    );
};

ForumWidget.defaultProps = {
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
};

export const forumWidget = (props: ForumWidgetProps, container: HTMLElement) => {
    ReactDOM.render(React.createElement(ForumWidget, props), container);
};
