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
  CONTRACT_DEFAULT_AVAILABLE_ORDER_BY,
  CONTRACT_DEFAULT_AVAILABLE_SEARCH,
  CONTRACT_DEFAULT_ORDER_BY,
  CONTRACT_DEFAULT_ORDER_DIRECTION,
  CONTRACT_DEFAULT_PER_PAGE,
} from '../constants/contract.list.constant';
import {
  ContractActiveDoc,
  ContractCreateDoc,
  ContractDeleteDoc,
  ContractGetDoc,
  ContractInactiveDoc,
  ContractListDoc,
  ContractUpdateDoc,
} from '../docs/contract.doc';
import { ContractCreateDto } from '../dtos/contract.create.dto';
import { ContractRequestDto } from '../dtos/contract.request.dto';
import { ContractUpdateDto } from '../dtos/contract.update.dto';
import { IContractEntity } from '../interfaces/contract.entity.interface';
import { ContractDoc } from '../repository/entities/contract.entity';
import { ContractGetSerialization } from '../serializations/contract.get.serialization';
import { ContractListSerialization } from '../serializations/contract.list.serialization';
import { ContractService } from '../services/contract.service';

@ApiTags('Contract')
@Controller({ version: '1', path: '/contract' })
export class AdminContractController {
  constructor(
    private readonly _contractService: ContractService,
    private readonly paginationService: PaginationService,
  ) {}

  @ContractListDoc()
  @ResponsePaging('contract.list', {
    serialization: ContractListSerialization,
  })
  @AdminProtected()
  @Get('/list')
  async list(
    @PaginationQuery(
      CONTRACT_DEFAULT_PER_PAGE,
      CONTRACT_DEFAULT_ORDER_BY,
      CONTRACT_DEFAULT_ORDER_DIRECTION,
      CONTRACT_DEFAULT_AVAILABLE_SEARCH,
      CONTRACT_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = { ..._search };

    const docs: IContractEntity[] = await this._contractService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });
    const total: number = await this._contractService.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {
      _pagination: { total, totalPage },
      data: docs,
    };
  }

  @ContractGetDoc()
  @ResponseSingle('contract.get', {
    serialization: ContractGetSerialization,
  })
  @AdminProtected()
  @RequestParamGuard(ContractRequestDto)
  @Get('/get/:contract')
  async get(@Param('contract') id: string): Promise<IResponse> {
    const doc = await this._contractService._checkContract(id);
    return { data: doc };
  }

  @ContractCreateDoc()
  @ResponseSingle('contract.create', {
    serialization: ResponseIdSerialization,
  })
  @Post('/create')
  @AdminProtected()
  async create(
    @Body()
    body: ContractCreateDto,
  ): Promise<IResponse> {
    const data = { ...body };
    const doc: ContractDoc = await this._contractService.create(data);
    return {
      data: doc?._id,
    };
  }

  @ContractUpdateDoc()
  @ResponseSingle('contract.update', {
    serialization: ResponseIdSerialization,
  })
  @AdminProtected()
  @RequestParamGuard(ContractRequestDto)
  @Patch('/update/:contract')
  async update(
    @Param('contract') id: string,
    @Body()
    body: ContractUpdateDto,
  ): Promise<IResponse> {
    const doc = await this._contractService._checkContract(id);
    await this._contractService.update(doc, body);
    return {
      data: doc?._id,
    };
  }

  @ContractInactiveDoc()
  @ResponseSingle('contract.inactive')
  @AdminProtected()
  @RequestParamGuard(ContractRequestDto)
  @Patch('/update/inactive/:contract')
  async inactive(@Param('contract') id: string): Promise<IResponse> {
    const doc = await this._contractService._checkContract(id);
    await this._contractService.inactive(doc);
    return { data: doc?._id };
  }

  @ContractActiveDoc()
  @ResponseSingle('contract.active')
  @AdminProtected()
  @RequestParamGuard(ContractRequestDto)
  @Patch('/update/active/:contract')
  async active(@Param('contract') id: string): Promise<IResponse> {
    const doc = await this._contractService._checkContract(id);
    await this._contractService.active(doc);
    return { data: doc?._id };
  }

  @ContractDeleteDoc()
  @ResponseSingle('contract.delete')
  @AdminProtected()
  @RequestParamGuard(ContractRequestDto)
  @Delete('/delete/:contract')
  async delete(@Param('contract') id: string): Promise<IResponse> {
    const doc = await this._contractService._checkContract(id);
    await this._contractService.delete(doc);
    return { data: doc?._id };
  }
}
