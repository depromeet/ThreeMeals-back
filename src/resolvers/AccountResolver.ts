/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable prefer-promise-reject-errors */
import { Arg, Args, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Service } from 'typedi';
import { AccountService } from '../services/AccountService';
import { Account } from '../entities/Account';
import { Token } from '../schemas/TokenSchema';
import axios from 'axios';
import { AuthMiddleware } from '../middleware/typegraphql/auth';
import { SignInArgument } from './arguments/SignInArgument';
import { updateAccountInfoArgument, updateImageArgument } from './arguments/AccountArgument';
import { Provider } from '../entities/Enums';
import { uploadFileToS3 } from '../middleware/typegraphql/uploadS3';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { Boolean } from 'aws-sdk/clients/batch';
const path = require('path');

@Service()
@Resolver(() => Account)
export class AccountResolver {
    constructor(private readonly accountService: AccountService) {}

    @Query((returns) => Provider)
    async helloWorld(): Promise<string> {
        return 'hello';
    }

    // jwtnewAccount
    @Mutation((returns) => Token)
    async signIn(@Args() { accessToken, provider }: SignInArgument, @Ctx() ctx: any): Promise<Token> {
        const accountToken = await this.accountService.signIn({ accessToken, provider });
        return { token: accountToken };
    }

    // 프로필 수정
    @Mutation((returns) => Account)
    @UseMiddleware(AuthMiddleware)
    async updateAccountInfo(
        @Args() { providerId, content, profileUrl }: updateAccountInfoArgument,
        @Ctx('account') account: Account,
    ): Promise<Account> {
        const accountInfo = await this.accountService.updateAccountInfo({
            providerId,
            content,
            profileUrl,
            fromAccount: account,
        });

        return accountInfo;
    }


    // 프로필 수정 - 사진 추가
    @Mutation((returns) => Boolean)
    @UseMiddleware(AuthMiddleware)
    async updateImage(
        @Arg('file', () => GraphQLUpload) file: FileUpload,
        @Args() { providerId }: updateImageArgument,
        @Ctx('account') account: Account,
    ): Promise<boolean> {
        await this.accountService.updateImage({ fromAccount: account, file, providerId });

        return true;
    }

    // return Type이 Boolean이 아니고 Account Type일 때.
    // @Mutation((returns) => Account)
    // @UseMiddleware(AuthMiddleware)
    // async updateImage(
    //     @Arg('file', () => GraphQLUpload) file: FileUpload,
    //     @Args() { providerId }: updateImageArgument,
    //     @Ctx('account') account: Account,
    // ): Promise<Account> {
    //     const accountImage = await this.accountService.updateImage({ fromAccount: account, file, providerId });

    //     return accountImage;
    // }

    // mutation updateImage($file: Upload!) {
    //     updateImage(file: $file, providerId: "1706701468")
    // }
    // curl: // {"query":"mutation updateImage($file: Upload!) {\n\tupdateImage(file: $file, providerId: \"1706701468\")\n}"}

    // 프로필 수정 - 사진 추가
    @Mutation((returns) => Account)
    @UseMiddleware(AuthMiddleware)
    async updateImageToBasic(
        @Args() { providerId }: updateImageArgument,
        @Ctx('account') account: Account,
    ): Promise<Account> {
        const accountBasicImage = await this.accountService.updateImageToBasic({ fromAccount: account, providerId });

        return accountBasicImage;
    }
}
