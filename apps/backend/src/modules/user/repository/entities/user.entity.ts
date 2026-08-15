import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { CallbackWithoutResultAndOptionalError, Document, Types } from 'mongoose';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { USER_STATUS } from 'src/common/enum/user.status.enum';
import { ENUM_GENDER } from 'src/modules/admin/constants/admin.gender.enum.constant';

/** Tenant owners and staff. Superadmins live in `admins`, not here. */
export const DatabaseName = 'users';

@DatabaseEntity({ collection: DatabaseName })
export class UserEntity extends DatabaseMongoObjectIdEntityAbstract {
  @Prop({
    required: false,
    sparse: true,
    index: true,
    trim: true,
    type: String,
    unique: true,
  })
  username?: string;

  @Prop({
    required: true,
    index: true,
    trim: true,
    type: String,
  })
  fullName: string;

  @Prop({
    required: false,
    sparse: true,
    unique: true,
    type: String,
  })
  mobileNumber?: string;

  @Prop({
    required: true,
    index: true,
    unique: true,
    lowercase: true,
    type: String,
  })
  email: string;

  @Prop({
    required: true,
    type: String,
    enum: USER_STATUS,
    default: USER_STATUS.TENANT,
  })
  role: USER_STATUS;

  @Prop({
    required: true,
    type: String,
  })
  password: string;

  @Prop({
    required: true,
    type: Date,
  })
  passwordExpired: Date;

  @Prop({
    required: true,
    type: Date,
  })
  passwordCreated: Date;

  @Prop({
    required: true,
    default: 0,
    type: Number,
  })
  passwordAttempt: number;

  @Prop({
    required: true,
    type: String,
  })
  salt: string;

  @Prop({
    required: true,
    default: true,
    index: true,
    type: Boolean,
  })
  isActive: boolean;

  @Prop({
    required: false,
    type: AwsS3Serialization,
    default: {
      path: '',
      pathWithFilename: '',
      filename: '',
      completedUrl: '',
      baseUrl: '',
      mime: '',
    },
  })
  photo?: AwsS3Serialization;

  @Prop({ type: String })
  passwordResetToken: string;

  @Prop({ type: Date })
  passwordResetExpires: Date;

  @Prop({ type: String, required: false })
  dob: string;

  @Prop({ type: String, required: false })
  gender: ENUM_GENDER;

  @Prop({
    required: true,
    index: true,
    type: Types.ObjectId,
    ref: 'TenantEntity',
  })
  tenantId: Types.ObjectId;

  @Prop({
    required: false,
    type: String,
  })
  tenantName?: string;

  @Prop({
    required: false,
    type: String,
  })
  tenantStaffRole?: string;

  @Prop({
    required: false,
    type: [String],
    default: [],
  })
  permissions?: string[];
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);

export type UserDoc = UserEntity & Document;

UserSchema.pre('save', function (next: CallbackWithoutResultAndOptionalError) {
  this.email = this.email.toLowerCase();
  next();
});
