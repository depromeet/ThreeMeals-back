import { Service } from 'typedi';
import { EventHandler } from './EventHandler';
import { PostRepository } from '../../infrastructure/repositories/PostRepository';
import { CommentDeletedEvent } from '../../domain/events/CommentDeletedEvent';
import BaseError from '../../domain/exceptions/BaseError';
import { ERROR_CODE } from '../../domain/exceptions/ErrorCode';
import { PostState, PostType } from '../../entities/Enums';

@Service()
export class CommentDeletedEventHandler extends EventHandler<CommentDeletedEvent> {
    constructor(
        private readonly postRepository: PostRepository,
    ) {
        super();
    }

    eventName(): string {
        return CommentDeletedEvent.name;
    }

    async handle(event: CommentDeletedEvent): Promise<void> {
        const { postId } = event.data;
        const post = await this.postRepository.findOneById(postId);
        if (!post) {
            throw new BaseError(ERROR_CODE.NOT_FOUND);
        }
        if (post.postType === PostType.Quiz || post.postType === PostType.Ask) {
            post.postState = PostState.Submitted;
        }

        await this.postRepository.savePost(post);
        await this.postRepository.decreaseCommentCount(postId);
    }
}
