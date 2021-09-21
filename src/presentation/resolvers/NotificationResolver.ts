import { Ctx, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Service } from 'typedi';
import { AccountOrmEntity } from '../../entities/AccountOrmEntity';
import { Notification } from '../../entities/Notification';
import { AuthMiddleware } from '../../infrastructure/apollo/middleware/auth';
import { NotificationService } from '../../application/services/NotificationService';
import { NotiCount } from './schemas/UnreadNotiCount';
import BaseError from '../../domain/exceptions/BaseError';
import { ERROR_CODE } from '../../domain/exceptions/ErrorCode';

@Service()
@Resolver(() => Notification)
export class NotificationResolver {
    constructor(private readonly notificationService: NotificationService) {}

    @Query((returns) => [Notification])
    @UseMiddleware(AuthMiddleware)
    async getNotifications(@Ctx('account') account: AccountOrmEntity): Promise<Notification[]> {
        const notifications = await this.notificationService.getNotificationsByUser(account);
        return notifications;
    }

    @Query((returns) => NotiCount)
    @UseMiddleware(AuthMiddleware)
    async getUnreadNotiCount(@Ctx('account') account: AccountOrmEntity): Promise<NotiCount> {
        if (!account) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED);
        }
        const unreadNotiCount = await this.notificationService.getUnreadNotiCount(account);

        const notiCount = { count: unreadNotiCount };

        return notiCount;
    }
}
