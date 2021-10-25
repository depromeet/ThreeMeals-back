import { Ctx, Query, Resolver, UseMiddleware, Mutation, Arg } from 'type-graphql';
import { Service } from 'typedi';
import { AccountOrmEntity } from '../../entities/AccountOrmEntity';
import { AuthMiddleware } from '../../infrastructure/apollo/middleware/auth';
import { Favorite } from '../../entities/Favorite';
import { FavoriteService } from '../../application/services/FavoriteService';

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
        return await this.favoriteService.createFavorite({ fromAccountId: account.id, favoriteAccountId: favoriteAccountId });
    }
    // @Query((returns) => NotiCount)
    // @UseMiddleware(AuthMiddleware)
    // async getUnreadNotiCount(@Ctx('account') account: AccountOrmEntity): Promise<NotiCount> {
    //     if (!account) {
    //         throw new BaseError(ERROR_CODE.UNAUTHORIZED);
    //     }
    //     const unreadNotiCount = await this.notificationService.getUnreadNotiCount(account);

    //     const notiCount = { count: unreadNotiCount };

    //     return notiCount;
    // }
}
