import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { UserCreateDto } from 'src/modules/user/dtos/user.create.dto';

export class UserLoginDto extends PickType(UserCreateDto, ['email'] as const) {
  @ApiProperty({
    description: 'string password',
    example: `Test@123`,
    required: true,
  })
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(128)
  readonly password: string;
}
