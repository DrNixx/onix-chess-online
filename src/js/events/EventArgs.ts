import { IEventArgs, IEventArgs1 } from './IEventArgs';

export class EventArgs implements IEventArgs {
    /**
     * constructor
     */
    constructor(public Sender: any) {
    }
}

export class EventArgs1<T> extends EventArgs implements IEventArgs1<T> {
    /**
     * constructor
     */
    constructor(Sender: any, public EventData: T) {
        super(Sender);
    }
}