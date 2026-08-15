import { registerAs } from '@nestjs/config';
import { FILE_SIZE_IN_BYTES } from 'src/common/file/constants/file.constant';

export default registerAs(
  'file',
  (): Record<string, any> => ({
    image: {
      maxFileSize: FILE_SIZE_IN_BYTES,
    },
    excel: {
      maxFileSize: FILE_SIZE_IN_BYTES,
    },
    audio: {
      maxFileSize: FILE_SIZE_IN_BYTES,
    },
    video: {
      maxFileSize: FILE_SIZE_IN_BYTES,
    },
  }),
);
