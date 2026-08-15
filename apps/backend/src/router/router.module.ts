import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { RouterModule as NestJsRouterModule } from '@nestjs/core';
import { RoutesAdminModule } from './routes/routes.admin.module';
import { RoutesUserModule } from './routes/routes.user.module';

@Module({})
export class RouterModule {
  static forRoot(): DynamicModule {
    const imports: (
      | DynamicModule
      | Type<any>
      | Promise<DynamicModule>
      | ForwardReference<any>
    )[] = [];

    if (process.env.HTTP_ENABLE) {
      imports.push(
        RoutesUserModule,
        RoutesAdminModule,
        NestJsRouterModule.register([
          {
            path: '/admin',
            module: RoutesAdminModule, // superadmin table (`admins`) + login
          },
          {
            path: '/user',
            module: RoutesUserModule, // tenant admin + staff (`users` + tenantId)
          },
        ]),
      );
    }

    return {
      module: RouterModule,
      providers: [],
      exports: [],
      controllers: [],
      imports,
    };
  }
}
