import { Get, JsonController, Param, Req, Res, UseBefore } from 'routing-controllers';
import { Logger } from '../../infrastructure/typedi/decorator/Logger';
import { ILogger } from '../../infrastructure/logger/ILogger';
import { CommandBus } from '../../application/commands/Command';
import { AccountQueries } from '../../application/queries/AccountQueries';
import { AuthMiddleware } from '../../infrastructure/express/middlewares/AuthMiddleware';
import { AccountSchema } from '../resolvers/schemas/AccountSchema';
import { AccountOrmEntity } from '../../entities/AccountOrmEntity';
import { Service } from 'typedi';

@Service()
@JsonController('/account')
export class AccountController {
    constructor(
        @Logger() private readonly logger: ILogger,
        private readonly commandBus: CommandBus,
        private readonly accountQueries: AccountQueries,
    ) {
    }

    @Get('/:accountId')
    @UseBefore(AuthMiddleware)
    async getAccountInfo(@Param('accountId') accountId: string, @Req() req: any, @Res() res: any): Promise<any> {
        return this.accountQueries.getAccountInfo({ accountId: accountId });
    }
}


