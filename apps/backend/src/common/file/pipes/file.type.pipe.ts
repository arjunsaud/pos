import {
  PipeTransform,
  Injectable,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import {
  ENUM_FILE_AUDIO_MIME,
  ENUM_FILE_EXCEL_MIME,
  ENUM_FILE_IMAGE_MIME,
  ENUM_FILE_VIDEO_MIME,
} from 'src/common/file/constants/file.enum.constant';
import { ENUM_FILE_STATUS_CODE_ERROR } from 'src/common/file/constants/file.status-code.constant';
import { IFile } from 'src/common/file/interfaces/file.interface';

@Injectable()
export class FileTypeImagePipe implements PipeTransform {
  async transform(value: IFile | IFile[]): Promise<IFile | IFile[]> {
    if (!value) {
      return;
    }

    if (Array.isArray(value)) {
      for (const val of value) {
        await this.validate(val.mimetype);
      }

      return value;
    }

    const file = value as IFile;
    await this.validate(file.mimetype);

    return value;
  }

  async validate(mimetype: string): Promise<void> {
    if (
      !Object.values(ENUM_FILE_IMAGE_MIME).find(
        (val) => val === mimetype.toLowerCase(),
      )
    ) {
      throw new UnsupportedMediaTypeException({
        statusCode: ENUM_FILE_STATUS_CODE_ERROR.FILE_EXTENSION_ERROR,
        message: 'file.error.mimeInvalid',
      });
    }

    return;
  }
}

@Injectable()
export class FileTypeVideoPipe implements PipeTransform {
  async transform(value: IFile | IFile[]): Promise<IFile | IFile[]> {
    if (Array.isArray(value)) {
      for (const val of value) {
        await this.validate(val.mimetype);
      }

      return value;
    }

    const file = value as IFile;
    await this.validate(file.mimetype);

    return value;
  }

  async validate(mimetype: string): Promise<void> {
    if (
      !Object.values(ENUM_FILE_VIDEO_MIME).find(
        (val) => val === mimetype.toLowerCase(),
      )
    ) {
      throw new UnsupportedMediaTypeException({
        statusCode: ENUM_FILE_STATUS_CODE_ERROR.FILE_EXTENSION_ERROR,
        message: 'file.error.mimeInvalid',
      });
    }

    return;
  }
}

@Injectable()
export class FileTypeAudioPipe implements PipeTransform {
  async transform(value: IFile | IFile[]): Promise<IFile | IFile[]> {
    if (Array.isArray(value)) {
      for (const val of value) {
        await this.validate(val.mimetype);
      }

      return value;
    }

    const file = value as IFile;
    await this.validate(file.mimetype);

    return value;
  }

  async validate(mimetype: string): Promise<void> {
    if (
      !Object.values(ENUM_FILE_AUDIO_MIME).find(
        (val) => val === mimetype.toLowerCase(),
      )
    ) {
      throw new UnsupportedMediaTypeException({
        statusCode: ENUM_FILE_STATUS_CODE_ERROR.FILE_EXTENSION_ERROR,
        message: 'file.error.mimeInvalid',
      });
    }

    return;
  }
}

const SPREADSHEET_EXTENSIONS = new Set(['xls', 'xlsx', 'csv']);
const EXTRA_SPREADSHEET_MIME = new Set([
  'text/plain',
  'application/octet-stream',
]);

function spreadsheetExtension(filename?: string): string {
  if (!filename || !filename.includes('.')) {
    return '';
  }
  return filename.split('.').pop()?.toLowerCase() || '';
}

function isAllowedSpreadsheet(file: IFile): boolean {
  const ext = spreadsheetExtension(file.originalname);
  if (SPREADSHEET_EXTENSIONS.has(ext)) {
    return true;
  }
  const mime = (file.mimetype || '').toLowerCase();
  return (
    Object.values(ENUM_FILE_EXCEL_MIME).includes(mime as ENUM_FILE_EXCEL_MIME) ||
    EXTRA_SPREADSHEET_MIME.has(mime)
  );
}

@Injectable()
export class FileTypeExcelPipe implements PipeTransform {
  async transform(value: IFile | IFile[]): Promise<IFile | IFile[]> {
    if (Array.isArray(value)) {
      for (const val of value) {
        await this.validate(val);
      }

      return value;
    }

    const file: IFile = value as IFile;
    await this.validate(file);

    return value;
  }

  async validate(file: IFile): Promise<void> {
    if (!isAllowedSpreadsheet(file)) {
      throw new UnsupportedMediaTypeException({
        statusCode: ENUM_FILE_STATUS_CODE_ERROR.FILE_EXTENSION_ERROR,
        message: 'file.error.mimeInvalid',
      });
    }

    return;
  }
}
