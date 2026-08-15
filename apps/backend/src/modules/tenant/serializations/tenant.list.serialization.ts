import { OmitType } from '@nestjs/swagger';
import { TenantGetSerialization } from './tenant.get.serialization';

export class TenantListSerialization extends OmitType(
  TenantGetSerialization,
  [] as const,
) {}
