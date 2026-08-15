import { faker } from '@faker-js/faker';

export const DocQueryIsActive = [
  {
    name: 'isActive',
    allowEmptyValue: false,
    required: false,
    type: 'string',
    example: 'true',
    description: "boolean value with ',' delimiter",
  },
];

export const DocQueryUser = [
  {
    name: 'user',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.database.mongodbObjectId(),
  },
];

export const DocParams = [
  {
    name: 'isPagination',
    required: false,
    type: Boolean,
    example: false,
  },
];
