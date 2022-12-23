import {IUser} from "../user/IUser";

type NOTIFY = 'notify';
type CHAT = 'chat';
type GAME = 'game';

export const NOTIFY: NOTIFY = 'notify';
export const CHAT: CHAT = 'chat';

export const GAME: GAME = 'game';

export type INotifyContext = {
    c: string;
    r?: string;
};

export type IChatContext = {
    id: string;
    date: number;
    sender: IUser;
    text: string;
    allread?: boolean;
};

export type IGameContext = {
    c: string;
    t?: number;
    m?: string;
};

type INotifyMessage = {
    t: NOTIFY;
    ctx: INotifyContext;
};

type IChatMessage = {
    t: CHAT;
    ctx: IChatContext | IChatContext[];
};

type IGameMessage = {
    t: GAME;
    ctx: IGameContext;
};

export type IStreamMessage = INotifyMessage | IChatMessage | IGameMessage;