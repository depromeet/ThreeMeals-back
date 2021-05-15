import {Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware} from 'type-graphql';
import {getCustomRepository} from 'typeorm';
import DataLoader from 'dataloader';
import * as _ from 'lodash';
import {Service} from 'typedi';
import {Loader} from 'type-graphql-dataloader';
import {Post} from '../entities/Post';
import {PostEmoticon} from '../entities/PostEmoticon';
import {PostService} from '../services/PostService';
import {CreatePostArgument} from './arguments/CreatePostArgument';
import {AuthMiddleware} from '../middleware/typegraphql/auth';
import {Account} from '../entities/Account';
import {PostEmoticonRepository} from '../repositories/PostEmoticonRepository';
import {PostConnection} from '../schemas/PostConnection';
import {GetPostsArgument} from './arguments/GetPostsArgument';
import {NewPostCount} from '../schemas/NewPostCount';
import {PostType} from '../entities/Enums';
import {CommentService} from '../services/CommentService';
import BaseError from '../exceptions/BaseError';
import {ERROR_CODE} from '../exceptions/ErrorCode';
import {Comment} from '../entities/Comment';
import {CommentRepository} from '../repositories/CommentRepository';
import {PostCommentSchema} from '../schemas/PostCommentSchema';

@Service()
@Resolver(() => Post)
export class PostResolver {
    constructor(
        private readonly postService: PostService,
    ) {}

    // 물어봐
    @Query((returns) => PostConnection)
    @UseMiddleware(AuthMiddleware)
    async getPosts(
        @Args() args: GetPostsArgument,
        @Ctx('account') account?: Account,
    ): Promise<PostConnection> {
        const posts = await this.postService.getPosts({
            myAccountId: account ? account.id : null,
            accountId: args.accountId,
            hasUsedEmoticons: false,
            after: args.after ? args.after : null,
            limit: args.first,
            postType: args.postType || null,
        });
        return new PostConnection(posts, 'id');
    }

    @Query((returns) => NewPostCount)
    @UseMiddleware(AuthMiddleware)
    async getMyNewPostCount(
        @Ctx('account') account?: Account,
    ) {
        if (!account) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED);
        }
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
        @Ctx('account') account?: Account,
    ): Promise<Post> {
        if (!account) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED);
        }
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
        const emoticonsById = _.groupBy(postEmoticons, 'postId');
        return ids.map((id) => emoticonsById[id] ?? []);
    })
    async usedEmoticons(
        @Root() post: Post,
    ) {
        return (dataLoader: DataLoader<string, PostEmoticon[]>) => dataLoader.load(post.id);
    }

    @FieldResolver((returns) => [PostCommentSchema])
    @Loader<Post, Comment[]>(async (posts, { context }) => { // batchLoadFn
        const commentRepository = getCustomRepository(CommentRepository);
        const onlyOneCommentPostIds = posts
            .filter((post) => (post.postType === PostType.Quiz || post.postType === PostType.Ask))
            .map((post) => post.id);
        let comments: Comment[] = [];
        if (onlyOneCommentPostIds.length > 0) {
            comments = await commentRepository.listByPostIds([...onlyOneCommentPostIds]);
        }
        const commentsById = _.groupBy(comments, 'postId');
        return posts.map((post) => commentsById[post.id] ?? []);
    })
    async comments(
        @Root() post: Post,
    ) {
        return (dataLoader: DataLoader<Post, Comment[]>) => dataLoader.load(post);
    }
}

