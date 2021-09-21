import { Arg, Args, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Service } from 'typedi';
import { AccountQueries } from '../../application/queries/AccountQueries';
import { AccountOrmEntity } from '../../entities/AccountOrmEntity';
import { Token } from './schemas/TokenSchema';
import { AuthJwtMiddleware, AuthMiddleware } from '../../infrastructure/apollo/middleware/auth';
import { SignInArgument } from './arguments/SignInArgument';
import { UpdateAccountInfoArgument } from './arguments/AccountArgument';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import BaseError from '../../domain/exceptions/BaseError';
import { ERROR_CODE } from '../../domain/exceptions/ErrorCode';
import { CommandBus } from '../../application/commands/Command';
import { SignInCommand } from '../../application/commands/account/sign-in/SignInCommand';
import { UpdateAccountCommand } from '../../application/commands/account/update-account/UpdateAccountCommand';
import { UploadAccountImageCommand } from '../../application/commands/account/upload-account-image/UploadAccountImageCommand';
import { DeleteAccountImageCommand } from '../../application/commands/account/delete-account-image/DeleteAccountImageCommand';
import { MutationResult } from './schemas/base/MutationResult';
import { RegisterSnsInfoArgument } from './arguments/RegisterSnsInfoArgument';
import { RegisterSnsCommand } from '../../application/commands/account/register-sns/RegisterSnsCommand';
import { DeregisterSnsInfoArgument } from './arguments/DeregisterSnsInfoArgument';
import { DeregisterSnsCommand } from '../../application/commands/account/deregister-sns/DeregisterSnsCommand';
import { AccountSchema } from './schemas/AccountSchema';
import { Logger } from '../../infrastructure/typedi/decorator/Logger';
import { ILogger } from '../../infrastructure/logger/ILogger';

@Service()
@Resolver(() => AccountSchema)
export class AccountResolver {
    constructor(
        @Logger() private readonly logger: ILogger,
        private readonly commandBus: CommandBus,
        private readonly accountQueries: AccountQueries,
    ) {}

    // 다른 사용자 정보 가져오기
    @Query((returns) => AccountSchema)
    @UseMiddleware(AuthMiddleware)
    async getAccountInfo(
        @Arg('accountId') accountId: string,
    ): Promise<AccountSchema> {
        throw new BaseError({errorCode: ERROR_CODE.ALREADY_COMMENT_LIKE, message: '테스트용도임다.'})
        return this.accountQueries.getAccountInfo({ accountId: accountId });
    }

    // 내 정보 가져오기
    @Query((returns) => AccountSchema)
    @UseMiddleware(AuthJwtMiddleware)
    async getMyAccountInfo(
        @Ctx('accountId') accountId?: string,
    ): Promise<AccountSchema> {
        if (!accountId) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED);
        }
        return this.accountQueries.getAccountInfo({ accountId });
    }

    // jwtnewAccount
    @Mutation((returns) => Token)
    async signIn(@Args() { accessToken, provider }: SignInArgument, @Ctx() ctx: any): Promise<Token> {
        this.logger.info('signIn mutation executed', { provider });

        const accountToken = await this.commandBus.send(new SignInCommand({
            token: accessToken,
            providerType: provider as any,
        }));
        return { token: accountToken };
    }

    // 프로필 수정
    @Mutation((returns) => AccountSchema)
    @UseMiddleware(AuthJwtMiddleware)
    async updateAccountInfo(
        @Args() { nickname, content }: UpdateAccountInfoArgument,
        @Ctx('accountId') accountId?: string,
    ): Promise<AccountOrmEntity> {
        if (!accountId) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED);
        }

        const changedAccount = await this.commandBus.send(new UpdateAccountCommand({
            nickname,
            content,
            accountId,
        }));
        !changedAccount.socials && ( changedAccount.socials = []);
        return changedAccount;
    }

    @Mutation((returns) => Boolean)
    @UseMiddleware(AuthJwtMiddleware)
    async updateImage(
        @Arg('file', () => GraphQLUpload) file: FileUpload,
        @Ctx('accountId') accountId?: string,
    ): Promise<boolean> {
        if (!accountId) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED);
        }

        // check mimetype & ext type
        const mimeType = /(image\/jpg|image\/jpeg|image\/png|image\/gif|image\/bmp)$/;
        const extType = /(.*?)\.(jpg|jpeg|png|gif|bmp)$/;
        if (!mimeType.test(file.mimetype) || !extType.test(file.filename)) {
            throw new BaseError(ERROR_CODE.INVALID_IMAGE_TYPE);
        }

        await this.commandBus.send(new UploadAccountImageCommand({
            accountId,
            imageData: {
                filename: file.filename,
                mimetype: file.mimetype,
                encoding: file.encoding,
                body: file.createReadStream(),
            },
        }));

        return true;
        // return MutationResult.fromSuccessResult();
    }

    @Mutation((returns) => Boolean)
    @UseMiddleware(AuthJwtMiddleware)
    async updateImageToBasic(
        @Ctx('accountId') accountId?: string,
    ): Promise<boolean> {
        if (!accountId) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED);
        }
        await this.commandBus.send(new DeleteAccountImageCommand({
            accountId,
        }));

        return true;
    }

    @Mutation((returns) => MutationResult)
    @UseMiddleware(AuthJwtMiddleware)
    async registerSnsInfo(
        @Args() args: RegisterSnsInfoArgument,
        @Ctx('accountId') accountId?: string,
    ): Promise<MutationResult> {
        if (!accountId) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED);
        }
        await this.commandBus.send(new RegisterSnsCommand({
            snsType: args.snsType,
            snsId: args.snsId,
            url: args.url,
            accountId,
        }));

        return MutationResult.fromSuccessResult();
    }

    @Mutation((returns) => MutationResult)
    @UseMiddleware(AuthJwtMiddleware)
    async deregisterSnsInfo(
        @Args() args: DeregisterSnsInfoArgument,
        @Ctx('accountId') accountId?: string,
    ): Promise<MutationResult> {
        if (!accountId) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED);
        }
        await this.commandBus.send(new DeregisterSnsCommand({
            snsType: args.snsType,
            accountId,
        }));

        return MutationResult.fromSuccessResult();
    }
}
