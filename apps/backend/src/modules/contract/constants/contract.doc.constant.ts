import { faker } from '@faker-js/faker';

export const ContractDocQueryIsActive = [
  {
    name: 'isActive',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'true,false',
    description: "boolean value with ',' delimiter",
  },
];

export const ContractDocParamsId = [
  {
    name: 'contract',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.database.mongodbObjectId(),
  },
];
