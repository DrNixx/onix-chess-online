import React, { useEffect} from 'react';
import { nanoid } from 'nanoid';
import classNames from 'classnames';
import isString from "lodash/isString";
import {OverlayTrigger, Popover, PopoverProps} from "react-bootstrap";
import { Logger } from '../../common/Logger';
import { IChessUser } from '../../chess/types/Interfaces';
import {AvatarSizeType, Icons, UserIconType} from "./Interfaces";
import {Avatar} from "./Avatar";


export interface IUserNameProps {
    language?: string;
    user?: IChessUser;
    size?: AvatarSizeType;
    icon?: UserIconType;
    showInfo?: boolean;
    withFlag?: boolean;
    compact?: boolean;
    controls?: boolean;
    popover?: boolean;
}

export interface IUserNameState {
    popoverContent?: string;
}

export class UserName extends React.Component<IUserNameProps, IUserNameState> {
    public static defaultProps: IUserNameProps = {
        language: 'ru-ru',
        user: { name: '?' },
        size: 'Medium',
        icon: Icons.NONE,
        showInfo: true,
        withFlag: false,
        compact: false,
        controls: false,
        popover: true
    }

    /**
     * constructor
     */
    constructor(props: IUserNameProps) {
        super(props);

        this.state = {
            popoverContent: undefined
        };

    }

    private miniCallback = (text: string) => {
        this.setState({
            popoverContent: text
        });
    };

    private getPopoverContent = () => {
        const { popoverContent } = this.state;
        if (popoverContent) {
            return (
                <Popover.Content dangerouslySetInnerHTML={{ __html: popoverContent }} />
            );
        } else {
            return (
                <Popover.Content>
                    <div className="text-center">
                        <div className="progress-circle-indeterminate m-t-45" />
                    </div>
                </Popover.Content>
            );
        }
    };

    private onPopupToggle = (show: boolean) => {
        const { language } = this.props;
        const { popoverContent } = this.state;

        if (show && !popoverContent) {
            const { user } = this.props;
            const popoverLink = `/${language}/user/mini/${user?.id ?? 1}`;
            const { miniCallback } = this;
            fetch(popoverLink, {mode: "cors"})
                .then(function(response) {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }

                    return response.text();
                })
                .then(function(responseAsText) {
                    miniCallback(responseAsText);
                })
                .catch(function(error) {
                    Logger.error('Looks like there was a problem when reading data: \n', error);
                });
        }
    };

    private popoverElement = () => {
        const UpdatingPopover = React.forwardRef(
            ({ popper, children, show: _, ...props }:  PopoverProps, ref) => {
                useEffect(() => {
                    popper.scheduleUpdate();
                }, [children, popper]);

                return (
                    <Popover ref={ref} {...props}>
                        {children}
                    </Popover>
                );
            },
        );


        return (
            <UpdatingPopover id={nanoid(8)} className="username-popup">
                {this.getPopoverContent()}
            </UpdatingPopover>
        );
    }

    private renderUsername = (user: IChessUser) => {
        if (user.display && (user.display != user.name)) {
            return (
                <div className="small"><span>{user.name}</span></div>
            );
        }

        return null;
    }

    private renderTitle = (user: IChessUser) => {
        if (user.title) {
            if (isString(user.title)) {
                return (
                    <span className="label label-success text-uppercase fs-10 mr-1"
                          data-toggle="tooltip"
                          title="">{user.title}</span>
                );
            } else {
                return (
                    <span className="label label-success text-uppercase fs-10 mr-1"
                          data-toggle="tooltip"
                          title={user.title.name}>{user.title.id}</span>
                );
            }
        }

        return null;
    };

    private renderUserLink = (user: IChessUser, userLink: string) =>  {
        const { popover } = this.props;

        const unClass = ["username", "cursor"];
        if (user.status) {
            unClass.push(user.status);
        }

        const display = user.display ?? user.name;

        if (popover) {
            return (
                <OverlayTrigger rootClose={true} trigger="click" placement="auto" onToggle={this.onPopupToggle} overlay={this.popoverElement()}>
                    <span className={classNames(unClass)}>{display}</span>
                </OverlayTrigger>
            );
        } else {
            return(
                <a href={userLink} className={classNames(unClass)}>{display}</a>
            );
        }
    };

    private renderInfo = (user: IChessUser, userLink: string) => {
        const { showInfo } = this.props;
        if (showInfo) {
            return (
                <div className="info-wrapper">
                    <div title={user.display}>
                        {this.renderTitle(user)}
                        {this.renderUserLink(user, userLink)}
                    </div>
                    {this.renderUsername(user)}
                </div>
            );
        }

        return null;
    };

    render() {
        const { user, size, language } = this.props;

        if (user) {
            const userLink = `/${language}/@/${user.id}`;
            return (
                <div className="username-block">
                    <div className="upic-wrapper">
                        <div className="tiny rounded upic"
                             data-online-mark="0"
                             data-user-raw="1"
                             data-online-time={user.online ? user.online : 'none'}
                             data-user-id={user.id}><a href={userLink}><Avatar user={user} size={size} /></a>
                        </div>
                    </div>
                    { this.renderInfo(user, userLink) }
                </div>
            );
        }

        return null;
    }
}
