import Centrifuge from "centrifuge";

export interface IApplication {
    stream: Centrifuge|null;

    getUserId(): number;
}

declare global {
    interface Window {
        chessApp: IApplication;
    }
}

export var appInstance: IApplication|null = null;

export const setAppInstance = (app: IApplication) => {
    appInstance = app;
    window.chessApp = app;
}