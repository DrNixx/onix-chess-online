import React, {useState} from 'react';
import {apiPost} from "../api/Api";

type Props = {
    channel: string;
    apiUrl: string;
};

const ChatInput: React.FC<Props> = ({ channel, apiUrl}) =>  {

    const [message, setMessage] = useState("");

    const msgChange = (e: React.ChangeEvent) => {
        const val = (e.target as HTMLInputElement).value;
        setMessage(val);
    };

    const clearMessage = () => {
        setMessage("");
    };

    const doSend = (e?: React.MouseEvent) => {
        e && e.preventDefault();

        if (message) {
            const data = {
                channel: channel,
                message: message
            };

            apiPost(apiUrl, data)
                .then(() => {
                    clearMessage();
                })
                .catch(function(error) {
                    console.error('Looks like there was a problem when send chat message: \n', error);
                });
        }
    };

    const keyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            doSend();
        }
    };

    return (
        <div className="chat-controls b-t b-grey bg-white clearfix px-2">
            <div className="d-flex align-items-center">
                <div className="flex-grow-1 no-padding">
                    <label className="sr-only">Message</label>
                    <input type="text" className="form-control chat-input" value={message} onKeyDown={keyPress} onChange={msgChange} />
                </div>
                <div className="link text-color ms-2 ps-2 b-l b-grey">
                    <a href="#" className="link text-color" onClick={doSend}><i className="pg-icon">send</i></a>
                </div>
            </div>
        </div>
    );
}

export default ChatInput;