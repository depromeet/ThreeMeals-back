import { IsEnum, IsString, IsHexColor } from 'class-validator';
import { Field, ArgsType } from 'type-graphql';
import { SecretType } from '../../entities/Enums';

@ArgsType()
export class InsertPostArgument {
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
