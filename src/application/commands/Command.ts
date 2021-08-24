import { Container } from 'typedi';
import { ClassType } from '../../types/class-type';

export const COMMAND_EXECUTER_SERVICE_METADATA = 'COMMAND_EXECUTER_SERVICE_METADATA';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICommand {}
export type CommandType = ClassType<ICommand>;

export interface ICommandExecuter<TCommand extends ICommand = any, TResult = any> {
    execute(command: TCommand): Promise<TResult>;
}
export type CommandExecuterType = ClassType<ICommandExecuter<ICommand>>;

export interface ICommandBus<TCommand extends ICommand> {
    send<T extends TCommand, TResult = any>(command: T): Promise<TResult>;
    register(executers: CommandExecuterType[]): void;
}

export class CommandBus<TCommand extends ICommand = ICommand> implements ICommandBus<TCommand> {
    send<T extends TCommand, TResult = any>(command: T): Promise<TResult> {
        const { constructor } = Object.getPrototypeOf(command);
        const commandName = constructor.name as string;
        const executer: ICommandExecuter = Container.get(commandName);
        return executer.execute(command);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    register(executers: CommandExecuterType[]): void {
        executers.forEach((executer) => {
            const commandName = Reflect.getMetadata(COMMAND_EXECUTER_SERVICE_METADATA, executer);
            const serviceMetadata = {
                id: commandName,
                type: executer,
            };
            Container.set(serviceMetadata);
        });
    }
}

export const CommandExecuter = <T = unknown>(command: CommandType): ClassDecorator => {
    return (targetConstructor) => {
        Reflect.defineMetadata(COMMAND_EXECUTER_SERVICE_METADATA, command.name, targetConstructor);
    };
};
