import { Service } from 'typedi';
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent, UpdateEvent } from 'typeorm';
import { Comment } from '../../entities/Comment';
import { Post } from '../../entities/Post';
import { CommentState } from '../../entities/Enums';

@Service()
@EventSubscriber()
export class CommentSubscriber implements EntitySubscriberInterface<Comment> {
    listenTo() {
        return Comment;
    }

    async afterInsert(event: InsertEvent<Comment>): Promise<void> {
        // comment 가 증가했다면 post count 1 증가
        await event.manager.createQueryBuilder()
            .update(Post)
            .set({ commentsCount: () => 'comments_count + 1' })
            .where('id = :postId', { postId: event.entity.postId })
            .execute();
    }

    async afterUpdate(event: UpdateEvent<Comment>): Promise<void> {
        // 삭제인 경우 post 의 count 1 제거
        if (event.entity.commentState === CommentState.Deleted) {
            await event.manager.createQueryBuilder()
                .update(Post)
                .set({ commentsCount: () => 'comments_count - 1' })
                .where('id = :postId', { postId: event.entity.postId })
                .execute();
        }
    }
}
