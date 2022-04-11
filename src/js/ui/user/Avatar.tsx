import React from 'react';
import clsx from "clsx";
import {Md5} from 'ts-md5/dist/md5';
import BaseAvatar from '@mui/material/Avatar';
import Skeleton from "@mui/material/Skeleton";
import { IUser } from '../../app';
import { AvatarSizeType } from './Interfaces';

type Props = {
    user?: IUser,
    size?: AvatarSizeType
    online?: string|true;
    className?: string;
};

const Avatar: React.FC<Props> = (props) => {
    const {user, size, online, className, children} = props;
    const sizes = {
        'tiny': 24,
        'small': 32,
        'medium': 40,
        'large': 56,
        'extra': 80,
        'original': 160
    };

    const borders = {
        'tiny': 1,
        'small': 2,
        'medium': 2,
        'large': 3,
        'extra': 3,
        'original': 4
    };

    const getAvatarUrl = (id: number|string, size: AvatarSizeType = "small") => {
        const key: string = Md5.hashStr(`UserAvatar|${id}`) + ".jpeg";
        const ch = key[0];
        return `https://a0${ch}.chess-online.com/userpics/${key}?size=${size}`;
    }

    const url = (user) ? getAvatarUrl(user.id ?? 1, size) : '???';
    const name = user?.display ?? '???';

    type AvatarSx = {
        width?: number;
        height?: number;
        borderStyle?: string;
        borderWidth?: number;
        borderColor?: string
    };

    const sx: AvatarSx = {};

    if (size !== 'medium') {
        sx.width = sx.height = sizes[size!];
    }


    let onlineTime: string|undefined = undefined;
    if (online) {
        sx.borderStyle = 'solid'
        sx.borderWidth = borders[size!];
        if (online === true) {
            onlineTime = 'now';
        } else if (online === 'none') {
            onlineTime = 'none';
            sx.borderColor = '#000';
        } else {
            onlineTime = online;
        }
    }

    return (
        <>
            {!user?.id ? (
                <Skeleton
                    animation="wave"
                    variant="circular"
                    sx={{
                        flexBasis: sizes[size!],
                        flexShrink: 0
                    }}
                    width={sizes[size!]}
                    height={sizes[size!]} />
            ) : (
                <BaseAvatar className={clsx(className, size) }
                            alt={name}
                            src={url}
                            sx={sx}
                            data-online-time={onlineTime}
                >{children}</BaseAvatar>
            )}
        </>
    );
};

Avatar.defaultProps = {
    user: undefined,
    size: 'medium'
};

export default Avatar;
