import { EventEmitter2 } from 'eventemitter2';
import { IDomainEvent } from '../../domain/common/IDomainEvent';

export abstract class IEventPublisher {
    abstract dispatch(domainEvent: IDomainEvent<any>): void;
    abstract dispatch(domainEvents: IDomainEvent<any>[]): void;
    abstract dispatchAsync(domainEvent: IDomainEvent<any>): Promise<void>;
    abstract dispatchAsync(domainEvents: IDomainEvent<any>[]): Promise<void>;
}

export class EventPublisher implements IEventPublisher {
    constructor(private emitter: EventEmitter2) {}

    dispatch(domainEvent: IDomainEvent<any>): void;
    dispatch(domainEvents: IDomainEvent<any>[]): void;
    dispatch(domainEvents: IDomainEvent<any> | IDomainEvent<any>[]): void {
        if (Array.isArray(domainEvents)) {
            domainEvents.forEach(((domainEvent) => {
                this.emitter.emit(domainEvent.eventName, domainEvent);
            }));
        } else {
            this.emitter.emit(domainEvents.eventName, domainEvents);
        }
    }

    async dispatchAsync(domainEvent: IDomainEvent<any>): Promise<void>;
    async dispatchAsync(domainEvents: IDomainEvent<any>[]): Promise<void>;
    async dispatchAsync(domainEvents: IDomainEvent<any> | IDomainEvent<any>[]): Promise<void> {
        if (Array.isArray(domainEvents)) {
            await Promise.all(domainEvents.map(((domainEvent) => this.emitter.emitAsync(domainEvent.eventName, domainEvent))));
        } else {
            await this.emitter.emitAsync(domainEvents.eventName, domainEvents);
        }
    }
}
