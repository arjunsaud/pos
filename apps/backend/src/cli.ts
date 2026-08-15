import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { CommandModule, CommandService } from 'nestjs-command';
import { AdminMigrationModule } from './migration/admin/admin.migration.module';
import { UserMigrationModule } from './migration/user/user.migration.module';

function resolveMigrationTarget(): string {
  const cmd = process.argv.find((arg) =>
    /^(seed|remove|migration|revert):/.test(arg),
  );
  if (cmd?.includes('user')) {
    return 'user';
  }
  if (cmd?.includes('admin')) {
    return 'admin';
  }
  return (process.env.MIGRATION || 'admin').toString().trim();
}

async function bootstrap() {
  try {
    let module: any;
    const service = resolveMigrationTarget();
    switch (service) {
      case 'admin': {
        module = AdminMigrationModule;
        break;
      }
      case 'user': {
        module = UserMigrationModule;
        break;
      }
      default: {
        console.error(`Invalid service: ${service}`);
        process.exit(1);
      }
    }
    const app = await NestFactory.createApplicationContext(module, {
      logger: ['error'],
    });

    const logger = new Logger();

    try {
      await app.select(CommandModule).get(CommandService).exec();
      process.exit(0);
    } catch (err: unknown) {
      logger.error(err, 'Migration');
      process.exit(1);
    }
  } catch (err: unknown) {
    console.error(err);
    process.exit(1);
  }
}

bootstrap();
