import { Service } from 'typedi';
import { EventHandler } from '../../common/EventHandler';
// import { PostCreatedEvent } from '../../entities/Post';
import { CommentCreatedEvent } from '../../services/event/CommentCreatedEvent';
import { NotificationService } from '../../services/NotificationService';
import { NotiType } from '../../entities/Enums';

@Service()
export class CreateNotiWhenCommentCreatedEventHandler extends EventHandler<CommentCreatedEvent> {
    constructor(private readonly notificationService: NotificationService) {
        super();
    }

    eventName(): string {
        return CommentCreatedEvent.name;
    }

    async handle(event: CommentCreatedEvent): Promise<void> {
        const { data: post } = event;
        if (post.fromAccountId !== post.toAccountId) {
            await this.notificationService.createNotification({
                accountId: post.toAccountId,
                relatedPostId: post.id,
                otherAccountId: post.fromAccountId,
                notiType: NotiType.CommentToMe,
            });
        }
    }
}
