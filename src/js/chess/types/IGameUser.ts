import { IChessUser, IUserAnalysis } from "./Interfaces";

export interface IGameUser extends IChessUser {
    display?: string,
    aurl?: string,
    rating?: number,
    zone?: number,
    zone_name?: string,
    timer?: number,
    postpone?: number,
    analysis?: IUserAnalysis,
    moveCentis?: number[]
}