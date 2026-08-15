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
  INVENTORY_DEFAULT_AVAILABLE_ORDER_BY,
  INVENTORY_DEFAULT_AVAILABLE_SEARCH,
  INVENTORY_DEFAULT_ORDER_BY,
  INVENTORY_DEFAULT_ORDER_DIRECTION,
  INVENTORY_DEFAULT_PER_PAGE,
} from '../constants/inventory.list.constant';
import {
  InventoryActiveDoc,
  InventoryCreateDoc,
  InventoryDeleteDoc,
  InventoryGetDoc,
  InventoryInactiveDoc,
  InventoryListDoc,
  InventoryUpdateDoc,
} from '../docs/inventory.doc';
import { InventoryCreateDto } from '../dtos/inventory.create.dto';
import { InventoryRequestDto } from '../dtos/inventory.request.dto';
import { InventoryUpdateDto } from '../dtos/inventory.update.dto';
import { IInventoryEntity } from '../interfaces/inventory.entity.interface';
import { InventoryDoc } from '../repository/entities/inventory.entity';
import { InventoryGetSerialization } from '../serializations/inventory.get.serialization';
import { InventoryListSerialization } from '../serializations/inventory.list.serialization';
import { InventoryService } from '../services/inventory.service';

@ApiTags('Inventory')
@Controller({ version: '1', path: '/inventory' })
export class AdminInventoryController {
  constructor(
    private readonly _inventoryService: InventoryService,
    private readonly paginationService: PaginationService,
  ) {}

  @InventoryListDoc()
  @ResponsePaging('inventory.list', {
    serialization: InventoryListSerialization,
  })
  @AdminProtected()
  @Get('/list')
  async list(
    @PaginationQuery(
      INVENTORY_DEFAULT_PER_PAGE,
      INVENTORY_DEFAULT_ORDER_BY,
      INVENTORY_DEFAULT_ORDER_DIRECTION,
      INVENTORY_DEFAULT_AVAILABLE_SEARCH,
      INVENTORY_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
    @Query('tenantId') tenantId?: string,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = {
      ..._search,
      ...(tenantId ? { tenantId } : {}),
    };

    const docs: IInventoryEntity[] = await this._inventoryService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });
    const total: number = await this._inventoryService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: docs,
    };
  }

  @InventoryGetDoc()
  @ResponseSingle('inventory.get', {
    serialization: InventoryGetSerialization,
  })
  @AdminProtected()
  @RequestParamGuard(InventoryRequestDto)
  @Get('/get/:inventory')
  async get(@Param('inventory') id: string): Promise<IResponse> {
    const doc = await this._inventoryService._checkInventory(id);
    return { data: doc };
  }

  @InventoryCreateDoc()
  @ResponseSingle('inventory.create', {
    serialization: ResponseIdSerialization,
  })
  @Post('/create')
  @AdminProtected()
  async create(
    @Body()
    body: InventoryCreateDto,
  ): Promise<IResponse> {
    const data = { ...body };
    const doc: InventoryDoc = await this._inventoryService.create(data);
    return {
      data: doc?._id,
    };
  }

  @InventoryUpdateDoc()
  @ResponseSingle('inventory.update', {
    serialization: ResponseIdSerialization,
  })
  @AdminProtected()
  @RequestParamGuard(InventoryRequestDto)
  @Patch('/update/:inventory')
  async update(
    @Param('inventory') id: string,
    @Body()
    body: InventoryUpdateDto,
  ): Promise<IResponse> {
    const doc = await this._inventoryService._checkInventory(id);
    await this._inventoryService.update(doc, body);
    return {
      data: doc?._id,
    };
  }

  @InventoryInactiveDoc()
  @ResponseSingle('inventory.inactive')
  @AdminProtected()
  @RequestParamGuard(InventoryRequestDto)
  @Patch('/update/inactive/:inventory')
  async inactive(@Param('inventory') id: string): Promise<IResponse> {
    const doc = await this._inventoryService._checkInventory(id);
    await this._inventoryService.inactive(doc);
    return { data: doc?._id };
  }

  @InventoryActiveDoc()
  @ResponseSingle('inventory.active')
  @AdminProtected()
  @RequestParamGuard(InventoryRequestDto)
  @Patch('/update/active/:inventory')
  async active(@Param('inventory') id: string): Promise<IResponse> {
    const doc = await this._inventoryService._checkInventory(id);
    await this._inventoryService.active(doc);
    return { data: doc?._id };
  }

  @InventoryDeleteDoc()
  @ResponseSingle('inventory.delete')
  @AdminProtected()
  @RequestParamGuard(InventoryRequestDto)
  @Delete('/delete/:inventory')
  async delete(@Param('inventory') id: string): Promise<IResponse> {
    const doc = await this._inventoryService._checkInventory(id);
    await this._inventoryService.delete(doc);
    return { data: doc?._id };
  }
}
