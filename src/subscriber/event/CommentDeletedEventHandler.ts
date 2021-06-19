import { Service } from 'typedi';
import { EventHandler } from '../../common/EventHandler';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { PostRepository } from '../../repositories/PostRepository';
import { CommentDeletedEvent } from '../../services/event/CommentDeletedEvent';

@Service()
export class CommentDeletedEventHandler extends EventHandler<CommentDeletedEvent> {
    constructor(@InjectRepository() private readonly postRepository: PostRepository) {
        super();
    }

    eventName(): string {
        return CommentDeletedEvent.name;
    }

    async handle(event: CommentDeletedEvent): Promise<void> {
        const { postId } = event.data;
        await this.postRepository.decreaseCommentCount(postId);
    }
}
