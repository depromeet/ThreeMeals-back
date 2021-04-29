import { Inject, Service } from 'typedi';
import { v4 as uuid } from 'uuid';
import BaseError from '../exceptions/BaseError';
import { ERROR_CODE } from '../exceptions/ErrorCode';
import { Account } from '../entities/Account';
import { logger } from '../logger/winston';
import * as faker from 'faker';
import { koreanMnemonic } from '../constants';
import { getCustomRepository } from 'typeorm';
import { AccountRepository } from '../repositories/AccountRepository';
import { SignInArgument } from '../resolvers/arguments/SignInArgument';
import { Provider } from '../entities/Enums';
import { InjectRepository } from 'typeorm-typedi-extensions';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';
import { classToPlain } from 'class-transformer';
@Service()
export class AccountService {
    constructor(@InjectRepository() private readonly AccountRepository: AccountRepository) {}

    async signIn({ accessToken, provider }: SignInArgument): Promise<string> {
        const userData = await this.fetchUserData({ accessToken, provider });
        if (userData) {
            let accountData = await this.AccountRepository.getAccount(userData.data.id);
            if (!accountData) {
                const newAccount = new Account();
                newAccount.nickname = userData.data.properties.nickname;
                newAccount.providerId = userData.data.id;
                newAccount.status = 'active';
                newAccount.image = userData.data.properties.profile_image;
                newAccount.provider = provider;
                accountData = await this.AccountRepository.createAccount(newAccount);
            }
            // 필요한 정보 담아야 하는걸로 수정필요

            return await this.issueJWT(classToPlain(accountData));
        } else {
            logger.info('no user');
            throw new BaseError(ERROR_CODE.USER_NOT_FOUND);
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
        return userData;
    }
}
