import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { CallbackWithoutResultAndOptionalError, Document } from 'mongoose';
import { AwsS3Serialization } from 'src/common/aws/serializations/aws.s3.serialization';
import { DatabaseMongoObjectIdEntityAbstract } from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import { DatabaseEntity } from 'src/common/database/decorators/database.decorator';
import { USER_STATUS } from 'src/common/enum/user.status.enum';
import { ENUM_GENDER } from '../../constants/admin.gender.enum.constant';

/** Platform superadmins only. Never store tenant admins or staff here. */
export const DatabaseName = 'admins';

@DatabaseEntity({ collection: DatabaseName })
export class AdminEntity extends DatabaseMongoObjectIdEntityAbstract {
  @Prop({
    required: false,
    sparse: true,
    index: true,
    trim: true,
    type: String,
    unique: true,
    maxlength: 100,
  })
  username?: string;

  @Prop({
    required: true,
    index: true,
    trim: true,
    type: String,
    maxlength: 100,
  })
  fullName: string;

  @Prop({
    required: false,
    sparse: true,
    unique: true,
    type: String,
    maxlength: 15,
  })
  mobileNumber?: string;

  @Prop({
    required: true,
    index: true,
    unique: true,
    lowercase: true,
    type: String,
    maxlength: 100,
  })
  email: string;

  @Prop({
    required: true,
    type: String,
    enum: USER_STATUS,
  })
  role: string;

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
    required: false,
    type: String,
    default: 'admin',
  })
  superAdminStaffRole?: string;

  @Prop({
    required: false,
    type: [String],
    default: [],
  })
  permissions?: string[];
}

export const AdminSchema = SchemaFactory.createForClass(AdminEntity);

export type AdminDoc = AdminEntity & Document;

AdminSchema.pre('save', function (next: CallbackWithoutResultAndOptionalError) {
  this.email = this.email.toLowerCase();
  next();
});
