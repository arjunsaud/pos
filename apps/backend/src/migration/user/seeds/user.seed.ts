import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { IAuthPassword } from 'src/common/auth/interfaces/auth.interface';
import { AuthService } from 'src/common/auth/services/auth.service';
import { CategoryService } from 'src/modules/category/services/category.service';
import { ProductCreateDto } from 'src/modules/product/dtos/product.create.dto';
import { ProductService } from 'src/modules/product/services/product.service';
import { TenantService } from 'src/modules/tenant/services/tenant.service';
import { UserCreateDto } from 'src/modules/user/dtos/user.create.dto';
import { UserDoc } from 'src/modules/user/repository/entities/user.entity';
import { UserService } from 'src/modules/user/services/user.service';

const DEMO_CATEGORIES = [
  { name: 'Grocery', description: 'Everyday grocery items' },
  { name: 'Dairy', description: 'Milk and dairy products' },
  { name: 'Beverages', description: 'Soft drinks and juices' },
  { name: 'Household', description: 'Cleaning and household' },
  { name: 'Personal Care', description: 'Soap, shampoo, and hygiene' },
  { name: 'Bakery', description: 'Bread and bakery' },
];

const DEMO_PRODUCTS: Omit<ProductCreateDto, 'tenantId'>[] = [
  {
    name: 'Amul Taaza Milk 1L',
    sku: 'MILK-1L',
    barcode: '8901234000011',
    price: 90,
    costPrice: 75,
    category: 'Dairy',
    stock: 48,
    minStock: 10,
    unit: 'pcs',
    isActive: true,
  },
  {
    name: 'Wai Wai Noodles',
    sku: 'WAIWAI-1',
    barcode: '8901552000123',
    price: 30,
    costPrice: 22,
    category: 'Grocery',
    stock: 120,
    minStock: 20,
    unit: 'pcs',
    isActive: true,
  },
  {
    name: 'Fortune Soyabean Oil 1L',
    sku: 'OIL-1L',
    barcode: '8901030869014',
    price: 290,
    costPrice: 240,
    category: 'Grocery',
    stock: 36,
    minStock: 8,
    unit: 'ltr',
    isActive: true,
  },
  {
    name: 'Basmati Rice 5kg',
    sku: 'RICE-5KG',
    barcode: '8901725005018',
    price: 850,
    costPrice: 720,
    category: 'Grocery',
    stock: 20,
    minStock: 4,
    unit: 'bag',
    isActive: true,
  },
  {
    name: 'Coca-Cola 500ml',
    sku: 'COKE-500',
    barcode: '8901764011029',
    price: 60,
    costPrice: 45,
    category: 'Beverages',
    stock: 72,
    minStock: 12,
    unit: 'pcs',
    isActive: true,
  },
  {
    name: 'Dettol Soap 75g',
    sku: 'SOAP-75',
    barcode: '8901030800756',
    price: 45,
    costPrice: 32,
    category: 'Household',
    stock: 40,
    minStock: 8,
    unit: 'pcs',
    isActive: true,
  },
  {
    name: 'Sunsilk Shampoo 180ml',
    sku: 'SHAM-180',
    barcode: '8901030801234',
    price: 185,
    costPrice: 140,
    category: 'Personal Care',
    stock: 24,
    minStock: 5,
    unit: 'pcs',
    isActive: true,
  },
  {
    name: 'Britannia Bread',
    sku: 'BREAD-1',
    barcode: '8901064350012',
    price: 55,
    costPrice: 40,
    category: 'Bakery',
    stock: 18,
    minStock: 6,
    unit: 'pcs',
    isActive: true,
  },
];

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
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
  ) {}

  @Command({
    command: 'seed:user',
    describe: 'seeds default tenant, tenant admin, and demo products',
  })
  async seeds(): Promise<void> {
    const password: IAuthPassword = await this.authService.createPassword(
      this.password,
    );

    const existingUser = await this.userService.findOne<UserDoc>({
      email: this.email,
    });

    let tenant =
      (await this.tenantService.findOne({ email: this.email })) ??
      (await this.tenantService.findOne({ name: this.tenantName }));

    if (!tenant && existingUser?.tenantId) {
      tenant = await this.tenantService.findOneById(
        String(existingUser.tenantId),
      );
    }

    if (!tenant) {
      tenant = await this.tenantService.create({
        name: this.tenantName,
        email: this.email,
        phone: this.mobileNumber,
        plan: 'Basic',
        status: 'active',
        domain: 'demo.posnepal.com',
        ownerName: this.ownerName,
      });
    }

    const tenantId = String(tenant._id);

    if (!existingUser) {
      await this.userService.create(
        {
          email: this.email,
          fullName: this.fullName,
          mobileNumber: this.mobileNumber,
          password: this.password,
          tenantId,
          tenantName: tenant.name,
        } as UserCreateDto,
        password,
      );
    }

    await this.seedCatalog(tenantId);
  }

  @Command({
    command: 'remove:user',
    describe: 'remove default tenant admin',
  })
  async remove(): Promise<void> {
    const existing: UserDoc = await this.userService.findOne<UserDoc>({
      email: this.email,
    });
    if (!existing) {
      throw new Error('There is no default tenant admin');
    }
    await this.userService.delete(existing);

    const tenant = await this.tenantService.findOne({ email: this.email });
    if (tenant) {
      const tenantId = String(tenant._id);
      await this.productService.deleteMany({ tenantId });
      await this.categoryService.deleteMany({ tenantId });
      await this.tenantService.delete(tenant);
    }
  }

  private async seedCatalog(tenantId: string): Promise<void> {
    for (const category of DEMO_CATEGORIES) {
      const existing = await this.categoryService.findOne({
        tenantId,
        name: category.name,
      });
      if (!existing) {
        await this.categoryService.create({
          tenantId,
          name: category.name,
          description: category.description,
        });
      }
    }

    const result = await this.productService.importFromRows(
      DEMO_PRODUCTS as unknown as Record<string, unknown>[],
      tenantId,
    );
    console.log(
      `Demo Store catalog: ${result.created} products added, ${result.skipped} skipped`,
    );
  }
}
