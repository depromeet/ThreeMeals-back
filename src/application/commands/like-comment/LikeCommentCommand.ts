import { ICommand } from '../Command';

export class LikeCommentCommand implements ICommand {
    constructor(
        public readonly likerId: string,
        public readonly commentId: string,
        public readonly postId: string,
    ) {}
}
