import { IDomainEvent } from '../../common/IDomainEvent';

export interface CommentDeletedEventData {
    postId: string;
    content: string;
    accountId: string; // 댓글 쓴사람
}

export class CommentDeletedEvent implements IDomainEvent<CommentDeletedEventData> {
    eventName: string;
    data: CommentDeletedEventData;


    constructor(data: CommentDeletedEventData) {
        this.eventName = CommentDeletedEvent.name;
        this.data = data;
    }
}
