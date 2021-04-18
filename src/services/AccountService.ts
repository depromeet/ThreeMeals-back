import { Inject, Service } from 'typedi';
import { v4 as uuid } from 'uuid';
import NotFoundException from '../exceptions/NotFoundException';
import { Account } from '../entities/account/Account';
import { logger } from '../logger/winston';
import * as faker from 'faker';
import { koreanMnemonic } from '../constants';
import { getCustomRepository } from 'typeorm';
import { AccountRepository } from '../repositories/AccountRepository';

interface accountInfo {
    id: string;
    nickname: string;
    // eslint-disable-next-line camelcase
    profileImg: string;
}
@Service()
export class AccountService {
    async createUserByKakao(arg: accountInfo): Promise<Account> {
        const accountRepository = getCustomRepository(AccountRepository);

        // eslint-disable-next-line camelcase
        let { id, nickname, profileImg } = arg;
        if (!nickname) {
            nickname = koreanMnemonic[faker.datatype.number(koreanMnemonic.length)];
            nickname += faker.datatype.number(100);
        }

        const account = await accountRepository.createAccount(arg);
        return account;
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
