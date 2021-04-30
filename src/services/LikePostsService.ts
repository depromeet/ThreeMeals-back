/* eslint-disable camelcase */
import { Inject, Service } from 'typedi';
import { LikePosts } from '../entities/LikePosts';
import { LikePostsRepository } from '../repositories/LikePostsRepository';
import { PostRepository } from '../repositories/PostRepository';
import { AccountRepository } from '../repositories/AccountRepository';
import { InjectRepository } from 'typeorm-typedi-extensions';
import BaseError from '../exceptions/BaseError';
import { ERROR_CODE } from '../exceptions/ErrorCode';
import { logger } from 'src/logger/winston';

@Service()
export class LikePostsService {
    constructor(
        @InjectRepository() private readonly LikePostsRepository: LikePostsRepository,
        @InjectRepository() private readonly PostRepository: PostRepository,
        @InjectRepository() private readonly AccountRepository: AccountRepository,
    ) {}
    async createLikePosts(args: {
        accountId: string,
        postId: number,
    }): Promise<LikePosts> {
        const { accountId, postId } = args;

        const from = await this.AccountRepository.getAccountId(accountId);
        const post = await this.PostRepository.getPostId(postId);

        const newLikePosts = new LikePosts();
        newLikePosts.account = from;
        newLikePosts.post = post;

        await this.LikePostsRepository.save(newLikePosts);

        return newLikePosts;
    }

    async deleteLikePosts(args: { id: number }): Promise<void> {
        const { id: id } = args;

        const postId = await this.PostRepository.getPostId(id);

        // postEmoticon 삭제
        await this.LikePostsRepository.delete({ post: postId });
    }
}
