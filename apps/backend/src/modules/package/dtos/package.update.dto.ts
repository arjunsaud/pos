import { PartialType } from '@nestjs/swagger';
import { PackageCreateDto } from './package.create.dto';

export class PackageUpdateDto extends PartialType(PackageCreateDto) {}
