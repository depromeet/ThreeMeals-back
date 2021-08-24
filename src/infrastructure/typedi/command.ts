import { Container } from 'typedi';
import { HelloCommandExecuter } from '../../application/commands/hello/HelloCommandExecuter';
import { CommandBus } from '../../application/commands/Command';
import { LikeCommentCommandExecuter } from '../../application/commands/like-comment/LikeCommentCommandExecuter';
import { DeleteLikeCommentCommandExecuter } from '../../application/commands/delete-like-comment/DeleteLikeCommentCommandExecuter';

export default async (): Promise<void> => {
    const commandBus = new CommandBus();
    commandBus.register([
        HelloCommandExecuter,
        LikeCommentCommandExecuter,
        DeleteLikeCommentCommandExecuter,
    ]);
    Container.set(CommandBus, commandBus);
};
