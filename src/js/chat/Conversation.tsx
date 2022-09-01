import React from 'react';
import Scrollbar from "react-scrollbars-custom";
import { dateToAgo } from '../fn/date/DateToAgo';
import { IChatMessage } from './Interfaces';
import { IUser } from '../app';
import { Logger } from '../common/Logger';
import { appInstance } from '../app/IApplication';
import UserBadge from "../ui/user/UserBadge";

export interface ConversationProps {
    channel: string;
    messages: IChatMessage[];
    userid?: number;
    apiUrl: string;
}

export interface ConversationState {
    messages: IChatMessage[];
}

export class Conversation extends React.Component<ConversationProps, ConversationState> {
    protected elRef: HTMLDivElement|null = null;
    private size: number = 0;
    private observer: IntersectionObserver|null = null;
    protected scrollerRef: HTMLDivElement|null = null;

    /**
     * constructor
     */
    constructor(props: ConversationProps) {
        super(props);

        this.state = {
            messages: props.messages
        };
    }

    componentDidMount() {
        const { channel } = this.props;
        this.fetchConversation();

        const that = this;
        if (appInstance) {
            const { stream } = appInstance;
            if (stream) {
                const sub = stream.newSubscription(channel);
                sub.on('publication', function(ctx: any) {
                    if (ctx?.data) {
                        const { messages, ...other } = that.state;

                        const response: IChatMessage[] = ctx?.data;
                        response.forEach((m) => messages.push(m));

                        that.setState({
                            ...other,
                            messages: messages
                        });
                    }
                });
            }
        }
    }

    componentWillUnmount() {
        if (this.observer !== null) {
            this.observer.disconnect();
            this.observer = null;
        }
    }

    componentDidUpdate() {
        this.scrollHandle();
    }

    private scrollHandle = () => {
        const { messages } = this.state;
        if (messages.length > 0) {
            const last = messages[messages.length - 1];
            const msg = document.getElementById(last.id);
            const div = this.scrollerRef;
            if (msg && div) {
                if (msg.offsetTop < div.offsetHeight) {
                    div.scrollTop = div.scrollHeight - div.clientHeight;
                    return;
                }

                const scroll = div.scrollTop + div.clientHeight;

                if ((div.scrollHeight - scroll) < (msg.clientHeight + 25)) {
                    div.scrollTop = div.scrollHeight - div.clientHeight;
                }
            }
        }
    };

    protected setElRef = (el: HTMLDivElement|null) => {
        this.elRef = el;
        if (this.observer !== null) {
            this.observer.disconnect();
            this.observer = null;
        }

        if (this.elRef) {
            const that = this;
            that.observer = new IntersectionObserver(() => {
                const newSize = that.elRef!.clientHeight;
                if (newSize !== that.size) {
                    that.size = newSize;
                    if (that.scrollerRef) {
                        const div = that.scrollerRef;
                        div.scrollTop = div.scrollHeight - div.clientHeight;
                    }
                }
            });

            that.observer.observe(that.elRef!);
        }
    };

    private fetchConversation = (offset?: number) => {
        const { props, applyMessages} = this;
        const { apiUrl, channel } = props;

        let url = `${apiUrl}/@` + btoa(channel);

        if (offset) {
            url += `?offset=${offset}`;
        }

        fetch(url, {method: "GET", mode: "cors"})
                .then(function(response) {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }

                    return response.json();
                })
                .then(function(responseAsJson) {
                    applyMessages(responseAsJson);
                })
                .catch(function(error) {
                    Logger.error('Looks like there was a problem when reading forums: \n', error);
                });
    };

    private applyMessages = (response: IChatMessage[]) => {
        const { messages, ...other } = this.state;
        this.setState({
            ...other,
            messages: response
        }, () => this.scrollHandle() );
    };

    private myMessage = (message: IChatMessage) => {
        return (
            <div id={message.id} key={message.id} className="message clearfix">
                    <div className="chat-bubble from-me">
                        <div dangerouslySetInnerHTML={ {__html: message.text} } />
                        <div className="time">{ dateToAgo(new Date(message.date)) }</div>
                    </div>
            </div>
        );
    };

    private themUser = (user: IUser) => {
        return (
            <div className="message-header">
                <UserBadge user={user} size="tiny" compact={true} popover={false} />
            </div>
        );
    };

    private themMessage = (message: IChatMessage, withUser?: boolean) => {
        return (
            <div id={message.id} key={message.id} className="message clearfix">
                {withUser ? this.themUser(message.sender) : null}
                <div className="chat-bubble from-them">
                    <div dangerouslySetInnerHTML={ {__html: message.text} } />
                    <div className="time">{ dateToAgo(new Date(message.date)) }</div>
                </div>
            </div>
        );
    };

    private renderMessages = () => {
        const { props, state, myMessage, themMessage } = this;
        const { userid } = props;
        const { messages } = state;
        const result: JSX.Element[] = [];

        let prevuid: string | number | undefined = -1;
        let cnt: number = 0;

        return messages.reduce((res, msg) => {
            if (userid && msg.sender.id == userid) {
                res.push(myMessage(msg));
            } else {
                let show = false;
                if (prevuid != msg.sender.id) {
                    cnt = 0;
                    show = true;
                } else if (cnt > 5) {
                    cnt = 0;
                    show = true;
                }

                cnt++;

                res.push(themMessage(msg, show));
            }
            
            prevuid = msg.sender.id;
            return res;
        }, result);
    };

    render() {
        return (
            <div className="chat-inner chat-conversation flex-grow-1" ref={(el) => this.setElRef(el)}>
                <Scrollbar trackYProps={{style: {width: 5}}} scrollerProps={{elementRef: (el) => this.scrollerRef = el}}>
                    {this.renderMessages()}
                </Scrollbar>
            </div>
        );
    }
}
