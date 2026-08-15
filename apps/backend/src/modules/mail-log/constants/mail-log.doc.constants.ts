import { faker } from '@faker-js/faker';

export const MailLogDocParamsGet = [
  {
    name: 'mail',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.database.mongodbObjectId(),
  },
];
