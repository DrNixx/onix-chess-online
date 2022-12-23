import React, {Suspense, useEffect, useState} from 'react';
import { createRoot } from 'react-dom/client';
import {useSnackbar, SnackbarProvider} from "notistack";
import toSafeInteger from 'lodash/toSafeInteger';

import { Logger } from '../common/Logger';
import { IModule } from './IModule';
import serviceWorker from '../push/ServiceWorker';
import ConnectionInfo from '../ui/components/ConnectionInfo';
import { Frontend } from '../ui/Frontend';
import {init as initI18N} from '../i18n/i18Init';
import {setCentrifugeConfig, useCentrifuge} from "../hooks/useCentrifuge";
import {setApiRoot} from "../api/Api";

type Props = {
    locale?: string,
    uid?: number | string,
    channel?: string,
    token?: string,
    secret?: string,
    wsHost?: string,
    apiRoot?: string;
    ui?: boolean,
    sw?: boolean,
    modules?: IModule[],
};

const defaultProps = {
    locale: 'en-US',
    wsHost: 'ws://localhost:8000',
    apiRoot: 'https://www.chess-online.com/api',
    ui: true,
    sw: false,
    modules: [],
};

const ChessApplication: React.FC<Props> = (propsIn) => {
    const props = {...defaultProps, ...propsIn};
    const { enqueueSnackbar } = useSnackbar();
    const { uid, locale, apiRoot, wsHost, sw, token, channel, ui, modules } = props;

    const [connected, setConnected] = useState(false);

    setCentrifugeConfig(wsHost, {token: token ?? ''});
    const [centrifuge] = useCentrifuge();

    setApiRoot(apiRoot);

    useEffect(() => {
        initI18N(locale).then(() => {
            if (ui) {
                const uiInstance = new Frontend(uid);
                uiInstance.init();
            }

            modules.forEach((value) => {
                value.init();
            });
        });
    }, [locale, modules, ui, uid]);

    useEffect(() => {
        if (centrifuge) {
            centrifuge.on('connected', (context) => {
                Logger.debug('connect', context);
                setConnected(true);
            });

            centrifuge.on('disconnected', (context) => {
                Logger.debug('disconnect', context);
                setConnected(false);
            });

            centrifuge.on('publication', function(ctx) {
                const channel = ctx.channel;
                const payload = JSON.stringify(ctx.data);
                Logger.debug('Publication from server-side channel', channel, payload);

                if (ctx?.data?.t == "notify") {
                    if (ctx?.data?.c == "telegram") {
                        if (window.location.href.indexOf('account/profile') !== -1) {
                            window.location.reload();
                        }

                        return;
                    }
                }
            });

            if (channel) {
                //this.stream.subscribe(channel, this.onAlertMessage);
            }

            //this.stream.subscribe("$chat:2-3", function(messageCtx) {
            //    Logger.debug(messageCtx);
            //});

            centrifuge.connect();
        }

        return function cleanup() {
            /*
            if (stream.current) {
                stream.current.removeAllListeners();
                stream.current.disconnect();
                stream.current = null;
            }
             */
        };
    }, [centrifuge, channel]);

    useEffect(() => {
        if (sw) {
            serviceWorker();
        }
    }, [sw]);

    /*
    const getUserId = (): number => {
        return toSafeInteger(uid);
    }

    const getApiUrl = (urlPart: string): string => {
        return apiRoot + urlPart;
    }
    */

    return (
        <Suspense fallback="loading...">
            <SnackbarProvider maxSnack={4} anchorOrigin={{horizontal: "right", vertical: "bottom"}}>
                <ConnectionInfo online={connected} />
            </SnackbarProvider>
        </Suspense>
    );
}

export const ChessApp = (props: Props, container: HTMLElement) => {
    const root = createRoot(container);
    root.render(React.createElement(ChessApplication, props));
};
