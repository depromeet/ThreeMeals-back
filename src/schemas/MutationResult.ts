import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class MutationResult {
    @Field()
    message!: string;

    static fromSuccessResult() {
        const result = new MutationResult();
        result.message = 'success';
        return result;
    }
}
