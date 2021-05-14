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

    @Mutation((returns) => String)
    @UseMiddleware(AuthMiddleware)
    async deleteComment(
        @Arg('commentId') commentId: string,
        @Ctx('account') account?: Account,
    ): Promise<string> {
        if (!account) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED);
        }
        const result = await this.commentService.deleteComment(commentId, account);
        return '' + result;
    }

    @Query((returns) => CommentConnection)
    @UseMiddleware(AuthMiddleware)
    async getComments(
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
}
