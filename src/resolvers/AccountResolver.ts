import { Arg, Args, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Service } from 'typedi';
import { AccountService } from '../services/AccountService';
import { Account } from '../entities/Account';
import { Token } from '../schemas/TokenSchema';
import { AuthMiddleware } from '../middleware/typegraphql/auth';
import { SignInArgument } from './arguments/SignInArgument';
import { updateAccountInfoArgument, updateAccountInstaArgument } from './arguments/AccountArgument';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import BaseError from '../exceptions/BaseError';
import { ERROR_CODE } from '../exceptions/ErrorCode';
import { CommandBus } from '../common/Command';
import { HelloCommand } from '../command/hello/HelloCommand';

@Service()
@Resolver(() => Account)
export class AccountResolver {
    constructor(
        private readonly accountService: AccountService,
        private readonly commandBus: CommandBus,
    ) {}

    @Query((returns) => String)
    async helloWorld(): Promise<string> {
        const a = await this.commandBus.send<HelloCommand, string>(new HelloCommand('1', 'hello world'));
        console.log(a);
        return 'hello';
    }

    // 사용자 정보 가져오기
    @Query((returns) => Account)
    @UseMiddleware(AuthMiddleware)
    async getAccountInfo(
        @Ctx('account') account?: Account,
    ): Promise<Account> {
        if (!account) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED);
        }
        const accountInfo = await this.accountService.getAccountInfo({ accountId: account.id });

        return accountInfo;
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
    async createAccountInfo(
        @Args() { content }: updateAccountInfoArgument,
        @Ctx('account') account?: Account,
    ): Promise<Account> {
        if (!account) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED);
        }

        const accountInfo = await this.accountService.createAccountInfo({
            content,
            accountId: account.id,
        });

        return accountInfo;
    }


    // 인스타그램 아이디 연동
    @Mutation((returns) => Account)
    @UseMiddleware(AuthMiddleware)
    async createInstagramId(
        @Args() { profileUrl }: updateAccountInstaArgument,
        @Ctx('account') account?: Account,
    ): Promise<Account> {
        if (!account) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED);
        }

        const accountInfo = await this.accountService.createInstagramId({
            profileUrl,
            accountId: account.id,
        });

        return accountInfo;
    }

    // 프로필 수정 - 사진 추가
    @Mutation((returns) => Boolean)
    @UseMiddleware(AuthMiddleware)
    async updateImage(
        @Arg('file', () => GraphQLUpload) file: FileUpload,
        @Ctx('account') account?: Account,
    ): Promise<boolean> {
        if (!account) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED);
        }
        await this.accountService.updateImage({
            accountId: account.id,
            file,
        });

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
    @Mutation((returns) => Boolean)
    @UseMiddleware(AuthMiddleware)
    async updateImageToBasic(
        @Ctx('account') account?: Account,
    ): Promise<boolean> {
        if (!account) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED);
        }
        await this.accountService.updateImageToBasic({
            accountId: account.id,
        });

        return true;
    }
}
