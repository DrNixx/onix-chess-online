import React, {useState, useEffect, useCallback, useRef, useMemo} from 'react';

import { styled, ThemeProvider } from '@mui/material/styles';

import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import Scrollbar from "react-scrollbars-custom";
import { storage } from '../../storage';
import { IChessUser } from '../../chess/types/Interfaces';
import {ChessTheme} from "../../ui/ChessTheme";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import IconButton from '@mui/material/IconButton';
import UserBadge from "../user/UserBadge";
import {ForumWidgetProps} from "./ForumWidgetProps";
import {defaultOf} from "../../utils/propsUtils";
import {useDefaults} from "../../hooks/useDefaults";
import {useApi} from "../../hooks/useApi";


interface IForumMessage {
    forumId: number;
    forumName: string;
    topicId?: number;
    topicName: string;
    msgId: number;
    timeAgo: string;
    poster: IChessUser;
}

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

type propsWithDefaults = 'language' | 'apiUrl' | 'i18n';
const defaultProps: defaultOf<ForumWidgetProps, propsWithDefaults> = {
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

const forumPrevStore = storage.makeObject<IIdentifiers>('dashboard-forum-diff');
const forumKeyStore = storage.make('dashboard-forum-tab');

const ForumWidgetComponent: React.FC<ForumWidgetProps> = (propsIn) => {
    const props = useDefaults(propsIn, defaultProps);
    const {language, apiUrl, i18n} = props;

    const [posts, setPosts] = useState<IForumPosts>({});
    const tabs = useMemo(() => Object.keys(i18n.tabs), [i18n.tabs]);
    const empty = useMemo(() => {
        const result: IIdentifiers = {};
        tabs.forEach((key) => {
            result[key] = [];
        });

        return result;
    }, [tabs]);
    const [diffs, setDiffs] = useState<IForumDiffs>(() => {
        const result: IForumDiffs = {};
        tabs.forEach((key) => {
            result[key] = 0;
        });

        return result;
    });

    const [activeKey, setActiveKey] = useState(forumKeyStore.get('chatter'));
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [fade, setFade] = useState(false);
    const timeout = useRef(0);

    const { apiGet } = useApi();

    const fetchForumData = useCallback((withFade = false) => {
        if (timeout.current) {
            clearTimeout(timeout.current);
            timeout.current = 0;
        }

        setLoading(true);
        if (withFade) {
            setFade(true);
        }

        apiGet<IForumData>(apiUrl)
            .then(function(data) {
                setLoaded(true);
                if (data.model) {
                    setPosts(data.model.posts);
                    setFade(false);
                    setLoading(false)
                    if (data.model.nextInterval > 0) {
                        timeout.current = window.setTimeout(fetchForumData, data.model.nextInterval * 1000);
                    }
                }
            })
            .catch(function(error) {
                console.error('Looks like there was a problem when reading forums: \n', error);
            });
    }, [apiGet, apiUrl]);

    useEffect(() => {
        if (!loaded && !loading) {
            fetchForumData(true);
        }
    }, [fetchForumData, loaded, loading]);

    useEffect(() => {
        if (posts[activeKey]?.length) {
            const ps = forumPrevStore.get({...empty});
            ps[activeKey] = posts[activeKey].map((msg) => msg.msgId).sort() ?? [];
            setDiffs((prev) => {
                prev[activeKey] = 0;
                return {...prev};
            });
            forumPrevStore.set(ps);
        }
    }, [activeKey, empty, posts]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
        if (newValue) {
            forumKeyStore.set(newValue);
            setActiveKey(newValue);
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
                        <Grid size={{ md: 8 }}>
                            <div className="text-nowrap text-truncate">
                                <a href={forumLink}
                                   className="fw-bold pe-1">{message.forumName}:</a>
                                <a href={postLink}
                                   className="fw-normal pe-1">{message.topicName}</a>
                            </div>
                            <time className="d-block small">{message.timeAgo}</time>
                        </Grid>
                        <Grid size={{ md: 4 }}>
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

        if (messages) {
            messages.forEach((item) => {
                rows.push(renderMessageRow(item));
            });
        }

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
                        <a className="title" href={`/${language}/forums`}><i className="xi-forum-o text-orange pe-2" />{i18n.forums}</a>
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

export default ForumWidgetComponent;