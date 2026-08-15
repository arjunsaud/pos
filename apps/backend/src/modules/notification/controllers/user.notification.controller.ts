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
import { GetUser, UserProtected } from 'src/modules/user/decorators/user.decorator';
import { UserDoc } from 'src/modules/user/repository/entities/user.entity';
import {
  NOTIFICATION_DEFAULT_AVAILABLE_ORDER_BY,
  NOTIFICATION_DEFAULT_AVAILABLE_SEARCH,
  NOTIFICATION_DEFAULT_ORDER_BY,
  NOTIFICATION_DEFAULT_ORDER_DIRECTION,
  NOTIFICATION_DEFAULT_PER_PAGE,
} from '../constants/notification.list.constant';
import {
  NotificationActiveDoc,
  NotificationCreateDoc,
  NotificationDeleteDoc,
  NotificationGetDoc,
  NotificationInactiveDoc,
  NotificationListDoc,
  NotificationUpdateDoc,
} from '../docs/notification.doc';
import { NotificationCreateDto } from '../dtos/notification.create.dto';
import { NotificationRequestDto } from '../dtos/notification.request.dto';
import { NotificationUpdateDto } from '../dtos/notification.update.dto';
import { INotificationEntity } from '../interfaces/notification.entity.interface';
import { NotificationDoc } from '../repository/entities/notification.entity';
import { NotificationGetSerialization } from '../serializations/notification.get.serialization';
import { NotificationListSerialization } from '../serializations/notification.list.serialization';
import { NotificationService } from '../services/notification.service';

@ApiTags('Notification')
@Controller({ version: '1', path: '/notification' })
export class UserNotificationController {
  constructor(
    private readonly _notificationService: NotificationService,
    private readonly paginationService: PaginationService,
  ) {}

  @NotificationListDoc()
  @ResponsePaging('notification.list', {
    serialization: NotificationListSerialization,
  })
  @UserProtected()
  @Get('/list')
  async list(
    @GetUser() user: UserDoc,
    @PaginationQuery(
      NOTIFICATION_DEFAULT_PER_PAGE,
      NOTIFICATION_DEFAULT_ORDER_BY,
      NOTIFICATION_DEFAULT_ORDER_DIRECTION,
      NOTIFICATION_DEFAULT_AVAILABLE_SEARCH,
      NOTIFICATION_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = {
      ..._search,
      ...(user?.tenantId ? { tenantId: String(user.tenantId) } : {}),
    };

    const docs: INotificationEntity[] = await this._notificationService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });
    const total: number = await this._notificationService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: docs,
    };
  }

  @NotificationGetDoc()
  @ResponseSingle('notification.get', {
    serialization: NotificationGetSerialization,
  })
  @UserProtected()
  @RequestParamGuard(NotificationRequestDto)
  @Get('/get/:notification')
  async get(@Param('notification') id: string): Promise<IResponse> {
    const doc = await this._notificationService._checkNotification(id);
    return { data: doc };
  }

  @NotificationCreateDoc()
  @ResponseSingle('notification.create', {
    serialization: ResponseIdSerialization,
  })
  @Post('/create')
  @UserProtected()
  async create(
    @GetUser() user: UserDoc,
    @Body()
    body: NotificationCreateDto,
  ): Promise<IResponse> {
    const data = {
        ...body,
        tenantId: (body as any).tenantId || String(user?.tenantId || ''),
      };
    const doc: NotificationDoc = await this._notificationService.create(data);
    return {
      data: doc?._id,
    };
  }

  @NotificationUpdateDoc()
  @ResponseSingle('notification.update', {
    serialization: ResponseIdSerialization,
  })
  @UserProtected()
  @RequestParamGuard(NotificationRequestDto)
  @Patch('/update/:notification')
  async update(
    @Param('notification') id: string,
    @Body()
    body: NotificationUpdateDto,
  ): Promise<IResponse> {
    const doc = await this._notificationService._checkNotification(id);
    await this._notificationService.update(doc, body);
    return {
      data: doc?._id,
    };
  }

  @NotificationInactiveDoc()
  @ResponseSingle('notification.inactive')
  @UserProtected()
  @RequestParamGuard(NotificationRequestDto)
  @Patch('/update/inactive/:notification')
  async inactive(@Param('notification') id: string): Promise<IResponse> {
    const doc = await this._notificationService._checkNotification(id);
    await this._notificationService.inactive(doc);
    return { data: doc?._id };
  }

  @NotificationActiveDoc()
  @ResponseSingle('notification.active')
  @UserProtected()
  @RequestParamGuard(NotificationRequestDto)
  @Patch('/update/active/:notification')
  async active(@Param('notification') id: string): Promise<IResponse> {
    const doc = await this._notificationService._checkNotification(id);
    await this._notificationService.active(doc);
    return { data: doc?._id };
  }

  @NotificationDeleteDoc()
  @ResponseSingle('notification.delete')
  @UserProtected()
  @RequestParamGuard(NotificationRequestDto)
  @Delete('/delete/:notification')
  async delete(@Param('notification') id: string): Promise<IResponse> {
    const doc = await this._notificationService._checkNotification(id);
    await this._notificationService.delete(doc);
    return { data: doc?._id };
  }
}
