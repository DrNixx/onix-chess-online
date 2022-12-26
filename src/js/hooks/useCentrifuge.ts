import {useMemo, useState} from 'react';
import {Centrifuge, Options, ServerPublicationContext, SubscriptionTokenContext} from 'centrifuge';
import {singletonHook} from "react-singleton-hook";
import {useEvent} from "./useEvent";
import {apiPost} from "../api/Api";
import {IStreamMessage} from "../models/stream/IStreamMessage";

let wsHostConfig: string | undefined = undefined;
let optionsConfig: Partial<Options> | undefined = undefined;

export function setCentrifugeConfig(wsHost?: string, options?: Partial<Options>) {
    wsHostConfig = wsHost;
    optionsConfig = options;
}

type CentrifugeResult = [IStreamMessage | null, boolean, Centrifuge | undefined, (ctx: SubscriptionTokenContext) => Promise<string>];

function useCentrifugeImpl(): CentrifugeResult {
    const [connected, setConnected] = useState(false);
    const centrifuge = useMemo(() => !!wsHostConfig ? new Centrifuge(`${wsHostConfig}/connection/websocket`, optionsConfig) : undefined, []);
    const [lastMessage, setLastMessage] = useState<IStreamMessage | null>(null);

    const connectedListener = useEvent(() => {
        setConnected(true);
    });

    const disconnectedListener = useEvent(() => {
        setConnected(false);
    });

    const publicationListener = useEvent((ctx: ServerPublicationContext) => {
        console.debug('message', ctx);
        const msg = ctx?.data as IStreamMessage | undefined;
        if (msg) {
            setLastMessage(msg);
        }
    });

    if (centrifuge) {
        centrifuge.on('connected', connectedListener);
        centrifuge.on('disconnected', disconnectedListener);
        centrifuge.on('publication', publicationListener);
    }

    const getToken = (ctx: SubscriptionTokenContext): Promise<string> => {
        return apiPost<string>('/centrifuge/subscribe', ctx)
            .then(data => {
                return data.model ?? '';
            })
            .catch(() => '');
    }

    return [lastMessage, connected, centrifuge, getToken];
}

export const useCentrifuge = singletonHook([null, false, undefined, () => Promise.reject('Centrifugo client not configured')], useCentrifugeImpl);