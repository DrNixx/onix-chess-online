import { IDisposable, ITyped } from '../common/Types';
import { IEventArgs, IEventArgs1 } from './IEventArgs';
import { IEventHandler, IEventHandler1 } from './IEventHandler';
import { IEvent, IEvent1 } from './IEvent';
import { EventArgs, EventArgs1 } from './EventArgs';
import { EventHandler } from './EventHandler';

export class Event implements IDisposable, ITyped, IEvent {
    public _type = "Event";

    private handlers: IEventHandler[];

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public OnHandlerAttached: () => void = ()=> { };

    public OnHandlerAttachedContext: any = null;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public OnHandlerDettached: () => void = () => { };
    
    public OnHandlerDettachedContext: any = null;

    /**
     * constructor
     */
    constructor() {
        this.handlers = [];
    }

    /**
     * Determines whether the specified handler is bound to the event.
     */
    public hasBinding(handler: IEventHandler): boolean {
        return this.handlers.indexOf(handler) > -1;
    }

    /**
     * Determines whether the Event has active bindings.
     */
    public hasBindings(): boolean {
        return this.handlers.length > 0;
    }

    /**
     * Associates the handler with the Event object.
     * @param handler Event handler.
     */
    public bind(handler: IEventHandler): void {
        if (!this.hasBinding(handler)) {
            this.handlers.push(handler);
            if (this.OnHandlerAttached !== null) {
                this.OnHandlerAttached.call(this.OnHandlerAttachedContext);
            }
        }
    }

    /**
     * Associates the event handler with the Event object to execute no more than the specified number of times.
     * After the specified number of times, the action is disconnected from the handler.
     * @param handler Event handler.
     * @param triggerCount Number of calls before the handler is disconnected.
     */
    public bindFor(handler: IEventHandler, triggerCount: number): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const that = this;
        let triggers = 0;
        const wire: IEventHandler = new EventHandler((args: IEventArgs) => {
            if (++triggers >= triggerCount) {
                that.unbind(wire);
            }

            handler.invoke(args);
        }, handler.Context);

        this.handlers.push(wire);
    }

    /**
     * Disconnects the specified handler from the Event.
     * @param handler Event handler.
     */
    public unbind(handler: IEventHandler): void {
        for (let i = 0; i < this.handlers.length; i++) {
            if (this.handlers[i] === handler) {
                this.handlers.splice(i, 1);
                return;
            }
        }
    }

    /**
     * Executes all linked handlers.
     */
    public trigger(args: IEventArgs): void {
        let handlers: IEventHandler[];

        if (this.hasBindings()) {
            handlers = this.handlers.slice(0);

            for (let i = 0; i < handlers.length; i++) {
                handlers[i].invoke(args);
            }
        }
    }

    /**
     * Make arguments and execute
     * @param sender Event sender
     * @param data Event data
     */
    public fire(sender: any, data?: any) {
        this.trigger(new EventArgs(sender));
    }

    /**
     * Deletes an event and deletes the binding of all related handlers.
     */
    public dispose(): void {
        this.handlers = [];
    }
}

export class Event1<T> extends Event implements IEvent1<T> {
    public _type = "Event1";
    /**
     * Event handlers
     */
    Handlers: IEventHandler1<T>[] = [];

    /**
     * Associates the handler with the Event object.
     * @param handler Event handler.
     */
    public bind(handler: IEventHandler1<T>): void {
        super.bind(handler);
    }

    /**
     * Disconnects the specified handler from the Event.
     * @param handler Event handler.
     */
    public unbind(handler: IEventHandler1<T>): void {
        super.unbind(handler);
    }

    /**
     * Determines whether the specified handler is bound to the event.
     */
    public hasBinding(handler: IEventHandler1<T>): boolean {
        return super.hasBinding(handler);
    }

    /**
     * Executes all linked handlers.
     */
    public trigger(args: IEventArgs1<T>) {
        super.trigger(args);
    }

    /**
     * Make arguments and execute
     * @param sender Event sender
     * @param data Event data
     */
    public fire(sender: any, data: T) {
        this.trigger(new EventArgs1<T>(sender, data));
    }
}