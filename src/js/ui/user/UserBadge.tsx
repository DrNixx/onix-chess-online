import React, { useEffect, useCallback, useState} from 'react';
import clsx from "clsx";
import {nanoid} from "nanoid";
import toSafeInteger from "lodash/toSafeInteger";

import Box from '@mui/material/Box';
import Skeleton from "@mui/material/Skeleton";

import {IUser} from "../../app";
import {AvatarSizeType, Icons, UserIconType} from "./Interfaces";
import Avatar from "./Avatar";
import isString from "lodash/isString";
import userCache from "../../app/userCache";
import {Logger} from "../../common/Logger";
import {appInstance} from "../../app/IApplication";
import Popover from "@mui/material/Popover";
import UserRatings from "./UserRatings";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Stack from '@mui/material/Stack';
import {_} from "../../i18n/i18n";

type Props = {
    language?: string;
    user?: IUser;
    userId?: number|string;
    size?: AvatarSizeType;
    icon?: UserIconType;
    withFlag?: boolean;
    compact?: boolean;
    controls?: boolean;
    popover?: boolean;
};

const InfoBox: React.FC = (props) => {
    return (
        <Box sx={{
            pl: 1,
            lineHeight: 1,
            overflow: "hidden",
            "& > div": {
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis"
            }
        }}>
            {props.children}
        </Box>
    );
};

type UserTitleProps = {
    title?: IUser['title']
};
const UserTitle: React.VFC<UserTitleProps> = (props) => {
    if (props.title) {
        if (isString(props.title)) {
            return (
                <span className="label label-success text-uppercase fs-10 lh-20 me-1"
                      data-toggle="tooltip"
                      title="">{props.title}</span>
            );
        } else {
            return (
                <span className="label label-success text-uppercase fs-10 lh-20 me-1"
                      data-toggle="tooltip"
                      title={props.title.name}>{props.title.id}</span>
            );
        }
    }

    return null;
}

type UserNameProps = {
    user: IUser;
    compact: boolean;
};

const UserName: React.FC<UserNameProps> = (props) => {
    const { user, compact, children } = props;
    const name = (user.display && user.name && (user.display != '?') && (user.name != '?') && (user.display != user.name)) ? user.name : undefined;
    const separator = (name && !compact) ? " :: " : "";
    return (
        <Box
            className="small"
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                flexWrap: 'nowrap'
            }}>
                        <span>
                            {!compact && <span># {user.id}</span>}
                            {name && <span>{separator}{name}</span>}
                        </span>
            { children ? (<span className="ps-4">{children}</span>) : null }
        </Box>
    );
};

