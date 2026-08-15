import { ObjectCannedACL } from '@aws-sdk/client-s3';

export interface IAwsS3PutItemOptions {
  path: string;
  acl?: ObjectCannedACL | string;
  baseUrl?: string;
}

export interface IAwsS3Serialization {
  path?: string;
  pathWithFilename?: string;
  filename?: string;
  completedUrl?: string;
  baseUrl?: string;
  mime?: string;
}
