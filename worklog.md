# POS Nepal - Development Worklog

---
Task ID: 1
Agent: Main
Task: Major feature updates - Outlets, Packages, Landing Page, and cleanup

Work Log:
- Updated types/index.ts: Removed Contract, ContractStatus types; removed sa-contracts, customers from NavSection; removed PlanType; added SubscriptionPackage (with individual feature booleans per user spec), Outlet types; added tenant-outlets NavSection
- Added Customer type back (still needed by POS for billing)
- Updated mock-data: Replaced SubscriptionPlan with 4 SubscriptionPackages (Plan 1-4) matching user spec exactly; added 9 mock Outlets across 4 tenants; kept mockCustomers for POS; removed mockContracts
- Created useOutletSelectorStore in auth/store.ts for tenant outlet selection
- Updated sidebar: Removed Customer from tenant menu; removed Contracts from SA menu; renamed Subscriptions to Packages; added Outlets to tenant Settings; added OutletSelector component (mirrors TenantSelector pattern)
- Updated page.tsx: Removed ContractsPage and CustomersPage imports; changed sa-packages mapping; added TenantOutlets import
- Created subscription-management.tsx: Full CRUD for package definitions with feature comparison grid, 7 toggleable features per plan
- Rewrote landing-page.tsx: 7 sections (Hero, Features, How It Works, Pricing with 4 plans, Testimonials, FAQ with Accordion, Referral CTA, Footer) with dark/light mode
- Updated tenant-dashboard.tsx: Added ReferralCard component with copy link/share buttons and referral stats
- Created tenant-outlets.tsx: Full CRUD for outlet management with search, status filter, default outlet badge
- Fixed command-palette.tsx: Updated all nav sections to match new sidebar
- Fixed tenant-management.tsx: Updated PlanType references to string plans (Plan 1-4)
- Fixed sa-tenant-overview.tsx, sa-tenant-subscription.tsx, tenant-subscription-page.tsx: Updated mockPlans→mockPackages, planName→packageName
- Fixed helpers.ts: Removed PlanType import, updated getPlanBadgeClasses to accept string

Stage Summary:
- All requested changes implemented and verified via agent-browser
- Landing page: 7 sections with 4 pricing plans, promo code input, FAQ, testimonials
- SA sidebar: Packages (not Subscriptions), Promotions, Referrals, Profile - no Contracts
- Tenant sidebar: Outlet selector, no Customer, Sales & Reports merged, Outlets/Profile/Settings added
- Outlet system: 9 mock outlets across 4 tenants, default outlet concept, selector in sidebar
- Lint passes cleanly

---
Task ID: 2 (from previous context)
Agent: Main
Task: Various bug fixes and feature requests

Work Log:
- Fixed tenant view showing both admin and tenant menus simultaneously
- Fixed sa-tenant-vendors.tsx missing formatDate import

Stage Summary:
- All previous bugs resolved
- Codebase stable for new feature development

---
Task ID: 3
Agent: Main
Task: Landing page pricing toggle, registration, WhatsApp button, SA Payment page, Support Tickets system

Work Log:
- **Types**: Added SupportTicket (with priority/status/category), AdminPaymentMethod, PaymentReceipt types; Added sa-payment, sa-support-tickets, tenant-support to NavSection
- **Mock Data**: Added mockSupportTickets (7 tickets across tenants), mockAdminPaymentMethods (eSewa/Khalti/Bank/QR), mockPaymentReceipts (5 receipts with various statuses)
- **Landing Page**: Complete rewrite with:
  - Monthly/Annually billing toggle (animated spring toggle button)
  - 20% discount badge and "Limited Time Offer" for annual plans
  - Strikethrough original price showing savings
  - Registration dialog (store name, full name, email, phone, password, referral code)
  - Free Plan 7-Day Trial banner in pricing section
  - Trial Expired popup (progress bar, quick plan selection, upgrade CTA)
  - WhatsApp floating button (bottom-right, green, hover tooltip "Chat with us!")
  - FAQ updated: 7-day trial (was 14-day)
- **SA Payment Page** (new): Payment Methods tab with eSewa/Khalti/Bank/QR cards + toggle switches; Payment Receipts tab with table, View/Approve/Reject actions, dialogs
- **SA Support Tickets Page** (new): All tenant tickets, status/category filters, search, expandable cards with inline response textarea, Mark as Resolved
- **Tenant Support Page** (new): Create/view tickets for tenant, New Ticket dialog with category/priority, expandable ticket cards showing responses
- **Sidebar**: Added Finance section (Payment, Support Tickets) to SA; Added Support to Tenant Settings group
- **page.tsx**: Added imports and mappings for SAPayment, SASupportTickets, TenantSupport

