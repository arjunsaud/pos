import { OmitType } from '@nestjs/swagger';
import { ContractGetSerialization } from './contract.get.serialization';

export class ContractListSerialization extends OmitType(
  ContractGetSerialization,
  [] as const,
) {}
