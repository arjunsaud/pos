import { faker } from '@faker-js/faker';

export const VendorDocQueryIsActive = [
  {
    name: 'isActive',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'true,false',
    description: "boolean value with ',' delimiter",
  },
];

export const VendorDocParamsId = [
  {
    name: 'vendor',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.database.mongodbObjectId(),
  },
];
