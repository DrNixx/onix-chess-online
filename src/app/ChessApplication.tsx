import React, {useEffect, useState} from 'react';
//import {useSnackbar} from "notistack";

import ConnectionInfo from '../components/ConnectionInfo';
import {Frontend} from './Frontend';
import {init as initI18N} from '../i18n/i18Init';
import {setCentrifugeConfig, useCentrifuge} from '../hooks/useCentrifuge';
import {setApiRoot} from '../api/Api';
import {setNotify} from './AppNotify';
import {useAlert} from '../hooks/useAlert';
import {ChessApplicationProps} from './ChessApplicationProps';
import {defaultOf} from '../utils/propsUtils';
import {useDefaults} from "../hooks/useDefaults";

type propsWithDefaults = 'locale' | 'wsHost' | 'apiRoot' | 'ui' | 'sw' | 'modules';
const defaultProps: defaultOf<ChessApplicationProps, propsWithDefaults> = {
    locale: 'en-US',
    wsHost: 'ws://localhost:8000',
    apiRoot: 'https://www.chess-online.com/api',
    ui: true,
    sw: false,
    modules: [],
};

const ChessApplication: React.FC<ChessApplicationProps> = (propsIn) => {
    const props = useDefaults(propsIn, defaultProps);

    const {
        uid,
        locale,
        apiRoot,
        wsHost,
        sw,
        token,
        channel,
        ui,
        modules
    } = props;

    // const { enqueueSnackbar } = useSnackbar();
    const { show } = useAlert();
    const [connected, setConnected] = useState(false);

    setCentrifugeConfig(wsHost, {token: token ?? ''});
    const [,,centrifuge] = useCentrifuge();
    const [localeLoaded, setLocaleLoaded] = useState(false);

    setApiRoot(apiRoot);

    useEffect(() => {
        initI18N(locale).then(() => {
            setLocaleLoaded(true);
        });
    }, [locale]);

    useEffect(() => {
        if (localeLoaded) {
            if (ui) {
                const uiInstance = new Frontend(uid);
                uiInstance.init();
            }

            modules.forEach((value) => {
                value.init();
            });
        }
    }, [localeLoaded, modules, ui, uid]);

    useEffect(() => {
        if (centrifuge) {
            centrifuge.on('connected', () => {
                setConnected(true);
            });

            centrifuge.on('disconnected', () => {
                setConnected(false);
            });

            centrifuge.on('publication', function(ctx) {
                // const channel = ctx.channel;
                // const payload = JSON.stringify(ctx.data);

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
            // serviceWorker();
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

    setNotify((message, options) => {
        return show(message, options);
    });

    return (
        <ConnectionInfo online={connected} />
    );
}

export default ChessApplication;