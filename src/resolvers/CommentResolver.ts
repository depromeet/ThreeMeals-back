import { Arg, Args, Ctx, Mutation, Query, Resolver, Root, UseMiddleware } from 'type-graphql';
import { Service } from 'typedi';
import { CommentService } from '../services/CommentService';
import { Comment } from '../entities/Comment';
import { CreateCommentArgs } from './arguments/CommentArgument';
import { AuthMiddleware } from '../middleware/typegraphql/auth';
import { Account } from '../entities/Account';
import { CommentConnection } from '../schemas/CommentConnection';
import { GetCommentsArgument } from './arguments/GetCommentsArgument';
import BaseError from '../exceptions/BaseError';
import { ERROR_CODE } from '../exceptions/ErrorCode';
import { ChildrenCommentConnection } from '../schemas/ChildrenCommentSchema';
import { GetChildrenCommentsArgument } from './arguments/GetChildrenCommentsArgument';
import { MutationResult } from '../schemas/base/MutationResult';
import { LikePostsService } from '../services/LikePostsService';
import { LikePost } from '../entities/LikePost';
import { LikePostsArgument } from './arguments/LikePostsArgument';
import { AuthContext } from '../middleware/express/AuthContext';

@Service()
@Resolver(() => Comment)
export class CommentResolver {
    constructor(private readonly commentService: CommentService) {}

    @Mutation((returns) => Comment)
    @UseMiddleware(AuthMiddleware)
    async createComment(
        @Args() args: CreateCommentArgs,
        @Ctx('account') account?: Account,
    ): Promise<Comment> {
        if (!account) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED);
        }
        const comment = await this.commentService.createComment({
            content: args.content,
            parentId: args.parentId ? args.parentId : null,
            postId: args.postId,
            secretType: args.secretType,
            account,
        });
        return comment;
    }

    @Mutation((returns) => MutationResult)
    @UseMiddleware(AuthMiddleware)
    async deleteComment(
        @Arg('commentId') commentId: string,
        @Ctx('account') account?: Account,
    ): Promise<MutationResult> {
        if (!account) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED);
        }
        await this.commentService.deleteComment(commentId, account);
        return MutationResult.fromSuccessResult();
    }

    @Query((returns) => CommentConnection)
    @UseMiddleware(AuthMiddleware)
    async getParentComments(
        @Args() args: GetCommentsArgument,
        @Ctx('account') account?: Account,
    ): Promise<CommentConnection> {
        const comments = await this.commentService.getParentComments({
            myAccountId: account ? account.id : null,
            postId: args.postId,
            after: args.after ? args.after : null,
            limit: args.first,
        });
        return new CommentConnection(comments, 'id');
    }

    @Query((returns) => ChildrenCommentConnection)
    @UseMiddleware(AuthMiddleware)
    async getChildrenComments(
        @Args() args: GetChildrenCommentsArgument,
        @Ctx('account') account?: Account,
    ): Promise<ChildrenCommentConnection> {
        const comments = await this.commentService.getChildrenComments({
            myAccountId: account ? account.id : null,
            postId: args.postId,
            parentId: args.parentId,
            after: args.after ? args.after : null,
            limit: args.first,
        });
        return new ChildrenCommentConnection(comments, 'id');
    }


    // @Mutation((returns) => LikePost)
    // @UseMiddleware(AuthMiddleware)
    // async createLikePosts(
    //     @Args() { postId }: LikePostsArgument,
    //     @Ctx() { account }: AuthContext,
    // ): Promise<LikePost> {
    //     if (!account) {
    //         throw new BaseError(ERROR_CODE.UNAUTHORIZED);
    //     }
    //     const accountId = account.id;
    //     const post = await this.likePostsService.createLikePosts({ accountId, postId });
    //     return post;
    // }
}
