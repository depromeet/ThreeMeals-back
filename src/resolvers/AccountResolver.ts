import { Arg, Args, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Service } from 'typedi';
import { AccountService } from '../services/AccountService';
import { Account } from '../entities/Account';
import { Token } from '../schemas/TokenSchema';
import { AuthMiddleware } from '../middleware/typegraphql/auth';
import { SignInArgument } from './arguments/SignInArgument';
import { updateAccountInfoArgument, updateImageArgument } from './arguments/AccountArgument';
import { Provider } from '../entities/Enums';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { Boolean } from 'aws-sdk/clients/batch';
import BaseError from '../exceptions/BaseError';
import { ERROR_CODE } from '../exceptions/ErrorCode';

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
        @Ctx('account') account?: Account,
    ): Promise<Account> {
        if (!account) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED);
        }

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
        @Ctx('account') account?: Account,
    ): Promise<boolean> {
        if (!account) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED);
        }
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
        @Ctx('account') account?: Account,
    ): Promise<Account> {
        if (!account) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED);
        }
        const accountBasicImage = await this.accountService.updateImageToBasic({ fromAccount: account, providerId });

        return accountBasicImage;
    }
}
