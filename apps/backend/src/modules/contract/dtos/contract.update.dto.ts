import { PartialType } from '@nestjs/swagger';
import { ContractCreateDto } from './contract.create.dto';

export class ContractUpdateDto extends PartialType(ContractCreateDto) {}
