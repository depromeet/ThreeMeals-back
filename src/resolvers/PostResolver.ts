import { Arg, Args, Ctx, FieldResolver, Query, Mutation, Resolver, Root, UseMiddleware } from 'type-graphql';
import { Service } from 'typedi';
import { Post } from '../entities/Post';
import { PostEmoticon } from '../entities/PostEmoticon';
import { Emoticon } from '../entities/Emoticon';
import { PostService } from '../services/PostService';
import { PostEmoticonService } from '../services/PostEmoticonService';
import { EmoticonService } from '../services/EmoticonService';
import { InsertPostArgument } from './arguments/PostArgument';
import { PostEmoticonArgument } from './arguments/PostEmoticonArgument';
import { PostType } from '../entities/Enums';
import { isAuth } from '../middleware/typegraphql/auth';
import { AuthContext } from '../middleware/express/AuthContext';
import { logger } from '../logger/winston';

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
    async getQuestionPosts(
        @Arg('userId') id: number,
    ): Promise<Post[]> {
        const emoticons = await this.postService.getQuestionPosts({ id });
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
    @UseMiddleware(isAuth)
    async createPost(
        @Args() { content, color, secretType }: InsertPostArgument,
        @Args() { positionX, positionY, rotate }: PostEmoticonArgument,
        @Arg('toAccounId') toAccounId: number,
        @Ctx() { payload }: AuthContext,
        @Arg('emoticonId', { nullable: true }) emoticonId?: number,

    ): Promise<Post> {
        const accountId: any = payload?.id;

        const post = await this.postService.createPost({ content, color, secretType, accountId, toAccounId,
            positionX, positionY, rotate, emoticonId });
        return post;
    }

    // Post 삭제
    @Mutation((returns) => Boolean)
    async deletePost(
        @Arg('postId') id: number,
    ): Promise<boolean> {
        await this.postService.deletePost({ id });
        return true;
    }

    @FieldResolver((returns) => [PostEmoticon])
    async usingEmoticons(
        @Root() post: Post,
    ): Promise<PostEmoticon[]> {
        const postemoticons = await this.postEmoticonService.findPostEmoticon(post.id);
        return postemoticons;
    }

    @FieldResolver((returns) => [Emoticon])
    async Emoticons(
        @Root() post: Post,
    ): Promise<Emoticon[]> {
        const id: any = post.usingEmoticons;
        const emoticons = await this.emoticonService.findEmoticonResolver(id[0].emoticon.id);
        console.log(id[0].emoticon.id);
        return emoticons;
    }

    // @FieldResolver((returns) => [Emoticon])
    // async Emoticons(
    //     @Root() post: Post,
    // ): Promise<Emoticon[]> {
    //     const id: any = post.usingEmoticons;
    //     const emoticons = await this.emoticonService.findEmoticonResolver(id);
    //     console.log(id);
    //     return emoticons;
    // }
}

