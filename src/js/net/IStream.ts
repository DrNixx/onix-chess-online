import { IStreamMessage } from "./IStreamMessage";
import { ConnectionStatus } from "./ConnectionStatus";
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subscription } from 'rxjs/internal/Subscription';

export interface IStream {
    connectionStatus$: BehaviorSubject<ConnectionStatus>;

    subscribe(name: string, message: (value: IStreamMessage) => void, error?: (error: any) => void, complete?: () => void): Subscription;
    removeChannel(channel: string): void;
    removeAll(): void;
}