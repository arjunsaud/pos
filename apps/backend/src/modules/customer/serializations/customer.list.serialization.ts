import { OmitType } from '@nestjs/swagger';
import { CustomerGetSerialization } from './customer.get.serialization';

export class CustomerListSerialization extends OmitType(
  CustomerGetSerialization,
  [] as const,
) {}
