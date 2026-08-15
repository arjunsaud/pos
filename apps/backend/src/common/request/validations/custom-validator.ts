import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';

/**
 * Trim String
 */
export const CustomStringTrim = (): PropertyDecorator => {
  return applyDecorators(
    Transform(({ value }) => {
      return value ? value.replace(/\s+/g, ' ').trim() : value;
    }),
  );
};
