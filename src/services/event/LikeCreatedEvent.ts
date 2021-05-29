import { IDomainEvent } from '../../common/IDomainEvent';

export class LikeCreatedEvent implements IDomainEvent<LikeCreatedEventData> {
    data: LikeCreatedEventData;
    eventName: string;

    constructor(data: LikeCreatedEventData) {
        this.data = data;
        this.eventName = LikeCreatedEvent.name;
    }
}

export interface LikeCreatedEventData {
    postId: string;
    accountId: string;
    otherAccountId: string;
    postType: string;
}
