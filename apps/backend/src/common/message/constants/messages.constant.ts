/** Response messages — no i18n. Lookup by dotted key (e.g. user.login). */
export const RESPONSE_MESSAGES = {
  activityLog: {
    list: "ActivityLog list",
    get: "ActivityLog fetched",
    create: "ActivityLog created",
    delete: "ActivityLog deleted",
    update: "ActivityLog updated",
    inactive: "ActivityLog inactive",
    active: "ActivityLog active",
    error: {
      notFound: "ActivityLog not found"
    }
  },
  admin: {
    list: "List User Success.",
    get: "Get User Success.",
    create: "Create User Success.",
    delete: "Delete User Success.",
    update: "Update User Success.",
    inactive: "Inactive Succeed",
    active: "Active Succeed",
    import: "Import user Succeed",
    blocked: "Success blocked user",
    refresh: "Refresh token success",
    changePassword: "Change password Succeed",
    info: "Get info payload Succeed",
    profile: "Profile Success",
    updateProfile: "Update profile Succeed",
    claimUsername: "Claim username Succeed",
    upload: "Upload Success",
    login: "Login success.",
    signUp: "Sign up Success",
    loginGoogle: "Login with google succeed",
    passwordForgot: "Token Sent",
    error: {
      notFound: "User not found.",
      emailExist: "Email user used",
      mobileNumberExist: "Mobile Number user used",
      passwordExpired: "User password expired",
      passwordAttemptMax: "Password attempt user max",
      passwordNotMatch: "Password not match",
      blocked: "User blocked",
      inactivePermanent: "User inactive permanent",
      inactive: "User is inactive",
      isActiveInvalid: "User is active invalid",
      usernameExist: "Username exist",
      newPasswordMustDifference: "Old password must difference"
    }
  },
  apiKey: {
    list: "Get list of api keys succeed",
    get: "Get Detail of api key succeed",
    create: "Create api key succeed",
    reset: "Reset api key succeed",
    update: "Update api key succeed",
    inactive: "Inactive api key succeed",
    active: "Active api key succeed",
    updateDate: "Update date api key succeed",
    delete: "Delete api key succeed",
    error: {
      exist: "API Key Exist",
      isActiveInvalid: "API Key is active invalid",
      expired: "API Key expired",
      notFound: "API Key not found",
      keyNeeded: "Api Key is missing",
      inactive: "Auth API Inactive",
      notActiveYet: "Api Key not active yet",
      invalid: "Invalid API Key",
      typeInvalid: "Api Key type invalid"
    }
  },
  app: {
    hello: "This is test endpoint service {serviceName}."
  },
  auth: {
    error: {
      accessTokenUnauthorized: "Access Token UnAuthorized",
      refreshTokenUnauthorized: "Refresh Token UnAuthorized",
      googleSSO: "Google SSO something error"
    }
  },
  batch: {
    list: "Batch list",
    get: "Batch fetched",
    create: "Batch created",
    delete: "Batch deleted",
    update: "Batch updated",
    inactive: "Batch inactive",
    active: "Batch active",
    error: {
      notFound: "Batch not found"
    }
  },
  category: {
    list: "Category list",
    get: "Category fetched",
    create: "Category created",
    delete: "Category deleted",
    update: "Category updated",
    inactive: "Category inactive",
    active: "Category active",
    error: {
      notFound: "Category not found"
    }
  },
  content: {
    list: "Content list",
    get: "Content fetched",
    create: "Content created",
    delete: "Content deleted",
    update: "Content updated",
    inactive: "Content inactive",
    active: "Content active",
    error: {
      notFound: "Content not found"
    }
  },
  customer: {
    list: "Customer list",
    get: "Customer fetched",
    create: "Customer created",
    delete: "Customer deleted",
    update: "Customer updated",
    inactive: "Customer inactive",
    active: "Customer active",
    error: {
      notFound: "Customer not found"
    }
  },
  dashboard: {
    get: "Dashboard fetched",
    analytics: "Dashboard analytics fetched"
  },
  document: {
    list: "Document list",
    get: "Document fetched",
    create: "Document created",
    delete: "Document deleted",
    update: "Document updated",
    inactive: "Document inactive",
    active: "Document active",
    error: {
      notFound: "Document not found"
    }
  },
  feature: {
    list: "Feature list",
    get: "Feature fetched",
    create: "Feature created",
    delete: "Feature deleted",
    update: "Feature updated",
    inactive: "Feature inactive",
    active: "Feature active",
    error: {
      notFound: "Feature not found"
    }
  },
  file: {
    error: {
      notFound: "File not found",
      maxSize: "File size too big",
      maxFiles: "Files are to many",
      mimeInvalid: "File extension not valid",
      needExtractFirst: "Extract data needed",
      validationDto: "Import Data invalid"
    }
  },
  health: {
    check: "Healthy succeed"
  },
  heldSale: {
    list: "HeldSale list",
    get: "HeldSale fetched",
    create: "HeldSale created",
    delete: "HeldSale deleted",
    update: "HeldSale updated",
    inactive: "HeldSale inactive",
    active: "HeldSale active",
    error: {
      notFound: "HeldSale not found"
    }
  },
  http: {
    200: "OK",
    201: "Created",
    202: "Accepted",
    204: "No Content",
    301: "Move Permanently",
    302: "Found",
    304: "Not Modified",
    307: "Temporary Redirect",
    308: "Permanent Redirect",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    405: "Not Allowed Method",
    406: "Not Acceptable",
    413: "Payload To Large",
    414: "Uri To Large",
    415: "Unsupported Media Type",
    422: "Unprocessable Entity",
    429: "Too Many Request",
    500: "Internal Server Error",
    501: "Not Implemented",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
    success: {
      ok: "OK",
      created: "Created",
      accepted: "Accepted",
      noContent: "No Content"
    },
    redirection: {
      movePermanently: "Move Permanently",
      found: "Found",
      notModified: "Not Modified",
      temporaryRedirect: "Temporary Redirect",
      permanentRedirect: "Permanent Redirect"
    },
    clientError: {
      badRequest: "Bad Request",
      unauthorized: "Unauthorized",
      forbidden: "Forbidden",
      notFound: "Not Found",
      methodNotAllowed: "Not Allowed Method",
      notAcceptable: "Not Acceptable",
      payloadToLarge: "Payload To Large",
      uriToLarge: "Uri To Large",
      unsupportedMediaType: "Unsupported Media Type",
      unprocessableEntity: "Unprocessable Entity",
      tooManyRequest: "Too Many Request"
    },
    serverError: {
      internalServerError: "Internal Server Error",
      notImplemented: "Not Implemented",
      badGateway: "Bad Gateway",
      serviceUnavailable: "Service Unavailable",
      gatewayTimeout: "Gateway Timeout"
    },
    db: {
      error: "Database Error"
    }
  },
  inventory: {
    list: "Inventory list",
    get: "Inventory fetched",
    create: "Inventory created",
    delete: "Inventory deleted",
    update: "Inventory updated",
    inactive: "Inventory inactive",
    active: "Inventory active",
    error: {
      notFound: "Inventory not found"
    }
  },
  message: {
    languages: "message enum languages"
  },
  notification: {
    list: "Notification list",
    get: "Notification fetched",
    create: "Notification created",
    delete: "Notification deleted",
    update: "Notification updated",
    inactive: "Notification inactive",
    active: "Notification active",
    error: {
      notFound: "Notification not found"
    }
  },
  outlet: {
    list: "Outlet list",
    get: "Outlet fetched",
    create: "Outlet created",
    delete: "Outlet deleted",
    update: "Outlet updated",
    inactive: "Outlet inactive",
    active: "Outlet active",
    error: {
      notFound: "Outlet not found"
    }
  },
  package: {
    list: "Package list",
    get: "Package fetched",
    create: "Package created",
    delete: "Package deleted",
    update: "Package updated",
    inactive: "Package inactive",
    active: "Package active",
    error: {
      notFound: "Package not found"
    }
  },
  paymentMethod: {
    list: "PaymentMethod list",
    get: "PaymentMethod fetched",
    create: "PaymentMethod created",
    delete: "PaymentMethod deleted",
    update: "PaymentMethod updated",
    inactive: "PaymentMethod inactive",
    active: "PaymentMethod active",
    error: {
      notFound: "PaymentMethod not found"
    }
  },
  paymentReceipt: {
    list: "PaymentReceipt list",
    get: "PaymentReceipt fetched",
    create: "PaymentReceipt created",
    delete: "PaymentReceipt deleted",
    update: "PaymentReceipt updated",
    inactive: "PaymentReceipt inactive",
    active: "PaymentReceipt active",
    error: {
      notFound: "PaymentReceipt not found"
    }
  },
  product: {
    list: "Product list",
    get: "Product fetched",
    create: "Product created",
    delete: "Product deleted",
    update: "Product updated",
    inactive: "Product inactive",
    active: "Product active",
    error: {
      notFound: "Product not found"
    }
  },
  promotion: {
    list: "Promotion list",
    get: "Promotion fetched",
    create: "Promotion created",
    delete: "Promotion deleted",
    update: "Promotion updated",
    inactive: "Promotion inactive",
    active: "Promotion active",
    error: {
      notFound: "Promotion not found"
    }
  },
  purchase: {
    list: "Purchase list",
    get: "Purchase fetched",
    create: "Purchase created",
    delete: "Purchase deleted",
    update: "Purchase updated",
    inactive: "Purchase inactive",
    active: "Purchase active",
    error: {
      notFound: "Purchase not found"
    }
  },
  referral: {
    list: "Referral list",
    get: "Referral fetched",
    create: "Referral created",
    delete: "Referral deleted",
    update: "Referral updated",
    inactive: "Referral inactive",
    active: "Referral active",
    error: {
      notFound: "Referral not found"
    }
  },
  report: {
    sales: "Sales report fetched",
    inventory: "Inventory report fetched",
    vat: "VAT report fetched",
    profitLoss: "Profit and loss report fetched"
  },
  request: {
    validation: "Validation errors",
    min: "{property} has less elements than the minimum allowed.",
    max: "{property} has more elements than the maximum allowed.",
    maxLength: "{property} has more elements than the maximum allowed.",
    minLength: "{property} has less elements than the minimum allowed.",
    isString: "{property} should be a type of string.",
    isNotEmpty: "{property} cannot be empty.",
    isLowercase: "{property} should be lowercase.",
    isOptional: "{property} is optional.",
    isPositive: "{property} should be a positive number.",
    isEmail: "{property} should be a type of email.",
    isInt: "{property} should be a number.",
    isNumberString: "{property} should be a number.",
    isNumber: "{property} should be a number {value}.",
    isMongoId: "{property} should reference with mongo object id.",
    isBoolean: "{property} should be a boolean",
    isEnum: "{property} don't match with enum",
    isObject: "{property} should be a object",
    isArray: "{property} should be a array",
    arrayNotEmpty: "{property} array is not empty",
    minDate: "{property} has less date than the minimum allowed.",
    maxDate: "{property} has  more elements than the maximum allowed.",
    isDate: "{property} should be a date",
    isPasswordStrong: "{property} must have strong pattern",
    isPasswordMedium: "{property} must have medium pattern",
    isPasswordWeak: "{property} must have weak pattern",
    isStartWith: "{property} should start with {value}",
    safeString: "{property} should safe string, only contain A-Z, a-z, 0-9 and symbol allowed is '_-'",
    isOnlyDigits: "{property} should be a digits",
    mobileNumberAllowed: "{property} should be a mobile number that allowed",
    maxBinaryFile: "{property} size is more than max. {property} should less than {value}",
    dateGreaterThanEqualToday: "{property} must greater than equal today",
    dateLessThanEqualToday: "{property} must less than equal today",
    LessThan: "{property} has less than {value}",
    lessThanEqual: "{property} must less than equal {value}",
    greaterThan: "{property} must greater than {value}",
    greaterThanEqual: "{property} must greater than equal {value}",
    error: {
      userAgentInvalid: "Request user agent not acceptable",
      userAgentOsInvalid: "Request user agent OS not acceptable",
      userAgentBrowserInvalid: "Request user agent Browser not acceptable",
      timestampInvalid: "Timestamp invalid",
      toleranceTimeInMs: "Timestamp out of tolerance"
    }
  },
  returnRefund: {
    list: "ReturnRefund list",
    get: "ReturnRefund fetched",
    create: "ReturnRefund created",
    delete: "ReturnRefund deleted",
    update: "ReturnRefund updated",
    inactive: "ReturnRefund inactive",
    active: "ReturnRefund active",
    error: {
      notFound: "ReturnRefund not found"
    }
  },
  role: {
    list: "List Role Success.",
    get: "Get Role Success.",
    create: "Create Succeed",
    update: "Update Succeed",
    updatePermission: "Update permission Succeed",
    delete: "Delete Succeed",
    inactive: "Inactive Succeed",
    active: "Active Succeed",
    error: {
      notFound: "Role not found",
      inactive: "Role is inactive",
      exist: "Role exist",
      used: "Role in used",
      isActiveInvalid: "Role is active invalid",
      typeForbidden: "Role type not allowed"
    }
  },
  sale: {
    list: "Sale list",
    get: "Sale fetched",
    create: "Sale created",
    delete: "Sale deleted",
    update: "Sale updated",
    inactive: "Sale inactive",
    active: "Sale active",
    error: {
      notFound: "Sale not found"
    }
  },
  setting: {
    list: "List Setting Success.",
    get: "Get Setting Success.",
    update: "Update Succeed",
    error: {
      notFound: "Setting not found",
      valueNotAllowed: "Setting value not allowed"
    }
  },
  stockMovement: {
    list: "StockMovement list",
    get: "StockMovement fetched",
    create: "StockMovement created",
    delete: "StockMovement deleted",
    update: "StockMovement updated",
    inactive: "StockMovement inactive",
    active: "StockMovement active",
    error: {
      notFound: "StockMovement not found"
    }
  },
  stockTransfer: {
    list: "StockTransfer list",
    get: "StockTransfer fetched",
    create: "StockTransfer created",
    delete: "StockTransfer deleted",
    update: "StockTransfer updated",
    inactive: "StockTransfer inactive",
    active: "StockTransfer active",
    error: {
      notFound: "StockTransfer not found"
    }
  },
  subscription: {
    list: "Subscription list",
    get: "Subscription fetched",
    create: "Subscription created",
    delete: "Subscription deleted",
    update: "Subscription updated",
    inactive: "Subscription inactive",
    active: "Subscription active",
    error: {
      notFound: "Subscription not found"
    }
  },
  supportTicket: {
    list: "SupportTicket list",
    get: "SupportTicket fetched",
    create: "SupportTicket created",
    delete: "SupportTicket deleted",
    update: "SupportTicket updated",
    inactive: "SupportTicket inactive",
    active: "SupportTicket active",
    error: {
      notFound: "SupportTicket not found"
    }
  },
  tenant: {
    list: "Tenant list",
    get: "Tenant fetched",
    create: "Tenant created",
    delete: "Tenant deleted",
    update: "Tenant updated",
    inactive: "Tenant inactive",
    active: "Tenant active",
    error: {
      notFound: "Tenant not found"
    },
    seed: "Tenant seeded."
  },
  user: {
    list: "List User Success.",
    get: "Get User Success.",
    create: "Create User Success.",
    delete: "Delete User Success.",
    update: "Update User Success.",
    inactive: "Inactive Succeed",
    active: "Active Succeed",
    import: "Import user Succeed",
    blocked: "Success blocked user",
    refresh: "Refresh token success",
    changePassword: "Change password Succeed",
    info: "Get info payload Succeed",
    profile: "Profile Success",
    updateProfile: "Update profile Succeed",
    claimUsername: "Claim username Succeed",
    upload: "Upload Success",
    login: "Login success.",
    signUp: "Sign up Success",
    loginGoogle: "Login with google succeed",
    passwordForgot: "Token Sent",
    error: {
      notFound: "User not found.",
      emailExist: "Email user used",
      mobileNumberExist: "Mobile Number user used",
      passwordExpired: "User password expired",
      passwordAttemptMax: "Password attempt user max",
      passwordNotMatch: "Password not match",
      blocked: "User blocked",
      inactivePermanent: "User inactive permanent",
      inactive: "User is inactive",
      isActiveInvalid: "User is active invalid",
      usernameExist: "Username exist",
      newPasswordMustDifference: "Old password must difference",
      tenantRequired: "User must belong to a tenant"
    }
  },
  vendor: {
    list: "Vendor list",
    get: "Vendor fetched",
    create: "Vendor created",
    delete: "Vendor deleted",
    update: "Vendor updated",
    inactive: "Vendor inactive",
    active: "Vendor active",
    error: {
      notFound: "Vendor not found"
    }
  },
  otp: {
    invalid: "OTP is invalid.",
    expired: "OTP has expired.",
    type: {
      invalid: "OTP type is invalid."
    },
    destination: {
      required: "Email or mobile number is required."
    }
  },
  staff: {
    list: "List Staff Success.",
    get: "Get Staff Success.",
    create: "Create Staff Success.",
    update: "Update Staff Success.",
    delete: "Delete Staff Success.",
    inactive: "Staff Inactivated.",
    active: "Staff Activated."
  },
  settings: {
    error: {
      notFound: "Settings not found."
    }
  },
  mail: {
    error: {
      notFound: "Mail log not found."
    }
  }
} as const;

export type ResponseMessageCatalog = typeof RESPONSE_MESSAGES;

export function getResponseMessage(
  key: string,
  properties?: Record<string, unknown>,
): string {
  const parts = key.split('.');
  let current: unknown = RESPONSE_MESSAGES;
  for (const part of parts) {
    if (!current || typeof current !== 'object' || !(part in current)) {
      return key;
    }
    current = (current as Record<string, unknown>)[part];
  }
  if (typeof current !== 'string') {
    return key;
  }
  if (!properties) {
    return current;
  }
  return current.replace(/\{(\w+)\}/g, (_match, name: string) =>
    properties[name] === undefined ? `{${name}}` : String(properties[name]),
  );
}

