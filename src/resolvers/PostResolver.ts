import { Arg, Args, Ctx, FieldResolver, Mutation, Resolver, Root, UseMiddleware } from 'type-graphql';
import { Service } from 'typedi';
import { Request } from 'express';
import { PostService } from '../services/PostService';
import { Post } from '../entities/Post';
import { logger } from '../logger/winston';
import { InsertPostArgument, UpdatePostArgument } from './arguments/PostArgument';
import { PostType } from '../entities/Enums';
import { isAuth } from '../middleware/express/auth';
import { MyContext } from '../middleware/express/mycontext';

@Service()
@Resolver(() => Post)
export class PostResolver {
    constructor(private readonly postService: PostService) {}

    // @Query((returns) => Post)
    // async user(
    //     @Arg('id') id: number,
    // ): Promise<Post> {
    //     const user = await this.postService.getUser({id});
    //     return user;
    // }


    @Mutation((returns) => Post)
    @UseMiddleware(isAuth)
    async makePost(
        @Args() { content, postType, color, state, secretType }: InsertPostArgument,
        @Ctx() { payload }: MyContext,
    ): Promise<Post> {
        // providerId
        console.log(payload);
        const post = await this.postService.makePost({ content, postType, color, state, secretType });
        return post;
    }

    @Mutation((returns) => Post)
    async updatePost(
        @Arg('id') id: number,
        @Args() { content, color, secretType }: UpdatePostArgument,
        @Ctx() ctx: any,
    ): Promise<Post> {
        const post = await this.postService.updatePost({ id, content, color, secretType });
        return post;
    }

    @Mutation((returns) => Boolean)
    async deletePost(
        @Arg('id') id: number,
    ): Promise<boolean> {
        await this.postService.deletePost({ id });
        return true;
    }
}
