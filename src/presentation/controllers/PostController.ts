import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from 'type-graphql';
import { Container, Inject, Service } from 'typedi';
import { Post } from '../../entities/Post';
import { PostService } from '../../application/services/PostService';
import { AuthMiddleware } from '../../infrastructure/express/middlewares/AuthMiddleware';

import { Get, JsonController, Param, Req, Res, UseBefore } from 'routing-controllers';

@Service()
@JsonController('/post')
export class PostController {
    constructor(
        private readonly postService: PostService,
    ) {
    }

    @Get('/:postId')
    @UseBefore(AuthMiddleware)
    async getPost(
        @Param('postId') postId: string,
        @Req() req: any, @Res() res: any,
    ): Promise<Post> {
        const account = req.account;
        console.log(this == null);
        console.log(this.postService == null);

        return this.postService.getPost({
            postId,
            myAccountId: account ? account.id : null,
        });
    }

    //
    // @Query((returns) => PostConnection)
    // @UseMiddleware(AuthMiddleware)
    // async getPosts(
    //     @Args() args: GetPostsArgument,
    //     @Ctx('account') account?: AccountOrmEntity,
    // ): Promise<PostConnection> {
    //     if (args.postState && args.postState === PostState.Deleted) {
    //         console.error('post state cannot be deleted');
    //         throw new BaseError(ERROR_CODE.INVALID_POST_STATE);
    //     }
    //
    //     const posts = await this.postService.getPosts({
    //         myAccountId: account ? account.id : null,
    //         accountId: args.accountId,
    //         hasUsedEmoticons: false,
    //         after: args.after ? args.after : null,
    //         limit: args.first,
    //         postType: args.postType || null,
    //         postState: args.postState || null,
    //     });
    //     return new PostConnection(posts, 'id');
    // }
    //
    // @Query((returns) => NewPostCount)
    // @UseMiddleware(AuthMiddleware)
    // async getMyNewPostCount(
    //     @Args() args: GetMyNewPostCount,
    //     @Ctx('account') account?: AccountOrmEntity,
    // ): Promise<NewPostCount> {
    //     if (!account) {
    //         throw new BaseError(ERROR_CODE.UNAUTHORIZED);
    //     }
    //
    //     const postCounts = await this.postService.getNewPostsCounts({
    //         accountId: account.id,
    //         postType: args.postType || null,
    //         postState: args.postState || null,
    //     });
    //
    //     return new NewPostCount(postCounts);
    // }
    //
    // // Post 생성
    // @Mutation((returns) => MutationResult)
    // @UseMiddleware(AuthMiddleware)
    // async createPost(
    //     @Args() { content, color, secretType, postType, toAccountId, emoticons }: CreatePostArgument,
    //     @Ctx('account') account?: AccountOrmEntity,
    // ): Promise<MutationResult> {
    //     if (!account) {
    //         throw new BaseError(ERROR_CODE.UNAUTHORIZED);
    //     }
    //     await this.postService.createPost({
    //         content,
    //         color,
    //         secretType,
    //         postType,
    //         toAccountId,
    //         fromAccount: account,
    //         postEmoticons: emoticons.map((m) => m.toPostEmoticon()),
    //     });
    //
    //     return MutationResult.fromSuccessResult();
    // }
    //
    // // Post 삭제
    // @Mutation((returns) => MutationResult)
    // @UseMiddleware(AuthMiddleware)
    // async deletePost(
    //     @Arg('postId') postId: string,
    //     @Ctx('account') account?: AccountOrmEntity,
    // ): Promise<MutationResult> {
    //     if (!account) {
    //         throw new BaseError(ERROR_CODE.UNAUTHORIZED);
    //     }
    //     await this.postService.deletePost({ postId, account });
    //     return MutationResult.fromSuccessResult();
    // }
    //
    // @FieldResolver((returns) => [PostEmoticon])
    // @Loader<string, PostEmoticon[]>(async (ids, { context }) => { // batchLoadFn
    //     const postEmoticons = await Container.get(PostEmoticonRepository)
    //         .listPostEmoticonByPostIds([...ids]);
    //     const emoticonsById = _.groupBy(postEmoticons, 'postId');
    //     return ids.map((id) => emoticonsById[id] ?? []);
    // })
    // async usedEmoticons(
    //     @Root() post: Post,
    // ) {
    //     return (dataLoader: DataLoader<string, PostEmoticon[]>) => dataLoader.load(post.id);
    // }
    //
    // @FieldResolver((returns) => [PostCommentSchema])
    // @Loader<Post, Comment[]>(async (posts, { context }) => { // batchLoadFn
    //     const commentRepository = Container.get(CommentRepository);
    //     const onlyOneCommentPostIds = posts
    //         .filter((post) => (post.postType === PostType.Quiz || post.postType === PostType.Ask))
    //         .map((post) => post.id);
    //     let comments: Comment[] = [];
    //     if (onlyOneCommentPostIds.length > 0) {
    //         comments = await commentRepository.listByPostIds([...onlyOneCommentPostIds]);
    //     }
    //     const commentsById = _.groupBy(comments, 'postId');
    //     return posts.map((post) => commentsById[post.id] ?? []);
    // })
    // async comments(
    //     @Root() post: Post,
    // ) {
    //     return (dataLoader: DataLoader<Post, Comment[]>) => dataLoader.load(post);
    // }
}

