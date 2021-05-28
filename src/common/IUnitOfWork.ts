export const UNIT_OF_WORK = 'UNIT_OF_WORK';
export abstract class IUnitOfWork {
    abstract withTransaction<T>(work: () => T, name?: string): Promise<T>
}
