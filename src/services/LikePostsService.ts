/* eslint-disable camelcase */
import { Inject, Service } from 'typedi';
import { LikePost } from '../entities/LikePost';
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
        @InjectRepository() private readonly likePostsRepository: LikePostsRepository,
        @InjectRepository() private readonly postRepository: PostRepository,
        @InjectRepository() private readonly accountRepository: AccountRepository,
    ) {}
    async createLikePosts(args: {
        accountId: string,
        postId: string,
    }): Promise<LikePost> {
        const { accountId, postId } = args;

        const from = await this.accountRepository.getAccountId(accountId);
        const post = await this.postRepository.findOneById(postId);

        const newLikePost = new LikePost();
        newLikePost.account = from;
        newLikePost.post = post;

        await this.likePostsRepository.saveLike(newLikePost);

        return newLikePost;
    }

    async deleteLikePosts(args: { id: string }): Promise<void> {
        const { id: id } = args;

        const post = await this.postRepository.findOneById(id);
        if (!post) {
            console.log(`cannot find post , postId: ${id}`);
            throw new BaseError(ERROR_CODE.POST_NOT_FOUND);
        }

        // postEmoticon 삭제
        await this.likePostsRepository.deleteLikes(post);
    }
}
