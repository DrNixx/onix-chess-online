import { IEventArgs, IEventArgs1 } from './IEventArgs';
import { IEventHandler, IEventHandler1 } from './IEventHandler';

export class EventHandler implements IEventHandler {
    /**
     * constructor
     */
    constructor(public Callback: (args: IEventArgs) => void, public Context: any) {
    }

    /**
     * Calls the method for handling events in the context of the called object.
     */
    public invoke(args: IEventArgs) {
        this.Callback.call(this.Context, args);
    }
}

export class EventHandler1<T> extends EventHandler implements IEventHandler1<T> {
    /**
     * constructor
     */
    constructor(Callback: (args: IEventArgs1<T>) => void, Context: any) {
        super(<any>Callback, Context);
    }

    /**
     * Calls the method for handling events in the context of the called object.
     */
    public invoke(args: IEventArgs1<T>) {
        super.invoke(args);
    }
}