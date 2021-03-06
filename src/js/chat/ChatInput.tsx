import * as React from 'react';
import { FormGroup, Row, Col, FormLabel } from 'react-bootstrap';
import { Logger } from '../common/Logger';
import { _ } from '../i18n/i18n';
import { IChatMessage } from './Interfaces';

export interface ChatInputProps {
    channel: string;
    apiUrl: string;
}

interface ChatInputState {
    message?: string;
}

export class ChatInput extends React.Component<ChatInputProps, ChatInputState> {
    /**
     * constructor
     */
    constructor(props: ChatInputProps) {
        super(props);

        this.state = {
            message: ""
        };
    }

    private msgChange = (e: React.ChangeEvent) => {
        const val = (e.target as HTMLInputElement).value;

        this.setState({
            ...this.state,
            message: val
        });
    };

    private keyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            this.doSend();
        }
    };

    private clearMessage = () => {
        const { message, ...other } = this.state;
        this.setState({
            ...other,
            message: ""
        });
    };

    private doSend = (e?: React.MouseEvent) => {
        const { props, state, clearMessage } = this;

        e && e.preventDefault();

        if (state.message) {
            const data = {
                channel: props.channel,
                message: state.message
            };
    
            fetch(props.apiUrl, {method: "POST", mode: "cors", body: JSON.stringify(data)})
                .then(function(response) {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }

                    clearMessage();
                })
                .catch(function(error) {
                    Logger.error('Looks like there was a problem when send chat message: \n', error);
                });
        }
    };

    render() {
        const { message } = this.state;
        return (
            <div className="chat-controls b-t b-grey bg-white clearfix px-2">
                <div className="d-flex align-items-center">
                    <div className="flex-grow-1 no-padding">
                        <label className="sr-only">Message</label>
                        <input type="text" className="form-control chat-input" value={message} onKeyPress={this.keyPress} onChange={this.msgChange} />
                    </div>
                    <div className="link text-color ml-2 pl-2 b-l b-grey">
                        <a href="#" className="link text-color" onClick={this.doSend}><i className="pg-icon">send</i></a>
                    </div>
                </div>
            </div>
        );
    }
}