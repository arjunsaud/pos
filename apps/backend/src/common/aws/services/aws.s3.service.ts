import {
  AbortMultipartUploadCommand,
  AbortMultipartUploadCommandInput,
  AbortMultipartUploadCommandOutput,
  Bucket,
  CompleteMultipartUploadCommand,
  CompleteMultipartUploadCommandInput,
  CompleteMultipartUploadCommandOutput,
  CompletedPart,
  CreateMultipartUploadCommand,
  CreateMultipartUploadCommandInput,
  CreateMultipartUploadCommandOutput,
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  DeleteObjectCommandOutput,
  DeleteObjectsCommand,
  DeleteObjectsCommandInput,
  DeleteObjectsCommandOutput,
  GetObjectCommand,
  GetObjectCommandInput,
  GetObjectCommandOutput,
  GetObjectOutput,
  HeadBucketCommand,
  HeadBucketCommandInput,
  HeadBucketCommandOutput,
  ListBucketsCommand,
  ListBucketsCommandInput,
  ListBucketsCommandOutput,
  ListBucketsOutput,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
  ListObjectsV2CommandOutput,
  ListObjectsV2Output,
  ObjectCannedACL,
  ObjectIdentifier,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  S3Client,
  UploadPartCommand,
  UploadPartCommandInput,
  UploadPartCommandOutput,
  UploadPartRequest,
  _Object,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';
import { IAwsS3PutItemOptions } from '../interfaces/aws.interface';
import { IAwsS3Service } from '../interfaces/aws.s3-service.interface';
import {
  AwsS3MultipartPartsSerialization,
  AwsS3MultipartSerialization,
} from '../serializations/aws.s3-multipart.serialization';
import { AwsS3Serialization } from '../serializations/aws.s3.serialization';

@Injectable()
export class AwsS3Service implements IAwsS3Service {
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: this.configService.get<string>('aws.key'),
        secretAccessKey: this.configService.get<string>('aws.secret'),
      },
      endpoint: this.configService.get<string>('aws.baseUrl'),
      region: 'auto',
    });

    this.bucket = this.configService.get('aws.bucket');

    this.baseUrl = this.configService.get<string>('aws.baseUrl');
  }
  /**
   * not used yet
   * @returns
   */
  async checkBucketExistence(): Promise<HeadBucketCommandOutput> {
    const command: HeadBucketCommand = new HeadBucketCommand({
      Bucket: this.bucket,
    });

    try {
      const check = await this.s3Client.send<
        HeadBucketCommandInput,
        HeadBucketCommandOutput
      >(command);
      return check;
    } catch (err: any) {
      throw err;
    }
  }

  /**
   * Not used on any other services yet
   * @returns
   */
  async listBucket(): Promise<string[]> {
    const command: ListBucketsCommand = new ListBucketsCommand({});

    try {
      const listBucket: ListBucketsOutput = await this.s3Client.send<
        ListBucketsCommandInput,
        ListBucketsCommandOutput
      >(command);
      const mapList: string[] = listBucket.Buckets.map(
        (val: Bucket) => val.Name,
      );
      return mapList;
    } catch (err: any) {
      throw err;
    }
  }

  /**
   * Not used on any other services yet
   * @param prefix
   * @returns
   */
  async listItemInBucket(prefix?: string): Promise<AwsS3Serialization[]> {
    const command: ListObjectsV2Command = new ListObjectsV2Command({
      Bucket: this.bucket,
      Prefix: prefix,
    });

    try {
      const listItems: ListObjectsV2Output = await this.s3Client.send<
        ListObjectsV2CommandInput,
        ListObjectsV2CommandOutput
      >(command);

      const mapList = listItems.Contents.map((val: _Object) => {
        const lastIndex: number = val.Key.lastIndexOf('/');
        const path: string = val.Key.substring(0, lastIndex);
        const filename: string = val.Key.substring(
          lastIndex + 1,
          val.Key.length,
        );
        const mime: string = filename
          .substring(filename.lastIndexOf('.') + 1, filename.length)
          .toLocaleUpperCase();

        return {
          path,
          pathWithFilename: val.Key,
          filename: filename,
          completedUrl: `${this.baseUrl}/${val.Key}`,
          baseUrl: this.baseUrl,
          mime,
        };
      });

      return mapList;
    } catch (err: any) {
      throw err;
    }
  }

  /**
   * Used From Backup log and http log
   * @param filename
   * @param path
   * @param options
   * @returns
   */
  async getItemInBucket(
    filename: string,
    path?: string,
    options?: {
      bucket?: string;
    },
  ): Promise<Readable | ReadableStream<any> | Blob> {
    if (path) path = path.startsWith('/') ? path.replace('/', '') : `${path}`;
    const bucket = options?.bucket || this.bucket;

    const key: string = path ? `${path}/${filename}` : filename;
    const command: GetObjectCommand = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    try {
      const item: GetObjectOutput = await this.s3Client.send<
        GetObjectCommandInput,
        GetObjectCommandOutput
      >(command);
      return item.Body;
    } catch (err: any) {
      throw err;
    }
  }

  /**
   * Used from File Upload module and Backup Cron Module
   * @param filename
   * @param bucket
   * @param content
   * @param uploadedBy
   * @param options
   * @returns
   */
  async putItemInBucket(
    filename: string,
    content: string | Uint8Array | Buffer | Readable | ReadableStream | Blob,
    uploadedBy: string,
    options?: IAwsS3PutItemOptions,
  ): Promise<AwsS3Serialization> {
    let path: string = options?.path;
    const acl: any = options?.acl ? options.acl : ObjectCannedACL.public_read;

    if (path) path = path.startsWith('/') ? path.replace('/', '') : `${path}`;

    const mime: string = filename
      .substring(filename.lastIndexOf('.') + 1, filename.length)
      .toUpperCase();
    const key: string = path ? `${path}/${filename}` : filename;
    const command: PutObjectCommand = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: content,
      ACL: acl,
      Metadata: { uploaded_by: uploadedBy },
    });

    try {
      await this.s3Client.send<PutObjectCommandInput, PutObjectCommandOutput>(
        command,
      );
    } catch (err: any) {
      throw err;
    }

    // const baseUrl = options?.baseUrl || this.baseUrl;

    return {
      path,
      pathWithFilename: key,
      filename: filename,
      completedUrl: `${this.getBaseUrlByBucket(this.bucket)}/${key}`,
      baseUrl: this.getBaseUrlByBucket(this.bucket),
      mime,
    };
  }

  /**
   * Used on same file
   */
  getBaseUrlByBucket(bucket: string): string {
    return `${this.baseUrl}/${bucket}`;
  }

  /**
   * Not used any where yet
   * @param filename
   * @returns
   */
  async deleteItemInBucket(filename: string): Promise<void> {
    const command: DeleteObjectCommand = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: filename,
    });

    try {
      await this.s3Client.send<
        DeleteObjectCommandInput,
        DeleteObjectCommandOutput
      >(command);
      return;
    } catch (err: any) {
      throw err;
    }
  }

  /**
   * Not used any where yet
   * @param filenames
   * @returns
   */
  async deleteItemsInBucket(filenames: string[]): Promise<void> {
    const keys: ObjectIdentifier[] = filenames.map((val: string) => ({
      Key: val,
    }));
    const command: DeleteObjectsCommand = new DeleteObjectsCommand({
      Bucket: this.bucket,
      Delete: {
        Objects: keys,
      },
    });

    try {
      await this.s3Client.send<
        DeleteObjectsCommandInput,
        DeleteObjectsCommandOutput
      >(command);
      return;
    } catch (err: any) {
      throw err;
    }
  }

  /**
   * Not used any where yet
   * @param dir
   * @returns
   */
  async deleteFolder(dir: string): Promise<void> {
    const commandList: ListObjectsV2Command = new ListObjectsV2Command({
      Bucket: this.bucket,
      Prefix: dir,
    });
    const lists = await this.s3Client.send<
      ListObjectsV2CommandInput,
      ListObjectsV2CommandOutput
    >(commandList);

    try {
      const listItems = lists.Contents.map((val) => ({
        Key: val.Key,
      }));
      const commandDeleteItems: DeleteObjectsCommand = new DeleteObjectsCommand(
        {
          Bucket: this.bucket,
          Delete: {
            Objects: listItems,
          },
        },
      );

      await this.s3Client.send<
        DeleteObjectsCommandInput,
        DeleteObjectsCommandOutput
      >(commandDeleteItems);

      const commandDelete: DeleteObjectCommand = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: dir,
      });
      await this.s3Client.send<
        DeleteObjectCommandInput,
        DeleteObjectCommandOutput
      >(commandDelete);

      return;
    } catch (err: any) {
      throw err;
    }
  }

  /**
   * Not used any where yet
   * @param filename
   * @returns
   */
  async createMultiPart(
    filename: string,
    options?: IAwsS3PutItemOptions,
  ): Promise<AwsS3MultipartSerialization> {
    let path: string = options?.path;
    const acl: any = options?.acl ? options.acl : ObjectCannedACL.public_read;
    if (path) path = path.startsWith('/') ? path.replace('/', '') : `${path}`;

    const mime: string = filename
      .substring(filename.lastIndexOf('.') + 1, filename.length)
      .toUpperCase();
    const key: string = path ? `${path}/${filename}` : filename;

    const multiPartCommand: CreateMultipartUploadCommand =
      new CreateMultipartUploadCommand({
        Bucket: this.bucket,
        Key: key,
        ACL: acl,
      });

    try {
      const response = await this.s3Client.send<
        CreateMultipartUploadCommandInput,
        CreateMultipartUploadCommandOutput
      >(multiPartCommand);

      return {
        uploadId: response.UploadId,
        path,
        pathWithFilename: key,
        filename: filename,
        completedUrl: `${this.baseUrl}/${key}`,
        baseUrl: this.baseUrl,
        mime,
      };
    } catch (err: any) {
      throw err;
    }
  }

  /**
   * Not used yet
   * @param path
   * @param content
   * @param uploadId
   * @param partNumber
   * @returns
   */
  async uploadPart(
    path: string,
    content: UploadPartRequest['Body'] | string | Uint8Array | Buffer,
    uploadId: string,
    partNumber: number,
  ): Promise<AwsS3MultipartPartsSerialization> {
    const uploadPartCommand: UploadPartCommand = new UploadPartCommand({
      Bucket: this.bucket,
      Key: path,
      Body: content,
      PartNumber: partNumber,
      UploadId: uploadId,
    });

    try {
      const { ETag } = await this.s3Client.send<
        UploadPartCommandInput,
        UploadPartCommandOutput
      >(uploadPartCommand);

      return {
        ETag,
        PartNumber: partNumber,
      };
    } catch (err: any) {
      throw err;
    }
  }

  /**
   * Not Used Yet
   * @param path
   * @param uploadId
   * @param parts
   * @returns
   */
  async completeMultipart(
    path: string,
    uploadId: string,
    parts: CompletedPart[],
  ): Promise<void> {
    const completeMultipartCommand: CompleteMultipartUploadCommand =
      new CompleteMultipartUploadCommand({
        Bucket: this.bucket,
        Key: path,
        UploadId: uploadId,
        MultipartUpload: {
          Parts: parts,
        },
      });

    try {
      await this.s3Client.send<
        CompleteMultipartUploadCommandInput,
        CompleteMultipartUploadCommandOutput
      >(completeMultipartCommand);

      return;
    } catch (err: any) {
      throw err;
    }
  }

  /**
   * Not Used Yet
   * @param path
   * @param uploadId
   * @returns
   */
  async abortMultipart(path: string, uploadId: string): Promise<void> {
    const abortMultipartCommand: AbortMultipartUploadCommand =
      new AbortMultipartUploadCommand({
        Bucket: this.bucket,
        Key: path,
        UploadId: uploadId,
      });

    try {
      await this.s3Client.send<
        AbortMultipartUploadCommandInput,
        AbortMultipartUploadCommandOutput
      >(abortMultipartCommand);

      return;
    } catch (err: any) {
      throw err;
    }
  }

  /**
   * Used From Backup and http log
   * @param param0
   * @returns
   */
  async listAllItemInBucket({
    bucket,
    prefix,
  }: {
    bucket?: string;
    prefix?: string;
  } = {}): Promise<AwsS3Serialization[]> {
    const command: ListObjectsV2Command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
    });
    try {
      const listItems: ListObjectsV2Output = await this.s3Client.send<
        ListObjectsV2CommandInput,
        ListObjectsV2CommandOutput
      >(command);

      const mapList = listItems.Contents.map((val: _Object) => {
        const lastIndex: number = val.Key.lastIndexOf('/');
        const path: string = val.Key.substring(0, lastIndex);
        const filename: string = val.Key.substring(
          lastIndex + 1,
          val.Key.length,
        );
        const mime: string = filename
          .substring(filename.lastIndexOf('.') + 1, filename.length)
          .toLocaleUpperCase();

        return {
          path,
          pathWithFilename: val.Key,
          filename: filename,
          completedUrl: `${this.baseUrl}/${val.Key}`,
          baseUrl: this.baseUrl,
          mime,
          lastModified: val.LastModified,
        };
      });

      return mapList;
    } catch (err: any) {
      throw err;
    }
  }

  /**
   * Not Used Yet
   * @param filenames
   * @param bucket
   * @returns
   */
  async deleteBackupItemsInBucket(
    filenames: string[],
    bucket: string,
  ): Promise<void> {
    const keys: ObjectIdentifier[] = filenames.map((val: string) => ({
      Key: val,
    }));
    const command: DeleteObjectsCommand = new DeleteObjectsCommand({
      Bucket: bucket,
      Delete: {
        Objects: keys,
      },
    });

    try {
      await this.s3Client.send<
        DeleteObjectsCommandInput,
        DeleteObjectsCommandOutput
      >(command);
      return;
    } catch (err: any) {
      throw err;
    }
  }
}
