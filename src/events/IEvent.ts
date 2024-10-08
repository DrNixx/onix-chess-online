import { IEventArgs, IEventArgs1 } from './IEventArgs';
import { IEventHandler, IEventHandler1 } from './IEventHandler';

export interface IEvent {
    OnHandlerAttached: () => void;
    OnHandlerAttachedContext: any;
    OnHandlerDettached: () => void;
    OnHandlerDettachedContext: any;
    
    bind(handler: IEventHandler): void;
    bindFor(handler: IEventHandler, triggerCount: number): void;
    unbind(handler: IEventHandler): void;
    hasBindings(handler: IEventHandler): boolean;
    trigger(args: IEventArgs): void;
    fire(sender: any, data?: any): void;
}

export interface IEvent1<T> extends IEvent {
    bind(handler: IEventHandler1<T>): void;
    bindFor(handler: IEventHandler1<T>, triggerCount: number): void;
    unbind(handler: IEventHandler1<T>): void;
    hasBindings(handler: IEventHandler1<T>): boolean;
    trigger(args: IEventArgs1<T>): void;
    fire(sender: any, data: T): void;
}
