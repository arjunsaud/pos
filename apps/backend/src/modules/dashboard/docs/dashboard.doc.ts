import { applyDecorators } from '@nestjs/common';

import {
  Doc,
  DocAuth,
  DocGuard,
  DocResponse,
} from 'src/common/doc/decorators/doc.decorator';
import { DashboardGetSerialization } from '../serializations/dashboard.get.serialization';

export function DashboardGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get detail',
    }),

    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<DashboardGetSerialization>('dashboard.get', {
      serialization: DashboardGetSerialization,
    }),
  );
}

export function DashboardAnalyticsDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get analytics',
    }),

    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<DashboardGetSerialization>('dashboard.analytics', {
      serialization: DashboardGetSerialization,
    }),
  );
}
