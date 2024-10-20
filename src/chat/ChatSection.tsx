import React, {useCallback, forwardRef, ForwardedRef, useContext, useMemo} from 'react';
import clsx from 'clsx';
import Grid from '@mui/material/Grid2';

import { IChatRoom, IChatSection } from '../models/Chat';
import ChatMessage from './ChatMessage';
import {AuthContext} from "../providers/AuthProvider";
import UserBadge from "../components/user/UserBadge";
import Avatar from "../components/user/Avatar";

type Props = {
    room: IChatRoom;
    section: IChatSection;
};

const ChatSection = forwardRef(function (props: Props, ref: ForwardedRef<HTMLDivElement>) {
    const { room, section } = props;

    const { getUserId } = useContext(AuthContext);
    const userId = useMemo(() => {
        return getUserId();
    }, [getUserId]);

    const getSide = useCallback(() => {
        return section.sender?.id == userId ? 'right' : 'left';
    }, [section.sender?.id, userId]);

    const attachClass = useCallback(
        (index: number) => {
            const result: string[] = [];
            if (index === 0) {
                result.push(`${getSide()}First`);
            }
            if (index === section.messages.length - 1) {
                result.push(`${getSide()}Last`);
            }

            return result;
        },
        [getSide, section.messages.length],
    );

    const renderUser = useCallback(() => {
        return section.sender?.id == userId ? (
            <Avatar user={section.sender} size={'small'} online={section.sender?.online ? section.sender.online : 'none'} />
        ) : (
            <UserBadge
                user={section.sender}
                size={'small'}
                popover={false}
            />
        );
    }, []);

    const side = getSide();

    return (
        <Grid
            ref={ref}
            container
            spacing={2}
            justifyContent={side === 'right' ? 'flex-end' : 'flex-start'}
            sx={{ pb: 1 }}
        >
            {side === 'left' && section.sender && (
                <Grid>{renderUser()}</Grid>
            )}
            <Grid size={8}>
                {section.messages.map((msg, i) => (
                    <ChatMessage
                        key={msg.id}
                        room={room}
                        msg={msg}
                        side={side}
                        className={clsx(side, attachClass(i))}
                    />
                ))}
            </Grid>
        </Grid>
    );
});

export default ChatSection;
