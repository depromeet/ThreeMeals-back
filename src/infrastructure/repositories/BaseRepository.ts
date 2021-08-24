import { EntityManager, getManager } from 'typeorm';
import { TypeOrmDBContext } from '../type-orm/TypeOrmDBContext';

export abstract class BaseRepository<T> {
    get dbContext(): TypeOrmDBContext | undefined {
        return TypeOrmDBContext.currentDBContext();
    }

    get entityManager(): EntityManager {
        if (this.dbContext && this.dbContext.entityManager) {
            return this.dbContext.entityManager;
        }
        return getManager();
    }
}
