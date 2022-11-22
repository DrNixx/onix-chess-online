import React from 'react';
import { createRoot } from 'react-dom/client';
import { IChatMessage } from './Interfaces';
import { Conversation } from './Conversation';
import { ChatInput } from './ChatInput';

export interface ChatProps {
    channel: string;
    apiUrl: string;
    messages: IChatMessage[];
    userid?: number;
}

export class Chat extends React.Component<ChatProps, any> {
    /**
     * constructor
     */
    constructor(props: ChatProps) {
        super(props);
    }

    render() {
        const { channel, apiUrl, messages, userid } = this.props;

        return (
            <div className="chat-view h-100 d-flex flex-column">
                <Conversation channel={channel} messages={messages} userid={userid} apiUrl={apiUrl} />
                <ChatInput channel={channel} apiUrl={apiUrl} />
            </div>
        );
    }
}

export const simpleChat = (props: ChatProps, container: HTMLElement) => {
    const root = createRoot(container);
    root.render(React.createElement(Chat, props));
};