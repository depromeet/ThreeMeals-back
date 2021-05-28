import { flow, flatMap, map } from 'lodash/fp';
import { EventEmitter2 } from 'eventemitter2';
import { IDomainEvent } from './common/IDomainEvent';
import { DBContext } from './infrastructure/DBContext';
import { DomainEntity } from './common/DomainEntity';

export abstract class IEventPublisher {
    abstract publish(domainEvent: IDomainEvent<any>): void;
    abstract publishAsync(domainEvent: IDomainEvent<any>): Promise<void>;
    abstract dispatchEventsAsync(): Promise<void>;
}

export class EventPublisher implements IEventPublisher {
    constructor(private emitter: EventEmitter2) {}

    get dbContext(): DBContext | undefined {
        return DBContext.currentDBContext();
    }

    publish(domainEvent: IDomainEvent<any>): void {
        this.emitter.emit(domainEvent.eventName, domainEvent);
    }

    async publishAsync(domainEvent: IDomainEvent<any>): Promise<void> {
        await this.emitter.emitAsync(domainEvent.eventName, domainEvent);
    }

    async dispatchEventsAsync(): Promise<void> {
        if (this.dbContext) {
            await Promise.all(flow(
                flatMap<DomainEntity, IDomainEvent<any>>((entity) => entity.domainEvents),
                map((event) => this.publishAsync(event)),
            )(this.dbContext.entities));

            this.dbContext.entities
                .forEach((entity) => entity.clearEvents());
        }
    }
}
