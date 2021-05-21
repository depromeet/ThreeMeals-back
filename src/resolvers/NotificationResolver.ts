import { Ctx, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Service } from 'typedi';
import { Account } from '../entities/Account';
import { Notification } from '../entities/Notification';
import { AuthMiddleware } from '../middleware/typegraphql/auth';
import { NotificationService } from '../services/NotificationService';

@Service()
@Resolver(() => Notification)
export class NotificationResolver {
    constructor(
        private readonly notificationService: NotificationService,
    ) {}

    @Query((returns) => [Notification])
    @UseMiddleware(AuthMiddleware)
    async getNotifications(
        @Ctx('account') account: Account,
    ): Promise<Notification[]> {
        const notifications = await this.notificationService.getNotificationsByUser(account);
        return notifications;
    }
}
