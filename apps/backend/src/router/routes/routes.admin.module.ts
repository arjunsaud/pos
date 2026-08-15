import { Module } from '@nestjs/common';
import { AuthModule } from 'src/common/auth/auth.module';
import { AwsS3Module } from 'src/common/aws/aws.module';
import { AdminModule } from 'src/modules/admin/admin.module';
import { AdminController } from 'src/modules/admin/controllers/admin.controller';
import { AuthController } from 'src/modules/admin/controllers/auth.controller';
import { ActivityLogModule } from 'src/modules/activity-log/activity-log.module';
import { AdminActivityLogController } from 'src/modules/activity-log/controllers/admin.activity-log.controller';
import { BatchModule } from 'src/modules/batch/batch.module';
import { AdminBatchController } from 'src/modules/batch/controllers/admin.batch.controller';
import { CategoryModule } from 'src/modules/category/category.module';
import { AdminCategoryController } from 'src/modules/category/controllers/admin.category.controller';
import { ContentModule } from 'src/modules/content/content.module';
import { AdminContentController } from 'src/modules/content/controllers/admin.content.controller';
import { ContractModule } from 'src/modules/contract/contract.module';
import { AdminContractController } from 'src/modules/contract/controllers/admin.contract.controller';
import { CustomerModule } from 'src/modules/customer/customer.module';
import { AdminCustomerController } from 'src/modules/customer/controllers/admin.customer.controller';
import { DashboardModule } from 'src/modules/dashboard/dashboard.module';
import { AdminDashboardController } from 'src/modules/dashboard/controllers/admin.dashboard.controller';
import { DocumentModule } from 'src/modules/document/document.module';
import { AdminDocumentController } from 'src/modules/document/controllers/admin.document.controller';
import { FeatureModule } from 'src/modules/feature/feature.module';
import { AdminFeatureController } from 'src/modules/feature/controllers/admin.feature.controller';
import { HeldSaleModule } from 'src/modules/held-sale/held-sale.module';
import { AdminHeldSaleController } from 'src/modules/held-sale/controllers/admin.held-sale.controller';
import { InventoryModule } from 'src/modules/inventory/inventory.module';
import { AdminInventoryController } from 'src/modules/inventory/controllers/admin.inventory.controller';
import { MailLogModule } from 'src/modules/mail-log/mail-log.module';
import { MailLogController } from 'src/modules/mail-log/controllers/mail-log.controller';
import { NotificationModule } from 'src/modules/notification/notification.module';
import { AdminNotificationController } from 'src/modules/notification/controllers/admin.notification.controller';
import { OutletModule } from 'src/modules/outlet/outlet.module';
import { AdminOutletController } from 'src/modules/outlet/controllers/admin.outlet.controller';
import { PackageModule } from 'src/modules/package/package.module';
import { AdminPackageController } from 'src/modules/package/controllers/admin.package.controller';
import { PaymentMethodModule } from 'src/modules/payment-method/payment-method.module';
import { AdminPaymentMethodController } from 'src/modules/payment-method/controllers/admin.payment-method.controller';
import { PaymentReceiptModule } from 'src/modules/payment-receipt/payment-receipt.module';
import { AdminPaymentReceiptController } from 'src/modules/payment-receipt/controllers/admin.payment-receipt.controller';
import { ProductModule } from 'src/modules/product/product.module';
import { AdminProductController } from 'src/modules/product/controllers/admin.product.controller';
import { PromotionModule } from 'src/modules/promotion/promotion.module';
import { AdminPromotionController } from 'src/modules/promotion/controllers/admin.promotion.controller';
import { PurchaseModule } from 'src/modules/purchase/purchase.module';
import { AdminPurchaseController } from 'src/modules/purchase/controllers/admin.purchase.controller';
import { ReferralModule } from 'src/modules/referral/referral.module';
import { AdminReferralController } from 'src/modules/referral/controllers/admin.referral.controller';
import { ReportModule } from 'src/modules/report/report.module';
import { AdminReportController } from 'src/modules/report/controllers/admin.report.controller';
import { ReturnRefundModule } from 'src/modules/return-refund/return-refund.module';
import { AdminReturnRefundController } from 'src/modules/return-refund/controllers/admin.return-refund.controller';
import { SaleModule } from 'src/modules/sale/sale.module';
import { AdminSaleController } from 'src/modules/sale/controllers/admin.sale.controller';
import { SettingsModule } from 'src/modules/settings/settings.module';
import { AdminSettingsController } from 'src/modules/settings/controllers/admin.settings.controller';
import { StockMovementModule } from 'src/modules/stock-movement/stock-movement.module';
import { AdminStockMovementController } from 'src/modules/stock-movement/controllers/admin.stock-movement.controller';
import { StockTransferModule } from 'src/modules/stock-transfer/stock-transfer.module';
import { AdminStockTransferController } from 'src/modules/stock-transfer/controllers/admin.stock-transfer.controller';
import { SubscriptionModule } from 'src/modules/subscription/subscription.module';
import { AdminSubscriptionController } from 'src/modules/subscription/controllers/admin.subscription.controller';
import { SupportTicketModule } from 'src/modules/support-ticket/support-ticket.module';
import { AdminSupportTicketController } from 'src/modules/support-ticket/controllers/admin.support-ticket.controller';
import { TenantModule } from 'src/modules/tenant/tenant.module';
import { AdminTenantController } from 'src/modules/tenant/controllers/admin.tenant.controller';
import { UploadModule } from 'src/modules/upload/upload.module';
import { AdminUploadController } from 'src/modules/upload/admin.upload.controlle';
import { UserModule } from 'src/modules/user/user.module';
import { UserAdminController } from 'src/modules/user/controllers/user.admin.controller';
import { VendorModule } from 'src/modules/vendor/vendor.module';
import { AdminVendorController } from 'src/modules/vendor/controllers/admin.vendor.controller';

