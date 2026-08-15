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
  SUBSCRIPTION_DEFAULT_AVAILABLE_ORDER_BY,
  SUBSCRIPTION_DEFAULT_AVAILABLE_SEARCH,
  SUBSCRIPTION_DEFAULT_ORDER_BY,
  SUBSCRIPTION_DEFAULT_ORDER_DIRECTION,
  SUBSCRIPTION_DEFAULT_PER_PAGE,
} from '../constants/subscription.list.constant';
import {
  SubscriptionActiveDoc,
  SubscriptionCreateDoc,
  SubscriptionDeleteDoc,
  SubscriptionGetDoc,
  SubscriptionInactiveDoc,
  SubscriptionListDoc,
  SubscriptionUpdateDoc,
} from '../docs/subscription.doc';
import { SubscriptionCreateDto } from '../dtos/subscription.create.dto';
import { SubscriptionRequestDto } from '../dtos/subscription.request.dto';
import { SubscriptionUpdateDto } from '../dtos/subscription.update.dto';
import { ISubscriptionEntity } from '../interfaces/subscription.entity.interface';
import { SubscriptionDoc } from '../repository/entities/subscription.entity';
import { SubscriptionGetSerialization } from '../serializations/subscription.get.serialization';
import { SubscriptionListSerialization } from '../serializations/subscription.list.serialization';
import { SubscriptionService } from '../services/subscription.service';

@ApiTags('Subscription')
@Controller({ version: '1', path: '/subscription' })
export class AdminSubscriptionController {
  constructor(
    private readonly _subscriptionService: SubscriptionService,
    private readonly paginationService: PaginationService,
  ) {}

  @SubscriptionListDoc()
  @ResponsePaging('subscription.list', {
    serialization: SubscriptionListSerialization,
  })
  @AdminProtected()
  @Get('/list')
  async list(
    @PaginationQuery(
      SUBSCRIPTION_DEFAULT_PER_PAGE,
      SUBSCRIPTION_DEFAULT_ORDER_BY,
      SUBSCRIPTION_DEFAULT_ORDER_DIRECTION,
      SUBSCRIPTION_DEFAULT_AVAILABLE_SEARCH,
      SUBSCRIPTION_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
    @Query('tenantId') tenantId?: string,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = {
      ..._search,
      ...(tenantId ? { tenantId } : {}),
    };

    const docs: ISubscriptionEntity[] = await this._subscriptionService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });
    const total: number = await this._subscriptionService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: docs,
    };
  }

  @SubscriptionGetDoc()
  @ResponseSingle('subscription.get', {
    serialization: SubscriptionGetSerialization,
  })
  @AdminProtected()
  @RequestParamGuard(SubscriptionRequestDto)
  @Get('/get/:subscription')
  async get(@Param('subscription') id: string): Promise<IResponse> {
    const doc = await this._subscriptionService._checkSubscription(id);
    return { data: doc };
  }

  @SubscriptionCreateDoc()
  @ResponseSingle('subscription.create', {
    serialization: ResponseIdSerialization,
  })
  @Post('/create')
  @AdminProtected()
  async create(
    @Body()
    body: SubscriptionCreateDto,
  ): Promise<IResponse> {
    const data = { ...body };
    const doc: SubscriptionDoc = await this._subscriptionService.create(data);
    return {
      data: doc?._id,
    };
  }

  @SubscriptionUpdateDoc()
  @ResponseSingle('subscription.update', {
    serialization: ResponseIdSerialization,
  })
  @AdminProtected()
  @RequestParamGuard(SubscriptionRequestDto)
  @Patch('/update/:subscription')
  async update(
    @Param('subscription') id: string,
    @Body()
    body: SubscriptionUpdateDto,
  ): Promise<IResponse> {
    const doc = await this._subscriptionService._checkSubscription(id);
    await this._subscriptionService.update(doc, body);
    return {
      data: doc?._id,
    };
  }

  @SubscriptionInactiveDoc()
  @ResponseSingle('subscription.inactive')
  @AdminProtected()
  @RequestParamGuard(SubscriptionRequestDto)
  @Patch('/update/inactive/:subscription')
  async inactive(@Param('subscription') id: string): Promise<IResponse> {
    const doc = await this._subscriptionService._checkSubscription(id);
    await this._subscriptionService.inactive(doc);
    return { data: doc?._id };
  }

  @SubscriptionActiveDoc()
  @ResponseSingle('subscription.active')
  @AdminProtected()
  @RequestParamGuard(SubscriptionRequestDto)
  @Patch('/update/active/:subscription')
  async active(@Param('subscription') id: string): Promise<IResponse> {
    const doc = await this._subscriptionService._checkSubscription(id);
    await this._subscriptionService.active(doc);
    return { data: doc?._id };
  }

  @SubscriptionDeleteDoc()
  @ResponseSingle('subscription.delete')
  @AdminProtected()
  @RequestParamGuard(SubscriptionRequestDto)
  @Delete('/delete/:subscription')
  async delete(@Param('subscription') id: string): Promise<IResponse> {
    const doc = await this._subscriptionService._checkSubscription(id);
    await this._subscriptionService.delete(doc);
    return { data: doc?._id };
  }
}
