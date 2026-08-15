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
  ACTIVITY_LOG_DEFAULT_AVAILABLE_ORDER_BY,
  ACTIVITY_LOG_DEFAULT_AVAILABLE_SEARCH,
  ACTIVITY_LOG_DEFAULT_ORDER_BY,
  ACTIVITY_LOG_DEFAULT_ORDER_DIRECTION,
  ACTIVITY_LOG_DEFAULT_PER_PAGE,
} from '../constants/activity-log.list.constant';
import {
  ActivityLogActiveDoc,
  ActivityLogCreateDoc,
  ActivityLogDeleteDoc,
  ActivityLogGetDoc,
  ActivityLogInactiveDoc,
  ActivityLogListDoc,
  ActivityLogUpdateDoc,
} from '../docs/activity-log.doc';
import { ActivityLogCreateDto } from '../dtos/activity-log.create.dto';
import { ActivityLogRequestDto } from '../dtos/activity-log.request.dto';
import { ActivityLogUpdateDto } from '../dtos/activity-log.update.dto';
import { IActivityLogEntity } from '../interfaces/activity-log.entity.interface';
import { ActivityLogDoc } from '../repository/entities/activity-log.entity';
import { ActivityLogGetSerialization } from '../serializations/activity-log.get.serialization';
import { ActivityLogListSerialization } from '../serializations/activity-log.list.serialization';
import { ActivityLogService } from '../services/activity-log.service';

@ApiTags('ActivityLog')
@Controller({ version: '1', path: '/activity-log' })
export class AdminActivityLogController {
  constructor(
    private readonly _activityLogService: ActivityLogService,
    private readonly paginationService: PaginationService,
  ) {}

  @ActivityLogListDoc()
  @ResponsePaging('activityLog.list', {
    serialization: ActivityLogListSerialization,
  })
  @AdminProtected()
  @Get('/list')
  async list(
    @PaginationQuery(
      ACTIVITY_LOG_DEFAULT_PER_PAGE,
      ACTIVITY_LOG_DEFAULT_ORDER_BY,
      ACTIVITY_LOG_DEFAULT_ORDER_DIRECTION,
      ACTIVITY_LOG_DEFAULT_AVAILABLE_SEARCH,
      ACTIVITY_LOG_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
    @Query('tenantId') tenantId?: string,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = {
      ..._search,
      ...(tenantId ? { tenantId } : {}),
    };

    const docs: IActivityLogEntity[] = await this._activityLogService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });
    const total: number = await this._activityLogService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: docs,
    };
  }

  @ActivityLogGetDoc()
  @ResponseSingle('activityLog.get', {
    serialization: ActivityLogGetSerialization,
  })
  @AdminProtected()
  @RequestParamGuard(ActivityLogRequestDto)
  @Get('/get/:activityLog')
  async get(@Param('activityLog') id: string): Promise<IResponse> {
    const doc = await this._activityLogService._checkActivityLog(id);
    return { data: doc };
  }

  @ActivityLogCreateDoc()
  @ResponseSingle('activityLog.create', {
    serialization: ResponseIdSerialization,
  })
  @Post('/create')
  @AdminProtected()
  async create(
    @Body()
    body: ActivityLogCreateDto,
  ): Promise<IResponse> {
    const data = { ...body };
    const doc: ActivityLogDoc = await this._activityLogService.create(data);
    return {
      data: doc?._id,
    };
  }

  @ActivityLogUpdateDoc()
  @ResponseSingle('activityLog.update', {
    serialization: ResponseIdSerialization,
  })
  @AdminProtected()
  @RequestParamGuard(ActivityLogRequestDto)
  @Patch('/update/:activityLog')
  async update(
    @Param('activityLog') id: string,
    @Body()
    body: ActivityLogUpdateDto,
  ): Promise<IResponse> {
    const doc = await this._activityLogService._checkActivityLog(id);
    await this._activityLogService.update(doc, body);
    return {
      data: doc?._id,
    };
  }

  @ActivityLogInactiveDoc()
  @ResponseSingle('activityLog.inactive')
  @AdminProtected()
  @RequestParamGuard(ActivityLogRequestDto)
  @Patch('/update/inactive/:activityLog')
  async inactive(@Param('activityLog') id: string): Promise<IResponse> {
    const doc = await this._activityLogService._checkActivityLog(id);
    await this._activityLogService.inactive(doc);
    return { data: doc?._id };
  }

  @ActivityLogActiveDoc()
  @ResponseSingle('activityLog.active')
  @AdminProtected()
  @RequestParamGuard(ActivityLogRequestDto)
  @Patch('/update/active/:activityLog')
  async active(@Param('activityLog') id: string): Promise<IResponse> {
    const doc = await this._activityLogService._checkActivityLog(id);
    await this._activityLogService.active(doc);
    return { data: doc?._id };
  }

  @ActivityLogDeleteDoc()
  @ResponseSingle('activityLog.delete')
  @AdminProtected()
  @RequestParamGuard(ActivityLogRequestDto)
  @Delete('/delete/:activityLog')
  async delete(@Param('activityLog') id: string): Promise<IResponse> {
    const doc = await this._activityLogService._checkActivityLog(id);
    await this._activityLogService.delete(doc);
    return { data: doc?._id };
  }
}
