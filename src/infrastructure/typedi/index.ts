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
import { IFetchProviderUser } from '../../application/services/fetch-provider-user/IFetchProviderUser';
import { FetchProviderUser } from '../provider-user/FetchProviderUser';
import { CommandBus } from '../../application/commands/Command';
import { LikeCommentCommandExecuter } from '../../application/commands/like-comment/LikeCommentCommandExecuter';
import { DeleteLikeCommentCommandExecuter } from '../../application/commands/delete-like-comment/DeleteLikeCommentCommandExecuter';
import { SignInCommandExecuter } from '../../application/commands/account/sign-in/SignInCommandExecuter';
import { UpdateAccountCommandExecuter } from '../../application/commands/account/update-account/UpdateAccountCommandExecuter';
import { ProfileImageUploader } from '../../domain/aggregates/account/ProfileImageUploader';
import { S3ImageUploader } from '../aws/s3/S3ImageUploader';
import {
    UploadAccountImageCommandExecuter,
} from '../../application/commands/account/upload-account-image/UploadAccountImageCommandExecuter';
import {
    DeleteAccountImageCommandExecuter,
} from '../../application/commands/account/delete-account-image/DeleteAccountImageCommandExecuter';
import { RegisterSnsCommandExecuter } from '../../application/commands/account/register-sns/RegisterSnsCommandExecuter';
import { DeregisterSnsCommandExecuter } from '../../application/commands/account/deregister-sns/DeregisterSnsCommandExecuter';

export default async (): Promise<void> => {
    // aws
    Container.set(ProfileImageUploader, new S3ImageUploader());

    // provider-user
    Container.set(IFetchProviderUser, new FetchProviderUser());

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

    // command
    const commandBus = new CommandBus();
    commandBus.register([
        LikeCommentCommandExecuter,
        DeleteLikeCommentCommandExecuter,
        SignInCommandExecuter,
        UpdateAccountCommandExecuter,
        UploadAccountImageCommandExecuter,
        DeleteAccountImageCommandExecuter,
        RegisterSnsCommandExecuter,
        DeregisterSnsCommandExecuter,
    ]);
    Container.set(CommandBus, commandBus);
};
