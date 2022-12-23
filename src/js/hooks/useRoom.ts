import {useCentrifuge} from "./useCentrifuge";
import {useEffect, useRef, useState} from "react";
import { useEvent } from "./useEvent";
import {JoinContext, LeaveContext, PublicationContext, Subscription} from "centrifuge";
import {IStreamMessage} from "../models/stream/IStreamMessage";

type RoomResult = [IStreamMessage | null, string[], Subscription | null];

export function useRoom(id: string): RoomResult {
    const [centrifuge, connected, getToken] = useCentrifuge();
    const [users, setUsers] = useState<string[]>([]);
    const [lastMessage, setLastMessage] = useState<IStreamMessage | null>(null);
    const subRef = useRef<Subscription | null>(null);

    const presence = () => {
        subRef.current?.presence().then(function(ctx) {
            const u: string[] = [];
            const clients: any = ctx.clients;
            for (const k in clients) {
                const v = clients[k];
                if (v) {
                    u.push(v.user);
                }
            }

            setUsers(u);
        }, function(err) {
            console.error(err);
        });
    };

    const subscribedListener = useEvent(() => {
        presence();
    });

    const publicationListener = useEvent((ctx: PublicationContext) => {
        console.debug('message', ctx);
        const msg = ctx?.data as IStreamMessage | undefined;
        if (msg) {
            setLastMessage(msg);
        }
    });

    const joinListener = useEvent((ctx: JoinContext) => {
        if (!users.includes(ctx.info.user)) {
            setUsers([...users, ctx.info.user]);
        }
    });

    const leaveListener = useEvent((ctx: LeaveContext) => {
        presence();
    });

    useEffect(() => {
        let isNew = false;
        if (centrifuge && connected) {
            let sub = centrifuge.getSubscription(id);
            if (sub === null) {
                isNew = true;
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

        if (isNew) {
            return () => {
                subRef.current?.unsubscribe();
                subRef.current?.removeAllListeners();
            };
        }

        return () => {
            // none
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [centrifuge, connected, getToken, id]);

    return [lastMessage, users, subRef.current];
}