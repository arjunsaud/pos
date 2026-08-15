import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
  PROMOTION_DEFAULT_AVAILABLE_ORDER_BY,
  PROMOTION_DEFAULT_AVAILABLE_SEARCH,
  PROMOTION_DEFAULT_ORDER_BY,
  PROMOTION_DEFAULT_ORDER_DIRECTION,
  PROMOTION_DEFAULT_PER_PAGE,
} from '../constants/promotion.list.constant';
import {
  PromotionActiveDoc,
  PromotionCreateDoc,
  PromotionDeleteDoc,
  PromotionGetDoc,
  PromotionInactiveDoc,
  PromotionListDoc,
  PromotionUpdateDoc,
} from '../docs/promotion.doc';
import { PromotionCreateDto } from '../dtos/promotion.create.dto';
import { PromotionRequestDto } from '../dtos/promotion.request.dto';
import { PromotionUpdateDto } from '../dtos/promotion.update.dto';
import { IPromotionEntity } from '../interfaces/promotion.entity.interface';
import { PromotionDoc } from '../repository/entities/promotion.entity';
import { PromotionGetSerialization } from '../serializations/promotion.get.serialization';
import { PromotionListSerialization } from '../serializations/promotion.list.serialization';
import { PromotionService } from '../services/promotion.service';

@ApiTags('Promotion')
@Controller({ version: '1', path: '/promotion' })
export class AdminPromotionController {
  constructor(
    private readonly _promotionService: PromotionService,
    private readonly paginationService: PaginationService,
  ) {}

  @PromotionListDoc()
  @ResponsePaging('promotion.list', {
    serialization: PromotionListSerialization,
  })
  @AdminProtected()
  @Get('/list')
  async list(
    @PaginationQuery(
      PROMOTION_DEFAULT_PER_PAGE,
      PROMOTION_DEFAULT_ORDER_BY,
      PROMOTION_DEFAULT_ORDER_DIRECTION,
      PROMOTION_DEFAULT_AVAILABLE_SEARCH,
      PROMOTION_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = { ..._search };

    const docs: IPromotionEntity[] = await this._promotionService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });
    const total: number = await this._promotionService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: docs,
    };
  }

  @PromotionGetDoc()
  @ResponseSingle('promotion.get', {
    serialization: PromotionGetSerialization,
  })
  @AdminProtected()
  @RequestParamGuard(PromotionRequestDto)
  @Get('/get/:promotion')
  async get(@Param('promotion') id: string): Promise<IResponse> {
    const doc = await this._promotionService._checkPromotion(id);
    return { data: doc };
  }

  @PromotionCreateDoc()
  @ResponseSingle('promotion.create', {
    serialization: ResponseIdSerialization,
  })
  @Post('/create')
  @AdminProtected()
  async create(
    @Body()
    body: PromotionCreateDto,
  ): Promise<IResponse> {
    const data = { ...body };
    const doc: PromotionDoc = await this._promotionService.create(data);
    return {
      data: doc?._id,
    };
  }

  @PromotionUpdateDoc()
  @ResponseSingle('promotion.update', {
    serialization: ResponseIdSerialization,
  })
  @AdminProtected()
  @RequestParamGuard(PromotionRequestDto)
  @Patch('/update/:promotion')
  async update(
    @Param('promotion') id: string,
    @Body()
    body: PromotionUpdateDto,
  ): Promise<IResponse> {
    const doc = await this._promotionService._checkPromotion(id);
    await this._promotionService.update(doc, body);
    return {
      data: doc?._id,
    };
  }

  @PromotionInactiveDoc()
  @ResponseSingle('promotion.inactive')
  @AdminProtected()
  @RequestParamGuard(PromotionRequestDto)
  @Patch('/update/inactive/:promotion')
  async inactive(@Param('promotion') id: string): Promise<IResponse> {
    const doc = await this._promotionService._checkPromotion(id);
    await this._promotionService.inactive(doc);
    return { data: doc?._id };
  }

  @PromotionActiveDoc()
  @ResponseSingle('promotion.active')
  @AdminProtected()
  @RequestParamGuard(PromotionRequestDto)
  @Patch('/update/active/:promotion')
  async active(@Param('promotion') id: string): Promise<IResponse> {
    const doc = await this._promotionService._checkPromotion(id);
    await this._promotionService.active(doc);
    return { data: doc?._id };
  }

  @PromotionDeleteDoc()
  @ResponseSingle('promotion.delete')
  @AdminProtected()
  @RequestParamGuard(PromotionRequestDto)
  @Delete('/delete/:promotion')
  async delete(@Param('promotion') id: string): Promise<IResponse> {
    const doc = await this._promotionService._checkPromotion(id);
    await this._promotionService.delete(doc);
    return { data: doc?._id };
  }
}