Stage Summary:
- All 5 features implemented and browser-verified
- Landing page: pricing toggle works, registration dialog, WhatsApp button visible, trial popup functional
- SA Payment: 4 payment methods with QR mock, 5 receipts with approve/reject flow
- Support Tickets: Full bidirectional flow (tenant creates, SA responds)
- Lint passes clean, no runtime errors

---
Task ID: 4
Agent: Main
Task: Update pricing plans, Sign In/Get Started toggle, T&C/Privacy in Settings, UI polish

Work Log:
- **Mock Data**: Updated packages from Plan 1-4 to Basic (NPR 999, 50 items, 1 staff), Medium (NPR 4,999, 200 items, 5 staff, popular), High (NPR 9,999, 500 items, 10 staff). Removed Plan 4. Updated all tenant plan references and subscription data.
- **Landing Page**: Default billing toggle now starts on "Annually". Added Custom plan card (dashed border, "Contact Us" via WhatsApp). Removed Referral from nav links (section still exists). Footer cleaned up: removed duplicate Privacy Policy from Support, added proper icons to Contact section. T&C and Privacy Policy dialogs now read content from `useLegalContentStore`. Added markdown-like renderer for legal content.
- **Login Page**: Merged Sign In and Get Started (Register) into a single page with animated tab toggle (spring animation). Added "Back to Home" button (appears only when accessed from landing page). Registration form includes free trial banner, all required fields.
- **SA Settings**: Added Terms & Conditions tab (markdown textarea editor, Reset to Default, Preview dialog, Save/Discard). Added Privacy Policy tab (same features). Both read/write to `useLegalContentStore` which shares content with the landing page dialogs.
- **Sidebar**: Removed standalone Legal section (T&C and Privacy Policy) from SA sidebar menu. These are now accessible only through Settings tabs.
- **Types**: Removed `sa-terms-conditions` and `sa-privacy-policy` from NavSection union type.
- **page.tsx**: Removed SATermsConditions and SAPrivacyPolicy imports/mappings. Added `onBack` prop to LoginPage.
- **Helpers**: Updated `getPlanBadgeClasses` to handle Basic/Medium/High plan names (case-insensitive).
- **Tenant Management**: Updated plan colors, form defaults, select items, plan order from Plan 1-4 to Basic/Medium/High.
- **Tenant Subscription**: Updated currentPlanName from 'Plan 2' to 'Medium', fixed avatar initial rendering.

Stage Summary:
- All changes browser-verified via agent-browser
- Landing page: 3 paid plans + Custom card, default annually, no Referral in nav, T&C/Privacy footer links work
- Login page: Sign In / Get Started toggle with animated indicator, Back to Home button works
- SA Settings: 5 tabs (Branding, Domain, Payment Methods, Terms & Conditions, Privacy Policy)
- Legal content flows from SA Settings editor → store → landing page dialogs
- Lint passes clean, all references to old plan names updated
---
Task ID: 1
Agent: Main Agent
Task: Update packages with new features, landing page redesign, standalone legal pages, custom domain settings

Work Log:
- Updated SubscriptionPackage type: renamed advanceInventory to inventory, added maxOutlets, skuManagement, vendors, invoicePrinting, trainingAndSupport, customDomain, dailyBackup
- Updated mockPackages: Basic(1 outlet), Medium(5 outlets), High(10 outlets) with all new feature flags
- Updated subscription-management.tsx with new feature toggles, imports (Barcode, Truck, Printer, GraduationCap, Globe, HardDrive), maxOutlets form field
- Fixed all advanceInventory references across sa-tenant-subscription, sa-tenant-overview, tenant-subscription-page
- Rewrote landing-page.tsx: standalone Terms & Conditions and Privacy Policy full pages (not popups), footer only Privacy Policy link, 13 feature toggles with outlet count, renamed Advanced Inventory to Inventory, default annually selected
- Added Custom Domains tab to SA Settings with global domain settings, subdomain format, SSL provisioning, tenant subdomain table with copy buttons
- Added Domain Settings section to Tenant Admin settings with subdomain display, custom domain configuration, DNS verification flow
- Fixed JSX parsing error with {tenant-name} in SA settings (needed string literal escaping)

