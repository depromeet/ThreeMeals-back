import { Service } from 'typedi';
import { Notification } from '../../entities/Notification';
import { Account } from '../../entities/Account';
import { BaseRepository } from './BaseRepository';

@Service()
export class NotificationRepository extends BaseRepository<Notification> {
    async saveNotification(noti: Notification): Promise<Notification> {
        return this.entityManager.save(noti);
    }

    async getNotifications(account: Account): Promise<Notification[]> {
        const notification = 'notification';
        const builder = this.entityManager.createQueryBuilder(Notification, notification)
            .where(`${notification}.accountId = :accountId`, { accountId: account.id })
            .leftJoinAndSelect(`${notification}.relatedPost`, 'relatedPost')
            .leftJoinAndSelect(`${notification}.otherAccount`, 'otherAccount');
        return builder.getMany();
    }

    async updateReadAll(accountId: string) {
        this.entityManager.createQueryBuilder()
            .update(Notification)
            .set({ read: true })
            .where('account_id = :accountId', { accountId })
            .execute();
    }

    async countUnreadNoti(account: Account): Promise<number> {
        const notiDatas = await this.entityManager
            .find(Notification, { accountId: account.id, read: false });
        return notiDatas.length;
    }
}
