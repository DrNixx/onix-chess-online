import React, {useCallback, useEffect, useState} from 'react';
//import {useSnackbar} from "notistack";

import ConnectionInfo from '../components/ConnectionInfo';
import Frontend from './Frontend';
import {init as initI18N} from '../i18n/i18Init';
import {setApiRoot} from '../api/Api';
import {setNotify} from './AppNotify';
import {useAlert} from '../hooks/useAlert';
import {ChessApplicationProps} from './ChessApplicationProps';
import {defaultOf} from '../utils/propsUtils';
import {useDefaults} from "../hooks/useDefaults";
import Loader from "../ui/Loader";

type propsWithDefaults = 'locale' | 'apiRoot' | 'ui' | 'sw' | 'modules';
const defaultProps: defaultOf<ChessApplicationProps, propsWithDefaults> = {
    locale: 'en-US',
    apiRoot: 'https://www.chess-online.com/api',
    ui: true,
    sw: false,
    modules: [],
};

const ChessApplication: React.FC<ChessApplicationProps> = (propsIn) => {
    const props = useDefaults(propsIn, defaultProps);

    const {
        locale,
        apiRoot,
        sw,
        modules
    } = props;

    // const { enqueueSnackbar } = useSnackbar();
    const { show } = useAlert();
    const [connected, setConnected] = useState(false);

    const [localeLoaded, setLocaleLoaded] = useState(false);

    setApiRoot(apiRoot);

    useEffect(() => {
        initI18N(locale).then(() => {
            setLocaleLoaded(true);
        });
    }, [locale]);

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

    const createModules = useCallback(() => {
        return modules.map((value) => {
            return value.init();
        });
    }, [modules]);

    setNotify((message, options) => {
        return show(message, options);
    });

    return localeLoaded ? (
        <>
            <ConnectionInfo online={connected} />
            <Frontend>
                {createModules()}
            </Frontend>
        </>
    ) : <Loader />;
}

export default ChessApplication;