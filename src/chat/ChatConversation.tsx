import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';

import { TransitionGroup } from 'react-transition-group';
import { useTheme } from '@mui/material/styles';

import CircularProgress from '@mui/material/CircularProgress';
import Fade from '@mui/material/Fade';

import { IChatMessage, IChatResponse, IChatRoom, IChatSection, isChatAction, isChatMessage } from '../models/Chat';
import ChatSection from './ChatSection';
import { useRoom } from '../hooks/useRoom';
import InfinityScroller, { InfinityScrollerRef } from '../components/InfinityScroller';
import { useApi } from '../hooks/useApi';
import { ModelMetaNav } from '../models/ApiTypes';
import {AuthContext} from "../providers/AuthProvider";

type Props = {
    room: IChatRoom;
};

const ChatConversation: React.FC<Props> = ({ room }) => {
    const { getUserId } = useContext(AuthContext);
    const userId = useMemo(() => {
        return getUserId();
    }, [getUserId]);

    const theme = useTheme();
    const scrollerRef = useRef<InfinityScrollerRef | null>(null);
    const [scrollTo, setScrollTo] = useState<string | false | undefined>(undefined);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [messages, setMessages] = useState<IChatMessage[]>([]);
    const { apiGet } = useApi();
    const { message: lastChat } = useRoom(room.id);
    const metaPrev = useRef<ModelMetaNav | null>(null);

    const getLastUnread = useCallback(() => {
        const notMyUnreads = messages.filter((m) => m.sender?.id != userId).filter((m) => !m.readByMe);

        return notMyUnreads.length > 0 ? notMyUnreads[notMyUnreads.length - 1] : undefined;
    }, [messages, userId]);

    const getLastAny = useCallback(() => {
        return messages.length > 0 ? messages[0] : undefined;
    }, [messages]);

    const getLast = useCallback(() => {
        return getLastUnread() ?? getLastAny();
    }, [getLastAny, getLastUnread]);

    const readMessages = useCallback(async () => {
        const apiUrl = process.env.NODE_ENV == 'production' ? '' : import.meta.env.VITE_API_URL ?? '';
        let url = `${apiUrl}/api/chat/@` + btoa(room.id);

        if (metaPrev.current) {
            const meta = metaPrev.current;
            url += `?affix=${meta.affix}&id=${meta.id}&sentAt=${meta?.time}`;
        }

        return apiGet<IChatResponse>(url).then((result) => {
            metaPrev.current = result.model?.meta.prev ?? null;
            const metaCurrent = result.model?.meta.current ?? null;
            setHasMoreData(!!metaPrev.current && !!metaCurrent && metaCurrent.limit === metaCurrent.count);
            if (result.model?.messages) {
                const newMessages = result.model.messages;
                setMessages((m) => [...m, ...newMessages]);
            }
        });
    }, [apiGet, room.id]);

    useEffect(() => {
        readMessages().then();
    }, [readMessages]);

    const scrollToMessage = useCallback((msg?: string) => {
        if (msg) {
            const el = document.getElementById(msg);
            scrollerRef.current?.scrollToView(el);
            setScrollTo(false);
        }
    }, []);

    useEffect(() => {
        if (typeof scrollTo === 'string') {
            scrollToMessage(scrollTo);
        } else if (scrollTo === undefined) {
            scrollToMessage(getLast()?.id);
        }
    }, [getLast, scrollTo, scrollToMessage]);

    useEffect(() => {
        if (isChatMessage(lastChat)) {
            setMessages((m) => [lastChat, ...m]);

            if (userId == lastChat.sender?.id) {
                setScrollTo(lastChat.id);
            }
        } else if (isChatAction(lastChat)) {
            // nop
        }
    }, [lastChat, userId]);

    const reversedMessages = useCallback(() => {
        return [...messages].reverse();
    }, [messages]);

    const getSections = useCallback((): IChatSection[] => {
        return reversedMessages().reduce((acc, cur) => {
            if (!acc.length) {
                acc.push({ sender: cur.sender, messages: [cur] });
            } else {
                const last = acc.length - 1;
                if (acc[last].sender?.id === cur.sender?.id) {
                    acc[last].messages.push(cur);
                } else {
                    acc.push({ sender: cur.sender, messages: [cur] });
                }
            }

            return acc;
        }, [] as IChatSection[]);
    }, [reversedMessages]);

    return (
        <InfinityScroller
            className="chat-messages"
            flipped={true}
            ref={scrollerRef}
            sx={{
                borderTop: '1px solid rgba(0, 0, 0, .05)',
                padding: theme.spacing(1),
                overflow: 'auto',
                flex: 1,
                position: 'relative',
            }}
            spinner={<CircularProgress sx={{ position: 'absolute' }} />}
            shouldLoad={() => {
                return hasMoreData;
            }}
            onInfiniteLoad={() => {
                return readMessages();
            }}
        >
            <TransitionGroup>
                {getSections().map((s, ix) => (
                    <Fade key={`${room.id}+${ix}`}>
                        <ChatSection room={room} section={s} />
                    </Fade>
                ))}
            </TransitionGroup>
        </InfinityScroller>
    );
};

export default ChatConversation;
