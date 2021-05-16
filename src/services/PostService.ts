import { Service } from 'typedi';
import { each, filter, flow, map, unionBy, values } from 'lodash/fp';
import { Post } from '../entities/Post';
import { PostEmoticon } from '../entities/PostEmoticon';
import { AccountRepository } from '../repositories/AccountRepository';
import { PostRepository } from '../repositories/PostRepository';
import { PostEmoticonRepository } from '../repositories/PostEmoticonRepository';
import { LikePostsRepository } from '../repositories/LikePostsRepository';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { PostState, PostType, SecretType } from '../entities/Enums';
import BaseError from '../exceptions/BaseError';
import { ERROR_CODE } from '../exceptions/ErrorCode';
import { Account } from '../entities/Account';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { NotificationService } from './NotificationService';
import { NotiType } from '../entities/Enums';
@Service()
export class PostService {
    constructor(
        @InjectRepository() private readonly accountRepository: AccountRepository,
        @InjectRepository() private readonly postRepository: PostRepository,
        @InjectRepository() private readonly postEmoticonRepository: PostEmoticonRepository,
        @InjectRepository() private readonly likePostsRepository: LikePostsRepository,
        private readonly notificationService: NotificationService,
    ) {}

    async getPosts(args: {
        myAccountId: string | null;
        accountId: string;
        hasUsedEmoticons: boolean;
        postType: PostType | null;
        postState: PostState | null;
        limit: number;
        after: string | null;
    }): Promise<Post[]> {
        const posts = await this.postRepository.listByAccountId({ ...args });

        return flow(
            each<Post>((post) => post.hideFromAccount(args.myAccountId)),
        )(posts);
    }

    async getNewPostsCounts(args: { accountId: string; postType: PostType | null }): Promise<{ postType: PostType; count: number }[]> {
        const counts = await this.postRepository.countsGroupByPostType({ ...args, postState: PostState.Submitted });

        return flow(
            filter((postType) => (args.postType ? args.postType === postType : true)),
            map((postType) => ({ postType, count: '0' })),
            unionBy('postType', counts),
            map((count) => ({ postType: count.postType, count: parseInt(count.count) })),
        )(values(PostType));
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
        if (postType === PostType.Answer) {
            // from to 가 다른데 답해줘라면 에러
            if (from.id !== to.id) {
                console.log(`invalid post type, postType: ${postType}, fromId: ${from.id}, toId: ${to.id}`);
                throw new BaseError(ERROR_CODE.INVALID_POST_TYPE);
            }
        } else {
            // from 과 to 가 같은데 답해줘가 아니라면 에러
            if (from.id === to.id) {
                console.log(`invalid post type, postType: ${postType}, fromId: ${from.id}, toId: ${to.id}`);
                throw new BaseError(ERROR_CODE.INVALID_POST_TYPE);
            }
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

        // 글 생성하고 알림 db 생성 await을 해야될까?
        if (savedPost && from.id !== to.id) {
            this.notificationService.createNotification({
                account: to,
                relatedPost: savedPost,
                otherAccount: from,
                notiType: NotiType.PostToMe,
            });
        }
        return savedPost;
    }

    // Post 삭제
    async deletePost(args: { id: string }): Promise<void> {
        const { id: id } = args;
        const postId = await this.postRepository.findOneById(id);

        // postEmoticon 삭제
        await this.postEmoticonRepository.delete({ post: postId });

        // LikePosts 삭제
        await this.likePostsRepository.delete({ post: postId });

        // post 삭제
        await this.postRepository.delete({ id: id });
    }
}
