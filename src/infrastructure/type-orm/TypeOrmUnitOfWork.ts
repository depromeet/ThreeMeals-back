import { flatMap } from 'lodash';
import { TypeOrmDBContext } from './TypeOrmDBContext';
import { config } from '../../config';
import { IUnitOfWork } from '../../domain/common/IUnitOfWork';
import { IEventPublisher } from '../event-publishers/EventPublisher';


export class TypeOrmUnitOfWork implements IUnitOfWork {
    constructor(
        private readonly eventPublisher: IEventPublisher,
    ) {}

    get dbContext(): TypeOrmDBContext | undefined {
        return TypeOrmDBContext.currentDBContext();
    }

    async withTransaction<T>(work: () => Promise<T> | T, conName = config.db.default.connectionName): Promise<T> {
        return TypeOrmDBContext.createAsync(conName, async (queryRunner) => {
            await queryRunner.startTransaction();
            try {
                const result = await work();

                await this.eventPublisher.dispatchAsync(
                    flatMap(TypeOrmDBContext.currentDBContext()?.entities, (entity) => entity.domainEvents),
                );

                await queryRunner.commitTransaction();
                return result;
            } catch (error) {
                await queryRunner.rollbackTransaction();
                throw error;
            }
        });
    }
}
