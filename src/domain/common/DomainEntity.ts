import { IDomainEvent } from './IDomainEvent';

export abstract class DomainEntity {
    private _domainEvents: IDomainEvent<any>[] = [];
    get domainEvents(): IDomainEvent<any>[] {
        return this._domainEvents;
    }

    protected addEvent(domainEvent: IDomainEvent<any>): void {
        this._domainEvents.push(domainEvent);
    }

    public clearEvents(): void {
        this._domainEvents = [];
    }

    static isEntity(entity: unknown): entity is DomainEntity {
        return entity instanceof DomainEntity;
    }
}