const UserBadge: React.FC<Props> = (props) => {
    const { language, user: propsUser, userId, size, popover, compact, children } = props;

    const [user, setUser] = useState(props.user);
    const [loading, setLoading] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState<HTMLSpanElement | null>(null);
    const [popupId, setPopupId] = useState("");

    useEffect(() => {
        if (!loading && !propsUser?.id && userId) {
            const uid = toSafeInteger(userId);
            let cachedUser = userCache.get(uid);
            if (cachedUser) {
                setUser(cachedUser);
            } else {
                if (appInstance) {
                    setLoading(true);
                    fetch(appInstance.getApiUrl(`/user/mini/${uid}`), {mode: "cors"})
                        .then((response) => {
                            if (!response.ok) {
                                throw Error(response.statusText);
                            }
                            // Read the response as json.
                            return response.json();
                        })
                        .then((userData) => {
                            if (userData) {
                                setLoading(false);
                                setUser(userData);
                                userCache.set(uid, userData);
                            }
                        })
                        .catch(function(error) {
                            Logger.error('Looks like there was a problem when reading user data: \n', error);
                        });
                }
            }
        }
    }, [propsUser, userId]);

    const renderUserLinkSimple = () => {
        if (user) {
            const unClass = ["username"];
            if (user!.status) {
                unClass.push(user!.status);
            }

            const display = (user.display && (user.display != '?')) ? user.display : user.name;
            const userLink = `/${language}/@/${user.id}`;
            return(
                <a href={userLink} className={clsx(unClass)}>{display}</a>
            );
        }

        return null;
    };

    const renderUserLink = useCallback(() =>  {
        if (user) {
            const unClass = ["username", "cursor"];
            if (user.status) {
                unClass.push(user.status);
            }

            const display = (user.display && (user.display != '?')) ? user.display : user.name;

            if (popover && user.id) {
                return (
                    <>
                        <Box
                            className={clsx(unClass)}
                            component="span"
                            onClick={(event: React.MouseEvent<HTMLSpanElement>) => {
                                if (!anchorEl) {
                                    setAnchorEl(event.currentTarget);
                                    setPopupId(nanoid(8));
                                }
                            }}
                        >{display}</Box>
                        {renderPopover(user)}
                    </>
                );
            } else {
                if (user.id) {
                    const userLink = `/${language}/@/${user.id}`;
                    return(
                        <a href={userLink} className={clsx(unClass)}>{display}</a>
                    );
                } else {
                    return(
                        <span className={clsx(unClass)}>{display}</span>
                    );
                }
            }
        }

        return null;
    }, [user, popover, anchorEl, language]);

    const renderPopover = (user: IUser) => {
        const handleClose = () => {
            setAnchorEl(null);
        };

        const open = Boolean(anchorEl);

        return (
            <Popover
                id={popupId}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box sx={{ padding: 1, width: 280 }}>
                    <Box
                        className="pb-2 mb-2 border-bottom w-100"
                        sx={{display: "inline-flex", flexWrap: "nowrap", maxWidth: "100%"}}
                    >
                        <Avatar user={user} size="medium" online={user?.online ? user.online : 'none'} />
                        <InfoBox>
                            <Box title={user?.display} sx={{mb: .25}}>
                                <UserTitle title={user.title} />
                                {renderUserLinkSimple()}
                            </Box>
                            <UserName user={user} compact={false} />
                        </InfoBox>
                    </Box>
                    <UserRatings user={user} />
                    <Box className={"pt-2 mt-2 border-top w-100"} sx={{display: "flex"}}>
                        <Stack direction="row" spacing={3}>
                            <Stack direction="row" spacing={1}>
                                <IconButton
                                    href={`/${language}/@/${user.id}`}
                                    title={_('actions', 'open_profile')}
                                    aria-label={_('actions', 'open_profile')}
                                    size="small">
                                    <Icon baseClassName="" data-icon="r" />
                                </IconButton>
                                <IconButton
                                    href={`/${language}/user/statistics/${user.id}`}
                                    title={_('actions', 'open_statistics')}
                                    aria-label={_('actions', 'open_statistics')}
                                    size="small">
                                    <Icon baseClassName="" className="xi-chart-line" />
                                </IconButton>
                            </Stack>
                            <Stack direction="row" spacing={1}>
                                <IconButton
                                    href={`/${language}/pm/compose/${user.id}`}
                                    title={_('actions', 'compose_mail')}
                                    aria-label={_('actions', 'compose_mail')}
                                    size="small">
                                    <Icon baseClassName="" className="xi-mail-big" />
                                </IconButton>
                                <IconButton
                                    href={`/${language}/game/challenge/${user.id}`}
                                    title={_('actions', 'send_challenge')}
                                    aria-label={_('actions', 'send_challenge')}
                                    size="small">
                                    <Icon baseClassName="" className="xi-challenge" />
                                </IconButton>
                            </Stack>
                        </Stack>
                    </Box>
                </Box>
            </Popover>
        );
    };

    const renderInfo = (user: IUser) => {
        return (
            <InfoBox>
                <Box title={user.display} sx={{mb: .25}}>
                    <UserTitle title={user.title} />
                    {renderUserLink()}
                </Box>
                <UserName user={user} compact={!!compact}>{children}</UserName>
            </InfoBox>
        );
    };

    return (
        <Box sx={{display: "inline-flex", flexWrap: "nowrap", maxWidth: "100%"}}>
            <Avatar user={user} size={size} online={user?.online ? user.online : 'none'} />
            { user?.id ? renderInfo(user) : (
                <Skeleton animation="wave" height={24} width="10em" />
            )}
        </Box>
    );
};

UserBadge.defaultProps = {
    language: 'ru-ru',
    user: {
        id: undefined,
        name: '?',
        display: '?'
    },
    size: 'medium',
    icon: Icons.NONE,
    withFlag: false,
    compact: true,
    controls: false,
    popover: true
};

export default UserBadge;