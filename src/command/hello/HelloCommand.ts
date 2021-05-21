import { ICommand } from '../../common/Command';

export class HelloCommand implements ICommand {
    constructor(
        public readonly id: string,
        public readonly helloContent: string,
    ) {}
}
