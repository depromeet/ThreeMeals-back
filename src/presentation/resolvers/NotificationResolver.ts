import { Ctx, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Service } from 'typedi';
import { AccountOrmEntity } from '../../entities/AccountOrmEntity';
import { Notification } from '../../entities/Notification';
import { AuthMiddleware } from '../../infrastructure/apollo/middleware/auth';
import { NotificationService } from '../../application/services/NotificationService';
import { NotiCount } from './schemas/UnreadNotiCount';
import BaseError from '../../exceptions/BaseError';
import { ERROR_CODE } from '../../exceptions/ErrorCode';

@Service()
@Resolver(() => Notification)
export class NotificationResolver {
    constructor(private readonly notificationService: NotificationService) {}

    @Query((returns) => [Notification])
    @UseMiddleware(AuthMiddleware)
    async getNotifications(@Ctx('account') account: AccountOrmEntity): Promise<Notification[]> {
        const notifications = await this.notificationService.getNotificationsByUser(account);
        console.log(notifications);
        return notifications;
    }

    @Query((returns) => NotiCount)
    @UseMiddleware(AuthMiddleware)
    async getUnreadNotiCount(@Ctx('account') account: AccountOrmEntity): Promise<NotiCount> {
        console.log(account);
        if (!account) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED);
        }
        const unreadNotiCount = await this.notificationService.getUnreadNotiCount(account);

        const notiCount = { count: unreadNotiCount };

        return notiCount;
    }
}
