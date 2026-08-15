import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  StreamableFile,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';
import {
  ClassConstructor,
  ClassTransformOptions,
  plainToInstance,
} from 'class-transformer';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ENUM_FILE_EXCEL_MIME } from 'src/common/file/constants/file.enum.constant';
import { ENUM_HELPER_FILE_TYPE } from 'src/common/helper/constants/helper.enum.constant';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';
import { HelperFileService } from 'src/common/helper/services/helper.file.service';
import {
  RESPONSE_FILE_TYPE_META_KEY,
  RESPONSE_SERIALIZATION_META_KEY,
  RESPONSE_SERIALIZATION_OPTIONS_META_KEY,
} from 'src/common/response/constants/response.constant';
import { IResponseFile } from 'src/common/response/interfaces/response.interface';
import { WorkBook } from 'xlsx';

@Injectable()
export class ResponseFileInterceptor implements NestInterceptor<Promise<any>> {
  constructor(
    private readonly reflector: Reflector,
    private readonly helperFileService: HelperFileService,
    private readonly helperDateService: HelperDateService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Promise<Record<string, any>>>> {
    const fileType: ENUM_HELPER_FILE_TYPE =
      this.reflector.get<ENUM_HELPER_FILE_TYPE>(
        RESPONSE_FILE_TYPE_META_KEY,
        context.getHandler(),
      );

    if (context.getType() === 'http') {
      return next.handle().pipe(
        map(async (res: Promise<IResponseFile>) => {
          const ctx: HttpArgumentsHost = context.switchToHttp();
          const response: Response = ctx.getResponse();

          const classSerialization: ClassConstructor<any> = this.reflector.get<
            ClassConstructor<any>
          >(RESPONSE_SERIALIZATION_META_KEY, context.getHandler());
          const classSerializationOptions: ClassTransformOptions =
            this.reflector.get<ClassTransformOptions>(
              RESPONSE_SERIALIZATION_OPTIONS_META_KEY,
              context.getHandler(),
            );

          // set default response
          const responseData = (await res) as IResponseFile;
          let data: Record<string, any>[] = responseData.data;
          if (classSerialization) {
            data = plainToInstance(
              classSerialization,
              data,
              classSerializationOptions,
            );
          }

          // create file
          const workbook: WorkBook =
            this.helperFileService.createExcelWorkbook(data);
          const file: Buffer = this.helperFileService.writeExcelToBuffer(
            workbook,
            {
              type: fileType,
            },
          );

          // set headers
          const timestamp = this.helperDateService.timestamp();
          response
            .setHeader(
              'Content-Type',
              ENUM_FILE_EXCEL_MIME[fileType.toUpperCase()],
            )
            .setHeader(
              'Content-Disposition',
              `attachment; filename=export-${timestamp}.${fileType}`,
            )
            .setHeader('Content-Length', file.length);

          return new StreamableFile(file);
        }),
      );
    }

    return next.handle();
  }
}
