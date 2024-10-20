import React, {useEffect, useState} from 'react';
import ChatConversation from './ChatConversation';
import ChatInput from './ChatInput';
import {ChatProps} from "./ChatProps";
import {IChatRoom} from "../models/Chat";
import {useApi} from "../hooks/useApi";

const Chat: React.FC<ChatProps> = ({channel}) => {
    const [room, setRoom] = useState<IChatRoom>();
    const {apiGet} = useApi();

    useEffect(() => {
        const apiUrl = process.env.NODE_ENV == 'production' ? '' : import.meta.env.VITE_API_URL ?? '';
        apiGet<IChatRoom>(`${apiUrl}/api/chat/room/@` + btoa(channel))
            .then((data) => {
                if (data.model) {
                    setRoom(data.model);
                }
            })
     }, [apiGet, channel]);

    return room ? (
        <div className="chat-view h-100 d-flex flex-column">
            <ChatConversation room={room}/>
            <ChatInput room={room}/>
        </div>
    ) : null;
}

export default Chat;