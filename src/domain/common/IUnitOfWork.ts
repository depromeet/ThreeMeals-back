export abstract class IUnitOfWork {
    abstract withTransaction<T>(work: () => Promise<T> | T, name?: string): Promise<T>
}
