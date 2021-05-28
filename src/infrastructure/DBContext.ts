import { NextFunction } from 'express';
import { AsyncLocalStorage, AsyncResource } from 'async_hooks';
import { wrapEmitter } from '../util/wrapEmitter';
import { EntityManager, getConnection, QueryRunner } from 'typeorm';
import EventEmitter from 'events';
import { config } from '../config';
import { DomainEntity } from '../common/DomainEntity';

const pluginName = 'DBRequestContext';

export class DBContext {
    private static storage = new AsyncLocalStorage<DBContext>();
    private _entities: DomainEntity[] = [];

    constructor(readonly map: Map<string, QueryRunner>) {}

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

    static create(emitters: EventEmitter[], next?: NextFunction): void {
        const ctx = this.createContext([
            getConnection(config.db.default.connectionName).createQueryRunner(),
        ]);
        this.storage.run(ctx, () => {
            const asyncResource = new AsyncResource(pluginName);
            emitters.forEach((emitter) => {
                wrapEmitter(emitter, asyncResource);
            });
            return next ? next() : undefined;
        });
    }

    static async createAsync(emitters: EventEmitter[], next?: (...args: any[]) => Promise<void>): Promise<void> {
        const ctx = this.createContext([
            getConnection(config.db.default.connectionName).createQueryRunner(),
        ]);
        await new Promise((resolve, reject) => {
            this.storage.run(ctx, () => {
                const asyncResource = new AsyncResource(pluginName);
                emitters.forEach((emitter) => {
                    wrapEmitter(emitter, asyncResource);
                });
                return next ? next().then(resolve).catch(reject) : undefined;
            });
        });
    }

    private static createContext(queryRunner :QueryRunner | QueryRunner[]): DBContext {
        const forks = new Map<string, QueryRunner>();

        if (Array.isArray(queryRunner)) {
            queryRunner.forEach((runner) => forks.set(runner.connection.name, runner));
        } else {
            forks.set(queryRunner.connection.name, queryRunner);
        }

        return new DBContext(forks);
    }

    static currentDBContext(): DBContext | undefined {
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
