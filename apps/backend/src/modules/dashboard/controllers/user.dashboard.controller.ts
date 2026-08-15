import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseSingle } from 'src/common/response/decorators/response.decorator';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import {
  GetUser,
  UserProtected,
} from 'src/modules/user/decorators/user.decorator';
import { UserDoc } from 'src/modules/user/repository/entities/user.entity';
import { DashboardGetDoc } from '../docs/dashboard.doc';
import { DashboardService } from '../services/dashboard.service';

@ApiTags('Dashboard')
@Controller({ version: '1', path: '/dashboard' })
export class UserDashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @DashboardGetDoc()
  @ResponseSingle('dashboard.get')
  @UserProtected()
  @Get('/total')
  async get(@GetUser() user: UserDoc): Promise<IResponse> {
    const data = await this.dashboardService.getTenantStats(
      String(user.tenantId || ''),
    );
    return { data };
  }
}
