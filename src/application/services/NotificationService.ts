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
        this.readAllNotifications(account);
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
        console.log(account);
        return await this.notificationRepository.countUnreadNoti(account);
    }
}
