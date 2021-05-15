import { Repository, EntityRepository } from 'typeorm';
import { Post } from '../entities/Post';
import { Service } from 'typedi';
import { Notification } from '../entities/Notification';
import { Account } from '../entities/Account';

@Service()
@EntityRepository(Notification)
export class NotificationRepository extends Repository<Notification> {
    async getNotifications(account: Account) {
        const notifications = await this.find({ account: account });
        return notifications;
    }
}
