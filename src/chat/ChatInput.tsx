import React, { useState } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';

import { IChatRoom } from '../models/Chat';
import { useApi } from '../hooks/useApi';
import SendIcon from '@mui/icons-material/Send';
import IconButton from "@mui/material/IconButton";

type Props = {
    room: IChatRoom;
};

const ChatInput: React.FC<Props> = ({ room }) => {
    const theme = useTheme();
    const [message, setMessage] = useState('');
    const { apiPost } = useApi();

    const msgChange = (e: React.ChangeEvent) => {
        const val = (e.target as HTMLTextAreaElement).value;
        setMessage(val);
    };

    const clearMessage = () => {
        setMessage('');
    };

    const doSend = (e?: React.MouseEvent | React.KeyboardEvent) => {
        if (e) e.preventDefault();

        if (message) {
            const data = {
                channel: room.id,
                message: message,
            };

            const apiUrl = process.env.NODE_ENV == 'production' ? '' : import.meta.env.VITE_API_URL ?? '';
            apiPost(`${apiUrl}/api/chat`, { data })
                .then(() => {
                    clearMessage();
                })
                .catch(function (error) {
                    console.error('Looks like there was a problem when send chat message: \n', error);
                });
        }
    };

    const keyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            doSend(e);
        }
    };

    return (
        <>
            <Box
                className="chat-input-holder"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    borderTop: '1px solid rgba(0, 0, 0, .1)',
                    padding: theme.spacing(0.5),
                }}
            >
                <TextField
                    sx={{
                        mr: theme.spacing(0.5),
                        flex: 1,
                    }}
                    multiline
                    maxRows={4}
                    size="small"
                    value={message}
                    onKeyDown={keyPress}
                    onChange={msgChange}
                />
                <IconButton size={'large'} color={'secondary'} disabled={!message} onClick={doSend}>
                    <SendIcon />
                </IconButton>
            </Box>
            <Box
                sx={{
                    padding: '3px 10px',
                    textAlign: 'right',
                    display: process.env.NODE_ENV !== 'production' ? 'block' : 'none',
                }}
            >
                <a href="#" className="fa fa-thumbs-up"></a>
                <a href="#" className="fa fa-camera"></a>
                <a href="#" className="fa fa-video-camera"></a>
                <a href="#" className="fa fa-image"></a>
                <a href="#" className="fa fa-paperclip"></a>
                <a href="#" className="fa fa-link"></a>
                <a href="#" className="fa fa-trash-o"></a>
                <a href="#" className="fa fa-search"></a>
            </Box>
        </>
    );
};

export default ChatInput;
