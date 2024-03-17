import {IModule} from "./IModule";

export type ChessApplicationProps = {
    locale?: string,
    uid?: number | string,
    channel?: string,
    token?: string,
    secret?: string,
    wsHost?: string,
    apiRoot?: string;
    ui?: boolean,
    sw?: boolean,
    modules?: IModule[],
};