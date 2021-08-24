import { Service } from 'typedi';
import { DBContext } from '../typeorm/DBContext';
import { config } from '../../config';
import BaseError from '../../exceptions/BaseError';
import { ERROR_CODE } from '../../exceptions/ErrorCode';
import { IUnitOfWork, UNIT_OF_WORK } from '../../domain/common/IUnitOfWork';
import { IEventPublisher } from '../event-publishers/EventPublisher';

@Service(UNIT_OF_WORK)
export class TypeOrmUnitOfWork implements IUnitOfWork {
    constructor(
        private readonly eventPublisher: IEventPublisher,
    ) {}

    get dbContext(): DBContext | undefined {
        return DBContext.currentDBContext();
    }

    async withTransaction<T>(work: () => Promise<T> | T, name = config.db.default.connectionName): Promise<T> {
        const queryRunner = this.dbContext?.queryRunner;
        if (!queryRunner) {
            console.log('Cannot get query Runner');
            throw new BaseError(ERROR_CODE.INTERNAL_SERVER_ERROR);
        }
        await queryRunner.startTransaction();
        try {
            const result = await work();

            await this.eventPublisher.dispatchEventsAsync();

            await queryRunner.commitTransaction();
            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
