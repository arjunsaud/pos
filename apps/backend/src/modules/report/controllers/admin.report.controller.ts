import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseSingle } from 'src/common/response/decorators/response.decorator';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { AdminProtected } from 'src/modules/admin/decorators/admin.user.decorator';
import { ReportService } from '../services/report.service';

@ApiTags('Report')
@Controller({ version: '1', path: '/report' })
export class AdminReportController {
  constructor(private readonly reportService: ReportService) {}

  @ResponseSingle('report.sales')
  @AdminProtected()
  @Get('/sales')
  async sales(@Query('tenantId') tenantId?: string): Promise<IResponse> {
    return { data: await this.reportService.getSales(tenantId) };
  }

  @ResponseSingle('report.inventory')
  @AdminProtected()
  @Get('/inventory')
  async inventory(@Query('tenantId') tenantId?: string): Promise<IResponse> {
    return { data: await this.reportService.getInventory(tenantId) };
  }

  @ResponseSingle('report.vat')
  @AdminProtected()
  @Get('/vat')
  async vat(@Query('tenantId') tenantId?: string): Promise<IResponse> {
    return { data: await this.reportService.getVat(tenantId) };
  }

  @ResponseSingle('report.profitLoss')
  @AdminProtected()
  @Get('/profit-loss')
  async profitLoss(@Query('tenantId') tenantId?: string): Promise<IResponse> {
    return { data: await this.reportService.getProfitLoss(tenantId) };
  }
}
