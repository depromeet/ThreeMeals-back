import { Repository, EntityRepository } from 'typeorm';
import { Service } from 'typedi';
import { Notification } from '../entities/Notification';
import { Account } from '../entities/Account';
import { BaseRepository } from './BaseRepository';

@Service()
@EntityRepository(Notification)
export class NotificationRepository extends BaseRepository<Notification> {
    async saveNotification(noti: Notification): Promise<Notification> {
        return this.entityManager.save(noti);
    }

    async getNotifications(account: Account): Promise<Notification[]> {
        // const notifications = await this.find({ accountId: account.id });
        // return notifications;

        const notification = 'notification';

        const builder = this.createQueryBuilder(notification)
            .where(`${notification}.accountId = :accountId`, { accountId: account.id })
            .leftJoinAndSelect(`${notification}.relatedPost`, 'relatedPost')
            .leftJoinAndSelect(`${notification}.otherAccount`, 'otherAccount');
        return builder.getMany();
    }

    async updateReadAll(accountId: string) {
        const notifications = this.update({ accountId: accountId }, { read: true });
    }
}
