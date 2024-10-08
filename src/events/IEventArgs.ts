export interface IEventArgs {
    Sender: any;
}

export interface IEventArgs1<T> extends IEventArgs {
    EventData: T;
}