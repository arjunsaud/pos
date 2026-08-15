import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseSingle } from 'src/common/response/decorators/response.decorator';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { AdminProtected } from 'src/modules/admin/decorators/admin.user.decorator';
import { DashboardGetDoc } from '../docs/dashboard.doc';
import { DashboardService } from '../services/dashboard.service';

@ApiTags('Dashboard')
@Controller({ version: '1', path: '/dashboard' })
export class AdminDashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @DashboardGetDoc()
  @ResponseSingle('dashboard.get')
  @AdminProtected()
  @Get('/total')
  async get(): Promise<IResponse> {
    const data = await this.dashboardService.getSuperAdminStats();
    return { data };
  }
}
