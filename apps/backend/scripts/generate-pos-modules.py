#!/usr/bin/env python3
"""Generate NestJS POS modules matching the admin UI domain model."""

from __future__ import annotations

import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
MODULES = SRC / "modules"


def pascal(name: str) -> str:
    return "".join(part.capitalize() for part in name.replace("_", "-").split("-"))


def camel(name: str) -> str:
    value = pascal(name)
    return value[0].lower() + value[1:]


def const(name: str) -> str:
    return name.replace("-", "_").upper()


def ts_type(field: dict) -> str:
    kind = field["type"]
    if kind == "number":
        return "number"
    if kind == "bool":
        return "boolean"
    if kind == "array":
        return "Record<string, any>[]"
    if kind == "string[]":
        return "string[]"
    return "string"


def dto_decorators(field: dict) -> str:
    kind = field["type"]
    required = field.get("required", False)
    lines = []
    if not required:
        lines.append("  @IsOptional()")
    if kind == "number":
        lines.append("  @IsNumber()")
    elif kind == "bool":
        lines.append("  @IsBoolean()")
    elif kind in ("array", "string[]"):
        lines.append("  @IsArray()")
    else:
        lines.append("  @IsString()")
        if required:
            lines.append("  @IsNotEmpty()")
    return "\n".join(lines)


def entity_prop(field: dict) -> str:
    kind = field["type"]
    required = "true" if field.get("required") else "false"
    index = "true" if field.get("index") else "false"
    if kind == "number":
        ts = "Number"
        default = field.get("default", 0)
        default_src = str(default)
    elif kind == "bool":
        ts = "Boolean"
        default = field.get("default", False)
        default_src = "true" if default else "false"
    elif kind in ("array", "string[]"):
        ts = "Array"
        default_src = "[]"
    else:
        ts = "String"
        default = field.get("default", "")
        default_src = f"'{default}'" if default != "" else "''"

    extra = ""
    if field.get("enum"):
        extra = f"\n    enum: {field['enum']},"

    return f"""  @Prop({{
    required: {required},
    index: {index},
    type: {ts},{extra}
    default: {default_src},
  }})
  {field['name']}{'?' if not field.get('required') else ''}: {ts_type(field)};"""


