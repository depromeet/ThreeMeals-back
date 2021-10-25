import { Service } from 'typedi';
import { each, F, filter, flow, map, unionBy, values } from 'lodash/fp';
import { Post } from '../../entities/Post';
import { PostEmoticon } from '../../entities/PostEmoticon';
import { AccountRepository } from '../../infrastructure/repositories/AccountRepository';
import { PostRepository } from '../../infrastructure/repositories/PostRepository';
import { PostState, PostType, SecretType } from '../../entities/Enums';
import BaseError from '../../domain/exceptions/BaseError';
import { ERROR_CODE } from '../../domain/exceptions/ErrorCode';
import { AccountOrmEntity } from '../../entities/AccountOrmEntity';
import { IUnitOfWork } from '../../domain/common/IUnitOfWork';
import { FavoriteRepository } from '../../infrastructure/repositories/FavoriteRepository';
import { Favorite } from '../../entities/Favorite';

@Service()
export class FavoriteService {
    constructor(
        private readonly accountRepository: AccountRepository,
        private readonly postRepository: PostRepository,
        private readonly favoriteRepository: FavoriteRepository,
        private readonly unitOfWork: IUnitOfWork,
    ) {}

    async getFavorites(account: AccountOrmEntity): Promise<Favorite[]> {
        return await this.favoriteRepository.findByAccount(account);
    }

    async createFavorite(args: { fromAccountId: string; favoriteAccountId: string }): Promise<Favorite> {
        const alreadyFavorite = await this.favoriteRepository.getFavorite(args.fromAccountId, args.favoriteAccountId);

        if (alreadyFavorite) {
            throw new BaseError(ERROR_CODE.ALREADY_FAVORITE);
        }

        const favorite = new Favorite();
        favorite.accountId = args.fromAccountId;
        favorite.favoriteAccountId = args.favoriteAccountId;
        return await this.favoriteRepository.createFavorite(favorite);
    }

    async deleteFavorite(favoriteId: string): Promise<void> {
        await this.favoriteRepository.deleteFavorite(favoriteId);
    }
}
