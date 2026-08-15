import { faker } from '@faker-js/faker';

export const TemplateDocParamsId = [
  {
    name: 'template',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.database.mongodbObjectId(),
  },
];
