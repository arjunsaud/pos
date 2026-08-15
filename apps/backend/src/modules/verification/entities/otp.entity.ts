import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { OtpType } from '@posnepal/shared';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';

export const OrgDatabaseName = 'otp';

@DatabaseEntity({ collection: OrgDatabaseName })
export class OTPEntity extends DatabaseMongoObjectIdEntityAbstract {
  @Prop({
    required: true,
    index: true,
    enum: Object.values(OtpType),
    type: String,
  })
  type: OtpType;

  @Prop({
    required: false,
    index: true,
    type: String,
    maxlength: 50,
  })
  mobileNumber?: string;

  /** Absolute expiry time; TTL index removes the document after this moment. */
  @Prop({ type: Date, expires: 0, required: true })
  expireAt: Date;

  /** SHA-256 hash of the OTP — never store plaintext. */
  @Prop({
    required: true,
    index: true,
    type: String,
    maxlength: 128,
  })
  otp: string;

  @Prop({
    required: false,
    index: true,
    lowercase: true,
    type: String,
    default: null,
    maxlength: 100,
  })
  email?: string;
}

export const OTPSchema = SchemaFactory.createForClass(OTPEntity);

/** Compound uniqueness: one active OTP per destination + type. */
OTPSchema.index(
  { type: 1, email: 1, mobileNumber: 1 },
  { name: 'otp_type_destination' },
);

export type OTPDoc = OTPEntity & Document;
