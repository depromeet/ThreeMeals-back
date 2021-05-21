import { EventEmitter2 } from 'eventemitter2';
import { IDomainEvent } from './IDomainEvent';

export abstract class EventHandler<DomainEvent extends IDomainEvent<any>> {
    abstract handle(event: DomainEvent): void | Promise<void>;
    abstract eventName(): string;
    listen(eventEmitter: EventEmitter2): void {
        eventEmitter.on(this.eventName(), this.handle.bind(this));
    }
}
