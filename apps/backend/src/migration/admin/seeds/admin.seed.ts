import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { IAuthPassword } from 'src/common/auth/interfaces/auth.interface';
import { AuthService } from 'src/common/auth/services/auth.service';
import { USER_STATUS } from 'src/common/enum/user.status.enum';
import { AdminDoc } from 'src/modules/admin/repository/entities/admin.entity';
import { AdminService } from 'src/modules/admin/services/admin.service';

@Injectable()
export class MigrateDefaultAdmin {
  email: string = 'admin@posnepal.com';
  password: string = 'Test@123';
  fullName: string = 'Super Admin';
  mobileNumber: string = '9800000000';
  constructor(
    private readonly _adminService: AdminService,
    private readonly authService: AuthService,
  ) {}

  @Command({
    command: 'seed:admin',
    describe: 'seeds default admin',
  })
  async seeds(): Promise<void> {
    try {
      const password: IAuthPassword = await this.authService.createPassword(
        this.password,
      );

      const existingAdmin = await this._adminService.findOne({
        email: this.email,
      });

      if (existingAdmin) {
        return;
      }
      await this._adminService.seedAdmin(
        {
          email: this.email,
          fullName: this.fullName,
          mobileNumber: this.mobileNumber,
          password: this.password,
          role: USER_STATUS.ADMIN,
        },
        password,
      );
    } catch (err: any) {
      throw new Error(err.message);
    }
    return;
  }

  @Command({
    command: 'remove:admin',
    describe: 'remove default admin',
  })
  async remove(): Promise<void> {
    try {
      const existingDefaultAdmin: AdminDoc = await this._adminService.findOne({
        email: this.email,
      });
      if (!existingDefaultAdmin) {
        throw new Error('There is no default admin');
      }
      await this._adminService.delete(existingDefaultAdmin);
    } catch (err: any) {
      throw err;
    }
    return;
  }
}