MODULES_SPEC = [
    {
        "name": "tenant",
        "collection": "tenants",
        "search": ["name", "email", "domain", "ownerName", "phone"],
        "admin": True,
        "user": False,
        "active_field": "status",
        "fields": [
            {"name": "name", "type": "str", "required": True, "index": True},
            {"name": "email", "type": "str", "required": True, "index": True},
            {"name": "phone", "type": "str", "required": True},
            {"name": "plan", "type": "str", "required": True, "index": True, "default": "Basic"},
            {"name": "status", "type": "str", "required": True, "index": True, "default": "active"},
            {"name": "domain", "type": "str", "required": True, "index": True},
            {"name": "ownerName", "type": "str", "required": True},
            {"name": "productCount", "type": "number", "required": False, "default": 0},
            {"name": "monthlyRevenue", "type": "number", "required": False, "default": 0},
            {"name": "address", "type": "str", "required": False},
            {"name": "pan", "type": "str", "required": False},
            {"name": "vatNumber", "type": "str", "required": False},
        ],
    },
    {
        "name": "outlet",
        "collection": "outlets",
        "search": ["name", "city", "address", "phone"],
        "admin": True,
        "user": True,
        "tenant_scoped": True,
        "active_field": "status",
        "fields": [
            {"name": "tenantId", "type": "str", "required": True, "index": True},
            {"name": "name", "type": "str", "required": True, "index": True},
            {"name": "address", "type": "str", "required": True},
            {"name": "city", "type": "str", "required": True, "index": True},
            {"name": "phone", "type": "str", "required": True},
            {"name": "isDefault", "type": "bool", "required": False, "default": False},
            {"name": "status", "type": "str", "required": True, "index": True, "default": "active"},
        ],
    },
    {
        "name": "package",
        "collection": "packages",
        "search": ["name"],
        "admin": True,
        "user": True,
        "active_field": "status",
        "fields": [
            {"name": "name", "type": "str", "required": True, "index": True},
            {"name": "price", "type": "number", "required": True},
            {"name": "interval", "type": "str", "required": True, "default": "monthly"},
            {"name": "status", "type": "str", "required": True, "index": True, "default": "active"},
            {"name": "maxProducts", "type": "number", "required": True, "default": 50},
            {"name": "maxStaff", "type": "number", "required": True, "default": 1},
            {"name": "maxOutlets", "type": "number", "required": True, "default": 1},
            {"name": "analytics", "type": "str", "required": True, "default": "basic"},
            {"name": "support", "type": "str", "required": True, "default": "basic"},
            {"name": "paymentGateway", "type": "bool", "required": False, "default": False},
            {"name": "billing", "type": "bool", "required": False, "default": True},
            {"name": "receipt", "type": "bool", "required": False, "default": True},
            {"name": "export", "type": "bool", "required": False, "default": False},
            {"name": "inventory", "type": "bool", "required": False, "default": True},
            {"name": "skuManagement", "type": "bool", "required": False, "default": False},
            {"name": "pos", "type": "bool", "required": False, "default": True},
            {"name": "multipleOutlets", "type": "bool", "required": False, "default": False},
            {"name": "vendors", "type": "bool", "required": False, "default": False},
            {"name": "invoicePrinting", "type": "bool", "required": False, "default": False},
            {"name": "trainingAndSupport", "type": "bool", "required": False, "default": False},
            {"name": "customDomain", "type": "bool", "required": False, "default": False},
            {"name": "dailyBackup", "type": "bool", "required": False, "default": False},
            {"name": "popular", "type": "bool", "required": False, "default": False},
        ],
    },
    {
        "name": "subscription",
        "collection": "subscriptions",
        "search": ["tenantName", "packageName", "status"],
        "admin": True,
        "user": True,
        "tenant_scoped": True,
        "fields": [
            {"name": "tenantId", "type": "str", "required": True, "index": True},
            {"name": "tenantName", "type": "str", "required": True, "index": True},
            {"name": "packageId", "type": "str", "required": True, "index": True},
            {"name": "packageName", "type": "str", "required": True},
            {"name": "status", "type": "str", "required": True, "index": True, "default": "trial"},
            {"name": "startDate", "type": "str", "required": True},
            {"name": "endDate", "type": "str", "required": True},
            {"name": "amount", "type": "number", "required": True},
            {"name": "currency", "type": "str", "required": True, "default": "NPR"},
            {"name": "autoRenew", "type": "bool", "required": False, "default": True},
        ],
    },
    {
        "name": "vendor",
        "collection": "vendors",
        "search": ["name", "email", "phone", "contactPerson", "pan"],
        "admin": True,
        "user": True,
        "tenant_scoped": True,
        "active_field": "status",
        "fields": [
            {"name": "tenantId", "type": "str", "required": True, "index": True},
            {"name": "name", "type": "str", "required": True, "index": True},
            {"name": "contactPerson", "type": "str", "required": True},
            {"name": "email", "type": "str", "required": True},
            {"name": "phone", "type": "str", "required": True},
            {"name": "pan", "type": "str", "required": False},
            {"name": "vatNumber", "type": "str", "required": False},
            {"name": "address", "type": "str", "required": False},
            {"name": "city", "type": "str", "required": False},
            {"name": "status", "type": "str", "required": True, "index": True, "default": "active"},
            {"name": "productCount", "type": "number", "required": False, "default": 0},
        ],
    },
    {
        "name": "document",
        "collection": "documents",
        "search": ["name", "fileName", "tenantName", "type"],
        "admin": True,
        "user": True,
        "tenant_scoped": True,
        "fields": [
            {"name": "tenantId", "type": "str", "required": True, "index": True},
            {"name": "tenantName", "type": "str", "required": True},
            {"name": "type", "type": "str", "required": True, "index": True},
            {"name": "name", "type": "str", "required": True},
            {"name": "fileName", "type": "str", "required": True},
            {"name": "fileSize", "type": "str", "required": False},
            {"name": "status", "type": "str", "required": True, "index": True, "default": "pending"},
        ],
    },
    {
        "name": "feature",
        "collection": "features",
        "search": ["key", "label", "category"],
        "admin": True,
        "user": True,
        "tenant_scoped": True,
        "fields": [
            {"name": "tenantId", "type": "str", "required": True, "index": True},
            {"name": "key", "type": "str", "required": True, "index": True},
            {"name": "label", "type": "str", "required": True},
            {"name": "description", "type": "str", "required": False},
            {"name": "category", "type": "str", "required": True, "index": True},
            {"name": "enabled", "type": "bool", "required": False, "default": True},
        ],
    },
    {
        "name": "product",
        "collection": "products",
        "search": ["name", "sku", "barcode", "category", "vendorName"],
        "admin": True,
        "user": True,
        "tenant_scoped": True,
        "active_field": "isActive",
        "fields": [
            {"name": "tenantId", "type": "str", "required": True, "index": True},
            {"name": "name", "type": "str", "required": True, "index": True},
            {"name": "sku", "type": "str", "required": True, "index": True},
            {"name": "barcode", "type": "str", "required": False, "index": True},
            {"name": "price", "type": "number", "required": True},
            {"name": "costPrice", "type": "number", "required": False, "default": 0},
            {"name": "category", "type": "str", "required": True, "index": True},
            {"name": "stock", "type": "number", "required": False, "default": 0},
            {"name": "minStock", "type": "number", "required": False, "default": 0},
            {"name": "unit", "type": "str", "required": True, "default": "pcs"},
            {"name": "isActive", "type": "bool", "required": False, "index": True, "default": True},
            {"name": "image", "type": "str", "required": False},
            {"name": "vendorId", "type": "str", "required": False, "index": True},
            {"name": "vendorName", "type": "str", "required": False},
            {"name": "outletId", "type": "str", "required": False, "index": True},
            {"name": "hasBatchTracking", "type": "bool", "required": False, "default": False},
        ],
    },
    {
        "name": "category",
        "collection": "categories",
        "search": ["name", "description"],
        "admin": True,
        "user": True,
        "tenant_scoped": True,
        "fields": [
            {"name": "tenantId", "type": "str", "required": True, "index": True},
            {"name": "name", "type": "str", "required": True, "index": True},
            {"name": "description", "type": "str", "required": False},
            {"name": "productCount", "type": "number", "required": False, "default": 0},
        ],
    },
    {
        "name": "inventory",
        "collection": "inventories",
        "search": ["productName", "sku"],
        "admin": True,
        "user": True,
        "tenant_scoped": True,
        "fields": [
            {"name": "tenantId", "type": "str", "required": True, "index": True},
            {"name": "productId", "type": "str", "required": True, "index": True},
            {"name": "productName", "type": "str", "required": True, "index": True},
            {"name": "sku", "type": "str", "required": True, "index": True},
            {"name": "currentStock", "type": "number", "required": True, "default": 0},
            {"name": "minStock", "type": "number", "required": False, "default": 0},
            {"name": "outletId", "type": "str", "required": False, "index": True},
        ],
    },
    {
        "name": "stock-movement",
        "collection": "stock_movements",
        "search": ["productName", "reason", "performedBy"],
        "admin": True,
        "user": True,
        "tenant_scoped": True,
        "fields": [
            {"name": "tenantId", "type": "str", "required": True, "index": True},
            {"name": "productId", "type": "str", "required": True, "index": True},
            {"name": "productName", "type": "str", "required": True},
            {"name": "type", "type": "str", "required": True, "index": True},
            {"name": "quantity", "type": "number", "required": True},
            {"name": "reason", "type": "str", "required": False},
            {"name": "performedBy", "type": "str", "required": False},
            {"name": "outletId", "type": "str", "required": False, "index": True},
        ],
    },
    {
        "name": "batch",
        "collection": "batches",
        "search": ["productName", "sku", "batchNumber"],
        "admin": True,
        "user": True,
        "tenant_scoped": True,
        "fields": [
            {"name": "tenantId", "type": "str", "required": True, "index": True},
            {"name": "productId", "type": "str", "required": True, "index": True},
            {"name": "productName", "type": "str", "required": True},
            {"name": "sku", "type": "str", "required": True},
            {"name": "batchNumber", "type": "str", "required": True, "index": True},
            {"name": "quantity", "type": "number", "required": True},
            {"name": "remainingQty", "type": "number", "required": True},
            {"name": "costPrice", "type": "number", "required": False, "default": 0},
            {"name": "mfgDate", "type": "str", "required": False},
            {"name": "expiryDate", "type": "str", "required": False, "index": True},
            {"name": "status", "type": "str", "required": True, "index": True, "default": "good"},
            {"name": "receivedDate", "type": "str", "required": False},
            {"name": "outletId", "type": "str", "required": False, "index": True},
        ],
    },
    {
        "name": "customer",
        "collection": "customers",
        "search": ["name", "email", "phone", "pan"],
        "admin": True,
        "user": True,
        "tenant_scoped": True,
        "active_field": "isActive",
        "fields": [
            {"name": "tenantId", "type": "str", "required": True, "index": True},
            {"name": "name", "type": "str", "required": True, "index": True},
            {"name": "email", "type": "str", "required": False},
            {"name": "phone", "type": "str", "required": True, "index": True},
            {"name": "pan", "type": "str", "required": False},
            {"name": "address", "type": "str", "required": False},
            {"name": "totalPurchases", "type": "number", "required": False, "default": 0},
            {"name": "totalSpent", "type": "number", "required": False, "default": 0},
            {"name": "lastVisit", "type": "str", "required": False},
            {"name": "isActive", "type": "bool", "required": False, "index": True, "default": True},
            {"name": "loyaltyPoints", "type": "number", "required": False, "default": 0},
            {"name": "creditBalance", "type": "number", "required": False, "default": 0},
            {"name": "creditLimit", "type": "number", "required": False, "default": 0},
        ],
    },
    {
        "name": "sale",
        "collection": "sales",
        "search": ["invoiceNumber", "customerName", "staffName", "paymentMethod"],
        "admin": True,
        "user": True,
        "tenant_scoped": True,
        "fields": [
            {"name": "tenantId", "type": "str", "required": True, "index": True},
            {"name": "invoiceNumber", "type": "str", "required": True, "index": True},
            {"name": "customerName", "type": "str", "required": False, "index": True},
            {"name": "customerPAN", "type": "str", "required": False},
            {"name": "customerId", "type": "str", "required": False, "index": True},
            {"name": "items", "type": "array", "required": True},
            {"name": "subtotal", "type": "number", "required": True},
            {"name": "discount", "type": "number", "required": False, "default": 0},
            {"name": "vatAmount", "type": "number", "required": False, "default": 0},
            {"name": "vatPercent", "type": "number", "required": False, "default": 13},
            {"name": "total", "type": "number", "required": True},
            {"name": "paymentMethod", "type": "str", "required": True},
            {"name": "status", "type": "str", "required": True, "index": True, "default": "completed"},
            {"name": "staffName", "type": "str", "required": False},
            {"name": "outletId", "type": "str", "required": False, "index": True},
        ],
    },
    {
        "name": "held-sale",
        "collection": "held_sales",
        "search": ["customerName"],
        "admin": True,
        "user": True,
        "tenant_scoped": True,
        "fields": [
            {"name": "tenantId", "type": "str", "required": True, "index": True},
            {"name": "cart", "type": "array", "required": True},
            {"name": "customerName", "type": "str", "required": False},
            {"name": "heldAt", "type": "str", "required": True},
            {"name": "total", "type": "number", "required": True},
            {"name": "outletId", "type": "str", "required": False, "index": True},
        ],
    },
    {
        "name": "purchase",
        "collection": "purchases",
        "search": ["orderNumber", "vendorName", "createdBy"],
        "admin": True,
        "user": True,
        "tenant_scoped": True,
        "fields": [
            {"name": "tenantId", "type": "str", "required": True, "index": True},
            {"name": "orderNumber", "type": "str", "required": True, "index": True},
            {"name": "vendorId", "type": "str", "required": True, "index": True},
            {"name": "vendorName", "type": "str", "required": True},
            {"name": "items", "type": "array", "required": True},
            {"name": "subtotal", "type": "number", "required": True},
            {"name": "vatAmount", "type": "number", "required": False, "default": 0},
            {"name": "total", "type": "number", "required": True},
            {"name": "status", "type": "str", "required": True, "index": True, "default": "draft"},
            {"name": "orderDate", "type": "str", "required": True},
            {"name": "expectedDate", "type": "str", "required": False},
            {"name": "receivedDate", "type": "str", "required": False},
            {"name": "notes", "type": "str", "required": False},
            {"name": "createdBy", "type": "str", "required": False},
        ],
    },
    {
        "name": "stock-transfer",
        "collection": "stock_transfers",
        "search": ["transferNumber", "fromOutletName", "toOutletName", "reason"],
        "admin": True,
        "user": True,
        "tenant_scoped": True,
        "fields": [
            {"name": "tenantId", "type": "str", "required": True, "index": True},
            {"name": "transferNumber", "type": "str", "required": True, "index": True},
            {"name": "fromOutletId", "type": "str", "required": True, "index": True},
            {"name": "fromOutletName", "type": "str", "required": True},
            {"name": "toOutletId", "type": "str", "required": True, "index": True},
            {"name": "toOutletName", "type": "str", "required": True},
            {"name": "items", "type": "array", "required": True},
            {"name": "status", "type": "str", "required": True, "index": True, "default": "pending"},
            {"name": "reason", "type": "str", "required": False},
            {"name": "completedAt", "type": "str", "required": False},
            {"name": "createdBy", "type": "str", "required": False},
            {"name": "notes", "type": "str", "required": False},
        ],
    },
    {
        "name": "promotion",
        "collection": "promotions",
        "search": ["code", "name", "createdBy"],
        "admin": True,
        "user": False,
        "fields": [
            {"name": "code", "type": "str", "required": True, "index": True},
            {"name": "name", "type": "str", "required": True, "index": True},
            {"name": "description", "type": "str", "required": False},
            {"name": "type", "type": "str", "required": True, "index": True},
            {"name": "value", "type": "number", "required": True},
            {"name": "status", "type": "str", "required": True, "index": True, "default": "scheduled"},
            {"name": "maxUses", "type": "number", "required": False, "default": 0},
            {"name": "usedCount", "type": "number", "required": False, "default": 0},
            {"name": "validFrom", "type": "str", "required": True},
            {"name": "validUntil", "type": "str", "required": True},
            {"name": "createdBy", "type": "str", "required": False},
        ],
    },
    {
        "name": "referral",
        "collection": "referrals",
        "search": ["referrerTenantName", "referredTenantName", "referralCode"],
        "admin": True,
        "user": True,
        "fields": [
            {"name": "referrerTenantId", "type": "str", "required": True, "index": True},
            {"name": "referrerTenantName", "type": "str", "required": True},
            {"name": "referredTenantId", "type": "str", "required": True, "index": True},
            {"name": "referredTenantName", "type": "str", "required": True},
            {"name": "referralCode", "type": "str", "required": True, "index": True},
            {"name": "status", "type": "str", "required": True, "index": True, "default": "pending"},
            {"name": "rewardType", "type": "str", "required": True},
            {"name": "rewardValue", "type": "number", "required": True},
            {"name": "convertedAt", "type": "str", "required": False},
        ],
    },
    {
        "name": "support-ticket",
        "collection": "support_tickets",
        "search": ["subject", "tenantName", "category"],
        "admin": True,
        "user": True,
        "tenant_scoped": True,
        "fields": [
            {"name": "tenantId", "type": "str", "required": True, "index": True},
            {"name": "tenantName", "type": "str", "required": True, "index": True},
            {"name": "subject", "type": "str", "required": True},
            {"name": "description", "type": "str", "required": True},
            {"name": "category", "type": "str", "required": True, "index": True},
            {"name": "priority", "type": "str", "required": True, "index": True, "default": "medium"},
            {"name": "status", "type": "str", "required": True, "index": True, "default": "open"},
            {"name": "respondedAt", "type": "str", "required": False},
            {"name": "response", "type": "str", "required": False},
            {"name": "attachments", "type": "string[]", "required": False},
        ],
    },
    {
        "name": "notification",
        "collection": "notifications",
        "search": ["title", "message", "type"],
        "admin": True,
        "user": True,
        "tenant_scoped": True,
        "fields": [
            {"name": "tenantId", "type": "str", "required": True, "index": True},
            {"name": "type", "type": "str", "required": True, "index": True},
            {"name": "title", "type": "str", "required": True},
            {"name": "message", "type": "str", "required": True},
            {"name": "priority", "type": "str", "required": True, "index": True, "default": "medium"},
            {"name": "isRead", "type": "bool", "required": False, "index": True, "default": False},
            {"name": "actionUrl", "type": "str", "required": False},
            {"name": "entityId", "type": "str", "required": False},
        ],
    },
    {
        "name": "activity-log",
        "collection": "activity_logs",
        "search": ["user", "action", "details"],
        "admin": True,
        "user": True,
        "tenant_scoped": True,
        "fields": [
            {"name": "tenantId", "type": "str", "required": False, "index": True},
            {"name": "user", "type": "str", "required": True, "index": True},
            {"name": "action", "type": "str", "required": True, "index": True},
            {"name": "details", "type": "str", "required": False},
            {"name": "type", "type": "str", "required": True, "index": True, "default": "info"},
        ],
    },
    {
        "name": "payment-method",
        "collection": "payment_methods",
        "search": ["name", "type"],
        "admin": True,
        "user": True,
        "fields": [
            {"name": "type", "type": "str", "required": True, "index": True},
            {"name": "name", "type": "str", "required": True, "index": True},
            {"name": "description", "type": "str", "required": False},
            {"name": "enabled", "type": "bool", "required": False, "index": True, "default": True},
            {"name": "accountDetails", "type": "str", "required": False},
            {"name": "qrCodeUrl", "type": "str", "required": False},
        ],
    },
    {
        "name": "payment-receipt",
        "collection": "payment_receipts",
        "search": ["tenantName", "packageName", "status"],
        "admin": True,
        "user": True,
        "tenant_scoped": True,
        "fields": [
            {"name": "tenantId", "type": "str", "required": True, "index": True},
            {"name": "tenantName", "type": "str", "required": True, "index": True},
            {"name": "amount", "type": "number", "required": True},
            {"name": "packageId", "type": "str", "required": True, "index": True},
            {"name": "packageName", "type": "str", "required": True},
            {"name": "paymentMethod", "type": "str", "required": True},
            {"name": "receiptFile", "type": "str", "required": False},
            {"name": "status", "type": "str", "required": True, "index": True, "default": "pending"},
            {"name": "uploadedAt", "type": "str", "required": False},
            {"name": "reviewedAt", "type": "str", "required": False},
            {"name": "reviewedBy", "type": "str", "required": False},
            {"name": "notes", "type": "str", "required": False},
        ],
    },
    {
        "name": "return-refund",
        "collection": "return_refunds",
        "search": ["returnNumber", "invoiceNumber", "customerName"],
        "admin": True,
        "user": True,
        "tenant_scoped": True,
        "fields": [
            {"name": "tenantId", "type": "str", "required": True, "index": True},
            {"name": "returnNumber", "type": "str", "required": True, "index": True},
            {"name": "saleId", "type": "str", "required": True, "index": True},
            {"name": "invoiceNumber", "type": "str", "required": True, "index": True},
            {"name": "customerName", "type": "str", "required": False},
            {"name": "items", "type": "array", "required": True},
            {"name": "refundAmount", "type": "number", "required": True},
            {"name": "refundMethod", "type": "str", "required": True},
            {"name": "status", "type": "str", "required": True, "index": True, "default": "requested"},
            {"name": "reason", "type": "str", "required": False},
            {"name": "processedBy", "type": "str", "required": False},
            {"name": "processedAt", "type": "str", "required": False},
        ],
    },
    {
        "name": "content",
        "collection": "contents",
        "search": ["key", "title"],
        "admin": True,
        "user": True,
        "fields": [
            {"name": "key", "type": "str", "required": True, "index": True},
            {"name": "title", "type": "str", "required": True},
            {"name": "body", "type": "str", "required": True},
        ],
    },
]


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content.rstrip() + "\n")


