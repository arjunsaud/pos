import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { IAuthPassword } from 'src/common/auth/interfaces/auth.interface';
import { AuthService } from 'src/common/auth/services/auth.service';
import { TenantService } from 'src/modules/tenant/services/tenant.service';
import { UserCreateDto } from 'src/modules/user/dtos/user.create.dto';
import { UserDoc } from 'src/modules/user/repository/entities/user.entity';
import { UserService } from 'src/modules/user/services/user.service';

@Injectable()
export class MigrateDefaultTenantAdmin {
  email = 'tenant@posnepal.com';
  password = 'Test@123';
  fullName = 'Tenant Admin';
  mobileNumber = '9800000001';
  tenantName = 'Demo Store';
  ownerName = 'Tenant Admin';

  constructor(
    private readonly userService: UserService,
    private readonly tenantService: TenantService,
    private readonly authService: AuthService,
  ) {}

  @Command({
    command: 'seed:user',
    describe: 'seeds default tenant and tenant admin',
  })
  async seeds(): Promise<void> {
    const password: IAuthPassword = await this.authService.createPassword(
      this.password,
    );

    const existingUser = await this.userService.findOne({
      email: this.email,
    });
    if (existingUser) {
      return;
    }

    const existingTenant = await this.tenantService.findOne({
      email: this.email,
    });
    const tenant =
      existingTenant ??
      (await this.tenantService.create({
        name: this.tenantName,
        email: this.email,
        phone: this.mobileNumber,
        plan: 'Basic',
        status: 'active',
        domain: 'demo.posnepal.com',
        ownerName: this.ownerName,
      }));

    await this.userService.create(
      {
        email: this.email,
        fullName: this.fullName,
        mobileNumber: this.mobileNumber,
        password: this.password,
        tenantId: String(tenant._id),
        tenantName: tenant.name,
      } as UserCreateDto,
      password,
    );
  }

  @Command({
    command: 'remove:user',
    describe: 'remove default tenant admin',
  })
  async remove(): Promise<void> {
    const existing: UserDoc = await this.userService.findOne({
      email: this.email,
    });
    if (!existing) {
      throw new Error('There is no default tenant admin');
    }
    await this.userService.delete(existing);

    const tenant = await this.tenantService.findOne({ email: this.email });
    if (tenant) {
      await this.tenantService.delete(tenant);
    }
  }
}
