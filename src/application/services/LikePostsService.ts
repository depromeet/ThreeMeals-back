import { Service } from 'typedi';
import { LikePost } from '../../entities/LikePost';
import { LikePostRepository } from '../../infrastructure/repositories/LikePostRepository';
import { PostRepository } from '../../infrastructure/repositories/PostRepository';
import { AccountRepository } from '../../infrastructure/repositories/AccountRepository';
import BaseError from '../../exceptions/BaseError';
import { ERROR_CODE } from '../../exceptions/ErrorCode';
import { EventPublisher } from '../../infrastructure/event-publishers/EventPublisher';
import { LikeCreatedEvent } from '../../domain/events/LikeCreatedEvent';

@Service()
export class LikePostsService {
    constructor(
        private readonly postRepository: PostRepository,
        private readonly likePostsRepository: LikePostRepository,
        private readonly accountRepository: AccountRepository,
        private readonly eventPublisher: EventPublisher,
    ) {}

    async createLikePosts(args: { accountId: string; postId: string }): Promise<LikePost> {
        const { accountId, postId } = args;

        const from = await this.accountRepository.findOneById(accountId);
        const post = await this.postRepository.findOneById(postId);
        if (!post) {
            throw new BaseError(ERROR_CODE.POST_NOT_FOUND);
        }

        if (accountId !== post.toAccountId) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED_LIKE_POST);
        }

        const newLikePost = new LikePost();
        newLikePost.account = from;
        newLikePost.post = post;

        await this.likePostsRepository.saveLike(newLikePost);

        await this.eventPublisher.dispatchAsync(
            new LikeCreatedEvent({
                postId: postId,
                accountId: accountId,
                otherAccountId: post.fromAccountId,
                postType: post.postType,
            }),
        );
        return newLikePost;
    }

    async deleteLikePosts(args: { accountId: string, postId: string }): Promise<void> {
        const { accountId, postId } = args;

        const post = await this.postRepository.findOneById(postId);
        if (!post) {
            console.log(`cannot find post , postId: ${postId}`);
            throw new BaseError(ERROR_CODE.POST_NOT_FOUND);
        }

        if (accountId !== post.toAccountId) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED_LIKE_POST);
        }

        await this.likePostsRepository.deleteLikes(post);
    }
}