Stage Summary:
- All package features now include: Billing, Receipt, Export, Inventory, SKU Management, POS, Payment Gateway, Multiple Outlets, Vendors, Invoice Printing, Training & Support, Custom Domain, Daily Backup
- Landing page has full-page legal views with Back navigation
- SA Settings has 6 tabs: Branding, Domain, Payment Methods, Terms & Conditions, Privacy Policy, Custom Domains
- Tenant Settings has Domain Settings card with subdomain info and custom domain setup
- All verified via agent-browser

---
Task ID: 2-a
Agent: Main Agent
Task: Create Purchase Management page for tenant POS

Work Log:
- Created `/src/features/tenant/purchases/components/purchase-management.tsx` — full-featured Purchase Order management component
- **Summary Cards** (4 StatCards): Total Orders, Pending Orders (draft+sent), In Transit (sent+partial), Total Value (NPR)
- **Tabs**: Orders List | Create Order
- **Orders List Tab**: Search (order # or vendor name) + Status filter dropdown (all/draft/sent/partial/received/cancelled); Table with columns: Order #, Vendor, Items Count, Status (color badges), Total (NPR), Date, Actions (View/Receive/Cancel)
- **Status Badges**: draft=gray, sent=blue, partial=amber, received=green, cancelled=red
- **Create Order Tab**: Vendor dropdown (active vendors from mockVendors), product search with dropdown (from mockProducts), add items with auto-filled costPrice, quantity +/- controls, auto-calculated subtotal + 13% VAT + total, notes field, expected delivery date, save as draft
- **View Order Dialog**: Full order details with status timeline (Draft→Sent→Partial→Received, or Cancelled), vendor/status/date info grid, items table with ordered vs received quantities (color-coded), totals summary, action buttons (Receive Items, Cancel Order)
- **Receive Order Dialog**: For sent/partial orders, pre-fills remaining quantity per item, clamped input (0 to remaining), updates status to partial or received accordingly
- **Export CSV**: Downloads filtered orders as CSV with all key fields
- **Pagination**: 10 items per page with Previous/Next and page indicator
- All imports use specified paths: `@/lib/mock-data`, `@/lib/types`, `@/lib/helpers`, `@/components/shared/stat-card`, `@/components/shared/page-header`, `sonner` toast
- Lint passes cleanly

Stage Summary:
- Purchase Management page fully implemented with all 9 requirements
- Consistent with existing page patterns (billing-page.tsx, vendors-page.tsx)
- Responsive design, hover effects on table rows, proper shadcn/ui components throughout

---
Task ID: 2-e
Agent: Main Agent
Task: Create Stock Transfer page for multi-outlet inventory management

Work Log:
- Created `/src/features/tenant/stock-transfer/components/stock-transfer-page.tsx`
- **Summary Cards** (4 StatCards): Total Transfers, Pending (gray), In Transit (blue), Completed (purple) — all with color-coded left borders and icon backgrounds
- **Tabs**: Transfers List | Create Transfer
- **Transfers List Tab**: Search (transfer # or outlet name) + Status filter dropdown (all/pending/in-transit/completed/cancelled); Table with columns: Transfer #, From Outlet (with MapPin icon), To Outlet (with MapPin icon), Items Count (badge), Status (color badges), Date, Created By, Actions (View/Complete/Cancel)
- **Status Badges**: pending=gray, in-transit=blue, completed=green, cancelled=red (custom `getTransferStatusBadgeClasses` function)
- **Create Transfer Tab**: From/To outlet selects (filtered by tenant 't1', To excludes selected From), reason field (required), product search with dropdown (from mockProducts, filtered by active and not already added), add items with +/- quantity controls, notes field (optional), summary showing total products/units and outlet names, submit creates pending transfer
- **View Transfer Dialog**: Full transfer details with status badge + reason, outlet info grid (from/to with MapPin icons, dates, created by, total units), items table with product/SKU/quantity/unit price/calculated value, estimated value summary, action buttons (Complete Transfer for in-transit, Cancel for pending)
- **Complete Transfer Dialog**: For in-transit transfers, shows transfer summary (#, from, to, items count), items preview table, Confirm Completion button — marks transfer as completed with today's date
- **Cancel Transfer**: Available for pending transfers from both table actions and view dialog
- **Export CSV**: Downloads filtered transfers with columns (Transfer #, From, To, Items, Units, Status, Reason, Dates, Created By)
- **Pagination**: 10 items per page with Previous/Next and page indicator
- All imports match spec: `@/lib/mock-data`, `@/lib/types`, `@/lib/helpers` (npr, formatDate), `@/components/shared/stat-card`, `@/components/shared/page-header`, `sonner` toast
- Lint passes cleanly, no compilation errors

Stage Summary:
- Stock Transfer page fully implemented with all 9 requirements
- Consistent with purchase-management.tsx patterns and existing page design
- Responsive design, hover effects on table rows, proper shadcn/ui components throughout

---
Task ID: 2-d
Agent: Main Agent
Task: Create Notifications & Alerts page for tenant

Work Log:
- Rewrote `/src/features/tenant/notifications/components/notifications-page.tsx` to use `mockNotifications` from `@/lib/mock-data` and proper types (`AppNotification`, `NotificationType`, `NotificationPriority`) from `@/lib/types`
- **Summary Row** (3 stat cards with colored left borders): Unread count (red, Bell icon), Today's Notifications (primary, Filter icon), Critical Alerts (red, AlertTriangle icon)
- **Tabs**: All | Unread | Critical | Low Stock | Expiry | System — each with count badge, styled as rounded-full pills using TabsList/TabsTrigger
- **Notification Cards**: Card-based list (not table), each card shows:
  - Type-specific icon (AlertTriangle, XCircle, Clock, CreditCard, PackageCheck, ArrowLeftRight, Banknote, Info) with colored background
  - Priority left border (critical=red, high=amber, medium=blue, low=gray)
  - Title (bold for unread), message (muted, line-clamp-2), relative time, priority badge, type badge
  - Blue dot unread indicator
  - Action button ("View" with ArrowRight) if `actionUrl` exists, navigates via `useNavStore.setCurrentSection`
  - Mark as Read button (CheckCheck icon) for unread notifications
- **Bulk Actions**: Mark All as Read, Delete All Read — in PageHeader children, with toast feedback
- **Empty State**: BellOff icon + contextual message (varies by active tab)
- **ScrollArea**: Max height 600px with custom scrollbar for long notification lists
- Imports: `mockNotifications`, `AppNotification`, `NotificationType`, `NotificationPriority`, `useNavStore`, `PageHeader`, `toast`, shadcn/ui (Card, Button, Badge, Tabs, ScrollArea), Lucide icons (Bell, BellOff, CheckCheck, Trash2, AlertTriangle, XCircle, Clock, CreditCard, PackageCheck, ArrowLeftRight, Banknote, Info, Filter, ArrowRight)
- Lint passes cleanly

Stage Summary:
- Notifications page fully rewritten with all 6 requirements
- Uses centralized mock data and types from the project codebase
- Card-based layout with priority indicators, type icons, action navigation
- Responsive design with mobile-friendly tab pills and scrollable list

---
Task ID: 2-c
Agent: Main Agent
Task: Enhance Customers page with loyalty points, credit management, purchase history, and credit overview tab

Work Log:
- Enhanced `/src/features/tenant/customers/components/customers-page.tsx` with 7 new features:
  1. **Summary Cards** (4 StatCards): Total Customers (Users icon, blue), Active Credit (CreditCard icon, rose), Total Loyalty Points (Gift icon, amber), Average Purchase Value (TrendingUp icon, emerald)
  2. **Main Tabs**: Customer List | Credit Overview — using shadcn Tabs at top level wrapping the entire content
  3. **Customer List Tab**: Extended existing table with new columns: Loyalty Points (amber badge with Coins icon), Credit Balance (rose text), Purchase History action in dropdown menu
  4. **Credit Overview Tab**: Table of customers with creditBalance > 0 showing: customer name/avatar, credit balance (rose), credit limit, utilization % (Progress bar color-coded: green < 50%, amber 50-80%, rose > 80%), overdue days (badge with AlertTriangle), Pay/Extend action buttons. Footer shows count and total outstanding.
  5. **Loyalty Points section** (in customer detail dialog → Loyalty tab): Large gradient card showing points balance with Gift icon, Add Points button (Plus icon) and Redeem Points button (Gift icon, disabled when 0). Add/Redeem dialog with customer info, points input (with max validation for redeem), reason input, toast feedback.
  6. **Credit Management section** (in customer detail dialog → Credit tab): Two stat cards (Credit Balance with CreditCard icon, Available Credit with Banknote icon), credit utilization Progress bar (color-coded), Record Payment and Extend Credit Limit buttons.
  7. **Purchase History**: Customer detail dialog → Purchases tab filters mockSales by customerName showing real sales data (invoice #, date, items count, payment method with colored dot, status badge, total). Standalone Purchase History dialog accessible from table row dropdown menu, with stats row (Total Orders, Total Spent, Avg Order) and scrollable sales table (max-h-96).
  8. **Add Customer form**: Extended with Credit Limit (NPR) number input, Loyalty Points field (disabled, starts at 0 for new, shows current for edit). Form state now includes creditLimit.
- **New Dialogs**: Add/Redeem Loyalty Points, Record Credit Payment (with payment method Select), Extend Credit Limit (with preview of new limit)
- **Imports added**: mockSales from @/lib/mock-data, Sale type, Progress, Select/SelectContent/SelectItem/SelectTrigger/SelectValue, Coins, CreditCard, Gift, Banknote, Plus, AlertTriangle icons
- **Credit actions**: Record Payment deducts from creditBalance (validates ≤ balance), Extend Credit adds to creditLimit, both update state and viewingCustomer for immediate UI refresh
- Lint passes cleanly, no compilation errors

Stage Summary:
- Customers page enhanced with loyalty points, credit management, purchase history, and credit overview
- 4 summary cards, 2 main tabs, 4 detail dialog tabs (Overview, Loyalty, Credit, Purchases)
- 3 new action dialogs (Loyalty Add/Redeem, Record Payment, Extend Credit)
- Standalone Purchase History dialog from table actions using real mockSales data
- Credit Overview tab with utilization progress bars, overdue badges, and pay/extend actions
- Add Customer form includes credit limit field, loyalty points start at 0
- Responsive design, consistent with existing pages, lint clean

---
Task ID: 2-b
Agent: Main Agent
Task: Enhance Sales & Reports page with Profit & Loss, Inventory Report, and VAT Report tabs with Recharts visualizations

Work Log:
- Enhanced `/src/features/tenant/sales-reports/components/sales-reports-page.tsx` with 3 new report tabs while keeping existing Sales tab intact
- **Tabs**: Sales (existing) | Profit & Loss (new) | Inventory (new) | VAT (new)
- **Profit & Loss Tab**:
  - 4 Summary Cards: Total Revenue (emerald, TrendingUp), Total COGS (red, TrendingDown), Gross Profit (sky, BarChart3), Net Profit (emerald, DollarSign)
  - Recharts BarChart showing monthly Revenue vs COGS vs Net Profit with custom NPR tooltip, `hsl(var(--chart-*))` colors for theme consistency
  - Table: Month, Revenue, COGS, Gross Profit, Expenses (hidden on mobile), Net Profit, Margin % (color-coded badge: green ≥20%, amber ≥10%, red <10%)
  - Totals row with overall margin calculation
- **Inventory Report Tab**:
  - 4 Summary Cards: Total Products (primary, Package), Total Stock Value (emerald, DollarSign), Low Stock Items (amber, AlertTriangle), Dead Stock (red, Archive)
  - Recharts PieChart (donut style with innerRadius=60) showing stock value by category with custom label, 8-color palette
  - Table: Category, Products Count, Total Value, Low Stock Count (badge), Status (Healthy/Attention Needed badge)
  - Totals row
- **VAT Report Tab**:
  - 4 Summary Cards: Total VAT Collected (emerald, TrendingUp), Total VAT Paid (red, TrendingDown), Net VAT Payable (primary, Receipt, color-coded), Filing Period (sky, Calendar)
  - Recharts LineChart showing VAT Collected vs VAT Paid trend with dots and active dots
  - Table: Month, Taxable Amount, VAT Collected 13% (emerald), VAT Paid (red), Net Payable (color-coded)
  - Totals row
- **Export for ALL tabs**: Export CSV (actual download via Blob) and Export PDF (window.print mock) buttons in PageHeader, dynamically shown per active tab
- **Helper functions**: `formatMonthLabel` to convert '2024-01' to 'January 2024', `downloadCSV` shared utility, `NprTooltipContent` Recharts custom tooltip component
- **New imports**: mockProfitLossData, mockProducts from @/lib/mock-data; Recharts components (BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line); Lucide icons (PieChartIcon, Package, AlertTriangle, Archive, TrendingDown, FileText, Printer)
- Lint passes cleanly with no errors

Stage Summary:
- Sales Reports page now has 4 tabs: Sales (original), Profit & Loss, Inventory, VAT
- Each new tab has 4 summary cards, a Recharts visualization (Bar/Pie/Line), and a detailed table with totals row
- All tabs have working CSV export and PDF (print) export buttons
- Responsive design: hidden columns on mobile, chart resize via ResponsiveContainer, flex-wrap on cards
- Theme-aware: uses CSS variables for chart colors, dark mode compatible badges and text
- Export name unchanged: `default function SalesReportsPage()` for backward compatibility

---
Task ID: 3-a
Agent: Main Agent
Task: Enhance Inventory page with Batch & Expiry tab and Barcode & QR tab

Work Log:
- Enhanced `/src/features/tenant/inventory/components/inventory-page.tsx` with two new tabs added to the existing Tabs component (keeping 'current' and 'movements' intact)
- **New imports**: Added `mockBatches` from `@/lib/mock-data`, `Batch` type from `@/lib/types`, Lucide icons (Clock, XCircle, CheckCircle, QrCode, ScanBarcode, Printer)
- **New state**: `batchFilter` (all/good/expiring-soon/expired), `barcodeSearch` (string)
- **Batch & Expiry Tab**:
  - 4 Summary Cards: Total Batches (Package icon), Expiring Soon (Clock icon, amber), Expired (XCircle icon, red), Good Stock (CheckCircle icon, emerald)
  - Table with columns: Batch # (monospace), Product, SKU (hidden on mobile), Quantity, Remaining (color-coded: red=0, amber≤30%, green>30%), Cost Price (NPR, hidden on mobile), MFG Date (hidden on mobile), Expiry Date (hidden on mobile), Status (Badge: good=green, expiring-soon=amber, expired=red), Days Until Expiry (color-coded: red=negative, amber≤7d, green>7d)
  - Status filter dropdown (All, Good, Expiring Soon, Expired)
  - Empty state message when no batches match filter
  - Uses `mockBatches` data with real-time days-until-expiry calculation
- **Barcode & QR Tab**:
  - Search/filter bar by product name or SKU
  - Print Barcode Labels button (opens `window.print()` dialog)
  - Product grid: 1 col mobile, 2 cols sm, 3 cols lg, 4 cols xl
  - Each product card shows: Product name, SKU (monospace), barcode number (monospace, centered, tracking-widest), visual CSS barcode (vertical bars generated from barcode digits as widths), QR code placeholder (9×9 CSS grid with finder patterns in corners, seeded from barcode characters), unit price (NPR), ScanBarcode and QrCode icons
  - Empty state with ScanBarcode icon when no products match search
  - Uses `mockProducts` data with existing `npr` helper
- All existing functionality preserved (Current Stock tab with search/sort/pagination/export, Stock Movements tab, Stock Adjustment dialog)
- Lint passes cleanly, dev server compiles successfully

Stage Summary:
- Inventory page now has 4 tabs: Current Stock, Stock Movements, Batch & Expiry, Barcode & QR
- Batch & Expiry tab provides batch tracking with expiry status filtering and color-coded badges
- Barcode & QR tab shows product grid with CSS-generated barcode visuals and QR code placeholders
- Responsive design: hidden columns on mobile, grid adapts from 1 to 4 columns
- Export name unchanged: `default function InventoryPage()` for backward compatibility

---
Task ID: 3-b
Agent: Main Agent
Task: Enhance Billing page with Invoice Printing, Returns & Refunds tab, and Status filter

Work Log:
- Enhanced `/src/features/tenant/billing/components/billing-page.tsx` with 3 major features while keeping all existing functionality
- **Invoice Printing**:
  - Added "Print Invoice" button (Printer icon) on each sale row in the table (Actions column)
  - Added "Print Invoice" button in the Invoice View Dialog footer
  - Created new Print Invoice Dialog with formatted invoice layout:
    - Store header from mockTenants t1 (ABC Store, PAN: 309876543, Kathmandu Nepal, phone)
    - Invoice number, date, customer name, PAN
    - Items table with qty, unit price, total columns
    - Subtotal, discount, VAT (13%), Grand Total
    - Payment method, staff name
    - Footer: "Thank you for your purchase!" with store name and address
    - Print button that opens a new window with formatted CSS and calls window.print()
  - Uses `useRef` for printable div reference
- **Returns & Refunds Tab**:
  - Added Tabs component wrapping entire page content (Invoices | Returns & Refunds)
  - 4 Summary Cards: Total Returns (sky, RotateCcw), Pending Returns (amber, AlertTriangle), Approved (blue, CheckCircle), Total Refunded Amount (emerald, FileText)
  - Search filter (return #, invoice #, or customer) + Status filter dropdown (All/Requested/Approved/Rejected/Completed)
  - Returns Table: Return #, Invoice #, Customer, Items Count (badge), Refund Amount, Method, Status (color badges), Date, Actions (View/Process)
  - Status badges: requested=amber, approved=blue, rejected=red, completed=green (custom `getReturnStatusBadgeClasses` function)
  - View Return Dialog: Info grid (invoice, customer, status, amount, method, dates, processed by), return reason, returned items table with product/qty/unit price/total/reason
  - Process Return Dialog: For requested/approved returns, shows summary (return #, invoice, customer, items, amount), items preview, refund method select (Cash/Card/eSewa/Khalti/Bank Transfer), Confirm Refund and Reject buttons
  - Confirm sets status to completed with processedBy/processedAt; Reject sets status to rejected
  - Uses `mockReturnRefunds` from `@/lib/mock-data`, imports `ReturnRefund`, `ReturnStatus` from `@/lib/types`
  - Pagination with 10 items per page
- **Status Filter** (already existed, preserved): All, Completed, Refunded, Pending on the Invoices tab
- **Responsive**: Hidden columns on mobile (PAN, Subtotal, VAT, Payment, Items, Method, Date), hidden columns on sm/md/lg breakpoints
- **New imports**: Tabs, TabsContent, TabsList, TabsTrigger, RotateCcw, CheckCircle, XCircle, AlertTriangle, FileText, mockReturnRefunds, mockTenants, ReturnRefund, ReturnStatus
- Export name unchanged: `default function BillingPage()` for backward compatibility

Stage Summary:
- Billing page now has 2 tabs: Invoices (original + print invoice) and Returns & Refunds
- Invoice Printing: Print button on table rows and view dialog, formatted print dialog with window.print()
- Returns & Refunds: Full CRUD with 4 summary cards, filterable table, view/process dialogs
- All existing functionality preserved (create invoice, search, date filter, status filter, pagination)
- Lint passes cleanly, dev server compiles successfully

---
Task ID: 3-c
Agent: Main
Task: Enhance vendors page with purchase history, payment tracking, and summary stats

Work Log:
- Updated `vendors-page.tsx` with 3 new features while preserving all existing functionality (CRUD, CSV export, search, pagination, filter)

**1. Summary Stats Row (replaces old 4-card stats)**
- Total Vendors: count of all vendors
- Active Vendors: count of active vendors  
- Total Orders Value: sum of all `mockPurchaseOrders` totals, formatted with `npr()`
- Outstanding Payments: 30% of received/partial PO value (since 70% is mocked as paid)
- Icons: Building2, UserCheck, FileText, TrendingUp

**2. Vendor View Dialog (new Eye button in actions column)**
- Tabs component (shadcn/ui) with 3 tabs: Details, Purchase Orders, Payments
- **Details Tab**: Two-column grid showing contact person, email, phone, status, PAN, VAT, address, products count
- **Purchase Orders Tab**: Filters `mockPurchaseOrders` by vendorId; table with Order #, Items Count, Status (colored badge via `getPOStatusBadgeClasses`), Total (NPR formatted), Date; View button per row opens order detail dialog
- **Payments Tab**: Three summary cards (Total Ordered, Total Paid, Outstanding) + recent payments table (Payment #, Amount, Method with icons for Bank/Cash/eSewa, Date, Status badge)

**3. Order Detail Dialog**
- Triggered from Purchase Orders tab "View" button
- Shows order meta: status badge, order date, expected date, received date, notes
- Items table: Product name + SKU, Qty ordered, Qty received, unit price, total
- Totals section: Subtotal, VAT, Grand Total

**4. Mock Payment Generator**
- `generateMockPayments(vendorId, vendorPOs)` function creates 2-3 payments per vendor
- Only for received/partial POs; 70% of received value distributed across payments
- Last payment marked as 'pending', rest as 'completed'
- Cycles through Bank, Cash, eSewa methods

**New Imports**:
- `mockPurchaseOrders` from `@/lib/mock-data`
- `PurchaseOrder` from `@/lib/types`
- `npr` from `@/lib/helpers`
- Tabs, TabsContent, TabsList, TabsTrigger from `@/components/ui/tabs`
- CardHeader, CardTitle from `@/components/ui/card`
- Lucide: Eye, CreditCard, TrendingUp, Banknote, Wallet, CircleDollarSign

**New Helpers**:
- `getPOStatusBadgeClasses(status)`: Color-coded badges for PO statuses (draft/sent/received/partial/cancelled)

Stage Summary:
- Vendor page now shows purchase-centric summary stats at top
- View dialog with 3 tabs provides full vendor insights (details, orders, payments)
- Order detail dialog shows items, quantities, and totals
- Mock payment generation provides realistic payment tracking per vendor
- All existing functionality preserved (add/edit/delete vendors, search, filter, pagination, CSV export)
- Lint passes cleanly, dev server compiles successfully

---
Task ID: 1 (Phase 2 - Comprehensive POS Features)
Agent: Main Agent
Task: Implement all 9 core POS modules: Inventory Management, Billing/Sales, Purchase Management, Reports & Analytics, User & Role Management, Customer Management, Supplier Management, Multi-Store/Warehouse, Notifications & Alerts

Work Log:
- **Types**: Added PurchaseOrder, PurchaseOrderItem, Batch, StockTransfer, StockTransferItem, AppNotification, ReturnRefund, ReturnItem, ProfitLossData types; added NavSection values: customers, notifications, purchases, stock-transfer; enhanced Product with barcode + hasBatchTracking fields; enhanced Customer with loyaltyPoints + creditBalance + creditLimit
- **Mock Data**: Added mockPurchaseOrders (6 POs across vendors with various statuses), mockBatches (10 batches with expiry tracking), mockStockTransfers (3 transfers between outlets), mockNotifications (10 notifications: low stock, out of stock, expiry, credit due, purchase received, transfer completed, system), mockReturnRefunds (3 returns with various statuses), mockProfitLossData (6 months of P&L); updated all 16 products with barcode numbers and hasBatchTracking flags; updated all 5 customers with loyaltyPoints, creditBalance, creditLimit
- **New Pages**: Created PurchaseManagement (purchase-management.tsx) with PO CRUD, vendor linking, status workflow, receive flow; Created StockTransferPage (stock-transfer-page.tsx) with transfer CRUD, outlet selection, complete flow
- **Enhanced Pages**:
  - Inventory: Added Batch & Expiry tab (10 batches, status filter, days until expiry) and Barcode & QR tab (CSS barcode/QR generation, print labels)
  - Billing: Added Returns & Refunds tab (3 mock returns, process/approve workflow), Invoice Printing dialog (formatted invoice with print button)
  - Sales Reports: Added Profit & Loss tab (bar chart, monthly table with margin %), Inventory Report tab (pie chart, category breakdown), VAT Report tab (line chart, monthly VAT collected vs paid)
  - Customers: Added loyalty points management (add/redeem), credit management (record payment, extend credit, utilization progress bar), purchase history dialog, Credit Overview tab
  - Vendors: Added summary stats (total orders value, outstanding payments), vendor view dialog with Purchase Orders tab and Payments tab, mock payment generation
  - Notifications: Complete rewrite with card-based notification list, type-specific icons, priority indicators, bulk actions, tab filtering
- **Navigation**: Updated sidebar with new sections: Procurement (Purchases, Stock Transfer), People (Customers), Notifications; Updated command palette with all new sections; Updated page.tsx with 4 new page imports and mappings

Stage Summary:
- All 9 POS modules are now present in the project:
  1. Inventory Management: Products CRUD, categories, stock tracking, alerts, batch/expiry tracking, barcode/QR
  2. Billing/Sales: Invoices, cart, discounts, VAT (13%), multiple payment methods, returns/refunds, invoice printing, POS interface
  3. Purchase Management: Purchase orders, supplier linking, incoming stock tracking, cost price recording
  4. Reports & Analytics: Sales reports, P&L reports, inventory reports, VAT reports, CSV/PDF export
  5. User & Role Management: Admin/cashier/manager roles, permissions, activity logs
  6. Customer Management: Customer database, loyalty points, credit management, purchase history
  7. Supplier/Vendor Management: Vendor database, contact details, purchase history, payment tracking
  8. Multi-Store/Warehouse: Multiple outlets, stock transfer between locations
  9. Notifications & Alerts: Low stock, out of stock, expiry alerts, payment reminders, system notifications
- All new pages verified via agent-browser: Purchases, Stock Transfer, Customers (with loyalty/credit), Notifications (with tabs), Inventory (batch/expiry, barcode), Billing (returns/refunds, invoice print), Reports (P&L, inventory, VAT), Vendors (purchase history, payments)
- Lint passes clean, zero console errors
- Dev server compiles successfully
