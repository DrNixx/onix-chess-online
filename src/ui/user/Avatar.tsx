import React, {PropsWithChildren} from 'react';
import clsx from "clsx";
import {Md5} from 'ts-md5';
import BaseAvatar from '@mui/material/Avatar';
import Skeleton from "@mui/material/Skeleton";
import PersonIcon from "@mui/icons-material/Person";
import { AvatarSizeType } from './Interfaces';
import {IUser} from "../../models/user/IUser";

type Props = {
    user?: IUser,
    size?: AvatarSizeType
    online?: string|true;
    className?: string;
};

const defaultProps = {
    user: undefined,
    size: 'medium' as AvatarSizeType
};

const Avatar: React.FC<PropsWithChildren<Props>> = (propsIn) => {
    const props = { ...defaultProps, ...propsIn };
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

    const name = (user?.display ?? user?.name) ?? '???';

    type AvatarSx = {
        width?: number;
        height?: number;
        borderStyle?: string;
        borderWidth?: number;
        borderColor?: string
    };

    const sx: AvatarSx = {};

    if (size !== 'medium') {
        sx.width = sx.height = sizes[size];
    }


    const avatarUser = (id: number | string) => {
        const url = getAvatarUrl(id, size);

        let onlineTime: string|undefined = undefined;
        if (online) {
            sx.borderStyle = 'solid'
            sx.borderWidth = borders[size];
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
            <BaseAvatar className={clsx(className, size) }
                        alt={name}
                        src={url}
                        sx={sx}
                        data-online-time={onlineTime}
            >{children}</BaseAvatar>
        );
    };

    const avatarDefault = () => {
        return (
            <BaseAvatar className={clsx(className, size) }
                        alt={name}
                        sx={sx}
            ><PersonIcon /></BaseAvatar>
        );
    };

    const avatarSkeleton = () => {
        return (
            <Skeleton
                animation="wave"
                variant="circular"
                sx={{
                    flexBasis: sizes[size],
                    flexShrink: 0
                }}
                width={sizes[size]}
                height={sizes[size]} />
        );
    };

    if (user) {
        if (user.id) {
            return avatarUser(user.id);
        } else {
            return avatarDefault();
        }
    } else {
        return avatarSkeleton();
    }
};

export default Avatar;
