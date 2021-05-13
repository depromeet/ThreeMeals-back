/* eslint-disable camelcase */
import { Arg, Args, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import { Service } from 'typedi';
import { LikePosts } from '../entities/LikePosts';
import { LikePostsService } from '../services/LikePostsService';
import { LikePostsArgument } from './arguments/LikePostsArgument';
import { AuthContext } from '../middleware/express/AuthContext';
import { AuthMiddleware } from '../middleware/typegraphql/auth';
import BaseError from "../exceptions/BaseError";
import {ERROR_CODE} from "../exceptions/ErrorCode";

@Service()
@Resolver(() => LikePosts)
export class LikePostsResolver {
    constructor(private readonly likePostsService: LikePostsService) {}


    @Mutation((returns) => LikePosts)
    @UseMiddleware(AuthMiddleware)
    async createLikePosts(
        @Args() { postId }: LikePostsArgument,
        @Ctx() { account }: AuthContext,
    ): Promise<LikePosts> {
        if (!account) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED);
        }
        const accountId = account.id;
        const post = await this.likePostsService.createLikePosts({ accountId, postId });
        return post;
    }


    @Mutation((returns) => Boolean)
    @UseMiddleware(AuthMiddleware)
    async deleteLikePosts(
        @Arg('postId') id: string,
        @Ctx() { account }: AuthContext,
    ): Promise<boolean> {
        if (!account) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED);
        }
        await this.likePostsService.deleteLikePosts({ id });
        return true;
    }
}