def generate_module(spec: dict) -> None:
    name = spec["name"]
    p = pascal(name)
    c = camel(name)
    k = const(name)
    folder = MODULES / name
    param = c
    title = p.replace("Id", " ID") if False else p
    search = spec["search"]
    fields = spec["fields"]
    tenant_scoped = spec.get("tenant_scoped", False)
    active_field = spec.get("active_field")

    iface_fields = "\n".join(f"  {f['name']}{'?' if not f.get('required') else ''}: {ts_type(f)};" for f in fields)
    entity_fields = "\n\n".join(entity_prop(f) for f in fields)
    dto_fields = "\n\n".join(
        f"""  @ApiProperty({{
    required: {str(f.get('required', False)).lower()},
    description: '{f['name']}',
  }})
{dto_decorators(f)}
  {f['name']}{'?' if not f.get('required') else ''}: {ts_type(f)};"""
        for f in fields
    )
    search_arr = ", ".join(f"'{s}'" for s in search)
    order_arr = ", ".join(f"'{s}'" for s in (["createdAt"] + search[:3]))

    write(
        folder / "interfaces" / f"{name}.entity.interface.ts",
        f"""export interface I{p}Entity {{
{iface_fields}
}}
""",
    )

    write(
        folder / "repository" / "entities" / f"{name}.entity.ts",
        f"""import {{ Prop, SchemaFactory }} from '@nestjs/mongoose';
import {{ Document }} from 'mongoose';
import {{ DatabaseMongoObjectIdEntityAbstract }} from 'src/common/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract';
import {{ DatabaseEntity }} from 'src/common/database/decorators/database.decorator';
import {{ I{p}Entity }} from '../../interfaces/{name}.entity.interface';

export const {p}DataBaseName = '{spec["collection"]}';

@DatabaseEntity({{ collection: {p}DataBaseName }})
export class {p}Entity
  extends DatabaseMongoObjectIdEntityAbstract
  implements I{p}Entity
{{
{entity_fields}
}}

export const {p}Schema = SchemaFactory.createForClass({p}Entity);

export type {p}Doc = {p}Entity & Document;
""",
    )

    write(
        folder / "repository" / "repositories" / f"{name}.repository.ts",
        f"""import {{ Injectable }} from '@nestjs/common';
import {{ Model }} from 'mongoose';
import {{ DatabaseMongoObjectIdRepositoryAbstract }} from 'src/common/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract';
import {{ DatabaseModel }} from 'src/common/database/decorators/database.decorator';
import {{ {p}Doc, {p}Entity }} from '../entities/{name}.entity';

@Injectable()
export class {p}Repository extends DatabaseMongoObjectIdRepositoryAbstract<
  {p}Entity,
  {p}Doc
> {{
  constructor(
    @DatabaseModel({p}Entity.name)
    private readonly _{c}Model: Model<{p}Entity>,
  ) {{
    super(_{c}Model);
  }}
}}
""",
    )

    write(
        folder / "repository" / f"{name}.repository.module.ts",
        f"""import {{ Module }} from '@nestjs/common';
import {{ MongooseModule }} from '@nestjs/mongoose';
import {{ DATABASE_CONNECTION_NAME }} from 'src/common/database/constants/database.constant';
import {{ {p}Entity, {p}Schema }} from './entities/{name}.entity';
import {{ {p}Repository }} from './repositories/{name}.repository';

@Module({{
  imports: [
    MongooseModule.forFeature(
      [
        {{
          name: {p}Entity.name,
          schema: {p}Schema,
        }},
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [{p}Repository],
  exports: [{p}Repository],
}})
export class {p}RepositoryModule {{}}
""",
    )

    write(
        folder / f"{name}.module.ts",
        f"""import {{ Module }} from '@nestjs/common';
import {{ {p}RepositoryModule }} from './repository/{name}.repository.module';
import {{ {p}Service }} from './services/{name}.service';

@Module({{
  imports: [{p}RepositoryModule],
  providers: [{p}Service],
  exports: [{p}Service],
}})
export class {p}Module {{}}
""",
    )

    write(
        folder / "services" / f"{name}.service.ts",
        f"""import {{ Injectable, NotFoundException }} from '@nestjs/common';
import {{ ClientSession }} from 'mongoose';
import {{
  IDatabaseCreateOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseManyOptions,
  IDatabaseSaveOptions,
}} from 'src/common/database/interfaces/database.interface';
import {{ {p}CreateDto }} from '../dtos/{name}.create.dto';
import {{ {p}UpdateDto }} from '../dtos/{name}.update.dto';
import {{
  {p}Doc,
  {p}Entity,
}} from '../repository/entities/{name}.entity';
import {{ {p}Repository }} from '../repository/repositories/{name}.repository';

@Injectable()
export class {p}Service {{
  constructor(private readonly _{c}Repo: {p}Repository) {{}}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<any>,
  ): Promise<{p}Entity[]> {{
    return await this._{c}Repo.findAll(find, options);
  }}

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<{p}Doc> {{
    return await this._{c}Repo.findOneById(_id, options);
  }}

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<any>,
  ): Promise<{p}Doc> {{
    return await this._{c}Repo.findOne(find, options);
  }}

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {{
    return await this._{c}Repo.getTotal(find, options);
  }}

  async create(
    data: {p}CreateDto,
    options?: IDatabaseCreateOptions<any>,
  ): Promise<{p}Doc> {{
    const entity = new {p}Entity();
    Object.assign(entity, data);
    return await this._{c}Repo.create(entity, options);
  }}

  async update(
    repository: {p}Doc,
    data: {p}UpdateDto,
    options?: IDatabaseSaveOptions,
  ): Promise<{p}Doc> {{
    Object.assign(repository, data);
    return await this._{c}Repo.save(repository, options);
  }}

  async active(
    repository: {p}Doc,
    options?: IDatabaseSaveOptions,
  ): Promise<{p}Doc> {{
    if ('isActive' in repository) {{
      (repository as any).isActive = true;
    }}
    if ('status' in repository) {{
      (repository as any).status = 'active';
    }}
    if ('enabled' in repository) {{
      (repository as any).enabled = true;
    }}
    return await this._{c}Repo.save(repository, options);
  }}

  async inactive(
    repository: {p}Doc,
    options?: IDatabaseSaveOptions,
  ): Promise<{p}Doc> {{
    if ('isActive' in repository) {{
      (repository as any).isActive = false;
    }}
    if ('status' in repository) {{
      (repository as any).status = 'inactive';
    }}
    if ('enabled' in repository) {{
      (repository as any).enabled = false;
    }}
    return await this._{c}Repo.save(repository, options);
  }}

  async delete(
    repository: {p}Doc,
    options?: IDatabaseSaveOptions,
  ): Promise<{p}Doc> {{
    return await this._{c}Repo.softDelete(repository, options);
  }}

  async deleteForce(
    repository: {p}Doc,
    options?: IDatabaseManyOptions,
  ): Promise<{p}Doc> {{
    return await this._{c}Repo.delete(repository, options);
  }}

  async exists(
    find?: Record<string, any>,
    options?: IDatabaseManyOptions,
  ): Promise<boolean> {{
    return await this._{c}Repo.exists(find, options);
  }}

  async createMany(
    data: {p}CreateDto[],
    options?: IDatabaseCreateOptions<any>,
  ) {{
    return await this._{c}Repo.createMany(data, options);
  }}

  async deleteMany(
    find: Record<string, any>,
    options?: IDatabaseManyOptions<ClientSession>,
  ) {{
    return await this._{c}Repo.deleteMany(find, options);
  }}

  async _check{p}(id: string): Promise<{p}Doc> {{
    const doc = await this.findOneById(id);
    if (!doc) {{
      throw new NotFoundException({{
        message: '{c}.error.notFound',
      }});
    }}
    return doc;
  }}
}}
""",
    )

    write(
        folder / "dtos" / f"{name}.create.dto.ts",
        f"""import {{ ApiProperty }} from '@nestjs/swagger';
import {{
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
}} from 'class-validator';
import {{ I{p}Entity }} from '../interfaces/{name}.entity.interface';

export class {p}CreateDto implements I{p}Entity {{
{dto_fields}
}}
""",
    )

    write(
        folder / "dtos" / f"{name}.update.dto.ts",
        f"""import {{ PartialType }} from '@nestjs/swagger';
import {{ {p}CreateDto }} from './{name}.create.dto';

export class {p}UpdateDto extends PartialType({p}CreateDto) {{}}
""",
    )

    write(
        folder / "dtos" / f"{name}.request.dto.ts",
        f"""import {{ IsMongoId, IsNotEmpty }} from 'class-validator';

export class {p}RequestDto {{
  @IsNotEmpty()
  @IsMongoId()
  {param}: string;
}}
""",
    )

    write(
        folder / "serializations" / f"{name}.get.serialization.ts",
        f"""import {{ ResponseIdSerialization }} from 'src/common/response/serializations/response.id.serialization';

export class {p}GetSerialization extends ResponseIdSerialization {{}}
""",
    )

    write(
        folder / "serializations" / f"{name}.list.serialization.ts",
        f"""import {{ OmitType }} from '@nestjs/swagger';
import {{ {p}GetSerialization }} from './{name}.get.serialization';

export class {p}ListSerialization extends OmitType(
  {p}GetSerialization,
  [] as const,
) {{}}
""",
    )

    write(
        folder / "constants" / f"{name}.list.constant.ts",
        f"""import {{ ENUM_PAGINATION_ORDER_DIRECTION_TYPE }} from 'src/common/pagination/constants/pagination.enum.constant';

export const {k}_DEFAULT_PER_PAGE = 20;
export const {k}_DEFAULT_ORDER_BY = 'createdAt';
export const {k}_DEFAULT_ORDER_DIRECTION =
  ENUM_PAGINATION_ORDER_DIRECTION_TYPE.DESC;
export const {k}_DEFAULT_AVAILABLE_ORDER_BY = [{order_arr}];
export const {k}_DEFAULT_AVAILABLE_SEARCH = [{search_arr}];
export const {k}_DEFAULT_IS_ACTIVE = [true, false];
""",
    )

    write(
        folder / "constants" / f"{name}.doc.constant.ts",
        f"""import {{ faker }} from '@faker-js/faker';

export const {p}DocQueryIsActive = [
  {{
    name: 'isActive',
    allowEmptyValue: true,
    required: false,
    type: 'string',
    example: 'true,false',
    description: "boolean value with ',' delimiter",
  }},
];

export const {p}DocParamsId = [
  {{
    name: '{param}',
    allowEmptyValue: false,
    required: true,
    type: 'string',
    example: faker.database.mongodbObjectId(),
  }},
];
""",
    )

    write(
        folder / "docs" / f"{name}.doc.ts",
        f"""import {{ applyDecorators, HttpStatus }} from '@nestjs/common';
import {{ ENUM_DOC_REQUEST_BODY_TYPE }} from 'src/common/doc/constants/doc.enum.constant';
import {{
  Doc,
  DocAuth,
  DocRequest,
  DocResponse,
  DocResponsePaging,
}} from 'src/common/doc/decorators/doc.decorator';
import {{ ResponseIdSerialization }} from 'src/common/response/serializations/response.id.serialization';
import {{ {p}DocParamsId }} from '../constants/{name}.doc.constant';
import {{ {p}CreateDto }} from '../dtos/{name}.create.dto';
import {{ {p}UpdateDto }} from '../dtos/{name}.update.dto';
import {{ {p}GetSerialization }} from '../serializations/{name}.get.serialization';
import {{ {p}ListSerialization }} from '../serializations/{name}.list.serialization';

export function {p}ListDoc(): MethodDecorator {{
  return applyDecorators(
    Doc({{ summary: 'get all {name}' }}),
    DocAuth({{ jwtAccessToken: true }}),
    DocResponsePaging<{p}ListSerialization>('{c}.list', {{
      serialization: {p}ListSerialization,
    }}),
  );
}}

export function {p}GetDoc(): MethodDecorator {{
  return applyDecorators(
    Doc({{ summary: 'get detail of {name}' }}),
    DocRequest({{ params: {p}DocParamsId }}),
    DocAuth({{ jwtAccessToken: true }}),
    DocResponse<{p}GetSerialization>('{c}.get', {{
      serialization: {p}GetSerialization,
    }}),
  );
}}

export function {p}CreateDoc(): MethodDecorator {{
  return applyDecorators(
    Doc({{ summary: 'create {name}' }}),
    DocAuth({{ jwtAccessToken: true }}),
    DocRequest({{
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: {p}CreateDto,
    }}),
    DocResponse<ResponseIdSerialization>('{c}.create', {{
      httpStatus: HttpStatus.CREATED,
      serialization: ResponseIdSerialization,
    }}),
  );
}}

export function {p}UpdateDoc(): MethodDecorator {{
  return applyDecorators(
    Doc({{ summary: 'update {name}' }}),
    DocRequest({{
      params: {p}DocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      body: {p}UpdateDto,
    }}),
    DocAuth({{ jwtAccessToken: true }}),
    DocResponse<ResponseIdSerialization>('{c}.update', {{
      serialization: ResponseIdSerialization,
    }}),
  );
}}

export function {p}InactiveDoc(): MethodDecorator {{
  return applyDecorators(
    Doc({{ summary: 'make {name} inactive' }}),
    DocRequest({{ params: {p}DocParamsId }}),
    DocAuth({{ jwtAccessToken: true }}),
    DocResponse('{c}.inactive'),
  );
}}

export function {p}ActiveDoc(): MethodDecorator {{
  return applyDecorators(
    Doc({{ summary: 'make {name} active' }}),
    DocRequest({{ params: {p}DocParamsId }}),
    DocAuth({{ jwtAccessToken: true }}),
    DocResponse('{c}.active'),
  );
}}

export function {p}DeleteDoc(): MethodDecorator {{
  return applyDecorators(
    Doc({{ operation: '{c}.delete' }}),
    DocAuth({{ jwtAccessToken: true }}),
    DocRequest({{ params: {p}DocParamsId }}),
    DocResponse('{c}.delete'),
  );
}}
""",
    )

    # Response messages live in src/common/message/constants/messages.constant.ts

    tenant_find = ""
    tenant_create = ""
    user_imports_extra = ""
    user_ctor_extra = ""
    if tenant_scoped:
        tenant_find = """
    const tenantScope = user?.tenantId ? { tenantId: String(user.tenantId) } : {};
"""
        tenant_create = """
      const payload = {
        ...body,
        tenantId: body.tenantId || String(user?.tenantId || ''),
      };
"""
    else:
        tenant_find = "\n    const tenantScope = {};\n"
        tenant_create = "\n      const payload = { ...body };\n"

    def controller(kind: str) -> str:
        protected = "AdminProtected" if kind == "admin" else "UserProtected"
        decorator_import = (
            "import { AdminProtected } from 'src/modules/admin/decorators/admin.user.decorator';"
            if kind == "admin"
            else "import { GetUser, UserProtected } from 'src/modules/user/decorators/user.decorator';\nimport { UserDoc } from 'src/modules/user/repository/entities/user.entity';"
        )
        user_param = "" if kind == "admin" else "@GetUser() user: UserDoc,"
        user_param_create = user_param
        list_user = "" if kind == "admin" else "@GetUser() user: UserDoc,\n    "
        create_user = "" if kind == "admin" else "    @GetUser() user: UserDoc,\n"
        find_scope = (
            "const find: Record<string, any> = { ..._search };"
            if kind == "admin"
            else """const find: Record<string, any> = {
      ..._search,
      ...(user?.tenantId ? { tenantId: String(user.tenantId) } : {}),
    };"""
        )
        create_body = (
            "const data = { ...body };"
            if kind == "admin"
            else """const data = {
        ...body,
        tenantId: (body as any).tenantId || String(user?.tenantId || ''),
      };"""
        )
        # package/content/payment-method are not tenant scoped even on user
        if not tenant_scoped:
            find_scope = "const find: Record<string, any> = { ..._search };"
            create_body = "const data = { ...body };"

        active_block = ""
        if active_field or True:
            active_block = f"""
  @{p}InactiveDoc()
  @ResponseSingle('{c}.inactive')
  @{protected}()
  @RequestParamGuard({p}RequestDto)
  @Patch('/update/inactive/:{param}')
  async inactive(@Param('{param}') id: string): Promise<IResponse> {{
    const doc = await this._{c}Service._check{p}(id);
    await this._{c}Service.inactive(doc);
    return {{ data: doc?._id }};
  }}

  @{p}ActiveDoc()
  @ResponseSingle('{c}.active')
  @{protected}()
  @RequestParamGuard({p}RequestDto)
  @Patch('/update/active/:{param}')
  async active(@Param('{param}') id: string): Promise<IResponse> {{
    const doc = await this._{c}Service._check{p}(id);
    await this._{c}Service.active(doc);
    return {{ data: doc?._id }};
  }}
"""

        class_name = f"{'Admin' if kind == 'admin' else 'User'}{p}Controller"
        return f"""import {{
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
}} from '@nestjs/common';
import {{ ApiTags }} from '@nestjs/swagger';
import {{ PaginationQuery }} from 'src/common/pagination/decorators/pagination.decorator';
import {{ PaginationListDto }} from 'src/common/pagination/dto/pagination.list.dto';
import {{ PaginationService }} from 'src/common/pagination/services/pagination.service';
import {{ RequestParamGuard }} from 'src/common/request/decorators/request.decorator';
import {{
  ResponsePaging,
  ResponseSingle,
}} from 'src/common/response/decorators/response.decorator';
import {{
  IResponse,
  IResponsePaging,
}} from 'src/common/response/interfaces/response.interface';
import {{ ResponseIdSerialization }} from 'src/common/response/serializations/response.id.serialization';
{decorator_import}
import {{
  {k}_DEFAULT_AVAILABLE_ORDER_BY,
  {k}_DEFAULT_AVAILABLE_SEARCH,
  {k}_DEFAULT_ORDER_BY,
  {k}_DEFAULT_ORDER_DIRECTION,
  {k}_DEFAULT_PER_PAGE,
}} from '../constants/{name}.list.constant';
import {{
  {p}ActiveDoc,
  {p}CreateDoc,
  {p}DeleteDoc,
  {p}GetDoc,
  {p}InactiveDoc,
  {p}ListDoc,
  {p}UpdateDoc,
}} from '../docs/{name}.doc';
import {{ {p}CreateDto }} from '../dtos/{name}.create.dto';
import {{ {p}RequestDto }} from '../dtos/{name}.request.dto';
import {{ {p}UpdateDto }} from '../dtos/{name}.update.dto';
import {{ I{p}Entity }} from '../interfaces/{name}.entity.interface';
import {{ {p}Doc }} from '../repository/entities/{name}.entity';
import {{ {p}GetSerialization }} from '../serializations/{name}.get.serialization';
import {{ {p}ListSerialization }} from '../serializations/{name}.list.serialization';
import {{ {p}Service }} from '../services/{name}.service';

@ApiTags('{p}')
@Controller({{ version: '1', path: '/{name}' }})
export class {class_name} {{
  constructor(
    private readonly _{c}Service: {p}Service,
    private readonly paginationService: PaginationService,
  ) {{}}

  @{p}ListDoc()
  @ResponsePaging('{c}.list', {{
    serialization: {p}ListSerialization,
  }})
  @{protected}()
  @Get('/list')
  async list(
    {list_user}@PaginationQuery(
      {k}_DEFAULT_PER_PAGE,
      {k}_DEFAULT_ORDER_BY,
      {k}_DEFAULT_ORDER_DIRECTION,
      {k}_DEFAULT_AVAILABLE_SEARCH,
      {k}_DEFAULT_AVAILABLE_ORDER_BY,
    )
    {{ _search, _limit, _offset, _order }}: PaginationListDto,
  ): Promise<IResponsePaging> {{
    {find_scope}

    const docs: I{p}Entity[] = await this._{c}Service.findAll(find, {{
      paging: {{
        limit: _limit,
        offset: _offset,
      }},
      order: _order,
    }});
    const total: number = await this._{c}Service.getTotal(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);

    return {{
      _pagination: {{ total, totalPage }},
      data: docs,
    }};
  }}

  @{p}GetDoc()
  @ResponseSingle('{c}.get', {{
    serialization: {p}GetSerialization,
  }})
  @{protected}()
  @RequestParamGuard({p}RequestDto)
  @Get('/get/:{param}')
  async get(@Param('{param}') id: string): Promise<IResponse> {{
    const doc = await this._{c}Service._check{p}(id);
    return {{ data: doc }};
  }}

  @{p}CreateDoc()
  @ResponseSingle('{c}.create', {{
    serialization: ResponseIdSerialization,
  }})
  @Post('/create')
  @{protected}()
  async create(
{create_user}    @Body()
    body: {p}CreateDto,
  ): Promise<IResponse> {{
    {create_body}
    const doc: {p}Doc = await this._{c}Service.create(data);
    return {{
      data: doc?._id,
    }};
  }}

  @{p}UpdateDoc()
  @ResponseSingle('{c}.update', {{
    serialization: ResponseIdSerialization,
  }})
  @{protected}()
  @RequestParamGuard({p}RequestDto)
  @Patch('/update/:{param}')
  async update(
    @Param('{param}') id: string,
    @Body()
    body: {p}UpdateDto,
  ): Promise<IResponse> {{
    const doc = await this._{c}Service._check{p}(id);
    await this._{c}Service.update(doc, body);
    return {{
      data: doc?._id,
    }};
  }}
{active_block}
  @{p}DeleteDoc()
  @ResponseSingle('{c}.delete')
  @{protected}()
  @RequestParamGuard({p}RequestDto)
  @Delete('/delete/:{param}')
  async delete(@Param('{param}') id: string): Promise<IResponse> {{
    const doc = await this._{c}Service._check{p}(id);
    await this._{c}Service.delete(doc);
    return {{ data: doc?._id }};
  }}
}}
"""

    if spec.get("admin"):
        write(folder / "controllers" / f"admin.{name}.controller.ts", controller("admin"))
    if spec.get("user"):
        write(folder / "controllers" / f"user.{name}.controller.ts", controller("user"))


def main() -> None:
    for spec in MODULES_SPEC:
        generate_module(spec)
        print(f"generated {spec['name']}")


if __name__ == "__main__":
    main()
