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
        @InjectRepository() private readonly accountRepository: AccountRepository,
        @InjectRepository() private readonly postRepository: PostRepository,
        @InjectRepository() private readonly postEmoticonRepository: PostEmoticonRepository,
        @InjectRepository() private readonly emoticonRepository: EmoticonRepository,
        @InjectRepository() private readonly likePostsRepository: LikePostsRepository,
    ) {}

    async getPosts(args: {
        accountId: string,
        hasComment: boolean,
        hasUsedEmoticons: boolean,
        postType: PostType | null,
        limit: number,
        after: string | null
    }): Promise<Post[]> {
        return this.postRepository.listByAccountId(args);
    }

    async getAnswerPosts(args: { id: string }): Promise<Post[]> {
        const { id: id } = args;
        const from = await this.accountRepository.getAccountId(toString(id));
        console.log(from);
        const posts = await this.postRepository.find({
            where: {
                postType: PostType.Answer,
                toAccount: from,
            },
            relations: ['usedEmoticons', 'usedEmoticons.emoticon'],
            order: { id: 'DESC' },
        });
        console.log(posts);
        return posts;
    }

    async createPost(args: {
        fromAccount: Account;
        toAccountId: string;
        content: string;
        color: string;
        secretType: SecretType;
        postType: PostType;
        postEmoticons: PostEmoticon[];
    }): Promise<Post> {
        // console.log(args);
        const { fromAccount: from, toAccountId, content, color, secretType, postType, postEmoticons } = args;

        const to = await this.accountRepository.getAccountId(toAccountId);
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
            newPost.usedEmoticons = await this.postEmoticonRepository.save(postEmoticons);
        }

        // // PostEmotion 생성
        const savedPost = await this.postRepository.createPost(newPost);

        return savedPost;
    }

    // Post 삭제
    async deletePost(args: { id: string }): Promise<void> {
        const { id: id } = args;
        const postId = await this.postRepository.getPostById(id);

        // postEmoticon 삭제
        await this.postEmoticonRepository.delete({ post: postId });

        // LikePosts 삭제
        await this.likePostsRepository.delete({ post: postId });

        // post 삭제
        await this.postRepository.delete({ id: id });
    }
}
