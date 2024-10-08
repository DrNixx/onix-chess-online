import {IUser} from "../models/user/IUser";

export interface INotify {
    id: string,
    read: boolean,
    ago: number,
    timeAgo: string,
    content?: INotifyContent,
}

export interface INotifyContent {
    type: string;
}

export interface INotifyPmContent extends INotifyContent
{
    sender: IUser;

    id: number;

    subject: string;

    text: string;
}

export interface IChallengeNewContent extends INotifyContent
{
    id: number;

    opponent: IUser;
}

export interface IChallengeCancelContent extends INotifyContent
{
    id: number;

    opponent: IUser;
}

export interface IChallengeDeclineContent extends INotifyContent
{
    id: number;

    opponent: IUser;
}

export interface IChallengeAcceptContent extends INotifyContent
{
    id: number;

    opponent: IUser;
}

export interface IJoinAcceptContent extends INotifyContent
{
    id: number;

    opponent: IUser;
}

export interface INotifyMoveContent extends INotifyContent
{
    id: number;

    opponent: IUser;

    san: string;
}