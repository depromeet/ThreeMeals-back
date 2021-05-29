import { Service } from 'typedi';
import { EventHandler } from '../../common/EventHandler';
import { NotificationService } from '../../services/NotificationService';
import { NotiType, PostType } from '../../entities/Enums';
import { CommentCreatedEvent } from '../../services/event/CommentCreatedEvent';

@Service()
export class CreateNotiWhenCommentCreatedEventHandler extends EventHandler<CommentCreatedEvent> {
    constructor(private readonly notificationService: NotificationService) {
        super();
    }

    eventName(): string {
        return CommentCreatedEvent.name;
    }

    async handle(event: CommentCreatedEvent): Promise<void> {
        // ohterAccount가 댓글달린 게시물의 주인
        // accountId가 댓글 단 사람
        const { accountId, postId, otherAccountId, postType } = event.data;
        console.log('???');
        // if (postType === PostType.Ask) {
        if (otherAccountId !== accountId) {
            await this.notificationService.createNotification({
                accountId: otherAccountId,
                relatedPostId: postId,
                otherAccountId: accountId,
                notiType: NotiType.CommentToMe,
            });
        }
        // } else if (postType === PostType.Answer) {
        //     await this.notificationService.createNotification({
        //         accountId: otherAccountId,
        //         relatedPostId: postId,
        //         otherAccountId: accountId,
        //         notiType: NotiType.CommentToMe,
        //     });
        // }
    }
}
