import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ENUM_APP_ENVIRONMENT } from 'src/app/constants/app.enum.constant';

import { NestExpressApplication } from '@nestjs/platform-express';
import { RoutesAdminModule } from './router/routes/routes.admin.module';
import { RoutesUserModule } from './router/routes/routes.user.module';

export default async function (app: NestExpressApplication) {
  const configService = app.get(ConfigService);
  const env: string = configService.get<string>('app.env', 'local');
  const logger = new Logger();

  const docName: string = configService.get<string>('doc.name', '');
  const docDesc: string = configService.get<string>('doc.description', '');
  const docVersion: string = configService.get<string>('doc.version', '');
  const docPrefix: string = configService.get<string>('doc.prefix', '');

  if (env !== ENUM_APP_ENVIRONMENT.PRODUCTION) {
    const documentBuild = new DocumentBuilder()
      .setTitle(docName)
      .setDescription(docDesc)
      .setVersion(docVersion)
      .addServer('/')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'accessToken',
      )
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'refreshToken',
      )
      .build();

    // const document =
    SwaggerModule.createDocument(app, documentBuild, {
      deepScanRoutes: true,
    });

    const adminDocumentBuild = new DocumentBuilder()
      .setTitle('Admin')
      .setDescription('APIs for Admin')
      .setVersion('1')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'accessToken',
      )
      .build();

    const adminDocument = SwaggerModule.createDocument(
      app,
      adminDocumentBuild,
      {
        deepScanRoutes: true,
        include: [RoutesAdminModule],
      },
    );

    SwaggerModule.setup('admin', app, adminDocument, {
      explorer: true,
      customSiteTitle: 'Admin',
      swaggerOptions: {
        docExpansion: 'none',
        filter: true,
        showRequestDuration: true,
        persistAuthorization: true,
      },
    });

    const userDocumentBuild = new DocumentBuilder()
      .setTitle('User')
      .setDescription('APIs for user')
      .setVersion('1')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'accessToken',
      )
      .build();

    const userDocument = SwaggerModule.createDocument(app, userDocumentBuild, {
      deepScanRoutes: true,
      include: [RoutesUserModule],
    });

    SwaggerModule.setup('user', app, userDocument, {
      explorer: true,
      customSiteTitle: 'User',
      swaggerOptions: {
        docExpansion: 'none',
        filter: true,
        showRequestDuration: true,
        persistAuthorization: true,
      },
    });

    logger.log(`==========================================================`);

    logger.log(`Docs will serve on ${docPrefix}`, 'NestApplication');

    logger.log(`==========================================================`);
  }
}
