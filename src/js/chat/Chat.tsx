import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { _ } from '../i18n/i18n';
import { IChatMessage } from './Interfaces';
import { Conversation } from './Conversation';
import { ChatInput } from './ChatInput';

export interface ChatProps {
    channel: string;
    apiUrl: string;
    messages: IChatMessage[];
    userid?: number;
}

export class Chat extends React.Component<ChatProps, {}> {
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
    ReactDOM.render(React.createElement(Chat, props), container, () => { });
};