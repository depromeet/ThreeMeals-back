import { Arg, Args, Ctx, FieldResolver, Mutation, Resolver, Root, UseMiddleware } from 'type-graphql';
import { Service } from 'typedi';
import { Request } from 'express';
import { CommentService } from '../services/CommentService';
import { Post } from '../entities/Post';
import { Comment } from '../entities/Comment';
import { logger } from '../logger/winston';
import { CreateCommentArgs } from './arguments/CommentArgument';
import { PostType } from '../entities/Enums';
import { isAuth } from '../middleware/typegraphql/auth';
import { AuthContext } from '../middleware/express/AuthContext';
import { argsToArgsConfig } from 'graphql/type/definition';

@Service()
@Resolver(() => Comment)
export class CommentResolver {
    constructor(private readonly commentService: CommentService) {}

    @Mutation((returns) => Comment)
    @UseMiddleware(isAuth)
    async createComment(@Args() args: CreateCommentArgs, @Ctx() { payload }: AuthContext): Promise<Comment> {
        // providerId
        // console.log(payload);
        console.log(payload);
        const comment = await this.commentService.createComment(args);
        return comment;
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
