/* eslint-disable camelcase */
import { Arg, Args, Ctx, FieldResolver, Mutation, Resolver, Root, UseMiddleware } from 'type-graphql';
import { Service } from 'typedi';
import { LikePosts } from '../entities/LikePosts';
import { LikePostsService } from '../services/LikePostsService';
import { LikePostsArgument } from './arguments/LikePostsArgument';
import { isAuth } from '../middleware/typegraphql/auth';
import { AuthContext } from '../middleware/express/AuthContext';
import { logger } from '../logger/winston';

@Service()
@Resolver(() => LikePosts)
export class LikePostsResolver {
    constructor(private readonly likePostsService: LikePostsService) {}


    @Mutation((returns) => LikePosts)
    @UseMiddleware(isAuth)
    async createLikePosts(
        @Args() { postId }: LikePostsArgument,
        @Ctx() { payload }: AuthContext,
    ): Promise<LikePosts> {
        const accountId: any = payload?.id;
        const post = await this.likePostsService.createLikePosts({ accountId, postId });
        return post;
    }


    @Mutation((returns) => Boolean)
    async deleteLikePosts(
        @Arg('postId') id: number,
    ): Promise<boolean> {
        await this.likePostsService.deleteLikePosts({ id });
        return true;
    }
}
