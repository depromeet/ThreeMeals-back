import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from 'type-graphql';
import { getCustomRepository } from 'typeorm';
import DataLoader from 'dataloader';
import * as _ from 'lodash';
import { Service } from 'typedi';
import { Loader } from 'type-graphql-dataloader';
import { Post } from '../entities/Post';
import { PostEmoticon } from '../entities/PostEmoticon';
import { PostService } from '../services/PostService';
import { PostEmoticonService } from '../services/PostEmoticonService';
import { EmoticonService } from '../services/EmoticonService';
import { CreatePostArgument } from './arguments/CreatePostArgument';
import { AuthMiddleware } from '../middleware/typegraphql/auth';
import { Account } from '../entities/Account';
import { PostEmoticonRepository } from '../repositories/PostEmoticonRepository';
import { PostConnection } from '../schemas/PostConnection';
import { GetMyPostArgument, GetPostArgument } from './arguments/GetPostArgument';
import { NewPostCount, PostCount } from '../schemas/NewPostCount';
import { PostType } from '../entities/Enums';

@Service()
@Resolver(() => Post)
export class PostResolver {
    constructor(
        private readonly postService: PostService,
        private readonly postEmoticonService: PostEmoticonService,
        private readonly emoticonService: EmoticonService,
    ) {}

    @Query((returns) => PostConnection)
    @UseMiddleware(AuthMiddleware)
    async getMyPosts(
        @Args() args: GetMyPostArgument,
        @Ctx('account') account: Account,
    ): Promise<PostConnection> {
        const posts = await this.postService.getPosts({
            accountId: account.id,
            hasComment: false,
            hasUsedEmoticons: false,
            after: args.after,
            limit: args.first,
            postType: args.postType || null,
        });
        return new PostConnection(posts, 'id');
    }

    // 물어봐
    @Query((returns) => [PostConnection])
    async getPosts(
        @Args() args: GetPostArgument,
    ): Promise<PostConnection> {
        const posts = await this.postService.getPosts({
            accountId: args.accountId,
            hasComment: false,
            hasUsedEmoticons: false,
            after: args.after,
            limit: args.first,
            postType: args.postType || null,
        });
        return new PostConnection(posts, 'id');
    }

    @Query((returns) => NewPostCount)
    @UseMiddleware(AuthMiddleware)
    async getMyNewPostCount(
        @Ctx('account') account: Account,
    ) {
        return {
            postCount: [
                { postType: PostType.Answer, count: 1 },
                { postType: PostType.Quiz, count: 13 },
                { postType: PostType.Ask, count: 5 },
            ],
        };
    }

    // Post 생성
    @Mutation((returns) => Post)
    @UseMiddleware(AuthMiddleware)
    async createPost(
        @Args() { content, color, secretType, postType, toAccountId, emoticons }: CreatePostArgument,
        @Ctx('account') account: Account,
    ): Promise<Post> {
        const post = await this.postService.createPost({
            content,
            color,
            secretType,
            postType,
            toAccountId,
            fromAccount: account,
            postEmoticons: emoticons.map((m) => m.toPostEmoticon()),
        });

        return post;
    }

    // Post 삭제
    @Mutation((returns) => Boolean)
    async deletePost(
        @Arg('postId') id: string,
    ): Promise<boolean> {
        await this.postService.deletePost({ id });
        return true;
    }

    @FieldResolver((returns) => [PostEmoticon])
    @Loader<string, PostEmoticon[]>(async (ids, { context }) => { // batchLoadFn
        const postEmoticons = await getCustomRepository(PostEmoticonRepository)
            .listPostEmoticonByPostIds([...ids]);
        //     .find({
        //     where: { post: { id: In([...ids]) } },
        //     relations: ['emoticon'],
        // });
        const emoticonsById = _.groupBy(postEmoticons, 'postId');
        return ids.map((id) => emoticonsById[id] ?? []);
    })
    async usedEmoticons(
        @Root() post: Post,
    ) {
        return (dataLoader: DataLoader<string, PostEmoticon[]>) => dataLoader.load(post.id);
    }
}

