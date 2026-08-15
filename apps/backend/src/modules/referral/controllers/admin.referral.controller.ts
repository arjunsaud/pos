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
  REFERRAL_DEFAULT_AVAILABLE_ORDER_BY,
  REFERRAL_DEFAULT_AVAILABLE_SEARCH,
  REFERRAL_DEFAULT_ORDER_BY,
  REFERRAL_DEFAULT_ORDER_DIRECTION,
  REFERRAL_DEFAULT_PER_PAGE,
} from '../constants/referral.list.constant';
import {
  ReferralActiveDoc,
  ReferralCreateDoc,
  ReferralDeleteDoc,
  ReferralGetDoc,
  ReferralInactiveDoc,
  ReferralListDoc,
  ReferralUpdateDoc,
} from '../docs/referral.doc';
import { ReferralCreateDto } from '../dtos/referral.create.dto';
import { ReferralRequestDto } from '../dtos/referral.request.dto';
import { ReferralUpdateDto } from '../dtos/referral.update.dto';
import { IReferralEntity } from '../interfaces/referral.entity.interface';
import { ReferralDoc } from '../repository/entities/referral.entity';
import { ReferralGetSerialization } from '../serializations/referral.get.serialization';
import { ReferralListSerialization } from '../serializations/referral.list.serialization';
import { ReferralService } from '../services/referral.service';

@ApiTags('Referral')
@Controller({ version: '1', path: '/referral' })
export class AdminReferralController {
  constructor(
    private readonly _referralService: ReferralService,
    private readonly paginationService: PaginationService,
  ) {}

  @ReferralListDoc()
  @ResponsePaging('referral.list', {
    serialization: ReferralListSerialization,
  })
  @AdminProtected()
  @Get('/list')
  async list(
    @PaginationQuery(
      REFERRAL_DEFAULT_PER_PAGE,
      REFERRAL_DEFAULT_ORDER_BY,
      REFERRAL_DEFAULT_ORDER_DIRECTION,
      REFERRAL_DEFAULT_AVAILABLE_SEARCH,
      REFERRAL_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = { ..._search };

    const docs: IReferralEntity[] = await this._referralService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });
    const total: number = await this._referralService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: docs,
    };
  }

  @ReferralGetDoc()
  @ResponseSingle('referral.get', {
    serialization: ReferralGetSerialization,
  })
  @AdminProtected()
  @RequestParamGuard(ReferralRequestDto)
  @Get('/get/:referral')
  async get(@Param('referral') id: string): Promise<IResponse> {
    const doc = await this._referralService._checkReferral(id);
    return { data: doc };
  }

  @ReferralCreateDoc()
  @ResponseSingle('referral.create', {
    serialization: ResponseIdSerialization,
  })
  @Post('/create')
  @AdminProtected()
  async create(
    @Body()
    body: ReferralCreateDto,
  ): Promise<IResponse> {
    const data = { ...body };
    const doc: ReferralDoc = await this._referralService.create(data);
    return {
      data: doc?._id,
    };
  }

  @ReferralUpdateDoc()
  @ResponseSingle('referral.update', {
    serialization: ResponseIdSerialization,
  })
  @AdminProtected()
  @RequestParamGuard(ReferralRequestDto)
  @Patch('/update/:referral')
  async update(
    @Param('referral') id: string,
    @Body()
    body: ReferralUpdateDto,
  ): Promise<IResponse> {
    const doc = await this._referralService._checkReferral(id);
    await this._referralService.update(doc, body);
    return {
      data: doc?._id,
    };
  }

  @ReferralInactiveDoc()
  @ResponseSingle('referral.inactive')
  @AdminProtected()
  @RequestParamGuard(ReferralRequestDto)
  @Patch('/update/inactive/:referral')
  async inactive(@Param('referral') id: string): Promise<IResponse> {
    const doc = await this._referralService._checkReferral(id);
    await this._referralService.inactive(doc);
    return { data: doc?._id };
  }

  @ReferralActiveDoc()
  @ResponseSingle('referral.active')
  @AdminProtected()
  @RequestParamGuard(ReferralRequestDto)
  @Patch('/update/active/:referral')
  async active(@Param('referral') id: string): Promise<IResponse> {
    const doc = await this._referralService._checkReferral(id);
    await this._referralService.active(doc);
    return { data: doc?._id };
  }

  @ReferralDeleteDoc()
  @ResponseSingle('referral.delete')
  @AdminProtected()
  @RequestParamGuard(ReferralRequestDto)
  @Delete('/delete/:referral')
  async delete(@Param('referral') id: string): Promise<IResponse> {
    const doc = await this._referralService._checkReferral(id);
    await this._referralService.delete(doc);
    return { data: doc?._id };
  }
}
