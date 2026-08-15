import { faker } from '@faker-js/faker';

export const PaymentReceiptDocQueryIsActive = [
  {
    name: 'isActive',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'true,false',
    description: "boolean value with ',' delimiter",
  },
];

export const PaymentReceiptDocParamsId = [
  {
    name: 'paymentReceipt',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.database.mongodbObjectId(),
  },
];
