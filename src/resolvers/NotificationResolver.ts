import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Service } from 'typedi';
import { Request } from 'express';
import { AccountService } from '../services/AccountService';
import { Account } from '../entities/Account';

import { Token } from '../schemas/TokenSchema';
import axios from 'axios';
import { logger } from '../logger/winston';
import { SignInArgument } from './arguments/SignInArgument';
import { Provider } from '../entities/Enums';
import { Notification } from '../entities/Notification';
import { NotificationService } from 'src/services/NotificationService';
@Service()
@Resolver(() => Notification)
export class NotificationResolver {
    constructor(private readonly notificationService: NotificationService) {}

    @Query((returns) => Provider)
    async getNotifications(@Ctx('account') account: Account): Promise<Notification[] | undefined> {
        const notifications = this.notificationService.getNotificationsByUser(account);
        return notifications;
    }
}
