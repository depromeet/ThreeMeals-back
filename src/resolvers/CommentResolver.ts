import { Arg, Args, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Service } from 'typedi';
import { CommentService } from '../services/CommentService';
import { Comment } from '../entities/Comment';
import { CreateCommentArgs } from './arguments/CommentArgument';
import { AuthMiddleware } from '../middleware/typegraphql/auth';
import { Account } from '../entities/Account';
import { DeleteResult } from 'typeorm';

@Service()
@Resolver(() => Comment)
export class CommentResolver {
    constructor(private readonly commentService: CommentService) {}

    @Mutation((returns) => Comment)
    @UseMiddleware(AuthMiddleware)
    async createComment(@Args() args: CreateCommentArgs, @Ctx('account') account: Account): Promise<Comment> {
        const comment = await this.commentService.createComment(args, account);
        return comment;
    }

    @Mutation((returns) => String)
    @UseMiddleware(AuthMiddleware)
    async deleteComment(@Arg('commentId') commentId: string, @Ctx('account') account: Account): Promise<string> {
        const result = await this.commentService.deleteComment(commentId, account);
        return '' + result;
    }

    @Query((returns) => [Comment])
    @UseMiddleware(AuthMiddleware)
    async getComments(@Arg('postId') postId: string, @Ctx('account') account: Account): Promise<Comment[]> {
        const comments = await this.commentService.getCommentsByPostId(postId);
        return comments;
    }
    // @Query((returns) => Comment)
    // @UseMiddleware(isAuth)
    // async getComments(@argsToArgsConfig() args: any, @Ctx() { payload });
    // @Mutation((returns) => Post)
    // async updatePost(@Arg('id') id: number, @Args() { content, color, secretType }: UpdatePostArgument, @Ctx() ctx: any): Promise<Post> {
    //     const post = await this.postService.updatePost({ id, content, color, secretType });
    //     return post;
    // }

    // @Mutation((returns) => Boolean)
    // async deletePost(@Arg('id') id: number): Promise<boolean> {
    //     await this.postService.deletePost({ id });
    //     return true;
    // }
}