import { Arg, Args, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Service } from 'typedi';
import { AccountQueries } from '../../application/queries/AccountQueries';
import { AccountOrmEntity } from '../../entities/AccountOrmEntity';
import { Token } from './schemas/TokenSchema';
import { AuthJwtMiddleware, AuthMiddleware } from '../../infrastructure/apollo/middleware/auth';
import { SignInArgument } from './arguments/SignInArgument';
import { UpdateAccountInfoArgument } from './arguments/AccountArgument';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import BaseError from '../../exceptions/BaseError';
import { ERROR_CODE } from '../../exceptions/ErrorCode';
import { CommandBus } from '../../application/commands/Command';
import { SignInCommand } from '../../application/commands/sign-in/SignInCommand';
import { UpdateAccountCommand } from '../../application/commands/update-account/UpdateAccountCommand';
import { UploadAccountImageCommand } from '../../application/commands/upload-account-image/UploadAccountImageCommand';
import { DeleteAccountImageCommand } from '../../application/commands/delete-account-image/DeleteAccountImageCommand';
import { MutationResult } from './schemas/base/MutationResult';
import { RegisterSnsInfoArgument } from './arguments/RegisterSnsInfoArgument';
import { RegisterSnsCommand } from '../../application/commands/register-sns/RegisterSnsCommand';
import { DeregisterSnsInfoArgument } from './arguments/DeregisterSnsInfoArgument';
import { DeregisterSnsCommand } from '../../application/commands/deregister-sns/DeregisterSnsCommand';

@Service()
@Resolver(() => AccountOrmEntity)
export class AccountResolver {
    constructor(
        private readonly accountQueries: AccountQueries,
        private readonly commandBus: CommandBus,
    ) {}

    // 다른 사용자 정보 가져오기
    @Query((returns) => AccountOrmEntity)
    @UseMiddleware(AuthMiddleware)
    async getAccountInfo(
        @Arg('accountId') accountId: string,
    ): Promise<AccountOrmEntity> {
        return this.accountQueries.getAccountInfo({ accountId: accountId });
    }

    // 내 정보 가져오기
    @Query((returns) => AccountOrmEntity)
    @UseMiddleware(AuthJwtMiddleware)
    async getMyAccountInfo(
        @Ctx('accountId') accountId?: string,
    ): Promise<AccountOrmEntity> {
        if (!accountId) {
            throw new BaseError(ERROR_CODE.UNAUTHORIZED);
        }
        return this.accountQueries.getAccountInfo({ accountId });
    }

    // jwtnewAccount
    @Mutation((returns) => Token)
    async signIn(@Args() { accessToken, provider }: SignInArgument, @Ctx() ctx: any): Promise<Token> {
        const accountToken = await this.commandBus.send(new SignInCommand({
            token: accessToken,
            providerType: provider as any,
        }));
        return { token: accountToken };
    }

    // 프로필 수정
    @Mutation((returns) => AccountOrmEntity)
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
