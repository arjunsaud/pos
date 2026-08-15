import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ENUM_APP_ENVIRONMENT } from 'src/app/constants/app.enum.constant';
import { IDatabaseOptionsService } from 'src/common/database/interfaces/database.options-service.interface';

@Injectable()
export class DatabaseOptionsService implements IDatabaseOptionsService {
  constructor(private readonly configService: ConfigService) {}

  createOptions(): MongooseModuleOptions {
    const env = this.configService.get<string>('app.env');
    const host = this.configService.get<string>('database.host');
    const database = this.configService.get<string>('database.name');
    const debug = this.configService.get<boolean>('database.debug');

    const timeoutOptions = this.configService.get<Record<string, number>>(
      'database.timeoutOptions',
    );

    let uri = `${host}`;

    if (database && !uri.includes(`/${database}`)) {
      const hasQuery = uri.includes('?');
      if (hasQuery) {
        uri = uri.replace('?', `/${database}?`);
      } else {
        uri = `${uri}/${database}`;
      }
    }

    const extraOptions = this.configService.get<string>('database.options');
    if (extraOptions && !uri.includes('mongodb+srv://')) {
      uri = `${uri}${uri.includes('?') ? '&' : '?'}${extraOptions}`;
    }

    if (env !== ENUM_APP_ENVIRONMENT.PRODUCTION) {
      mongoose.set('debug', debug);
    }

    const mongooseOptions: MongooseModuleOptions = {
      uri,
      autoCreate: true,
      ...timeoutOptions,
    };

    return mongooseOptions;
  }
}
