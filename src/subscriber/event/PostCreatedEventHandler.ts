import { Service } from 'typedi';
import { EventHandler } from '../../common/EventHandler';
import { PostCreatedEvent } from '../../entities/Post';
import { NotificationService } from '../../services/NotificationService';
import { NotiType } from '../../entities/Enums';

@Service()
export class PostCreatedEventHandler extends EventHandler<PostCreatedEvent> {
    constructor(
        private readonly notificationService: NotificationService,
    ) {
        super();
    }

    eventName(): string {
        return PostCreatedEvent.name;
    }

    async handle(event: PostCreatedEvent): Promise<void> {
        const { data: post } = event;
        if (post.fromAccountId !== post.toAccountId) {
            await this.notificationService.createNotification({
                accountId: post.toAccountId,
                relatedPostId: post.id,
                otherAccountId: post.fromAccountId,
                notiType: NotiType.PostToMe,
            });
        }
    }
}
