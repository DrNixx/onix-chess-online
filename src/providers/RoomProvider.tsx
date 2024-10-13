import React, { PropsWithChildren, createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { JoinContext, PublicationContext, Subscription } from 'centrifuge';
import { useEvent } from '../hooks/useEvent';
import { IChatContext, IChatResponse, IChatRoom, MessagesRequest, isChat } from '../models/Chat';
import { CentrifugeContext } from './CentrifugeProvider';
import { useApi } from '../hooks/useApi';

export const RoomContext = createContext<{
    room?: IChatRoom;
    lastMessage?: IChatContext;
    users: string[];
    loadMessages: (meta?: MessagesRequest) => Promise<IChatResponse | undefined>;
}>({
    room: undefined,
    lastMessage: undefined,
    users: [],
    loadMessages: () => {
        throw new Error('Method not implemented.');
    },
});

type Props = {
    room?: IChatRoom;
};

export const RoomProvider: React.FC<PropsWithChildren<Props>> = ({ room, children }) => {
    const { apiGet } = useApi();
    const { centrifuge, isConnected, getToken } = useContext(CentrifugeContext);
    const [users, setUsers] = useState<string[]>([]);
    const [lastMessage, setLastMessage] = useState<IChatContext | undefined>(undefined);
    const subRef = useRef<Subscription | null>(null);

    const presence = () => {
        subRef.current?.presence().then(
            function (ctx) {
                const u: string[] = [];
                const clients: any = ctx.clients;
                for (const k in clients) {
                    const v = clients[k];
                    if (v) {
                        u.push(v.user);
                    }
                }

                setUsers(u);
            },
            function (err) {
                console.error(err);
            },
        );
    };

    const subscribedListener = useEvent(() => {
        presence();
    });

    const publicationListener = useEvent((ctx: PublicationContext) => {
        if (isChat(ctx?.data)) {
            if (ctx.data.ctx) {
                setLastMessage(ctx.data.ctx);
            }
        }
    });

    const joinListener = useEvent((ctx: JoinContext) => {
        if (!users.includes(ctx.info.user)) {
            setUsers([...users, ctx.info.user]);
        }
    });

    const leaveListener = useEvent(() => {
        presence();
    });

    useEffect(() => {
        let sub: Subscription | null = null;
        if (room?.id && centrifuge && isConnected) {
            sub = centrifuge.getSubscription(room.id);
            if (sub === null) {
                sub = centrifuge.newSubscription(room.id, {
                    getToken: (ctx) => getToken(ctx),
                });
            }

            sub.on('subscribed', subscribedListener);
            sub.on('publication', publicationListener);
            sub.on('join', joinListener);
            sub.on('leave', leaveListener);

            sub.subscribe();
            subRef.current = sub;
        }

        return () => {
            if (sub) {
                sub.removeAllListeners();
                sub.unsubscribe();
                subRef.current = null;
            }
        };
    }, [
        centrifuge,
        isConnected,
        getToken,
        room?.id,
        subscribedListener,
        publicationListener,
        joinListener,
        leaveListener,
    ]);

    const loadMessages = useCallback(
        async (meta?: MessagesRequest) => {
            if (room?.id) {
                let url = `/api/chat/@${room.id}`;

                if (meta) {
                    const params: string[] = [];
                    if (meta.limit) {
                        params.push(`limit=${meta.limit}`);
                    }

                    if (meta.fromId) {
                        params.push(`fromId=${meta.fromId}`);
                    }

                    if (meta.affix) {
                        params.push(`affix=${meta.affix}`);
                    }

                    if (meta.id) {
                        params.push(`id=${meta.id}`);
                    }

                    if (meta.sentAt) {
                        params.push(`sentAt=${meta.sentAt}`);
                    }

                    if (params.length) {
                        url += '?' + params.join('&');
                    }
                }

                return await apiGet<IChatResponse>(url).then((result) => result.model);
            }

            return undefined;
        },
        [apiGet, room?.id],
    );

    return <RoomContext.Provider value={{ room, lastMessage, users, loadMessages }}>{children}</RoomContext.Provider>;
};
