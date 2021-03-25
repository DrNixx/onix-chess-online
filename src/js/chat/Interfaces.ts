import { IUser } from "../app";

export interface IChatMessage {
    id: string;
    date: number;
    sender: IUser;
    text: string;
    allread?: boolean;
}