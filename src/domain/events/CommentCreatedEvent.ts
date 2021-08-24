import { IDomainEvent } from '../common/IDomainEvent';

export class CommentCreatedEvent implements IDomainEvent<CommentCreatedEventData> {
    data: CommentCreatedEventData;
    eventName: string;

    constructor(data: CommentCreatedEventData) {
        this.data = data;
        this.eventName = CommentCreatedEvent.name;
    }
}

export interface CommentCreatedEventData {
    postId: string;
    content: string;
    accountId: string; // 댓글 쓴사람
    otherAccountId: string;
    postType: string;
    isUniqueComment: boolean;
}
