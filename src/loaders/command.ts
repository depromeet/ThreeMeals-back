import { Container } from 'typedi';
import { HelloCommandExecuter } from '../command/hello/HelloCommandExecuter';
import { CommandBus } from '../common/Command';

export default async (): Promise<void> => {
    const commandBus = new CommandBus();
    commandBus.register([
        HelloCommandExecuter,
    ]);
    Container.set(CommandBus, commandBus);
};
