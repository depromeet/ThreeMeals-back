import { Inject, Service } from 'typedi';
import { LikePost } from '../entities/LikePost';
import { LikePostsRepository } from '../repositories/LikePostsRepository';
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
        @InjectRepository() private readonly likePostsRepository: LikePostsRepository,
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

        if (accountId !== post.fromAccountId) {
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

    async deleteLikePosts(args: { accountId: string, id: string }): Promise<void> {
        const { accountId, id } = args;

        const post = await this.postRepository.findOneById(id);
        if (!post) {
            console.log(`cannot find post , postId: ${id}`);
            throw new BaseError(ERROR_CODE.POST_NOT_FOUND);
        }

        if (accountId !== post.toAccountId) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED_LIKE_POST);
        }

        // postEmoticon 삭제
        await this.likePostsRepository.deleteLikes(post);
    }
}
