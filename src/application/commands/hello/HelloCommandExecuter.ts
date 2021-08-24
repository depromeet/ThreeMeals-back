import { HelloCommand } from './HelloCommand';
import { CommandExecuter, ICommandExecuter } from '../Command';

@CommandExecuter(HelloCommand)
export class HelloCommandExecuter implements ICommandExecuter<HelloCommand> {
    async execute(command: HelloCommand): Promise<string> {
        // console.log(commands.id);
        // console.log(commands.helloContent);
        return command.helloContent;
    }
}
