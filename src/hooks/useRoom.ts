import {useContext, useEffect, useRef, useState} from "react";
import { useEvent } from "./useEvent";
import {IChatContext, INotifyContext, isChat, isNotify} from "../models/Chat";
import { JoinContext, PublicationContext, Subscription } from "centrifuge";
import {CentrifugeContext} from "../providers/CentrifugeProvider";

type RoomResult = {
    message: IChatContext | undefined,
    notify: INotifyContext | undefined,
    users: string[],
    subscription: Subscription | null
}

    //[IChatContext | undefined, string[], Subscription | null];

export function useRoom(id?: string): RoomResult {
    const { centrifuge, isConnected, getToken } = useContext(CentrifugeContext);
    const [users, setUsers] = useState<string[]>([]);
    const [lastMessage, setLastMessage] = useState<IChatContext | undefined>(undefined);
    const [lastNotify, setLastNotify] = useState<INotifyContext | undefined>(undefined);
    const subRef = useRef<Subscription | null>(null);

    const presence = () => {
        subRef.current?.presence().then(
            function(ctx) {
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
            function(err) {
                console.error(err);
            }
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
        } else if (isNotify(ctx?.data)) {
            if (ctx.data.ctx) {
                setLastNotify(ctx.data.ctx);
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
        if (id && centrifuge && isConnected) {
            sub = centrifuge.getSubscription(id);
            if (sub === null) {
                sub = centrifuge.newSubscription(id, {
                    getToken: (ctx) => getToken(ctx)
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

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [centrifuge, isConnected, getToken, id]);

    return {message: lastMessage, notify: lastNotify, users: users, subscription: subRef.current};
}