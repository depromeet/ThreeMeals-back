import { EventEmitter } from 'events';
import { AsyncLocalStorage, AsyncResource } from 'async_hooks';
import { EntityManager, getConnection, QueryRunner } from 'typeorm';
import { config } from '../../config';
import { DomainEntity } from '../../domain/common/DomainEntity';
import { wrapEmitter } from '../../util/wrapEmitter';

const pluginName = 'DBRequestContext';

export class TypeOrmDBContext {
    private static storage = new AsyncLocalStorage<TypeOrmDBContext>();

    constructor(
        readonly map: Map<string, QueryRunner>,
        public readonly tag = 'default',
        private _entities: DomainEntity[] = [],
    ) {}

    get entityManager(): EntityManager | undefined {
        return this.map.get('default')?.manager;
    }

    get queryRunner(): QueryRunner | undefined {
        return this.map.get('default');
    }

    get entities(): DomainEntity[] {
        return this._entities;
    }

    addDomainEntity(entity: DomainEntity): void {
        this._entities.push(entity);
    }

    static createWithEmitters<T>(emitters: EventEmitter[], next?: () => void): void {
        const queryRunner = getConnection(config.db.default.connectionName).createQueryRunner();
        const ctx = this.createContext([queryRunner]);
        this.storage.run(ctx, () => {
            const asyncResource = new AsyncResource(pluginName);
            emitters.forEach((emitter) => {
                wrapEmitter(emitter, asyncResource);
            });
            return next ? next() : undefined;
        });
    }

    static async createAsync<T>(con: string, next?: (queryRunner: QueryRunner) => Promise<T>): Promise<T> {
        const queryRunner = getConnection(con).createQueryRunner();
        const ctx = this.createContext([queryRunner]);
        return new Promise((resolve, reject) => {
            this.storage.run(ctx, () => {
                return next ?
                    next(queryRunner)
                        .then(resolve)
                        .catch(reject)
                        .finally(() => {
                            return queryRunner.release();
                        }) :
                    undefined;
            });
        });
    }

    private static createContext(queryRunner :QueryRunner | QueryRunner[]): TypeOrmDBContext {
        const forks = new Map<string, QueryRunner>();

        if (Array.isArray(queryRunner)) {
            queryRunner.forEach((runner) => forks.set(runner.connection.name, runner));
        } else {
            forks.set(queryRunner.connection.name, queryRunner);
        }

        return new TypeOrmDBContext(forks);
    }

    static currentDBContext(): TypeOrmDBContext | undefined {
        return this.storage.getStore();
    }

    static getQueryRunner(name = config.db.default.connectionName): QueryRunner | undefined {
        const context = this.currentDBContext();
        if (context && context.map.get(name)) {
            return context.map.get(name);
        }
        return undefined;
    }

    static getTransactionManager(name = config.db.default.connectionName): EntityManager | undefined {
        const context = this.currentDBContext();
        if (context && context.map.get(name)) {
            return context.map.get(name)?.manager;
        }
        return undefined;
    }
}
