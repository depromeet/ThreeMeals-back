/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
import { config } from '../config';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { assertNamedType, GraphQLScalarType } from 'graphql';
import { createWriteStream } from 'fs';
import { uploadFileToS3 } from '../middleware/typegraphql/uploadS3';
import * as AWS from 'aws-sdk';

@Service()
export class AccountService {
    constructor(
        @InjectRepository() private readonly accountRepository: AccountRepository,
    ) {}

    async getAccount(id: string): Promise<Account> {
        const account = await this.accountRepository.findOneById(id);
        if (!account) {
            console.log(`cannot find account by id, ${id}`);
            throw new Error('Not authenticated');
        }
        return account;
    }

    async getAccountInfo(args: {
        accountId: string,
    }): Promise<Account> {
        const account = await this.accountRepository.findOneById(args.accountId);
        if (!account) {
            console.log(`cannot find account by id, ${account}`);
            throw new Error('Not authenticated');
        }
        return account;
    }

    async signIn({ accessToken, provider }: SignInArgument): Promise<string> {
        const userData = await this.fetchUserData({ accessToken, provider });
        if (userData) {
            let accountData = await this.accountRepository.getAccount(userData.data.id);
            if (!accountData) {
                const newAccount = new Account();
                newAccount.nickname = userData.data.properties.nickname;
                newAccount.providerId = userData.data.id;
                newAccount.status = 'active';
                newAccount.image = userData.data.properties.profile_image;
                newAccount.provider = provider;
                accountData = await this.accountRepository.createAccount(newAccount);
            }
            // 필요한 정보 담아야 하는걸로 수정필요

            return await this.issueJWT(classToPlain(accountData));
        } else {
            logger.info('no user');
            throw new BaseError(ERROR_CODE.USER_NOT_FOUND);
        }
    }

    async issueJWT(userData: Record<string, any>): Promise<string> {
        const accountToken = jwt.sign(userData, config.jwt.secret);
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

    // 프로필 변경
    async updateAccountInfo(args: {
        content: string;
        profileUrl: string;
        accountId: string;
    }): Promise<Account> {
        const { content, profileUrl, accountId } = args;


        const updateInfo = await this.accountRepository.findOneById(accountId);

        console.log(updateInfo);

        if (!updateInfo) {
            throw new BaseError(ERROR_CODE.USER_NOT_FOUND);
        }

        // updateInfo!.nickname = nickname;
        // updateInfo!.image = image;
        updateInfo!.content = content;
        updateInfo!.profileUrl = profileUrl;
        updateInfo!.content = content;

        const accountInfo = await this.accountRepository.save(updateInfo);
        return accountInfo;
    }

    // 이미지 변경
    async updateImage(args: {
        accountId: string;
        file: FileUpload;
    }): Promise<Account> {
        const { accountId, file } = args;
        const { createReadStream, filename, mimetype, encoding } = file;

        const updateInfo = await this.accountRepository.findOneById(accountId);
        if (!updateInfo) {
            throw new BaseError(ERROR_CODE.USER_NOT_FOUND);
        }

        if (mimetype !== 'image/jpg' && mimetype !== 'image/jpeg' && mimetype !== 'image/png' && mimetype !== 'image/gif') {
            throw new BaseError(ERROR_CODE.INVALID_IMAGE_TYPE);
        }

        console.log(filename);

        const S3: AWS.S3 = new AWS.S3();
        const url: boolean = await new Promise((res, rej) => {
            createReadStream()
                .pipe(uploadFileToS3(S3, `${updateInfo.id}/${filename}`, mimetype))
                .on('finish', () => res(true))
                .on('error', () => rej(false));
        });
        const newFilename = `https://threemeals-back.s3.ap-northeast-2.amazonaws.com/${updateInfo.id}/${filename}`;
        updateInfo!.image = newFilename;
        const accountInfo = await this.accountRepository.save(updateInfo);

        return accountInfo;
    }


    // 기본이미지로 변경
    async updateImageToBasic(args: {
        accountId: string;
    }): Promise<Account> {
        const { accountId } = args;

        const updateInfo = await this.accountRepository.findOneById(accountId);
        if (!updateInfo) {
            throw new BaseError(ERROR_CODE.USER_NOT_FOUND);
        }

        updateInfo!.image = 'https://threemeals-back.s3.ap-northeast-2.amazonaws.com/basic.PNG';
        const accountInfo = await this.accountRepository.save(updateInfo);

        return accountInfo;
    }
}
