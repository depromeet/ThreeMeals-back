import { IsEnum, IsString, IsHexColor } from 'class-validator';
import { Field, ArgsType } from 'type-graphql';
import { PostType, PostState, SecretType } from '../../entities/Enums';

@ArgsType()
export class InsertPostArgument {
  @IsString({
      message: 'invalid type',
  })
  @Field()
  content!: string;

  @IsEnum(PostType, {
      message: 'type of post',
  })
  @Field((type) => String)
  postType!: PostType;

  @IsEnum(PostState, {
      message: 'state of post',
  })
  @Field((type) => String)
  postState!: PostState;

  @IsHexColor({
      message: 'not color',
  })
  @IsString({
      message: 'invalid type',
  })
  @Field()
  color!: string;

  @IsEnum(SecretType, {
      message: 'type of secret',
  })
  @Field((type) => String)
  secretType!: SecretType;
}


@ArgsType()
export class UpdatePostArgument {
  @IsString({
      message: 'invalid type',
  })
  @Field()
  content!: string;

  @IsHexColor({
      message: 'not color',
  })
  @IsString({
      message: 'invalid type',
  })
  @Field()
  color!: string;

  @IsEnum(SecretType, {
      message: 'type of secret',
  })
  @Field((type) => String)
  secretType!: SecretType;
}

// import { InputType, Field, ArgsType } from 'type-graphql';
// import { IsEnum, IsString } from 'class-validator';
// import { PostType, PostState } from '../../entities/Enums';

// @ArgsType()
// export class InsertPostArgument {
//   @Field()
//   content!: string;

//   @Field((type) => PostType)
//   postType!: PostType;

//   @Field((type) => PostState)
//   state!: PostState;

//   @Field()
//   color!: string;

//   @Field()
//   secretType!: string;
// }

// @ArgsType()
// export class UpdatePostArgument {
//   @Field()
//   content!: string;

//   @Field()
//   color!: string;

//   @Field()
//   secretType!: string;
// }
