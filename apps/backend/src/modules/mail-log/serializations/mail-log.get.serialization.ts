import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';

export class MailerGetSerialization extends ResponseIdSerialization {
  @ApiProperty({
    description: 'message',
    example: faker.lorem.paragraph(),
    required: true,
  })
  readonly message: string;

  @ApiProperty({
    description: 'designation',
    example: faker.lorem.paragraph(),
    required: false,
    nullable: true,
  })
  readonly designation: string;

  @ApiProperty({
    description: 'photo',
    example: faker.lorem.paragraph(),
    required: false,
    nullable: true,
  })
  readonly photo: string;

  @ApiProperty({
    description: 'isActive',
    example: true,
    required: true,
  })
  readonly isActive: boolean;

  @ApiProperty({
    description: 'Date created at',
    example: faker.date.recent(),
    required: true,
  })
  readonly createdAt: Date;

  @ApiProperty({
    description: 'Date updated at',
    example: faker.date.recent(),
    required: false,
  })
  readonly updatedAt: Date;

  @Exclude()
  readonly deletedAt?: Date;
}
