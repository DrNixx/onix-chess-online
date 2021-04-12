import { IUser } from '../app/IUser';

export interface INotify {
    id: string,
    read: boolean,
    ago: number,
    timeAgo: string,
    content?: INotifyContent | INotifyPmContent | INotifyMoveContent,
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

export interface INotifyMoveContent extends INotifyContent
{
    id: number;

    opponent: IUser;

    san: string;
}