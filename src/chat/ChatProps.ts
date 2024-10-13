import {IChatMessage} from "./Interfaces";

export type ChatProps = {
    channel: string;
    apiUrl: string;
    messages: IChatMessage[];
    userid?: number;
};