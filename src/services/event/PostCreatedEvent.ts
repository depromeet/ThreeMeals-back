import { IDomainEvent } from '../../common/IDomainEvent';
import { PostState, PostType } from '../../entities/Enums';

export class PostCreatedEvent implements IDomainEvent<PostCreatedEventData> {
    data: PostCreatedEventData;
    eventName: string;

    constructor(data: PostCreatedEventData) {
        this.data = data;
        this.eventName = PostCreatedEvent.name;
    }
}

export interface PostCreatedEventData {
    id: string;
    content: string;
    postType: PostType;
    postState: PostState;
    fromAccountId: string;
    toAccountId: string;
}
