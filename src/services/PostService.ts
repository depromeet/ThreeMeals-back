import { Inject, Service } from 'typedi';
import { Post } from '../entities/Post';
import { PostEmoticon } from '../entities/PostEmoticon';
import { AccountRepository } from '../repositories/AccountRepository';
import { PostRepository } from '../repositories/PostRepository';
import { PostEmoticonRepository } from '../repositories/PostEmoticonRepository';
import { EmoticonRepository } from '../repositories/EmoticonRepository';
import { LikePostsRepository } from '../repositories/LikePostsRepository';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { PostType, PostState, SecretType } from '../entities/Enums';
import BaseError from '../exceptions/BaseError';
import { ERROR_CODE } from '../exceptions/ErrorCode';
import { logger } from 'src/logger/winston';
import { toString } from 'lodash';

@Service()
export class PostService {
    constructor(
        @InjectRepository() private readonly AccountRepository: AccountRepository,
        @InjectRepository() private readonly PostRepository: PostRepository,
        @InjectRepository() private readonly PostEmoticonRepository: PostEmoticonRepository,
        @InjectRepository() private readonly EmoticonRepository: EmoticonRepository,
        @InjectRepository() private readonly LikePostsRepository: LikePostsRepository,
    ) {}

    async getQuestionPosts(args: { id: number }): Promise<Post[]> {
        const { id: id } = args;
        const from = await this.AccountRepository.getAccountId(toString(id));
        const posts = await this.PostRepository.find({ where: {
            postType: PostType.question, toAccount: from },
        relations: ['usingEmoticons', 'usingEmoticons.emoticon'] });

        return posts;
    }


    async getAnswerPosts(args: { id: number }): Promise<Post[]> {
        const { id: id } = args;
        const from = await this.AccountRepository.getAccountId(toString(id));
        console.log(from);
        const posts = await this.PostRepository.find({ where: {
            postType: PostType.answer, toAccount: from },
        relations: ['usingEmoticons', 'usingEmoticons.emoticon'] });
        console.log(posts);
        return posts;
    }

    async createPost(args: {
        content: string,
        color: string,
        secretType: SecretType,
        accountId: string,
        toAccounId: number
        positionX: number,
        positionY: number,
        rotate: number,
        emoticonId?: number
    }): Promise<Post> {
        const { content, secretType, color, accountId, toAccounId,
            positionX, positionY, rotate, emoticonId } = args;

        const from = await this.AccountRepository.getAccountId(accountId);
        if (!from) {
            throw new BaseError(ERROR_CODE.USER_NOT_FOUND);
        }

        const to = await this.AccountRepository.getAccountId(toString(toAccounId));
        if (!to) {
            throw new BaseError(ERROR_CODE.USER_NOT_FOUND);
        }

        // Post 생성
        const newPost = new Post();

        newPost.content = content;
        // from과 to가 같으면 답해줘. 다르면 물어봐.
        if (from.id == to.id) {
            newPost.postType = PostType.answer;
        } else {
            newPost.postType = PostType.question;
        }
        newPost.color = color;
        newPost.postState = PostState.submitted;
        newPost.secretType = secretType;
        newPost.fromAccount = from;
        newPost.toAccount = to;

        // PostEmotion 생성
        const tmp = await this.PostRepository.createPost(newPost);
        console.log(tmp);
        if (emoticonId != null) {
            const postId = await this.PostRepository.getPostId(tmp.id);
            const emoticon = await this.EmoticonRepository.getEmoticonId(emoticonId);

            const newPostEmoticon = new PostEmoticon();
            newPostEmoticon.positionX = positionX;
            newPostEmoticon.positionY = positionY;
            newPostEmoticon.rotate = rotate;
            newPostEmoticon.post = postId;
            newPostEmoticon.emoticon = emoticon;
            await this.PostEmoticonRepository.createPostEmoticon(newPostEmoticon);
        }

        return newPost;
    }

    // Post 삭제
    async deletePost(args: { id: number }): Promise<void> {
        const { id: id } = args;
        const postId = await this.PostRepository.getPostId(id);

        // postEmoticon 삭제
        await this.PostEmoticonRepository.delete({ post: postId });

        // LikePosts 삭제
        await this.LikePostsRepository.delete({ post: postId });

        // post 삭제
        await this.PostRepository.delete({ id: id });
    }
}
