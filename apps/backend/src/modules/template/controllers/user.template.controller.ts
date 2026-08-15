import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PRINT_TEMPLATE_TYPES, PrintTemplateType } from '@posnepal/shared';
import {
  ResponseSingle,
} from 'src/common/response/decorators/response.decorator';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { UserProtected } from 'src/modules/user/decorators/user.decorator';
import { TemplateGetSerialization } from '../serializations/template.get.serialization';
import { TemplateService } from '../services/template.service';

@ApiTags('Templates')
@Controller({ version: '1', path: '/template' })
export class UserTemplateController {
  constructor(private readonly _templateService: TemplateService) {}

  @ResponseSingle('template.active', {
    serialization: TemplateGetSerialization,
  })
  @UserProtected()
  @Get('/active')
  async active(@Query('type') type?: string): Promise<IResponse> {
    if (type !== 'invoice' && type !== 'receipt') {
      throw new BadRequestException({
        message: 'template.error.invalidType',
      });
    }
    const doc = await this._templateService.findActiveByType(
      type as PrintTemplateType,
    );
    if (!doc) {
      throw new BadRequestException({
        message: 'template.error.notFound',
      });
    }
    return { data: doc };
  }

  @ResponseSingle('template.types')
  @UserProtected()
  @Get('/types')
  async types(): Promise<IResponse> {
    return { data: PRINT_TEMPLATE_TYPES };
  }
}
