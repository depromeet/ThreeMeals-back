import { ICommand } from '../Command';

export class DeleteLikeCommentCommand implements ICommand {
    constructor(
        public readonly accountId: string,
        public readonly commentId: string,
    ) {}
}
