import { Inject, Service } from 'typedi';

import BaseError from '../exceptions/BaseError';
import { ERROR_CODE } from '../exceptions/ErrorCode';
import { Notification } from '../entities/Notification';
import { logger } from '../logger/winston';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Account } from '../entities/Account';

@Service()
export class NotificationService {
    constructor(@InjectRepository() private readonly notificationRepository: NotificationRepository) {}

    async getNotificationsByUser(account: Account) {
        return await this.notificationRepository.getNotifications(account);
    }
}
