import { Container } from 'typedi';
import { EventEmitter2 } from 'eventemitter2';
import { EventPublisher, IEventPublisher } from '../EventPublisher';
import { PostCreatedEventHandler } from '../subscriber/event/PostCreatedEventHandler';
import { CommentCreatedEventHandler } from '../subscriber/event/CommentCreatedEventHandler';
import { CreateNotiWhenCommentCreatedEventHandler } from '../subscriber/event/CreateNotiWhenCommentCreatedEventHandler';
import { CreateNotiWhenLikePostEventHandler } from '../subscriber/event/CreateNotiWhenLikePostEventHandler';
import { CommentDeletedEventHandler } from '../subscriber/event/CommentDeletedEventHandler';

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
