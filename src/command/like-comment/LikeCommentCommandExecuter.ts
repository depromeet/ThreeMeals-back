import { CommandExecuter, ICommandExecuter } from '../../common/Command';
import { LikeCommentCommand } from './LikeCommentCommand';

@CommandExecuter(LikeCommentCommand)
export class LikeCommentCommandExecuter implements ICommandExecuter<LikeCommentCommand> {
    async execute(command: LikeCommentCommand): Promise<any> {
        return undefined;
    }
}
