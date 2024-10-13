import React, { PropsWithChildren, useEffect, useCallback, useState} from 'react';
import clsx from "clsx";
import {nanoid} from "nanoid";
import toSafeInteger from "lodash/toSafeInteger";
import {useTranslation} from "react-i18next";

import Box from '@mui/material/Box';
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Popover from "@mui/material/Popover";
import Skeleton from "@mui/material/Skeleton";
import Stack from '@mui/material/Stack';

import {AvatarSizeType, Icons, UserIconType} from "./Interfaces";
import Avatar from "./Avatar";
import userCache from "../../app/userCache";
import UserRatings from "./UserRatings";
import InfoBox from "./InfoBox";
import UserTitle from "./UserTitle";
import UserNameElement from "./UserNameElement";
import {IUser} from "../../models/user/IUser";
import {apiGet} from "../../api/Api";
import {defaultOf} from "../../utils/propsUtils";
import {useDefaults} from "../../hooks/useDefaults";

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

type propsWithDefaults = 'language' | 'size' | 'icon' | 'withFlag' | 'compact' | 'controls' | 'popover';
const defaultProps: defaultOf<Props, propsWithDefaults> = {
    language: 'ru-ru',
    size: 'medium',
    icon: Icons.NONE,
    withFlag: false,
    compact: true,
    controls: false,
    popover: true
};

const UserBadge: React.FC<PropsWithChildren<Props>> = ({children, ...propsIn}) => {
    const props = useDefaults(propsIn, defaultProps);
    const { language, user: propsUser, userId, size, popover, compact } = props;

    const { t, ready } = useTranslation(['actions'], { useSuspense: false });

    const [user, setUser] = useState(props.user);
    const [loading, setLoading] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState<HTMLSpanElement | null>(null);
    const [popupId, setPopupId] = useState("");

    useEffect(() => {
        if (!loading && !propsUser?.id && userId) {
            const uid = toSafeInteger(userId);
            const cachedUser = userCache.get(uid);
            if (cachedUser) {
                setUser(cachedUser);
            } else {
                setLoading(true);
                apiGet(`/user/mini/${uid}`)
                    .then((userData) => {
                        if (userData) {
                            setLoading(false);
                            setUser(userData);
                            userCache.set(uid, userData);
                        }
                    })
                    .catch(function(error) {
                        console.error('Looks like there was a problem when reading user data: \n', error);
                    });
            }
        }
    }, [loading, propsUser, userId]);

    const getDisplay = useCallback(() => {
        if (user) {
            return (user.display && (user.display != '?')) ? user.display : user.name;
        }

        return undefined;
    }, [user]);

    const renderUserLinkSimple = useCallback(() => {
        if (user) {
            const unClass = ["username"];
            if (user?.status) {
                unClass.push(user.status);
            }

            const userLink = `/${language}/@/${user.id}`;
            return(
                <a href={userLink} className={clsx(unClass)}>{getDisplay()}</a>
            );
        }

        return null;
    }, [getDisplay, language, user]);

    const renderUserLink = useCallback(() =>  {
        if (user) {
            const unClass = ["username"];
            if (user.status) {
                unClass.push(user.status);
            }

            if (popover && user.id) {
                unClass.push('cursor');
                const handleClose = () => {
                    setAnchorEl(null);
                };

                const open = Boolean(anchorEl);

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
                        >{getDisplay()}</Box>
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
                                        <Box title={getDisplay()} sx={{mb: .25}}>
                                            <UserTitle title={user.title} />
                                            {renderUserLinkSimple()}
                                        </Box>
                                        <UserNameElement user={user} compact={false} />
                                    </InfoBox>
                                </Box>
                                <UserRatings user={user} />
                                <Box className={"pt-2 mt-2 border-top w-100"} sx={{display: "flex"}}>
                                    <Stack direction="row" spacing={3}>
                                        <Stack direction="row" spacing={1}>
                                            <IconButton
                                                href={`/${language}/@/${user.id}`}
                                                title={t('open_profile')}
                                                aria-label={t('open_profile')}
                                                size="small">
                                                <Icon baseClassName="" data-icon="r" />
                                            </IconButton>
                                            <IconButton
                                                href={`/${language}/user/statistics/${user.id}`}
                                                title={t('open_statistics')}
                                                aria-label={t('open_statistics')}
                                                size="small">
                                                <Icon baseClassName="" className="xi-chart-line" />
                                            </IconButton>
                                        </Stack>
                                        <Stack direction="row" spacing={1}>
                                            <IconButton
                                                href={`/${language}/pm/compose/${user.id}`}
                                                title={t('compose_mail')}
                                                aria-label={t('compose_mail')}
                                                size="small">
                                                <Icon baseClassName="" className="xi-mail-big" />
                                            </IconButton>
                                            <IconButton
                                                href={`/${language}/game/challenge/${user.id}`}
                                                title={t('send_challenge')}
                                                aria-label={t('send_challenge')}
                                                size="small">
                                                <Icon baseClassName="" className="xi-challenge" />
                                            </IconButton>
                                        </Stack>
                                    </Stack>
                                </Box>
                            </Box>
                        </Popover>
                    </>
                );
            } else {
                if (user.id) {
                    const userLink = `/${language}/@/${user.id}`;
                    return(
                        <a href={userLink} className={clsx(unClass)}>{getDisplay()}</a>
                    );
                } else {
                    return(
                        <span className={clsx(unClass)}>{getDisplay()}</span>
                    );
                }
            }
        }

        return null;
    }, [user, popover, anchorEl, getDisplay, popupId, renderUserLinkSimple, language, t]);

    const renderInfo = (user: IUser) => {
        return (
            <InfoBox>
                <Box title={getDisplay()} sx={{mb: .25}}>
                    <UserTitle title={user.title} />
                    {renderUserLink()}
                </Box>
                <UserNameElement user={user} compact={compact}>{children}</UserNameElement>
            </InfoBox>
        );
    };

    return (
        <Box sx={{display: "inline-flex", flexWrap: "nowrap", maxWidth: "100%"}}>
            <Avatar user={ready ? user : undefined} size={size} online={user?.online ? user.online : 'none'} />
            { (ready && user) ? renderInfo(user) : (
                <Skeleton sx={{ mx: 1 }} animation="wave" height={24} width="10em" />
            )}
        </Box>
    );
};

export default UserBadge;