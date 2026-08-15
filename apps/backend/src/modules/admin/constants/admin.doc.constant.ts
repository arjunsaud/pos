import { faker } from '@faker-js/faker';

export const AdminDocQueryIsActive = [
  {
    name: 'isActive',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'true,false',
    description: "boolean value with ',' delimiter",
  },
];

export const AdminDocQueryBlocked = [
  {
    name: 'blocked',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'true,false',
    description: "boolean value with ',' delimiter",
  },
];

export const AdminDocQueryInactivePermanent = [
  {
    name: 'inactivePermanent',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'true,false',
    description: "boolean value with ',' delimiter",
  },
];

export const AdminDocQueryRole = [
  {
    name: 'role',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: faker.string.uuid(),
  },
];

export const AdminDocParamsId = [
  {
    name: 'user',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.string.uuid(),
  },
];
