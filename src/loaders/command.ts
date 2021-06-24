import { Container } from 'typedi';
import { HelloCommandExecuter } from '../command/hello/HelloCommandExecuter';
import { CommandBus } from '../common/Command';
import { LikeCommentCommandExecuter } from '../command/like-comment/LikeCommentCommandExecuter';
import { DeleteLikeCommentCommandExecuter } from '../command/delete-like-comment/DeleteLikeCommentCommandExecuter';

export default async (): Promise<void> => {
    const commandBus = new CommandBus();
    commandBus.register([
        HelloCommandExecuter,
        LikeCommentCommandExecuter,
        DeleteLikeCommentCommandExecuter,
    ]);
    Container.set(CommandBus, commandBus);
};
