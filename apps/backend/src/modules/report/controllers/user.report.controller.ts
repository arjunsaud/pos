import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseSingle } from 'src/common/response/decorators/response.decorator';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import {
  GetUser,
  UserProtected,
} from 'src/modules/user/decorators/user.decorator';
import { UserDoc } from 'src/modules/user/repository/entities/user.entity';
import { ReportService } from '../services/report.service';

@ApiTags('Report')
@Controller({ version: '1', path: '/report' })
export class UserReportController {
  constructor(private readonly reportService: ReportService) {}

  @ResponseSingle('report.sales')
  @UserProtected()
  @Get('/sales')
  async sales(@GetUser() user: UserDoc): Promise<IResponse> {
    return { data: await this.reportService.getSales(String(user.tenantId || '')) };
  }

  @ResponseSingle('report.inventory')
  @UserProtected()
  @Get('/inventory')
  async inventory(@GetUser() user: UserDoc): Promise<IResponse> {
    return { data: await this.reportService.getInventory(String(user.tenantId || '')) };
  }

  @ResponseSingle('report.vat')
  @UserProtected()
  @Get('/vat')
  async vat(@GetUser() user: UserDoc): Promise<IResponse> {
    return { data: await this.reportService.getVat(String(user.tenantId || '')) };
  }

  @ResponseSingle('report.profitLoss')
  @UserProtected()
  @Get('/profit-loss')
  async profitLoss(@GetUser() user: UserDoc): Promise<IResponse> {
    return { data: await this.reportService.getProfitLoss(String(user.tenantId || '')) };
  }
}
