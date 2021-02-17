import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Logger } from '../common/Logger';
import { IModule } from './IModule';
import { IApplication, setAppInstance } from './IApplication';
import { ConnectionStatus } from '../net/ConnectionStatus';
import { IStream } from '../net/IStream';
import serviceWorker from '../push/ServiceWorker';
import { ConnectionInfo } from '../ui/components/ConnectionInfo';
import { Frontend } from '../ui/Frontend';
import { IStreamMessage } from '../net/IStreamMessage';

export interface AppProps {
    locale?: string,
    channel?: string,
    ui?: boolean,
    sw?: boolean,
    stream?: IPushStreamSettings,
    modules?: IModule[],
}

export interface AppState {
    status: ConnectionStatus,
    pmsg: number,
    moves: number,
}

export class App extends React.Component<AppProps, AppState> implements IApplication {
    public static defaultProps: AppProps = {
        ui: true,
        sw: false,
        stream: {
            host: "stream.chess-online.com",
            useSSL: true,
            modes: "websocket|eventsource|longpolling",
            extraParams: function() {
                return {"qs": "on"};
            },
        },
        modules: [],
    };

    public stream!: IStream;

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
        const { ui, channel, stream, modules } = this.props;

        if (ui) {
            this.ui = new Frontend();
            this.ui.init();
        }

        modules!.forEach((value, index) => {
            value.init();
        });

        this.stream = new PushStream(stream!);
        this.stream.connectionStatus$.subscribe(this.onConnectionStatusChange);

        if (channel) {
            this.stream.subscribe(channel, this.onAlertMessage);
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
            this.stream.removeAll();
        }
    }

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
