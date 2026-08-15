import { PrintTemplateType } from '@posnepal/shared';

export interface ITemplateEntity {
  type: PrintTemplateType;
  name: string;
  html: string;
  paperSize: string;
  isDefault: boolean;
  isActive: boolean;
}
