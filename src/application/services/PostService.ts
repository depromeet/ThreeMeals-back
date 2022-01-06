import { Service } from 'typedi';
import { each, filter, flow, map, unionBy, values } from 'lodash/fp';
import { Post } from '../../entities/Post';
import { PostEmoticon } from '../../entities/PostEmoticon';
import { AccountRepository } from '../../infrastructure/repositories/AccountRepository';
import { PostRepository } from '../../infrastructure/repositories/PostRepository';
import { PostState, PostType, SecretType } from '../../entities/Enums';
import BaseError from '../../domain/exceptions/BaseError';
import { ERROR_CODE } from '../../domain/exceptions/ErrorCode';
import { AccountOrmEntity } from '../../entities/AccountOrmEntity';
import { IUnitOfWork } from '../../domain/common/IUnitOfWork';

@Service()
export class PostService {
    constructor(
        private readonly accountRepository: AccountRepository,
        private readonly postRepository: PostRepository,
        private readonly unitOfWork: IUnitOfWork,
    ) {}

    async getPost(args: {
        postId: string,
        myAccountId: string | null;
    }): Promise<Post> {
        const { postId, myAccountId } = args;
        const post = await this.postRepository.findOneById(postId, true);
        if (!post) {
            console.error(`Post 찾을 수 없음 postId: ${args.postId}`);
            throw new BaseError(ERROR_CODE.POST_NOT_FOUND);
        }
        post.hideFromAccount(myAccountId);
        return post;
    }

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

    async getNewPostsCounts(args: {
        accountId: string;
        postType: PostType | null,
        postState: PostState | null },
    ): Promise<{ postType: PostType; count: number }[]> {
        const counts = await this.postRepository.countsGroupByPostType({ ...args });

        return flow(
            filter((postType) => (args.postType ? args.postType === postType : true)),
            map((postType) => ({ postType, count: '0' })),
            unionBy('postType', counts),
            map((count) => ({ postType: count.postType, count: parseInt(count.count) })),
        )(values(PostType));
    }

    async createPost(args: {
        fromAccount: AccountOrmEntity;
        toAccountId: string;
        content: string;
        color: string;
        secretType: SecretType;
        postType: PostType;
        postEmoticons: PostEmoticon[];
    }): Promise<Post> {
        return this.unitOfWork.withTransaction(async () => {
            const { fromAccount: from, toAccountId, content, color, secretType, postType, postEmoticons } = args;

            const to = await this.accountRepository.findOneById(toAccountId);
            if (!to) {
                throw new BaseError(ERROR_CODE.USER_NOT_FOUND);
            }

            // Post 생성
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
            const newPost = Post.create({
                color: color,
                content: content,
                fromAccountId: from.id,
                toAccountId: to.id,
                postType: postType,
                secretType: secretType,
            });

            if (postType !== PostType.Quiz && postEmoticons.length > 0) {
                newPost.addEmoticons(postEmoticons);
            }

            // Post 생성
            const savedPost = await this.postRepository.savePost(newPost);
            savedPost.addCreatedEvent();

            return savedPost;
        });
    }

    // Post 삭제
    async deletePost(args: { account: AccountOrmEntity, postId: string }): Promise<void> {
        const { account, postId } = args;
        const post = await this.postRepository.findOneById(postId);
        if (!post) {
            console.error(`Post 찾을 수 없음 postId: ${args.postId}`);
            throw new BaseError(ERROR_CODE.POST_NOT_FOUND);
        }
        post.delete(account.id);

        await this.postRepository.savePost(post);
    }
}
