import { Module } from '@nestjs/common';
import { AuthModule } from 'src/common/auth/auth.module';
import { AwsS3Module } from 'src/common/aws/aws.module';
import { ActivityLogModule } from 'src/modules/activity-log/activity-log.module';
import { UserActivityLogController } from 'src/modules/activity-log/controllers/user.activity-log.controller';
import { BatchModule } from 'src/modules/batch/batch.module';
import { UserBatchController } from 'src/modules/batch/controllers/user.batch.controller';
import { CategoryModule } from 'src/modules/category/category.module';
import { UserCategoryController } from 'src/modules/category/controllers/user.category.controller';
import { ContentModule } from 'src/modules/content/content.module';
import { UserContentController } from 'src/modules/content/controllers/user.content.controller';
import { CustomerModule } from 'src/modules/customer/customer.module';
import { UserCustomerController } from 'src/modules/customer/controllers/user.customer.controller';
import { DashboardModule } from 'src/modules/dashboard/dashboard.module';
import { UserDashboardController } from 'src/modules/dashboard/controllers/user.dashboard.controller';
import { DocumentModule } from 'src/modules/document/document.module';
import { UserDocumentController } from 'src/modules/document/controllers/user.document.controller';
import { FeatureModule } from 'src/modules/feature/feature.module';
import { UserFeatureController } from 'src/modules/feature/controllers/user.feature.controller';
import { HeldSaleModule } from 'src/modules/held-sale/held-sale.module';
import { UserHeldSaleController } from 'src/modules/held-sale/controllers/user.held-sale.controller';
import { InventoryModule } from 'src/modules/inventory/inventory.module';
import { UserInventoryController } from 'src/modules/inventory/controllers/user.inventory.controller';
import { NotificationModule } from 'src/modules/notification/notification.module';
import { UserNotificationController } from 'src/modules/notification/controllers/user.notification.controller';
import { OutletModule } from 'src/modules/outlet/outlet.module';
import { UserOutletController } from 'src/modules/outlet/controllers/user.outlet.controller';
import { PackageModule } from 'src/modules/package/package.module';
import { UserPackageController } from 'src/modules/package/controllers/user.package.controller';
import { PaymentMethodModule } from 'src/modules/payment-method/payment-method.module';
import { UserPaymentMethodController } from 'src/modules/payment-method/controllers/user.payment-method.controller';
import { PaymentReceiptModule } from 'src/modules/payment-receipt/payment-receipt.module';
import { UserPaymentReceiptController } from 'src/modules/payment-receipt/controllers/user.payment-receipt.controller';
import { ProductModule } from 'src/modules/product/product.module';
import { UserProductController } from 'src/modules/product/controllers/user.product.controller';
import { PurchaseModule } from 'src/modules/purchase/purchase.module';
import { UserPurchaseController } from 'src/modules/purchase/controllers/user.purchase.controller';
import { ReferralModule } from 'src/modules/referral/referral.module';
import { UserReferralController } from 'src/modules/referral/controllers/user.referral.controller';
import { ReportModule } from 'src/modules/report/report.module';
import { UserReportController } from 'src/modules/report/controllers/user.report.controller';
import { ReturnRefundModule } from 'src/modules/return-refund/return-refund.module';
import { UserReturnRefundController } from 'src/modules/return-refund/controllers/user.return-refund.controller';
import { SaleModule } from 'src/modules/sale/sale.module';
import { UserSaleController } from 'src/modules/sale/controllers/user.sale.controller';
import { SettingsModule } from 'src/modules/settings/settings.module';
import { UserSettingsController } from 'src/modules/settings/controllers/user.settings.controller';
import { StockMovementModule } from 'src/modules/stock-movement/stock-movement.module';
import { UserStockMovementController } from 'src/modules/stock-movement/controllers/user.stock-movement.controller';
import { StockTransferModule } from 'src/modules/stock-transfer/stock-transfer.module';
import { UserStockTransferController } from 'src/modules/stock-transfer/controllers/user.stock-transfer.controller';
import { SubscriptionModule } from 'src/modules/subscription/subscription.module';
import { UserSubscriptionController } from 'src/modules/subscription/controllers/user.subscription.controller';
import { SupportTicketModule } from 'src/modules/support-ticket/support-ticket.module';
import { UserSupportTicketController } from 'src/modules/support-ticket/controllers/user.support-ticket.controller';
import { UploadModule } from 'src/modules/upload/upload.module';
import { UserUploadController } from 'src/modules/upload/user.upload.controller';
import { UserModule } from 'src/modules/user/user.module';
import { UserAuthController } from 'src/modules/user/controllers/user.auth.controller';
import { UserStaffController } from 'src/modules/user/controllers/user.staff.controller';
import { TenantModule } from 'src/modules/tenant/tenant.module';
import { VendorModule } from 'src/modules/vendor/vendor.module';
import { UserVendorController } from 'src/modules/vendor/controllers/user.vendor.controller';

@Module({
  controllers: [
    UserAuthController,
    UserStaffController,
    UserDashboardController,
    UserSettingsController,
    UserUploadController,
    UserOutletController,
    UserPackageController,
    UserSubscriptionController,
    UserVendorController,
    UserDocumentController,
    UserFeatureController,
    UserProductController,
    UserCategoryController,
    UserInventoryController,
    UserStockMovementController,
    UserBatchController,
    UserCustomerController,
    UserSaleController,
    UserHeldSaleController,
    UserPurchaseController,
    UserStockTransferController,
    UserReferralController,
    UserSupportTicketController,
    UserNotificationController,
    UserActivityLogController,
    UserPaymentMethodController,
    UserPaymentReceiptController,
    UserReturnRefundController,
    UserContentController,
    UserReportController,
  ],
  imports: [
    UserModule,
    TenantModule,
    AuthModule,
    SettingsModule,
    UploadModule,
    AwsS3Module,
    DashboardModule,
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
    ReferralModule,
    SupportTicketModule,
    NotificationModule,
    ActivityLogModule,
    PaymentMethodModule,
    PaymentReceiptModule,
    ReturnRefundModule,
    ContentModule,
    ReportModule,
  ],
})
export class RoutesUserModule {}
