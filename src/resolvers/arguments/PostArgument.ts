import { InputType, Field, ArgsType } from 'type-graphql';
import { IsEnum, IsString } from 'class-validator';
import { PostType, State } from '../../entities/Enums';

@ArgsType()
export class InsertPostArgument {
  @Field()
  content!: string;

  @Field((type) => PostType)
  postType!: PostType;

  @Field((type) => State)
  state!: State;

  @Field()
  color!: string;

  @Field()
  secretType!: string;
}

@ArgsType()
export class UpdatePostArgument {
  @Field()
  content!: string;

  @Field()
  color!: string;

  @Field()
  secretType!: string;
}

