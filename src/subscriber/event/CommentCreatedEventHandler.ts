import { Service } from 'typedi';
import { EventHandler } from '../../common/EventHandler';
import { CommentCreatedEvent } from '../../services/event/CommentCreatedEvent';
import { PostRepository } from '../../repositories/PostRepository';
import BaseError from '../../exceptions/BaseError';
import { ERROR_CODE } from '../../exceptions/ErrorCode';
import { InjectRepository } from 'typeorm-typedi-extensions';

@Service()
export class CommentCreatedEventHandler extends EventHandler<CommentCreatedEvent> {
    constructor(@InjectRepository() private readonly postRepository: PostRepository) {
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

        await this.postRepository.save(post);
        await this.postRepository.increaseCommentCount(postId);
    }
}
