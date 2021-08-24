import { Arg, Args, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Service } from 'typedi';
import { AccountService } from '../../application/services/AccountService';
import { AccountOrmEntity } from '../../entities/AccountOrmEntity';
import { Token } from './schemas/TokenSchema';
import { AuthMiddleware } from '../../infrastructure/apollo/middleware/auth';
import { SignInArgument } from './arguments/SignInArgument';
import { updateAccountInfoArgument } from './arguments/AccountArgument';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import BaseError from '../../exceptions/BaseError';
import { ERROR_CODE } from '../../exceptions/ErrorCode';
import { CommandBus } from '../../application/commands/Command';
import { SignInCommand } from '../../application/commands/sign-in/SignInCommand';

@Service()
@Resolver(() => AccountOrmEntity)
export class AccountResolver {
    constructor(
        private readonly accountService: AccountService,
        private readonly commandBus: CommandBus,
    ) {}

    // 다른 사용자 정보 가져오기
    @Query((returns) => AccountOrmEntity)
    @UseMiddleware(AuthMiddleware)
    async getAccountInfo(
        @Arg('accountId') accountId: string,
    ): Promise<AccountOrmEntity> {
        const accountInfo = await this.accountService.getAccountInfo({ accountId: accountId });

        return accountInfo;
    }

    // 내 정보 가져오기
    @Query((returns) => AccountOrmEntity)
    @UseMiddleware(AuthMiddleware)
    async getMyAccountInfo(
        @Ctx('account') account?: AccountOrmEntity,
    ): Promise<AccountOrmEntity> {
        if (!account) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED);
        }
        const accountInfo = await this.accountService.getAccountInfo({ accountId: account.id });

        return accountInfo;
    }

    // jwtnewAccount
    @Mutation((returns) => Token)
    async signIn(@Args() { accessToken, provider }: SignInArgument, @Ctx() ctx: any): Promise<Token> {
        const accountToken = await this.commandBus.send(new SignInCommand({
            token: accessToken,
            providerType: provider as any,
        }));
        // const accountToken = await this.accountService.signIn({ accessToken, provider });
        return { token: 'asdf' };
    }

    // 프로필 수정
    @Mutation((returns) => AccountOrmEntity)
    @UseMiddleware(AuthMiddleware)
    async updateAccountInfo(
        @Args() { nickname, content, instagramUrl }: updateAccountInfoArgument,
        @Ctx('account') account?: AccountOrmEntity,
    ): Promise<AccountOrmEntity> {
        if (!account) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED);
        }

        const accountInfo = await this.accountService.updateAccountInfo({
            nickname,
            content,
            instagramUrl,
            accountId: account.id,
        });

        return accountInfo;
    }

    // 프로필 수정 - 사진 추가
    @Mutation((returns) => Boolean)
    @UseMiddleware(AuthMiddleware)
    async updateImage(
        @Arg('file', () => GraphQLUpload) file: FileUpload,
        @Ctx('account') account?: AccountOrmEntity,
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

    // 프로필 수정 - 사진 추가
    @Mutation((returns) => Boolean)
    @UseMiddleware(AuthMiddleware)
    async updateImageToBasic(
        @Ctx('account') account?: AccountOrmEntity,
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
