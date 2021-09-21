import { Service } from 'typedi';
import { EventHandler } from './EventHandler';
import { CommentCreatedEvent } from '../../domain/events/CommentCreatedEvent';
import { PostRepository } from '../../infrastructure/repositories/PostRepository';
import BaseError from '../../domain/exceptions/BaseError';
import { ERROR_CODE } from '../../domain/exceptions/ErrorCode';

@Service()
export class CommentCreatedEventHandler extends EventHandler<CommentCreatedEvent> {
    constructor(
        private readonly postRepository: PostRepository,
    ) {
        super();
    }

    eventName(): string {
        return CommentCreatedEvent.name;
    }

    async handle(event: CommentCreatedEvent): Promise<void> {
        const { postId, content, accountId, isUniqueComment } = event.data;
        const post = await this.postRepository.findOneById(postId);
        if (!post) {
            console.error(`Post 찾을 수 없음 postId: ${postId}`);
            throw new BaseError(ERROR_CODE.POST_NOT_FOUND);
        }

        post.answer(accountId, content, isUniqueComment);

        await this.postRepository.savePost(post);
        await this.postRepository.increaseCommentCount(postId);
    }
}
