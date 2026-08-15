import { ApiProperty } from '@nestjs/swagger';

export class ProductImportErrorSerialization {
  @ApiProperty()
  row: number;

  @ApiProperty({ required: false })
  sku?: string;

  @ApiProperty()
  reason: string;
}

export class ProductImportSerialization {
  @ApiProperty()
  created: number;

  @ApiProperty()
  skipped: number;

  @ApiProperty({ type: [ProductImportErrorSerialization] })
  errors: ProductImportErrorSerialization[];
}
