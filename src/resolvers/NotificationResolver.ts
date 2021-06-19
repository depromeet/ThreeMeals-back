import { Ctx, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Service } from 'typedi';
import { Account } from '../entities/Account';
import { Notification } from '../entities/Notification';
import { AuthMiddleware } from '../middleware/typegraphql/auth';
import { NotificationService } from '../services/NotificationService';
import { NotiCount } from '../schemas/UnreadNotiCount';
import BaseError from '../exceptions/BaseError';
import { ERROR_CODE } from '../exceptions/ErrorCode';

@Service()
@Resolver(() => Notification)
export class NotificationResolver {
    constructor(private readonly notificationService: NotificationService) {}

    @Query((returns) => [Notification])
    @UseMiddleware(AuthMiddleware)
    async getNotifications(@Ctx('account') account: Account): Promise<Notification[]> {
        const notifications = await this.notificationService.getNotificationsByUser(account);
        console.log(notifications);
        return notifications;
    }

    @Query((returns) => NotiCount)
    @UseMiddleware(AuthMiddleware)
    async getUnreadNotiCount(@Ctx('account') account: Account): Promise<NotiCount> {
        console.log(account);
        if (!account) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED);
        }
        const unreadNotiCount = await this.notificationService.getUnreadNotiCount(account);

        const notiCount = { count: unreadNotiCount };

        return notiCount;
    }
}
