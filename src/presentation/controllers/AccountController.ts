import { Get, JsonController, Param, Req, Res } from 'routing-controllers';
import { Logger } from '../../infrastructure/typedi/decorator/Logger';
import { ILogger } from '../../infrastructure/logger/ILogger';

@JsonController('/account')
export class AccountController {
    constructor(
        @Logger() private readonly logger: ILogger, // private readonly commandBus: CommandBus,
    ) {
    }

    @Get('/:id')
    getOne(@Param('id') id: number, @Req() req: any, @Res() res: any) {
        console.log('herhe');
    }
}


