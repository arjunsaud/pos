import { Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';
import { join } from 'path';
import { AppModule } from 'src/app/app.module';
import { AppInstanceProvider } from './common/instance/app.instance';
import swaggerInit from './swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  AppInstanceProvider.setAppInstance(app); // Set app instance

  app.setViewEngine('hbs');
  app.setBaseViewsDir(join(__dirname, 'views'));

  const configService = app.get(ConfigService);
  const env: string = configService.get<string>('app.env');
  const host: string = configService.get<string>('app.http.host');
  const port: number = configService.get<number>('app.http.port');
  const globalPrefix: string = configService.get<string>('app.globalPrefix');

  app.enableCors({
    origin: '*',
  });

  const httpEnable: boolean = configService.get<boolean>('app.http.enable');

  const logger = new Logger();
  process.env.NODE_ENV = env;

  app.setGlobalPrefix(globalPrefix);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableVersioning({
    type: VersioningType.URI,
  });

  await swaggerInit(app);
  await app.listen(port, host);

  logger.log(
    `Http is ${httpEnable}, ${
      httpEnable ? 'routes registered' : 'no routes registered'
    }`,
    'NestApplication',
  );
  logger.log(`Http Server running on ${await app.getUrl()}`, 'NestApplication');
}
bootstrap();
