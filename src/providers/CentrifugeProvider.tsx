import toInteger from 'lodash/toInteger';
import { Centrifuge, JoinContext, Options, Subscription, SubscriptionTokenContext } from 'centrifuge';
import React, {
    PropsWithChildren,
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState, useContext,
} from 'react';
import { useEvent } from '../hooks/useEvent';
import { extractNotifyPkg } from '../utils/wsUtils';
import { INotifyPacket } from '../models/Chat';
import { useApi } from '../hooks/useApi';
import {AuthContext} from "./AuthProvider";

type CentrifugeConfig = {
    host?: string;
    options?: Partial<Options>;
};

class Factory {
    private static centrifuge: Centrifuge | undefined;

    public static getInstance(config: CentrifugeConfig): Centrifuge | undefined {
        if (!this.centrifuge) {
            this.centrifuge = config.host
                ? new Centrifuge(`${config.host}/connection/websocket`, config.options)
                : undefined;
        }

        return this.centrifuge;
    }
}

export const CentrifugeContext = createContext<{
    isConnected: boolean;
    centrifuge?: Centrifuge;
    lastNotify: INotifyPacket | null;
    onlineUsers: number[];
    getToken: (ctx: SubscriptionTokenContext) => Promise<string>;
}>({
    isConnected: false,
    lastNotify: null,
    onlineUsers: [],
    getToken: () => {
        throw new Error('Method not implemented.');
    },
});

export const CentrifugeProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);
    const [config, setConfig] = useState<CentrifugeConfig>({});
    const [isConnected, setIsConnected] = useState(false);
    const [lastNotify, setLastNotify] = useState<INotifyPacket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
    const subRef = useRef<Subscription | null>(null);
    const centrifuge = useMemo(() => {
        return Factory.getInstance(config);
    }, [config]);

    const { apiGet, apiPost } = useApi();

    const connectedListener = useEvent(() => {
        setIsConnected(true);
    });

    const disconnectedListener = useEvent(() => {
        setIsConnected(false);
    });

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

                setOnlineUsers(
                    u
                        .filter((value, index, array) => array.indexOf(value) === index)
                        .sort()
                        .map((v) => toInteger(v)),
                );
            },
            function (err) {
                console.error(err);
            },
        );
    };

    const subscribedListener = useEvent(() => {
        presence();
    });

    const joinListener = useEvent((ctx: JoinContext) => {
        if (!onlineUsers.includes(toInteger(ctx.info.user))) {
            setOnlineUsers((u) =>
                [...u, ctx.info.user]
                    .filter((value, index, array) => array.indexOf(value) === index)
                    .sort()
                    .map((v) => toInteger(v)),
            );
        }
    });

    const leaveListener = useEvent(() => {
        presence();
    });

    useEffect(() => {
        if (isAuthenticated) {
            apiGet<CentrifugeConfig>(`/centrifuge/config`)
                .then((data) => {
                    if (data.model) {
                        setConfig(data.model);
                    }
                })
                .catch(() => '');
        }
    }, [apiGet, isAuthenticated]);

    const getToken = useCallback(
        async (ctx: SubscriptionTokenContext): Promise<string> => {
            return apiPost<string>(`/centrifuge/subscribe`, { data: ctx })
                .then((data) => {
                    return data.model ?? '';
                })
                .catch(() => '');
        },
        [apiPost],
    );

    useEffect(() => {
        if (centrifuge) {
            centrifuge.on('connected', connectedListener);
            centrifuge.on('disconnected', disconnectedListener);

            centrifuge.on('publication', function (ctx) {
                extractNotifyPkg(ctx).then((notify) => {
                    setLastNotify(notify);
                });
            });

            let sub = centrifuge.getSubscription('public:online');
            if (sub === null) {
                sub = centrifuge.newSubscription('public:online', {
                    getToken: (ctx) => getToken(ctx),
                });

                sub.on('subscribed', subscribedListener);
                sub.on('join', joinListener);
                sub.on('leave', leaveListener);

                sub.subscribe();
            }

            subRef.current = sub;
            centrifuge.connect();
        }
    }, [
        centrifuge,
        connectedListener,
        disconnectedListener,
        joinListener,
        leaveListener,
        subscribedListener,
        getToken,
    ]);

    return (
        <CentrifugeContext.Provider value={{ isConnected, centrifuge, lastNotify, onlineUsers, getToken }}>
            {children}
        </CentrifugeContext.Provider>
    );
};
