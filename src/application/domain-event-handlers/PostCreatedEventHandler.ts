import { Service } from 'typedi';
import { EventHandler } from './EventHandler';
import { NotificationService } from '../services/NotificationService';
import { NotiType } from '../../entities/Enums';
import { PostCreatedEvent } from '../../domain/events/PostCreatedEvent';

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
        const { fromAccountId, toAccountId, id: postId } = event.data;
        if (fromAccountId !== toAccountId) {
            await this.notificationService.createNotification({
                accountId: toAccountId,
                relatedPostId: postId,
                otherAccountId: fromAccountId,
                notiType: NotiType.PostToMe,
            });
        }
    }
}
