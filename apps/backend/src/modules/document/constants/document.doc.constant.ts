import { faker } from '@faker-js/faker';

export const DocumentDocQueryIsActive = [
  {
    name: 'isActive',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'true,false',
    description: "boolean value with ',' delimiter",
  },
];

export const DocumentDocParamsId = [
  {
    name: 'document',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.database.mongodbObjectId(),
  },
];
