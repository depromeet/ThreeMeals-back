import { Container } from 'typedi';
import { HelloCommandExecuter } from '../command/hello/HelloCommandExecuter';
import { CommandBus } from '../common/Command';
import { LikeCommentCommandExecuter } from '../command/like-comment/LikeCommentCommandExecuter';

export default async (): Promise<void> => {
    const commandBus = new CommandBus();
    commandBus.register([
        HelloCommandExecuter,
        LikeCommentCommandExecuter,
    ]);
    Container.set(CommandBus, commandBus);
};
