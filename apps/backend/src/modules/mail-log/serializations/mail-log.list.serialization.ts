import { OmitType } from '@nestjs/swagger';
import { MailerGetSerialization } from './mail-log.get.serialization';

export class MailerListSerialization extends OmitType(MailerGetSerialization, [
  'createdAt',
] as const) {}
