export interface IDomainEvent<DATA> {
    eventName: string
    data: DATA
}
