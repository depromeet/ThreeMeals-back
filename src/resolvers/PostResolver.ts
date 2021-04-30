import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from 'type-graphql';
import { Service } from 'typedi';
import { Post } from '../entities/Post';
import { PostEmoticon } from '../entities/PostEmoticon';
import { PostService } from '../services/PostService';
import { PostEmoticonService } from '../services/PostEmoticonService';
import { EmoticonService } from '../services/EmoticonService';
import { CreatePostArgument } from './arguments/CreatePostArgument';
import { AuthMiddleware } from '../middleware/typegraphql/auth';
import { Account } from '../entities/Account';

@Service()
@Resolver(() => Post)
export class PostResolver {
    constructor(
        private readonly postService: PostService,
        private readonly postEmoticonService: PostEmoticonService,
        private readonly emoticonService: EmoticonService,
    ) {}

    // 물어봐
    // userId는 jwt토큰에서 accoundId 즉, Account테이블에서 index기준으로 가져옴
    @Query((returns) => [Post])
    async getAskPosts(
        @Arg('userId') id: number,
    ): Promise<Post[]> {
        const emoticons = await this.postService.getAskPosts({ id });
        // console.log(emoticons)
        return emoticons;
    }

    // 답해줘
    // userId는 jwt토큰에서 accoundId 즉, Account테이블에서 index기준으로 가져옴
    @Query((returns) => [Post])
    async getAnswerPosts(
        @Arg('userId') id: number,
    ): Promise<Post[]> {
        const emoticons = await this.postService.getAnswerPosts({ id });
        // console.log(emoticons)
        return emoticons;
    }

    // Post 생성
    // payload는 jwt토큰에서 accoundId 즉, Account테이블에서 index기준으로 가져옴
    // emoticon은 선택 할 수도, 안 할 수도 있어서 nullable
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
    async usedEmoticons(
        @Root() post: Post,
    ): Promise<PostEmoticon[]> {
        const postemoticons = await this.postEmoticonService.findPostEmoticon(post.id);
        return postemoticons;
    }
}

