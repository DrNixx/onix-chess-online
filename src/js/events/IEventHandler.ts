import { IEventArgs, IEventArgs1 } from './IEventArgs';

export interface IEventHandler {
    Context: any;
    Callback: (args: IEventArgs) => void;
    invoke(args: IEventArgs): void;
}

export interface IEventHandler1<T> extends IEventHandler {
    invoke(args: IEventArgs1<T>): void;
}