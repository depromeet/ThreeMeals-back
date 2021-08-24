export const UNIT_OF_WORK = 'UNIT_OF_WORK';
export abstract class IUnitOfWork {
    abstract withTransaction<T>(work: () => Promise<T> | T, name?: string): Promise<T>
}
