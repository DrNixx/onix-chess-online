import {IModule} from "./IModule";

export type ChessApplicationProps = {
    locale?: string,
    uid?: number | string,
    apiRoot?: string;
    ui?: boolean,
    sw?: boolean,
    modules?: IModule[],
};