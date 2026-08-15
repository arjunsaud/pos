import { apiPaths } from '@/lib/api/endpoints';

function resource(base: string) {
  return {
    getList: `${base}/list`,
    getById: `${base}/get`,
    create: `${base}/create`,
    update: `${base}/update`,
    active: `${base}/update/active`,
    inActive: `${base}/update/inactive`,
    softDelete: `${base}/delete`,
  };
}

const urls = {
  admin: {
    auth: apiPaths.admin.auth,
    dashboard: apiPaths.admin.dashboard,
    tenant: resource(apiPaths.admin.tenant),
    package: resource(apiPaths.admin.package),
    subscription: resource(apiPaths.admin.subscription),
    staff: resource(apiPaths.admin.staff),
    user: resource(apiPaths.admin.user),
    document: resource(apiPaths.admin.document),
    activityLog: resource(apiPaths.admin.activityLog),
    promotion: resource(apiPaths.admin.promotion),
    referral: resource(apiPaths.admin.referral),
    paymentMethod: resource(apiPaths.admin.paymentMethod),
    paymentReceipt: resource(apiPaths.admin.paymentReceipt),
    supportTicket: resource(apiPaths.admin.supportTicket),
    content: resource(apiPaths.admin.content),
    report: apiPaths.admin.report,
    contract: resource(apiPaths.admin.contract),
    product: resource(apiPaths.admin.product),
    category: resource(apiPaths.admin.category),
    inventory: resource(apiPaths.admin.inventory),
    vendor: resource(apiPaths.admin.vendor),
    customer: resource(apiPaths.admin.customer),
    sale: resource(apiPaths.admin.sale),
    purchase: resource(apiPaths.admin.purchase),
    outlet: resource(apiPaths.admin.outlet),
    feature: resource(apiPaths.admin.feature),
  },
  user: {
    auth: apiPaths.user.auth,
    dashboard: apiPaths.user.dashboard,
    outlet: resource(apiPaths.user.outlet),
    product: resource(apiPaths.user.product),
    category: resource(apiPaths.user.category),
    inventory: resource(apiPaths.user.inventory),
    vendor: resource(apiPaths.user.vendor),
    customer: resource(apiPaths.user.customer),
    sale: resource(apiPaths.user.sale),
    heldSale: resource(apiPaths.user.heldSale),
    purchase: resource(apiPaths.user.purchase),
    stockTransfer: resource(apiPaths.user.stockTransfer),
    subscription: apiPaths.user.subscription,
    staff: resource(apiPaths.user.staff),
    notification: resource(apiPaths.user.notification),
    supportTicket: resource(apiPaths.user.supportTicket),
    settings: apiPaths.user.settings,
    package: apiPaths.user.package,
    publicPackages: apiPaths.user.publicPackages,
    report: apiPaths.user.report,
  },
};

export default urls;
