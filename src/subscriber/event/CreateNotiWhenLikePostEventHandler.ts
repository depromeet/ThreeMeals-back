import { Service } from 'typedi';
import { EventHandler } from '../../common/EventHandler';
import { NotificationService } from '../../services/NotificationService';
import { NotiType } from '../../entities/Enums';
import { LikeCreatedEvent } from '../../services/event/LikeCreatedEvent';

@Service()
export class CreateNotiWhenLikePostEventHandler extends EventHandler<LikeCreatedEvent> {
    constructor(private readonly notificationService: NotificationService) {
        super();
    }

    eventName(): string {
        return LikeCreatedEvent.name;
    }

    async handle(event: LikeCreatedEvent): Promise<void> {
        console.log('!!!!!when like');
        const { accountId, postId, otherAccountId } = event.data;
        if (otherAccountId !== accountId) {
            await this.notificationService.createNotification({
                accountId: accountId,
                relatedPostId: postId,
                otherAccountId: otherAccountId,
                notiType: NotiType.LikeToMine,
            });
        }
    }
}
