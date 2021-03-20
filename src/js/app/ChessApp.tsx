import * as React from 'react';
import * as ReactDOM from 'react-dom';
import toSafeInteger from 'lodash/toSafeInteger';
import { Logger } from '../common/Logger';
import Centrifuge from 'centrifuge';
import { IModule } from './IModule';
import { IApplication, setAppInstance } from './IApplication';
import { ConnectionStatus } from '../net/ConnectionStatus';
import serviceWorker from '../push/ServiceWorker';
import { ConnectionInfo } from '../ui/components/ConnectionInfo';
import { Frontend } from '../ui/Frontend';
import { IStreamMessage } from '../net/IStreamMessage';

export interface AppProps {
    locale?: string,
    uid?: number | string,
    channel?: string,
    token?: string,
    secret?: string,
    wsHost?: string,
    ui?: boolean,
    sw?: boolean,
    modules?: IModule[],
}

export interface AppState {
    status: ConnectionStatus,
    pmsg: number,
    moves: number,
}

export class App extends React.Component<AppProps, AppState> implements IApplication {
    public static defaultProps: AppProps = {
        wsHost: 'ws://localhost:8000',
        ui: true,
        sw: false,
        modules: [],
    };

    public stream: Centrifuge|null = null;

    public ui?: Frontend;

    constructor(props: AppProps) {
        super(props);
        
        this.state = {
            status: ConnectionStatus.Uninitialized,
            pmsg: 0,
            moves: 0,
        };
    }

    componentDidMount() {
        const { ui, wsHost, token, secret, channel, modules } = this.props;

        if (ui) {
            this.ui = new Frontend();
            this.ui.init();
        }

        modules!.forEach((value, index) => {
            value.init();
        });

        if (token) {
            this.wsConnect();
        }
        
        if (this.props.sw) {
            serviceWorker();
        }

        setAppInstance(this);
    }

    componentDidUpdate() {

    }

    componentWillUnmount() {
        if (this.stream) {
            this.stream.removeAllListeners();
            this.stream.disconnect();
        }
    }

    private wsConnect = () => {
        const { wsHost, token, secret, channel, modules } = this.props;

        this.stream = new Centrifuge(`${wsHost}/connection/websocket`);
        this.stream.setToken(token!);

        this.stream.on('connect', (context) => {
            Logger.debug('connect', context);
            // this.stream.connectionStatus$.subscribe(this.onConnectionStatusChange);
        });

        this.stream.on('disconnect', (context) => {
            Logger.debug('disconnect', context);
            // this.stream.connectionStatus$.subscribe(this.onConnectionStatusChange);
        });

        this.stream.on('publish', function(ctx) {
            const channel = ctx.channel;
            const payload = JSON.stringify(ctx.data);
            Logger.debug('Publication from server-side channel', channel, payload);
        });

        if (channel) {
            this.stream.subscribe(channel, this.onAlertMessage);
        }

        this.stream.subscribe("$chat:2-3", function(messageCtx) {
            Logger.debug(messageCtx);
        });

        this.stream.connect();
    };

    public requestSubscription() {
        if ('Notification' in window) {
            Notification.requestPermission()
                .then((p) => {
                    if (p === 'granted') {
                        serviceWorker();
                    }
                })
                .catch(function(err) {
                    console.error(err);
                });
        }
    }

    onAlertMessage = (msg: IStreamMessage) => {
        Logger.debug("on alert message", msg);
    };

    onConnectionStatusChange = (e: ConnectionStatus) => {
        const { state } = this;
        Logger.debug("Connection status changed", e);
        this.setState({
            ...state,
            status: e

        });

        this.forceUpdate();
    };

    public getUserId(): number {
        return toSafeInteger(this.props.uid);
    }

    render() {
        const { status } = this.state;
        return (
            <ConnectionInfo status={status}></ConnectionInfo>
        );
    }
}

export const ChessApp = (props: AppProps, container: HTMLElement) => {
    ReactDOM.render(React.createElement(App, props), container);
};
