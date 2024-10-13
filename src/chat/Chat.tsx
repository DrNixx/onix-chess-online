import React from 'react';
import Conversation from './Conversation';
import ChatInput from './ChatInput';
import {ChatProps} from "./ChatProps";

const Chat: React.FC<ChatProps> = ({channel, messages, userid, apiUrl}) => {

    return (
        <div className="chat-view h-100 d-flex flex-column">
            <Conversation channel={channel} messages={messages} userid={userid} apiUrl={apiUrl} />
            <ChatInput channel={channel} apiUrl={apiUrl} />
        </div>
    );
}

export default Chat;