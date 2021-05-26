import { EntityManager, Repository } from 'typeorm';
import { DBContext } from '../infrastructure/DBContext';

export abstract class BaseRepository<T> extends Repository<T> {
    get dbContext(): DBContext | undefined {
        return DBContext.currentDBContext();
    }

    get entityManager(): EntityManager {
        if (this.dbContext && this.dbContext.entityManager) {
            return this.dbContext.entityManager;
        }
        return this.manager;
    }
}
