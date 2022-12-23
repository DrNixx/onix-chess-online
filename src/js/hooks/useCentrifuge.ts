import {useMemo, useState} from 'react';
import {Centrifuge, Options, SubscriptionTokenContext} from 'centrifuge';
import {singletonHook} from "react-singleton-hook";
import {useEvent} from "./useEvent";
import {apiPost} from "../api/Api";

let wsHostConfig: string | undefined = undefined;
let optionsConfig: Partial<Options> | undefined = undefined;

export function setCentrifugeConfig(wsHost?: string, options?: Partial<Options>) {
    wsHostConfig = wsHost;
    optionsConfig = options;
}

type CentrifugeResult = [Centrifuge | undefined, boolean, (ctx: SubscriptionTokenContext) => Promise<string>];

function useCentrifugeImpl(): CentrifugeResult {
    const [connected, setConnected] = useState(false);
    const centrifuge = useMemo(() => !!wsHostConfig ? new Centrifuge(`${wsHostConfig}/connection/websocket`, optionsConfig) : undefined, []);

    const connectedListener = useEvent(() => {
        setConnected(true);
    });

    const disconnectedListener = useEvent(() => {
        setConnected(false);
    });

    if (centrifuge) {
        centrifuge.on('connected', connectedListener);
        centrifuge.on('disconnected', disconnectedListener);
    }

    const getToken = (ctx: SubscriptionTokenContext): Promise<string> => {
        return apiPost<string>('/centrifuge/subscribe', ctx)
            .then(data => {
                return data.model ?? '';
            })
            .catch(() => '');
    }

    return [centrifuge, connected, getToken];
}

export const useCentrifuge = singletonHook([undefined, false, () => Promise.reject('Centrifugo client not configured')], useCentrifugeImpl);