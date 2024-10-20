import React, {useCallback, useContext, useEffect, useMemo, useRef} from 'react';
import { isSameDay } from 'date-fns';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { blueGrey } from '@mui/material/colors';
import DoneAll from '@mui/icons-material/DoneAll';

import { IChatMessage, IChatRoom, isPrivateRoom } from '../models/Chat';
import { useApi } from '../hooks/useApi';
import {AuthContext} from "../providers/AuthProvider";
import {useTranslation} from "react-i18next";

type Props = {
    room: IChatRoom;
    msg: IChatMessage;
    side: 'left' | 'right';
    className?: string;
};

const ChatMessage: React.FC<Props> = ({ room, msg, side, className }) => {
    const { getUserId } = useContext(AuthContext);
    const userId = useMemo(() => {
        return getUserId();
    }, [getUserId]);

    const { t } = useTranslation(['datetime']);

    const msgRef = useRef<HTMLDivElement | null>(null);
    const { apiPost } = useApi();
    const theme = useTheme();

    const canReaded = useCallback(() => {
        return msg.sender?.id != userId && !msg.readByMe;
    }, [msg.readByMe, msg.sender?.id, userId]);

    const observerCallback = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [entry] = entries;

            if (entry.isIntersecting) {
                if (canReaded()) {
                    apiPost(`/api/chat/read/${msg.id}`)
                        .then(() => {
                            msg.readByMe = new Date().getTime();
                        })
                        .catch(() => false);
                }
            }
        },
        [apiPost, canReaded, msg],
    );

    useEffect(() => {
        const observer = new IntersectionObserver(observerCallback);
        if (msgRef.current && canReaded()) {
            observer.observe(msgRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [canReaded, observerCallback]);

    const renderStatus = useCallback(() => {
        if (isPrivateRoom(room)) {
            const partner = room.conversationWith.id ?? 0;
            if (msg.sender?.id == userId) {
                if (!!msg.readReceipts && msg.readReceipts.includes(partner)) {
                    // nop
                }

                const color =
                    !!msg.readReceipts && msg.readReceipts.includes(partner) ? blueGrey[900] : blueGrey[400];

                return (
                    <Typography variant="caption" component="span" color={color}>
                        <DoneAll fontSize="small" color="inherit" />
                    </Typography>
                );
            }
        }

        return null;
    }, [msg.readReceipts, msg.sender?.id, room, userId]);

    const sentAt = useCallback(() => {
        if (msg.sentAt) {
            const date = new Date(msg.sentAt);
            const now = new Date();

            return (
                <Typography variant="caption" component="div" sx={{ opacity: 0.75, px: 0.5 }}>
                    {isSameDay(date, now)
                        ? t('short_time', { date: date, ns: "datetime" })
                        : t('date_dmhm', { date: date, ns: "datetime" })}
                </Typography>
            );
        }

        return null;
    }, [msg.sentAt, t]);

    const radius = theme.spacing(2.5);

    return (
        <Box id={`${msg.id}`} sx={{ textAlign: side }} ref={msgRef}>
            <Box
                sx={{
                    padding: theme.spacing(1, 2),
                    borderRadius: 0.25,
                    marginBottom: 0.25,
                    display: 'inline-block',
                    wordBreak: 'break-word',
                    '&.left': {
                        borderTopRightRadius: radius,
                        borderBottomRightRadius: radius,
                        backgroundColor: theme.palette.grey[100],
                        color: theme.palette.common.black,
                    },
                    '&.right': {
                        borderTopLeftRadius: radius,
                        borderBottomLeftRadius: radius,
                        backgroundColor: blueGrey[200],
                        color: theme.palette.common.black,
                    },
                    '&.leftFirst': {
                        borderTopLeftRadius: radius,
                    },
                    '&.leftLast': {
                        borderBottomLeftRadius: radius,
                    },
                    '&.rightFirst': {
                        borderTopRightRadius: radius,
                    },
                    '&.rightLast': {
                        borderBottomRightRadius: radius,
                    },
                }}
                className={className}
            >
                {msg.type == 'text' && msg.category == 'message' && msg.text}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    {sentAt()}
                    {renderStatus()}
                </Box>
            </Box>
        </Box>
    );
};

export default ChatMessage;
