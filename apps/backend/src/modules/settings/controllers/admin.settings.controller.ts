import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseSingle } from 'src/common/response/decorators/response.decorator';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';

import { AdminProtected } from 'src/modules/admin/decorators/admin.user.decorator';
import {
  SettingsGetDoc,
  SettingsUpdateDoc,
  SettingsUpdateMaintenanceModeDoc,
  SettingsUpdatePagesDoc,
} from '../docs/settings.doc';

import { UpdateSettingsDto } from '../dto/update-settings.dto';
import {
  UpdateMaintenanceModeDto,
  UpdatePagesDto,
} from '../dto/update-settings-extra.dto';
import { ISettingsDoc } from '../interfaces/settings.interface';
import { SettingsService } from '../services/settings.service';

@ApiTags('Settings')
@Controller({ version: '1', path: '/settings' })
export class AdminSettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // ─── Single GET — returns all settings ───────────────────────────────────

  @SettingsGetDoc()
  @ResponseSingle('settings.get')
  @AdminProtected()
  @Get('')
  async get(): Promise<IResponse> {
    try {
      const settingsDocs: ISettingsDoc = await this.settingsService.findOne({});
      if (!settingsDocs) {
        throw new NotFoundException({ message: 'settings.error.notFound' });
      }
      return { data: settingsDocs };
    } catch (error) {
      throw error;
    }
  }

  // ─── Update core payment settings ────────────────────────────────────────

  @SettingsUpdateDoc()
  @ResponseSingle('settings.update', {
    serialization: ResponseIdSerialization,
  })
  @AdminProtected()
  @Patch('/update')
  async update(@Body() body: UpdateSettingsDto): Promise<IResponse> {
    try {
      const settingsDocs: ISettingsDoc = await this.settingsService.findOne({});
      if (!settingsDocs) {
        throw new NotFoundException({ message: 'settings.error.notFound' });
      }
      await this.settingsService.update(settingsDocs, body);
      return { data: settingsDocs?._id };
    } catch (error) {
      throw error;
    }
  }

  // ─── Maintenance Mode ─────────────────────────────────────────────────────

  @SettingsUpdateMaintenanceModeDoc()
  @ResponseSingle('settings.maintenanceMode.update', {
    serialization: ResponseIdSerialization,
  })
  @AdminProtected()
  @Patch('/maintenance-mode')
  async updateMaintenanceMode(
    @Body() body: UpdateMaintenanceModeDto,
  ): Promise<IResponse> {
    try {
      const settingsDocs: ISettingsDoc = await this.settingsService.findOne({});
      if (!settingsDocs) {
        throw new NotFoundException({ message: 'settings.error.notFound' });
      }
      await this.settingsService.updateMaintenanceMode(settingsDocs, body);
      return { data: settingsDocs?._id };
    } catch (error) {
      throw error;
    }
  }

  // ─── Pages ────────────────────────────────────────────────────────────────

  @SettingsUpdatePagesDoc()
  @ResponseSingle('settings.pages.update', {
    serialization: ResponseIdSerialization,
  })
  @AdminProtected()
  @Patch('/pages')
  async updatePages(
    @Body() body: UpdatePagesDto,
  ): Promise<IResponse> {
    try {
      const settingsDocs: ISettingsDoc = await this.settingsService.findOne({});
      if (!settingsDocs) {
        throw new NotFoundException({ message: 'settings.error.notFound' });
      }
      await this.settingsService.updatePages(settingsDocs, body);
      return { data: settingsDocs?._id };
    } catch (error) {
      throw error;
    }
  }
}
