import { Container } from 'typedi';
import { IAccountRepository } from '../../domain/aggregates/account/IAccountRepository';
import { AccountRepository } from '../repositories/AccountRepository';
import { EventEmitter2 } from 'eventemitter2';
import { PostCreatedEventHandler } from '../../application/domain-event-handlers/PostCreatedEventHandler';
import { CommentCreatedEventHandler } from '../../application/domain-event-handlers/CommentCreatedEventHandler';
import { CreateNotiWhenLikePostEventHandler } from '../../application/domain-event-handlers/CreateNotiWhenLikePostEventHandler';
import { CreateNotiWhenCommentCreatedEventHandler } from '../../application/domain-event-handlers/CreateNotiWhenCommentCreatedEventHandler';
import { CommentDeletedEventHandler } from '../../application/domain-event-handlers/CommentDeletedEventHandler';
import { EventPublisher, IEventPublisher } from '../event-publishers/EventPublisher';
import { IUnitOfWork } from '../../domain/common/IUnitOfWork';
import { TypeOrmUnitOfWork } from '../type-orm/TypeOrmUnitOfWork';
import { IFetchProviderUserData } from '../../application/services/fetch-social-user-data/IFetchProviderUserData';
import { FetchProviderUserData } from '../../application/services/fetch-social-user-data/FetchProviderUserData';
import { CommandBus } from '../../application/commands/Command';
import { LikeCommentCommandExecuter } from '../../application/commands/like-comment/LikeCommentCommandExecuter';
import { DeleteLikeCommentCommandExecuter } from '../../application/commands/delete-like-comment/DeleteLikeCommentCommandExecuter';
import { SignInCommandExecuter } from '../../application/commands/sign-in/SignInCommandExecuter';

export default async (): Promise<void> => {
    // repository
    Container.set(IAccountRepository, new AccountRepository());

    // event-emitter
    const emitter = new EventEmitter2({ wildcard: true, delimiter: '.' });

    const handlers = [
        Container.get(PostCreatedEventHandler),
        Container.get(CommentCreatedEventHandler),
        Container.get(CreateNotiWhenLikePostEventHandler),
        Container.get(CreateNotiWhenCommentCreatedEventHandler),
        Container.get(CommentDeletedEventHandler),
    ];

    for (const handler of handlers) {
        handler.listen(emitter);
    }

    const eventPublisher = new EventPublisher(emitter);

    Container.set(EventPublisher, eventPublisher);
    Container.set(IEventPublisher, eventPublisher);

    // typeorm
    Container.set(IUnitOfWork, new TypeOrmUnitOfWork(eventPublisher));

    // services
    Container.set(IFetchProviderUserData, new FetchProviderUserData());

    // command
    const commandBus = new CommandBus();
    commandBus.register([
        LikeCommentCommandExecuter,
        DeleteLikeCommentCommandExecuter,
        SignInCommandExecuter,
    ]);
    Container.set(CommandBus, commandBus);
};
