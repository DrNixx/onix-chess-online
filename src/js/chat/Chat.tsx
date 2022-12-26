import React from 'react';
import { createRoot } from 'react-dom/client';
import { IChatMessage } from './Interfaces';
import Conversation from './Conversation';
import ChatInput from './ChatInput';

type Props = {
    channel: string;
    apiUrl: string;
    messages: IChatMessage[];
    userid?: number;
};

const Chat: React.FC<Props> = ({channel, messages, userid, apiUrl}) => {

    return (
        <div className="chat-view h-100 d-flex flex-column">
            <Conversation channel={channel} messages={messages} userid={userid} apiUrl={apiUrl} />
            <ChatInput channel={channel} apiUrl={apiUrl} />
        </div>
    );
}

export default Chat;

export const simpleChat = (props: Props, container: HTMLElement) => {
    const root = createRoot(container);
    root.render(React.createElement(Chat, props));
};