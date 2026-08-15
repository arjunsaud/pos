import { faker } from '@faker-js/faker';

export const ReferralDocQueryIsActive = [
  {
    name: 'isActive',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'true,false',
    description: "boolean value with ',' delimiter",
  },
];

export const ReferralDocParamsId = [
  {
    name: 'referral',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.database.mongodbObjectId(),
  },
];
