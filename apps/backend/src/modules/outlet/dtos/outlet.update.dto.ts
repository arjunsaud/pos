import { PartialType } from '@nestjs/swagger';
import { OutletCreateDto } from './outlet.create.dto';

export class OutletUpdateDto extends PartialType(OutletCreateDto) {}
