import { Inject, Service } from 'typedi';

import BaseError from '../exceptions/BaseError';
import { ERROR_CODE } from '../exceptions/ErrorCode';
import { Notification } from '../entities/Notification';
import { logger } from '../logger/winston';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Account } from '../entities/Account';
import { CreateNotificationArgs } from '../resolvers/arguments/NotificationArguments';

@Service()
export class NotificationService {
    constructor(@InjectRepository() private readonly notificationRepository: NotificationRepository) {}

    async getNotificationsByUser(account: Account) {
        return await this.notificationRepository.getNotifications(account);
    }

    async createNotification(args: CreateNotificationArgs) {
        const newNoti = new Notification();
        newNoti.account = args.account;
        newNoti.otherAccount = args.otherAccount;
        newNoti.relatedPost = args.relatedPost;
        newNoti.notificationType = args.notiType;

        return await this.notificationRepository.save(newNoti);
    }
}
