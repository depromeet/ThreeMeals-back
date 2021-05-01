import { Service } from 'typedi';
import { Post } from '../entities/Post';
import { PostEmoticon } from '../entities/PostEmoticon';
import { AccountRepository } from '../repositories/AccountRepository';
import { PostRepository } from '../repositories/PostRepository';
import { PostEmoticonRepository } from '../repositories/PostEmoticonRepository';
import { EmoticonRepository } from '../repositories/EmoticonRepository';
import { LikePostsRepository } from '../repositories/LikePostsRepository';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { PostState, PostType, SecretType } from '../entities/Enums';
import BaseError from '../exceptions/BaseError';
import { ERROR_CODE } from '../exceptions/ErrorCode';
import { toString } from 'lodash';
import { Account } from '../entities/Account';

@Service()
export class PostService {
    constructor(
        @InjectRepository() private readonly AccountRepository: AccountRepository,
        @InjectRepository() private readonly PostRepository: PostRepository,
        @InjectRepository() private readonly PostEmoticonRepository: PostEmoticonRepository,
        @InjectRepository() private readonly EmoticonRepository: EmoticonRepository,
        @InjectRepository() private readonly LikePostsRepository: LikePostsRepository,
    ) {}

    async getAskPosts(args: { id: number }): Promise<Post[]> {
        const { id: id } = args;
        const from = await this.AccountRepository.getAccountId(toString(id));
        const posts = await this.PostRepository.find({ where: {
            postType: PostType.Ask, toAccount: from },
        relations: ['usedEmoticons', 'usedEmoticons.emoticon'] });

        return posts;
    }


    async getAnswerPosts(args: { id: number }): Promise<Post[]> {
        const { id: id } = args;
        const from = await this.AccountRepository.getAccountId(toString(id));
        console.log(from);
        const posts = await this.PostRepository.find({ where: {
            postType: PostType.Answer, toAccount: from },
        relations: ['usedEmoticons', 'usedEmoticons.emoticon'] });
        console.log(posts);
        return posts;
    }

    async createPost(args: {
        fromAccount: Account,
        toAccountId: string
        content: string,
        color: string,
        secretType: SecretType,
        postType: PostType,
        postEmoticons: PostEmoticon[],
    }): Promise<Post> {
        // console.log(args);
        const {
            fromAccount: from,
            toAccountId,
            content,
            color,
            secretType,
            postType,
            postEmoticons,
        } = args;

        const to = await this.AccountRepository.getAccountId(toAccountId);
        if (!to) {
            throw new BaseError(ERROR_CODE.USER_NOT_FOUND);
        }

        // Post 생성
        const newPost = new Post();
        // from 과 to 가 같은데 답해줘가 아니라면 에러
        if (from.id == to.id && postType !== PostType.Answer) {
            console.log(`invalid post type, postType: ${postType}, fromId: ${from.id}, toId: ${to.id}`);
            throw new BaseError(ERROR_CODE.INVALID_POST_TYPE);
        }
        newPost.content = content;
        newPost.color = color;
        newPost.postState = PostState.Submitted;
        newPost.secretType = secretType;
        newPost.postType = postType;
        newPost.fromAccount = from;
        newPost.toAccount = to;

        if (postType !== PostType.Quiz && postEmoticons.length > 0) {
            newPost.usedEmoticons = await this.PostEmoticonRepository.save(postEmoticons);
        }

        // // PostEmotion 생성
        const savedPost = await this.PostRepository.createPost(newPost);

        return savedPost;
    }

    // Post 삭제
    async deletePost(args: { id: string }): Promise<void> {
        const { id: id } = args;
        const postId = await this.PostRepository.getPostById(id);

        // postEmoticon 삭제
        await this.PostEmoticonRepository.delete({ post: postId });

        // LikePosts 삭제
        await this.LikePostsRepository.delete({ post: postId });

        // post 삭제
        await this.PostRepository.delete({ id: id });
    }
}
