import { Ctx, Query, Resolver, UseMiddleware, Mutation, Arg } from 'type-graphql';
import { Service } from 'typedi';
import { AccountOrmEntity } from '../../entities/AccountOrmEntity';
import { AuthMiddleware } from '../../infrastructure/apollo/middleware/auth';
import { Favorite } from '../../entities/Favorite';
import { FavoriteService } from '../../application/services/FavoriteService';
import { MutationResult } from './schemas/base/MutationResult';

@Service()
@Resolver(() => Favorite)
export class FavoriteResolver {
    constructor(private readonly favoriteService: FavoriteService) {}

    @Query((returns) => [Favorite])
    @UseMiddleware(AuthMiddleware)
    async getFavorites(@Ctx('account') account: AccountOrmEntity): Promise<Favorite[]> {
        const favorites = await this.favoriteService.getFavorites(account);
        return favorites;
    }

    @Mutation((returns) => Favorite)
    @UseMiddleware(AuthMiddleware)
    async createFavorite(
        @Arg('favoriteAccountId') favoriteAccountId: string,
        @Ctx('account') account: AccountOrmEntity,
    ): Promise<Favorite> {
        return await this.favoriteService.createFavorite({ accountId: account.id, favoriteAccountId: favoriteAccountId });
    }

    @Mutation((returns) => Boolean)
    @UseMiddleware(AuthMiddleware)
    async cancelFavorite(@Arg('favoriteAccountId') favoriteAccountId: string, @Ctx('account') account: AccountOrmEntity): Promise<boolean> {
        await this.favoriteService.deleteFavorite(account.id, favoriteAccountId);
        return true;
    }
}
