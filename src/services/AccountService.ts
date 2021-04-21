import { Inject, Service } from 'typedi';
import { v4 as uuid } from 'uuid';
import NotFoundException from '../exceptions/NotFoundException';
import { Account } from '../entities/account/Account';
import { logger } from '../logger/winston';
import * as faker from 'faker';
import { koreanMnemonic } from '../constants';
import { getCustomRepository } from 'typeorm';
import { AccountRepository } from '../repositories/AccountRepository';
import { SignInArgument } from '../resolvers/arguments/SignInArgument';
import { Provider } from '../types/Enums';
import jwt from 'jsonwebtoken';
import axios from 'axios';
interface accountInfo {
    id: string;
    nickname: string;
    // eslint-disable-next-line camelcase
    profileImg: string;
}
@Service()
export class AccountService {
    constructor(private readonly AccountRepository: AccountRepository) {}
    async signIn({ accessToken, provider }: SignInArgument): Promise<string> {
        const userData = await this.fetchUserData({ accessToken, provider });
        if (userData) {
            if (!(await this.AccountRepository.isExistedAccount(userData.data.id))) {
                const newAccount = new Account();
                newAccount.nickname = userData.data.nickname;
                newAccount.providerId = userData.data.id;
                newAccount.status = 'active';
                newAccount.image = userData.data.profileImg;
                await this.AccountRepository.createAccount(newAccount, provider);
            }
            return await this.issueJWT(userData.data);
        } else {
            logger.info('no user');
            throw new NotFoundException('no user');
        }
    }

    async issueJWT(userData: object): Promise<string> {
        const accountToken = jwt.sign(userData, process.env.JWT_SECRET || 'threemeal');
        return accountToken;
    }

    async fetchUserData({ accessToken, provider }: SignInArgument) {
        const userData = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: 'Bearer ' + accessToken,
            },
        });
        console.log(userData.data);
        return userData;
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
