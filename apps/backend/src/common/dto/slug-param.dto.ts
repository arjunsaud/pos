import { faker } from '@faker-js/faker';
import { IsNotEmpty, MinLength } from 'class-validator';
import { CustomStringTrim } from '../request/validations/custom-validator';

export class SlugParamDto {
  @IsNotEmpty()
  @MinLength(1)
  @CustomStringTrim()
  slug: string;
}

export const SlugDocParamsGet = [
  {
    name: 'slug',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.lorem.slug(),
  },
];
