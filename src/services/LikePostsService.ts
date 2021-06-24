import { Inject, Service } from 'typedi';
import { LikePost } from '../entities/LikePost';
import { LikePostRepository } from '../repositories/LikePostRepository';
import { PostRepository } from '../repositories/PostRepository';
import { AccountRepository } from '../repositories/AccountRepository';
import { InjectRepository } from 'typeorm-typedi-extensions';
import BaseError from '../exceptions/BaseError';
import { ERROR_CODE } from '../exceptions/ErrorCode';
import { EventPublisher } from '../EventPublisher';
import { LikeCreatedEvent } from './event/LikeCreatedEvent';

@Service()
export class LikePostsService {
    constructor(
        @InjectRepository() private readonly likePostsRepository: LikePostRepository,
        @InjectRepository() private readonly postRepository: PostRepository,
        @InjectRepository() private readonly accountRepository: AccountRepository,
        private readonly eventPublisher: EventPublisher,
    ) {}
    async createLikePosts(args: { accountId: string; postId: string }): Promise<LikePost> {
        const { accountId, postId } = args;

        const from = await this.accountRepository.getAccountId(accountId);
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

        await this.eventPublisher.publishAsync(
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
