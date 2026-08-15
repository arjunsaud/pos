import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { IContractEntity } from '../../interfaces/contract.entity.interface';

export const ContractDataBaseName = 'contracts';

@DatabaseEntity({ collection: ContractDataBaseName })
export class ContractEntity
  extends DatabaseMongoObjectIdEntityAbstract
  implements IContractEntity
{
  @Prop({ required: true, index: true, type: String, default: '' })
  tenantId: string;

  @Prop({ required: true, type: String, default: '' })
  tenantName: string;

  @Prop({ required: true, index: true, type: String, default: '' })
  title: string;

  @Prop({ required: true, type: String, default: 'service' })
  type: string;

  @Prop({ required: true, index: true, type: String, default: 'draft' })
  status: string;

  @Prop({ required: true, type: String, default: '' })
  startDate: string;

  @Prop({ required: true, type: String, default: '' })
  endDate: string;

  @Prop({ required: true, type: Number, default: 0 })
  value: number;

  @Prop({ required: true, type: String, default: 'NPR' })
  currency: string;

  @Prop({ required: false, type: String, default: '' })
  description?: string;
}

export const ContractSchema = SchemaFactory.createForClass(ContractEntity);

export type ContractDoc = ContractEntity & Document;
