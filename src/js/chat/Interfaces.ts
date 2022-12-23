import {IUser} from "../models/user/IUser";

export interface IChatMessage {
    id: string;
    date: number;
    sender: IUser;
    text: string;
    allread?: boolean;
}