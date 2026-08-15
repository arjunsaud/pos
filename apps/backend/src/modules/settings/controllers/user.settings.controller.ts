import { Controller, Get, NotFoundException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseSingle } from 'src/common/response/decorators/response.decorator';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { SettingsService } from '../services/settings.service';

import { SettingsUserGetDoc } from '../docs/settings.user.doc';
import { ISettingsDoc } from '../interfaces/settings.interface';

@ApiTags('Settings')
@Controller({ version: '1', path: '/settings' })
export class UserSettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @SettingsUserGetDoc()
  @ResponseSingle('settings.get')
  @Get('')
  async get(): Promise<IResponse> {
    try {
      const settingsDocs: ISettingsDoc = await this.settingsService.findOne({});
      if (!settingsDocs) {
        throw new NotFoundException({
          message: 'settings.error.notFound',
        });
      }
      return { data: settingsDocs };
    } catch (error) {
      throw error;
    }
  }
}
