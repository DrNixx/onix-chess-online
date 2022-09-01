import React, {useState, useEffect} from 'react';
import * as ReactDOM from 'react-dom';
import clsx from "clsx";

import { styled, ThemeProvider } from '@mui/material/styles';

import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import Scrollbar from "react-scrollbars-custom";
import { storage } from '../../storage';
import { IChessUser } from '../../chess/types/Interfaces';
import { Logger } from '../../common/Logger';
import {ChessTheme} from "../ChessTheme";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import IconButton from '@mui/material/IconButton';
import UserBadge from "../user/UserBadge";


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

    useEffect(() => {
        if (!loading) {
            fetchForumData(true);
        }

    }, []);


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

    const tabLabel = (text: string, counter: React.ReactNode) => {
        return (
            <>{text} {counter}</>
        );
    };

    const renderTabs = () => {
        return Object.keys(i18n.tabs).map((key) => {
            return (
                <Tab key={key} label={tabLabel(i18n.tabs[key], renderDiff(key, activeKey, diffs[key]))} value={key} />
            );
        });
    };

    const StripedListItem = styled(ListItem)(({ theme }) => ({
        paddingTop: 0,
        paddingBottom: 0,
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        }
    }));

    const renderMessageRow = (message: IForumMessage) => {
        const forumLink = `/${language}/forums/forum/${message.forumId}`;
        const postLink = `/${language}/forums/post/${message.msgId}#${message.msgId}`;
        return  (
            <StripedListItem key={message.msgId}>
                <ListItemText>
                    <Grid container spacing={2}>
                        <Grid item md={8}>
                            <div className="text-nowrap text-truncate">
                                <a href={forumLink}
                                   className="fw-bold pe-1">{message.forumName}:</a>
                                <a href={postLink}
                                   className="fw-normal pe-1">{message.topicName}</a>
                            </div>
                            <time className="d-block small">{message.timeAgo}</time>
                        </Grid>
                        <Grid item md={4}>
                            <div>
                                <UserBadge user={message.poster} size='small' compact={true} />
                            </div>
                        </Grid>
                    </Grid>
                </ListItemText>
            </StripedListItem>
        );
    };

    const renderForumBlock = (messages?: IForumMessage[]) => {
        const rows: JSX.Element[] = [];

        messages && messages.forEach((item) => {
            rows.push(renderMessageRow(item));
        });

        return rows;
    }

    const renderPanes = () => {
        return Object.keys(i18n.tabs).map((key) => {
            return (
                <TabPanel key={key} value={key} sx={{flexGrow: 1, width: "100%", p: 0}}>
                    <Scrollbar trackYProps={{style: {width: 5}}}>
                        <List>
                            {renderForumBlock(posts[key])}
                        </List>
                    </Scrollbar>
                </TabPanel>
            );
        });
    };

    return (
        <ThemeProvider theme={ChessTheme}>
            <Card variant="outlined"
                  className="widget-body"
                  sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%"
                  }}
            >
                <CardHeader
                    disableTypography
                    action={
                        <IconButton aria-label="refresh" onClick={refreshClick}>
                            {renderRefreshIcon()}
                        </IconButton>
                    }
                    title={
                        <a className="title" href={`/${props.language}/forums`}><i className="xi-forum-o text-orange pe-2" />{i18n.forums}</a>
                    }
                    sx={{ paddingBottom: 0 }}
                />
                <CardContent sx={{flexGrow: 1, p: 0}}>
                    <Box display="flex" flexDirection="column" sx={{ width: "100%", height: "100%", typography: 'body1' }}>
                        <TabContext value={activeKey}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleTabChange}
                                         variant="scrollable"
                                         scrollButtons="auto">
                                    { renderTabs() }
                                </TabList>
                            </Box>
                            { renderPanes() }
                        </TabContext>
                    </Box>
                    {renderLoader()}
                </CardContent>
            </Card>
        </ThemeProvider>
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
