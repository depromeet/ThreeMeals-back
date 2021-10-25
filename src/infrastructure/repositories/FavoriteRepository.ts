import { Service } from 'typedi';
// import {Account } from '../../'
import { BaseRepository } from '../type-orm/BaseRepository';
import { Favorite } from '../../entities/Favorite';
// import { account } from 'aws-sdk/clients/sns';
import { AccountOrmEntity } from '../../entities/AccountOrmEntity';

@Service()
export class FavoriteRepository extends BaseRepository<Favorite> {
    async findByAccount(account: AccountOrmEntity): Promise<Favorite[]> {
        const favorite = 'favorite';
        const builder = this.entityManager
            .createQueryBuilder(Favorite, favorite)
            .where(`${favorite}.accountId = :accountId`, { accountId: account.id })
            .leftJoinAndSelect(`${favorite}.favoriteAccount`, 'favoriteAccount')
            .limit(30);
        return builder.getMany();
    }

    async getFavorite(accountId: string, favoriteAccountId: string): Promise<Favorite | undefined> {
        return this.entityManager.findOne(Favorite, { accountId: accountId, favoriteAccountId: favoriteAccountId });
    }

    async createFavorite(favorite: Favorite): Promise<Favorite> {
        return await this.entityManager.save(favorite);
    }

    async deleteFavorite(accountId: string, favoriteAccountId: string): Promise<void> {
        await this.entityManager.delete(Favorite, {
            accountId: accountId,
            favoriteAccountId: favoriteAccountId,
        });
    }
}
