export interface IApplication {
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