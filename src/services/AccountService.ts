import { Service } from 'typedi';
import BaseError from '../exceptions/BaseError';
import { ERROR_CODE } from '../exceptions/ErrorCode';
import { Account } from '../entities/Account';
import { logger } from '../logger/winston';
import { AccountRepository } from '../infrastructure/repositories/AccountRepository';
import { SignInArgument } from '../resolvers/arguments/SignInArgument';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';
import { classToPlain } from 'class-transformer';
import { config } from '../config';
import { FileUpload } from 'graphql-upload';
import { uploadFileToS3 } from '../middleware/typegraphql/uploadS3';
import * as AWS from 'aws-sdk';

@Service()
export class AccountService {
    constructor(
        private readonly accountRepository: AccountRepository,
    ) {}

    async getAccountInfo(args: {
        accountId: string,
    }): Promise<Account> {
        const account = await this.accountRepository.findOneById(args.accountId);
        if (!account) {
            throw new BaseError(ERROR_CODE.USER_NOT_FOUND);
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
                if (!userData.data.properties.profile_image) {
                    newAccount.image = 'https://threemeals-back.s3.ap-northeast-2.amazonaws.com/basic.PNG';
                } else {
                    newAccount.image = userData.data.properties.profile_image;
                }
                newAccount.provider = provider;
                accountData = await this.accountRepository.saveAccount(newAccount);
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
        nickname?: string;
        content?: string;
        profileUrl?: string;
        accountId: string;
    }): Promise<Account> {
        const { nickname, content, accountId, profileUrl } = args;

        const updateInfo = await this.accountRepository.findOneById(accountId);

        if (!updateInfo) {
            throw new BaseError(ERROR_CODE.USER_NOT_FOUND);
        }

        // updateInfo!.nickname = nickname;
        // updateInfo!.image = image;
        nickname && (updateInfo.nickname = nickname);
        content && (updateInfo.content = content);
        profileUrl && (updateInfo.profileUrl = profileUrl);


        const accountInfo = await this.accountRepository.saveAccount(updateInfo);
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
        const accountInfo = await this.accountRepository.saveAccount(updateInfo);

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
        const accountInfo = await this.accountRepository.saveAccount(updateInfo);

        return accountInfo;
    }
}
