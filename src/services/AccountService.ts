import { Inject, Service } from 'typedi';
import { v4 as uuid } from 'uuid';
import NotFoundException from '../exceptions/NotFoundException';
import { Account } from '../entities/account/Account';
import { logger } from '../logger/winston';
import * as faker from 'faker';
import { koreanMnemonic } from '../constants';
import { getCustomRepository } from 'typeorm';
import { AccountRepository } from '../repositories/AccountRepository';

@Service()
export class AccountService {
    async createUser(args: { email: string; username: string }): Promise<Account> {
        const accountRepository = getCustomRepository(AccountRepository);
        let { username } = args;
        if (!username) {
            username = koreanMnemonic[faker.datatype.number(koreanMnemonic.length)];
            username += faker.datatype.number(100);
        }

        // const user = await accountRepository.createAccount(username, 'cesces333');
        return user;
    }

    async getAllUser(): Promise<Account[]> {
        const users = await Account.find();
        return users;
    }

    //   async getUser(args: { id: number }): Promise<User> {
    //     const { id: id } = args;
    //     const user = await User.findOne({
    //       where: { id: id },
    //       include: [
    //         {
    //           model: Comment,
    //           as: 'Comment',
    //           attributes: ['id', 'content'],
    //         },
    //       ],
    //     });

    //     if (!user) {
    //       logger.info('no user');
    //       throw new NotFoundException('no user');
    //     }

    //     return user;
    //   }
}
