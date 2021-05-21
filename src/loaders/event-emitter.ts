import { Container } from 'typedi';
import { EventEmitter2 } from 'eventemitter2';
import { EventPublisher } from '../EventPublisher';
import { PostCreatedEventHandler } from '../subscriber/event/PostCreatedEventHandler';

export default async (): Promise<void> => {
    const emitter = new EventEmitter2({ wildcard: true, delimiter: '.' });

    const handlers = [
        Container.get(PostCreatedEventHandler),
    ];

    for (const handler of handlers) {
        handler.listen(emitter);
    }

    Container.set(EventPublisher, new EventPublisher(emitter));
};