@Module({
  controllers: [
    AuthController,
    AdminController,
    AdminDashboardController,
    AdminSettingsController,
    AdminUploadController,
    MailLogController,
    UserAdminController,
    AdminTenantController,
    AdminOutletController,
    AdminPackageController,
    AdminSubscriptionController,
    AdminVendorController,
    AdminDocumentController,
    AdminFeatureController,
    AdminProductController,
    AdminCategoryController,
    AdminInventoryController,
    AdminStockMovementController,
    AdminBatchController,
    AdminCustomerController,
    AdminSaleController,
    AdminHeldSaleController,
    AdminPurchaseController,
    AdminStockTransferController,
    AdminPromotionController,
    AdminReferralController,
    AdminSupportTicketController,
    AdminNotificationController,
    AdminActivityLogController,
    AdminPaymentMethodController,
    AdminPaymentReceiptController,
    AdminReturnRefundController,
    AdminContentController,
    AdminContractController,
    AdminReportController,
  ],
  providers: [],
  exports: [],
  imports: [
    AdminModule,
    AuthModule,
    UserModule,
    SettingsModule,
    UploadModule,
    AwsS3Module,
    MailLogModule,
    DashboardModule,
    TenantModule,
    OutletModule,
    PackageModule,
    SubscriptionModule,
    VendorModule,
    DocumentModule,
    FeatureModule,
    ProductModule,
    CategoryModule,
    InventoryModule,
    StockMovementModule,
    BatchModule,
    CustomerModule,
    SaleModule,
    HeldSaleModule,
    PurchaseModule,
    StockTransferModule,
    PromotionModule,
    ReferralModule,
    SupportTicketModule,
    NotificationModule,
    ActivityLogModule,
    PaymentMethodModule,
    PaymentReceiptModule,
    ReturnRefundModule,
    ContentModule,
    ContractModule,
    ReportModule,
  ],
})
export class RoutesAdminModule {}
