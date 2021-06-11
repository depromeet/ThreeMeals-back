import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from 'type-graphql';
import { getCustomRepository } from 'typeorm';
import DataLoader from 'dataloader';
import * as _ from 'lodash';
import { Service } from 'typedi';
import { Loader } from 'type-graphql-dataloader';
import { Post } from '../entities/Post';
import { PostEmoticon } from '../entities/PostEmoticon';
import { PostService } from '../services/PostService';
import { CreatePostArgument } from './arguments/CreatePostArgument';
import { AuthMiddleware } from '../middleware/typegraphql/auth';
import { Account } from '../entities/Account';
import { PostEmoticonRepository } from '../repositories/PostEmoticonRepository';
import { PostConnection } from '../schemas/PostConnection';
import { GetMyNewPostCount, GetPostsArgument } from './arguments/GetPostsArgument';
import { NewPostCount } from '../schemas/NewPostCount';
import { PostState, PostType } from '../entities/Enums';
import BaseError from '../exceptions/BaseError';
import { ERROR_CODE } from '../exceptions/ErrorCode';
import { Comment } from '../entities/Comment';
import { CommentRepository } from '../repositories/CommentRepository';
import { PostCommentSchema } from '../schemas/PostCommentSchema';
import { MutationResult } from '../schemas/base/MutationResult';

@Service()
@Resolver(() => Post)
export class PostResolver {
    constructor(
        private readonly postService: PostService,
    ) {}

    @Query((returns) => Post)
    @UseMiddleware(AuthMiddleware)
    async getPost(
        @Arg('postId') postId: string,
        @Ctx('account') account?: Account,
    ): Promise<Post> {
        return this.postService.getPost({
            postId,
            myAccountId: account ? account.id : null,
        });
    }

    @Query((returns) => PostConnection)
    @UseMiddleware(AuthMiddleware)
    async getPosts(
        @Args() args: GetPostsArgument,
        @Ctx('account') account?: Account,
    ): Promise<PostConnection> {
        if (args.postState && args.postState === PostState.Deleted) {
            console.error('post state cannot be deleted');
            throw new BaseError(ERROR_CODE.INVALID_POST_STATE);
        }

        const posts = await this.postService.getPosts({
            myAccountId: account ? account.id : null,
            accountId: args.accountId,
            hasUsedEmoticons: false,
            after: args.after ? args.after : null,
            limit: args.first,
            postType: args.postType || null,
            postState: args.postState || null,
        });
        return new PostConnection(posts, 'id');
    }

    @Query((returns) => NewPostCount)
    @UseMiddleware(AuthMiddleware)
    async getMyNewPostCount(
        @Args() args: GetMyNewPostCount,
        @Ctx('account') account?: Account,
    ): Promise<NewPostCount> {
        if (!account) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED);
        }

        const postCounts = await this.postService.getNewPostsCounts({
            accountId: account.id,
            postType: args.postType || null,
        });

        return new NewPostCount(postCounts);
    }

    // Post 생성
    @Mutation((returns) => MutationResult)
    @UseMiddleware(AuthMiddleware)
    async createPost(
        @Args() { content, color, secretType, postType, toAccountId, emoticons }: CreatePostArgument,
        @Ctx('account') account?: Account,
    ): Promise<MutationResult> {
        if (!account) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED);
        }
        await this.postService.createPost({
            content,
            color,
            secretType,
            postType,
            toAccountId,
            fromAccount: account,
            postEmoticons: emoticons.map((m) => m.toPostEmoticon()),
        });

        return MutationResult.fromSuccessResult();
    }

    // Post 삭제
    @Mutation((returns) => MutationResult)
    @UseMiddleware(AuthMiddleware)
    async deletePost(
        @Arg('postId') postId: string,
        @Ctx('account') account?: Account,
    ): Promise<MutationResult> {
        if (!account) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED);
        }
        await this.postService.deletePost({ postId, account });
        return MutationResult.fromSuccessResult();
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

