import { Service } from 'typedi';
import { Notification } from '../../entities/Notification';
import { NotificationRepository } from '../../infrastructure/repositories/NotificationRepository';
import { AccountOrmEntity } from '../../entities/AccountOrmEntity';
import { NotiType } from '../../entities/Enums';

@Service()
export class NotificationService {
    constructor(
        private readonly notificationRepository: NotificationRepository,
    ) {}

    async getNotificationsByUser(account: AccountOrmEntity): Promise<Notification[]> {
        const notifications = await this.notificationRepository.getNotifications(account);
        notifications.forEach((notification) => {
            // post 주인이 나라면 other account 를 가린다.
            if (notification.relatedPost.toAccountId === account.id) {
                notification.otherAccount = null;
            }
        });
        await this.readAllNotifications(account);
        return notifications;
    }

    async createNotification(args: {
        relatedPostId: string;
        accountId: string;
        otherAccountId: string;
        notiType: NotiType;
    }): Promise<void> {
        const newNoti = new Notification();
        newNoti.accountId = args.accountId;
        newNoti.otherAccountId = args.otherAccountId;
        newNoti.relatedPostId = args.relatedPostId;
        newNoti.notificationType = args.notiType;
        newNoti.read = false;

        await this.notificationRepository.saveNotification(newNoti);
    }

    async readAllNotifications(account: AccountOrmEntity): Promise<void> {
        await this.notificationRepository.updateReadAll(account.id);
    }

    async getUnreadNotiCount(account: AccountOrmEntity): Promise<number> {
        return await this.notificationRepository.countUnreadNoti(account);
    }
}
