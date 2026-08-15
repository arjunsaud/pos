import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';
import { MigrationMetaRepo } from '../meta/migration-meta.repository';

@Injectable()
export class AdminMigrationService {
  constructor(
    private readonly migrationMetaRepo: MigrationMetaRepo,
  ) { }

  migrationList: any[] = [];

  @Command({
    command: 'migration:admin',
    describe: 'migrate admin database',
  })
  async migration(): Promise<void> {
    try {
      const start = Date.now();
      let count = 0;
      const data = await this.migrationMetaRepo.findAll();
      const doneName: string[] = data.map((d) => d.name);
      for (const service of this.migrationList) {
        if (!doneName.includes(service?.name)) {
          console.log(`Running migration booking : ${service?.name}`);
          try {
            await service?.up();
          } catch (error) {
            break;
          }
          count += 1;
        }
      }
      if (count > 0) {
        console.log(
          `${count} migration ran successfully in ${Math.ceil(
            (Date.now() - start) / 1000,
          )} seconds.`,
        );
      } else {
        console.log('No pending migrations');
      }
    } catch (e) { }
    return;
  }

  @Command({
    command: 'revert:admin',
    describe: 'revert admin database',
  })
  async revert(): Promise<void> {
    try {
      const data = await this.migrationMetaRepo.findAll();
      const doneName: string[] = data.map((d) => d.name);
      for (const service of this.migrationList.reverse()) {
        if (doneName.includes(service.name)) {
          console.log(`Reverting migration : ${service.name}`);
          await service.down();
        }
      }
    } catch (e) { }
    return;
  }

  @Command({
    command: 'revert:admin:one',
    describe: 'revert admin database',
  })
  async revertOne(): Promise<void> {
    try {
      let data: any = await this.migrationMetaRepo.findOne(
        {},
        {
          order: {
            timestamp: ENUM_PAGINATION_ORDER_DIRECTION_TYPE.DESC,
          },
        },
      );
      data = [data];
      const doneName: string[] = data.map((d) => d?.name);
      for (const service of this.migrationList.reverse()) {
        if (doneName.includes(service.name)) {
          console.log(`Reverting migration : ${service.name}`);
          await service.down();
        }
      }
    } catch (e) { }
    return;
  }
}
