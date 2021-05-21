import { HelloCommand } from './HelloCommand';
import { CommandExecuter, ICommandExecuter } from '../../common/Command';

@CommandExecuter(HelloCommand)
export class HelloCommandExecuter implements ICommandExecuter<HelloCommand> {
    async execute(command: HelloCommand): Promise<string> {
        // console.log(command.id);
        // console.log(command.helloContent);
        return command.helloContent;
    }
}
