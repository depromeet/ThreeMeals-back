import { EventEmitter2 } from 'eventemitter2';
import { IDomainEvent } from './common/IDomainEvent';

export interface IEventPublisher {
    publish(domainEvent: IDomainEvent<any>): void;
    publishAsync(domainEvent: IDomainEvent<any>): Promise<void>;
}

export class EventPublisher implements IEventPublisher {
    constructor(private emitter: EventEmitter2) {}

    publish(domainEvent: IDomainEvent<any>): void {
        this.emitter.emit(domainEvent.eventName, domainEvent);
    }

    async publishAsync(domainEvent: IDomainEvent<any>): Promise<void> {
        await this.emitter.emitAsync(domainEvent.eventName, domainEvent);
    }
}
