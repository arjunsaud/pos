import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { AdminCreateDto } from 'src/modules/admin/dtos/admin.create.dto';

export class AdminLoginDto extends PickType(AdminCreateDto, ['email'] as const) {
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
