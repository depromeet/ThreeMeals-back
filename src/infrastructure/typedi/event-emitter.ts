import { Container } from 'typedi';
import { EventEmitter2 } from 'eventemitter2';
import { EventPublisher, IEventPublisher } from '../event-publishers/EventPublisher';
import { PostCreatedEventHandler } from '../../application/domain-event-handlers/PostCreatedEventHandler';
import { CommentCreatedEventHandler } from '../../application/domain-event-handlers/CommentCreatedEventHandler';
import { CreateNotiWhenCommentCreatedEventHandler } from '../../application/domain-event-handlers/CreateNotiWhenCommentCreatedEventHandler';
import { CreateNotiWhenLikePostEventHandler } from '../../application/domain-event-handlers/CreateNotiWhenLikePostEventHandler';
import { CommentDeletedEventHandler } from '../../application/domain-event-handlers/CommentDeletedEventHandler';

export default async (): Promise<void> => {
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
};
