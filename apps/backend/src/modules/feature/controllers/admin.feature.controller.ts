import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationQuery } from 'src/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from 'src/common/pagination/dto/pagination.list.dto';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import {
  ResponsePaging,
  ResponseSingle,
} from 'src/common/response/decorators/response.decorator';
import {
  IResponse,
  IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import { AdminProtected } from 'src/modules/admin/decorators/admin.user.decorator';
import {
  FEATURE_DEFAULT_AVAILABLE_ORDER_BY,
  FEATURE_DEFAULT_AVAILABLE_SEARCH,
  FEATURE_DEFAULT_ORDER_BY,
  FEATURE_DEFAULT_ORDER_DIRECTION,
  FEATURE_DEFAULT_PER_PAGE,
} from '../constants/feature.list.constant';
import {
  FeatureActiveDoc,
  FeatureCreateDoc,
  FeatureDeleteDoc,
  FeatureGetDoc,
  FeatureInactiveDoc,
  FeatureListDoc,
  FeatureUpdateDoc,
} from '../docs/feature.doc';
import { FeatureCreateDto } from '../dtos/feature.create.dto';
import { FeatureRequestDto } from '../dtos/feature.request.dto';
import { FeatureUpdateDto } from '../dtos/feature.update.dto';
import { IFeatureEntity } from '../interfaces/feature.entity.interface';
import { FeatureDoc } from '../repository/entities/feature.entity';
import { FeatureGetSerialization } from '../serializations/feature.get.serialization';
import { FeatureListSerialization } from '../serializations/feature.list.serialization';
import { FeatureService } from '../services/feature.service';

@ApiTags('Feature')
@Controller({ version: '1', path: '/feature' })
export class AdminFeatureController {
  constructor(
    private readonly _featureService: FeatureService,
    private readonly paginationService: PaginationService,
  ) {}

  @FeatureListDoc()
  @ResponsePaging('feature.list', {
    serialization: FeatureListSerialization,
  })
  @AdminProtected()
  @Get('/list')
  async list(
    @PaginationQuery(
      FEATURE_DEFAULT_PER_PAGE,
      FEATURE_DEFAULT_ORDER_BY,
      FEATURE_DEFAULT_ORDER_DIRECTION,
      FEATURE_DEFAULT_AVAILABLE_SEARCH,
      FEATURE_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
    @Query('tenantId') tenantId?: string,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = {
      ..._search,
      ...(tenantId ? { tenantId } : {}),
    };

    const docs: IFeatureEntity[] = await this._featureService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });
    const total: number = await this._featureService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: docs,
    };
  }

  @FeatureGetDoc()
  @ResponseSingle('feature.get', {
    serialization: FeatureGetSerialization,
  })
  @AdminProtected()
  @RequestParamGuard(FeatureRequestDto)
  @Get('/get/:feature')
  async get(@Param('feature') id: string): Promise<IResponse> {
    const doc = await this._featureService._checkFeature(id);
    return { data: doc };
  }

  @FeatureCreateDoc()
  @ResponseSingle('feature.create', {
    serialization: ResponseIdSerialization,
  })
  @Post('/create')
  @AdminProtected()
  async create(
    @Body()
    body: FeatureCreateDto,
  ): Promise<IResponse> {
    const data = { ...body };
    const doc: FeatureDoc = await this._featureService.create(data);
    return {
      data: doc?._id,
    };
  }

  @FeatureUpdateDoc()
  @ResponseSingle('feature.update', {
    serialization: ResponseIdSerialization,
  })
  @AdminProtected()
  @RequestParamGuard(FeatureRequestDto)
  @Patch('/update/:feature')
  async update(
    @Param('feature') id: string,
    @Body()
    body: FeatureUpdateDto,
  ): Promise<IResponse> {
    const doc = await this._featureService._checkFeature(id);
    await this._featureService.update(doc, body);
    return {
      data: doc?._id,
    };
  }

  @FeatureInactiveDoc()
  @ResponseSingle('feature.inactive')
  @AdminProtected()
  @RequestParamGuard(FeatureRequestDto)
  @Patch('/update/inactive/:feature')
  async inactive(@Param('feature') id: string): Promise<IResponse> {
    const doc = await this._featureService._checkFeature(id);
    await this._featureService.inactive(doc);
    return { data: doc?._id };
  }

  @FeatureActiveDoc()
  @ResponseSingle('feature.active')
  @AdminProtected()
  @RequestParamGuard(FeatureRequestDto)
  @Patch('/update/active/:feature')
  async active(@Param('feature') id: string): Promise<IResponse> {
    const doc = await this._featureService._checkFeature(id);
    await this._featureService.active(doc);
    return { data: doc?._id };
  }

  @FeatureDeleteDoc()
  @ResponseSingle('feature.delete')
  @AdminProtected()
  @RequestParamGuard(FeatureRequestDto)
  @Delete('/delete/:feature')
  async delete(@Param('feature') id: string): Promise<IResponse> {
    const doc = await this._featureService._checkFeature(id);
    await this._featureService.delete(doc);
    return { data: doc?._id };
  }
}
