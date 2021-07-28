import { EntityManager, getManager } from 'typeorm';
import { DBContext } from '../DBContext';

export abstract class BaseRepository<T> {
    get dbContext(): DBContext | undefined {
        return DBContext.currentDBContext();
    }

    get entityManager(): EntityManager {
        if (this.dbContext && this.dbContext.entityManager) {
            return this.dbContext.entityManager;
        }
        return getManager();
    }
}
