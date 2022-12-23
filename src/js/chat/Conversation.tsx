import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import Scrollbar from "react-scrollbars-custom";
import { dateToAgo } from '../fn/date/DateToAgo';
import { IChatMessage } from './Interfaces';
import { Logger } from '../common/Logger';
import UserBadge from "../ui/user/UserBadge";
import {IUser} from "../models/user/IUser";
import {useRoom} from "../hooks/useRoom";
import {CHAT, IChatContext} from "../models/stream/IStreamMessage";
import {apiGet} from "../api/Api";

type Props = {
    channel: string;
    messages: IChatMessage[];
    userid?: number;
    apiUrl: string;
};

const Conversation: React.FC<Props> = (props) => {

    const { channel } = props;

    const [messages, setMessages] = useState(props.messages);
    const elRef = useRef<HTMLDivElement|null>(null);
    const [size, setSize] = useState(0);
    const scrollerRef = useRef<HTMLDivElement|null>(null);

    const [lastMessage] = useRoom(channel);

    const observer = useMemo<IntersectionObserver | null>(() => {
        if (observer !== null) {
            observer.disconnect();
        }

        let result = null;
        if (elRef.current) {
            const ref = elRef.current;
            result = new IntersectionObserver(() => {
                const newSize = ref.clientHeight;
                if (newSize !== size) {
                    setSize(newSize);
                    if (scrollerRef.current) {
                        const div = scrollerRef.current;
                        div.scrollTop = div.scrollHeight - div.clientHeight;
                    }
                }
            });

            result.observe(elRef.current);
        }

        return result;
    }, [size]);

    const scrollHandle = useCallback(() => {
        if (messages.length > 0) {
            const last = messages[messages.length - 1];
            const msg = document.getElementById(last.id);
            const div = scrollerRef.current;
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
    }, [messages]);

    const fetchConversation = (offset?: number) => {
        const { apiUrl, channel } = props;

        let url = `${apiUrl}/@` + btoa(channel);

        if (offset) {
            url += `?offset=${offset}`;
        }

        apiGet<IChatContext>(url)
            .then((data) => {
                setMessages([...messages, ...data]);
            })
            .catch(function(error) {
                Logger.error('Looks like there was a problem when reading forums: \n', error);
            });
    };

    useEffect(() => {
        fetchConversation();

        return function cleanup() {
            if (observer !== null) {
                observer.disconnect();
            }
        };
    }, [observer]);

    useEffect(() => {
        if (lastMessage?.t == CHAT) {
            const response = Array.isArray(lastMessage.ctx) ? lastMessage.ctx : [lastMessage.ctx];
            setMessages([...messages, ...response]);
        }
    }, [lastMessage]);

    useEffect(() => {
        scrollHandle();
    }, [messages, scrollHandle]);

    const myMessage = (message: IChatMessage) => {
        return (
            <div id={message.id} key={message.id} className="message clearfix">
                    <div className="chat-bubble from-me">
                        <div dangerouslySetInnerHTML={ {__html: message.text} } />
                        <div className="time">{ dateToAgo(new Date(message.date)) }</div>
                    </div>
            </div>
        );
    };

    const themUser = (user: IUser) => {
        return (
            <div className="message-header">
                <UserBadge user={user} size="tiny" compact={true} popover={false} />
            </div>
        );
    };

    const themMessage = (message: IChatMessage, withUser?: boolean) => {
        return (
            <div id={message.id} key={message.id} className="message clearfix">
                {withUser ? themUser(message.sender) : null}
                <div className="chat-bubble from-them">
                    <div dangerouslySetInnerHTML={ {__html: message.text} } />
                    <div className="time">{ dateToAgo(new Date(message.date)) }</div>
                </div>
            </div>
        );
    };

    const renderMessages = () => {
        const { userid } = props;
        const result: JSX.Element[] = [];

        let prevuid: string | number | undefined = -1;
        let cnt = 0;

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

    return (
        <div className="chat-inner chat-conversation flex-grow-1" ref={elRef}>
            <Scrollbar trackYProps={{style: {width: 5}}} scrollerProps={{elementRef: (el) => scrollerRef.current = el}}>
                {renderMessages()}
            </Scrollbar>
        </div>
    );
};

export default Conversation;
