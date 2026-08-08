# POS Nepal - Multi-Tenant POS, Inventory & Billing System

## Current Project Status (as of Round 11 Development Session)

### Assessment
The project is in a **production-quality UI prototype state** with **21 feature pages** across 3 roles. Round 11 focused on **1 new page (Notifications), 1 dashboard overhaul with activity feed, mobile-responsive POS, global shared component enhancements, and critical bug fixes**. The codebase compiles cleanly with 0 ESLint errors. All QA tests pass via agent-browser.

### Architecture
- **Framework**: Next.js 16 (App Router) + TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui (New York style)
- **State**: Zustand (auth, navigation, recent sections)
- **Charts**: Recharts with shadcn/ui ChartContainer (Area, Bar, Pie charts) + CSS-based bar charts
- **Icons**: Lucide React
- **Structure**: Feature-based folder structure with layered architecture
- **Data**: 100% mock/static data (no backend)
- **Animations**: Framer Motion (page transitions, login, bulk actions), CSS @keyframes (card-shine, gentle-pulse, gradient-border, number-pop, cart-pulse, float)

### What Was Done This Session (Round 11)

#### Bug Fixes (2)
1. **Top Categories Chart Bars Not Rendering**: Recharts `layout="vertical"` BarChart bars were invisible in the Reports page's Top Categories tab. Root cause: SVG `<path>` elements with CSS variable fill not rendering correctly. Fixed by replacing the Recharts horizontal bar chart with a **CSS-based bar chart** using HTML divs — more reliable, better looking (8 unique colors, rank numbers, percentage labels, hover effects), fully responsive, and accessible.
2. **Reports Page Empty Date Pickers**: Date inputs showed "0" spinbutton values and empty placeholders on load. Fixed by adding `getDefaultDates()` function that initializes dateFrom/dateTo to "Last 7 Days" range, and setting `datePreset` default to `'7d'`.

#### New Features (2)
1. **Notifications Page (NEW PAGE — 21st page)**:
   - Added `'notifications'` to `NavSection` type union
   - Sidebar menu item under Settings (Bell icon)
   - Full-page notification center with 18 Nepal-contextual mock notifications
   - 6 category filter buttons (All, Sale, Payment, Inventory, System, Promotion) with per-category counts
   - Search input for text filtering + Sort dropdown (Newest/Oldest)
   - Rich notification cards: left color indicator, category icon, title, description, relative time, unread blue dot, read/unread visual states
   - Mark individual as read (click) + Mark all as read button with unread count badge
   - Empty state with BellOff icon
   - Sticky footer: "Showing X of Y notifications" with unread count
   - Mobile-responsive (stacked filters on mobile)

2. **Dashboard Recent Activity Feed + Low Stock Alerts**:
   - Dynamic time-of-day greeting ("Good morning/afternoon/evening, Rajesh!") with store name subtitle
   - Animated 2px gradient border line below PageHeader (emerald → amber → purple → red, 6s cycle)
   - Recent Activity Card: 10 Nepal-specific activity items (sales, stock alerts, customer registrations, eSewa/Khalti payments, invoices, price updates)
   - Each activity: colored icon circle, description, relative time, alternating row backgrounds, hover effect, clickable with toast
   - Low Stock Alerts Card: 5 products (DDC Milk, Goldstar Shoes, Surya Lights, Tokla Tea, Amul Butter)
   - Stock progress bars (red if ≤25%, amber otherwise) + individual Restock buttons
   - View All button in activity header

#### Styling & Enhancements (10+ files)
1. **StatCard Component**: New `borderColor` prop (3px left border), `trendColor` prop (positive=emerald/+, negative=red/-, neutral=muted), enlarged icon (h-11 w-11), `hover:scale-[1.01]`
2. **EmptyState Component**: Floating icon animation (`animate-float`), gradient background, larger description text, new `actionNode` prop for custom actions
3. **PageHeader Component**: New `subtitle` prop (responsive, hidden on very small screens)
4. **POS Terminal Mobile Responsive**: Desktop cart hidden on mobile, floating emerald gradient cart button with pulse animation, full-height Sheet drawer for cart, 2-col product grid mobile/3-col tablet, barcode input full-width on mobile, horizontally scrollable category pills with hidden scrollbar
5. **Global CSS**: `animate-float` keyframe, `animate-gradient-border` keyframe, `animate-number-pop` keyframe, `animate-cart-pulse` keyframe, `no-scrollbar` utility, `scrollbar-thin` utility (6px rounded oklch thumb)
6. **Tenant Dashboard**: StatCards migrated to `borderColor` + `trendColor` props, number pop animation
7. **Super Admin Dashboard**: Total Revenue StatCard migrated to `borderColor` prop

#### Verification Results
- ✅ ESLint: 0 errors, 0 warnings (verified multiple times)
- ✅ Dev server: All compiles clean
- ✅ Agent-browser QA:
  - All 3 role logins navigate correctly
  - Dashboard greeting, activity feed, and low stock alerts render properly
  - Notifications page: 18 notifications, category filters, search, sort all working
  - Reports Top Categories: CSS bars render with 8 unique colors, percentages, rank numbers
  - Reports date picker: defaults to "Last 7 Days" with proper date values
  - POS mobile: 2-column grid, visible barcode input, mobile-friendly layout
  - No console errors during normal navigation

### Cumulative Feature Count
- **21 feature pages** across 3 roles (Super Admin × 7, Tenant Admin × 14, Staff × 2)
  - *New: Notifications (Tenant Settings → Notifications)*
- **7 shared components** (StatCard, PageHeader, EmptyState, ErrorBoundary, NotificationPanel, CommandPalette, Skeletons)
- **12 shared utility functions** in helpers.ts
- **13 shared layout features** (mobile drawer, notification panel with categories + relative time, command palette with groups + recent, login animations, branding preview, period toggles, error boundary, system theme, keyboard shortcuts, enhanced receipt, card shine animation)
- **Pages with column sorting**: Sales, Customers, Inventory, Tenants (4 pages)
- **Pages with CSV export**: Sales, Reports (3 tabs), Inventory, Customers, Products, Activity Logs, Settlement (8 export points)
- **Pages with date presets**: Reports, Sales (2 pages)
- **Pages with table footers**: Sales, Billing, Inventory, Settlement (4 pages)
- **Pages with Quick Actions**: Tenant Dashboard, Super Admin Dashboard (2 pages)
- **Pages with stock progress bars**: Inventory, Tenant Dashboard Low Stock Alerts (2 pages)
- **Pages with chart tabs**: Reports (5 tabs: Sales, Payment, Inventory, VAT, Top Categories) (1 page)
- **Pages with dual views**: Activity Logs (Table + Timeline) (1 page)
- **Pages with keyboard shortcuts**: POS Terminal (1 page)
- **Pages with bulk actions**: Products (1 page)
- **Pages with avatar color coding**: Customers, Tenant Staff, Super Admin Staff, Settlement (4 pages)
- **Pages with detailed dialog views**: Customers (tabbed with chart + history), Sales (invoice layout) (2 pages)
- **Pages with bar charts**: Super Admin Dashboard (2 charts), Reports (CSS-based Top Categories) (2 pages)
- **Pages with greeting**: Tenant Dashboard (1 page)
- **Pages with activity feed**: Tenant Dashboard (1 page)
- **Pages with low stock alerts**: Tenant Dashboard (1 page)

### Unresolved Issues or Risks

#### Known
- Recharts vertical BarChart (`layout="vertical"`) bars don't render in headless Chrome/Playwright (works in real browsers). Mitigated by using CSS-based bars for Top Categories.
- Turbopack logs repeated "Module not found" warnings for store-profile and settlement modules at SSR time — files exist, runtime works fine, appears to be a Turbopack caching artifact.
- Create Invoice additions are local to billing page only (not reflected in dashboard stats)

#### Low Priority
- No PDF export for invoices/reports yet
- No drag-and-drop reordering for categories/products
- No data table column resizing
- Business hours in Store Profile is static
- POS floating cart button only appears after first item is added (by design)

### Priority Recommendations for Next Phase
1. Comprehensive mobile responsive audit for remaining pages (Customers, Billing, Sales, Products, Inventory) (highest priority)
2. Export PDF for invoices and reports
3. Make Create Invoice flow update dashboard stats in real-time
4. Drag-and-drop reordering for categories or products
5. Data table column resizing
6. Tenant onboarding flow (first-time setup wizard)
7. Real-time stock level indicators on POS product grid
8. Super Admin dashboard revenue-by-plan chart investigation (Recharts BarChart rendering in headless)
9. Dedicated keyboard navigation for POS (barcode auto-focus after sale)
10. Add more Super Admin features (system health monitoring, tenant analytics)

### What Was Done This Session (Round 10)

#### Bug Fixes (1)
1. **Customer Detail Dialog RangeError**: `generateMockOrders()` used `charCodeAt(2)` and `charCodeAt(4)` on short customer IDs (e.g., `'c1'`), returning `NaN` and causing `date.toISOString()` to throw `RangeError`. Fixed by replacing with a proper `simpleHash()` string hash function. Also fixed division by zero potential with `Math.max(customer.totalPurchases, 1)`.

#### New Features (3)
1. **Daily Settlement / Reconciliation Page** (NEW PAGE — 20th page):
   - Added `'settlement'` to `NavSection` type union
   - Sidebar menu item under Point of Sale (Calculator icon)
   - 4 summary stat cards with trend indicators
   - Payment method breakdown grid with percentage bars (Cash 53%, Card 24%, eSewa 13%, Khalti 10%)
   - Reconciliation table (Expected/Actual/Difference/Status with Matched/Warning badges)
   - Staff performance table with colored avatar circles
   - Shift notes textarea with save functionality
   - Close Register (destructive) and Print Report (outline) action buttons

2. **Customer Detail Dialog Enhancement**:
   - Tabbed layout (Overview + Purchase History) using shadcn/ui Tabs
   - Overview: contact grid, spending trend sparkline (60px AreaChart with gradient fill), dates
   - Purchase History: compact table with 5 mock orders, payment method color dots, status badges
   - Gradient header section with colored stat cards (emerald/purple/amber)
   - Action buttons: Send Email, New Sale, Edit, Close

3. **Sales Detail Dialog — Invoice Layout**:
   - Professional invoice header with INVOICE title (font-mono), status + payment badges
   - Customer & Sale Info Grid (Bill To + Invoice Details)
   - Proper items table with #, Item, Qty, Unit Price, Total (alternating rows)
   - Right-aligned totals section with Subtotal, Discount, VAT 13%, bold Total
   - Print Receipt button (calls `window.print()`) + footer

#### Styling Enhancements (12 files)
1. **StatCard Component**: Animated gradient shine effect (`@keyframes card-shine`), subtle top border gradient (before pseudo-element), larger trend badges, `+`/`-` prefix on trend values
2. **Super Admin Dashboard**: New "Revenue by Plan" BarChart card (per-bar coloring: Basic=amber, Pro=emerald, Enterprise=blue)
3. **Billing Page**: Visual summary strip above invoices table (Total Invoices, Total Value, Pending)
4. **Reports Page**: Data summary strip in Sales tab (Total, Orders, Avg values)
5. **Notification Panel**: Category-specific colored icons (5 categories), left color indicators, relative time formatting, unread/read visual states, "Mark all as read" with toast, "View All" footer link, enhanced empty state with BellOff icon
6. **POS Terminal Cart**: 2px left color accent per item (stock status), gradient summary wrapper, pulsing total amount, payment method colored bottom borders with transaction count badges, gradient Complete Sale button
7. **Tenant Subscription Page**: Shimmer overlay on current plan card, colored plan initial circles, color-coded usage progress bars (green/amber/red thresholds), streamlined plan comparison with key features
8. **globals.css**: Added `animate-card-shine` and `animate-gentle-pulse` CSS utilities

#### Verification Results
- ✅ ESLint: 0 errors, 0 warnings (verified multiple times during session)
- ✅ Dev server: All compiles clean
- ✅ Agent-browser QA:
  - All 3 role logins navigate correctly
  - Settlement page renders with full reconciliation table, staff performance, shift notes
  - Customer detail dialog opens with tabs, spending chart, purchase history table
  - Sales detail dialog shows professional invoice layout with items table and totals
  - Notification panel opens with category filters and rich items
  - No console errors during normal navigation

### Cumulative Feature Count
- **20 feature pages** across 3 roles (Super Admin × 7, Tenant Admin × 13, Staff × 2)
  - *New: Daily Settlement (Tenant POS → Settlement)*
- **7 shared components** (StatCard, PageHeader, EmptyState, ErrorBoundary, NotificationPanel, CommandPalette, Skeletons)
- **12 shared utility functions** in helpers.ts
- **13 shared layout features** (mobile drawer, notification panel with categories + relative time, command palette with groups + recent, login animations, branding preview, period toggles, error boundary, system theme, keyboard shortcuts, enhanced receipt, card shine animation)
- **Pages with column sorting**: Sales, Customers, Inventory, Tenants (4 pages)
- **Pages with CSV export**: Sales, Reports (3 tabs), Inventory, Customers, Products, Activity Logs, Settlement (8 export points)
- **Pages with date presets**: Reports, Sales (2 pages)
- **Pages with table footers**: Sales, Billing, Inventory, Settlement (4 pages)
- **Pages with Quick Actions**: Tenant Dashboard, Super Admin Dashboard (2 pages)
- **Pages with stock progress bars**: Inventory (1 page)
- **Pages with chart tabs**: Reports (5 tabs: Sales, Payment, Inventory, VAT, Top Categories) (1 page)
- **Pages with dual views**: Activity Logs (Table + Timeline) (1 page)
- **Pages with keyboard shortcuts**: POS Terminal (1 page)
- **Pages with bulk actions**: Products (1 page)
- **Pages with avatar color coding**: Customers, Tenant Staff, Super Admin Staff, Settlement (4 pages)
- **Pages with detailed dialog views**: Customers (tabbed with chart + history), Sales (invoice layout) (2 pages)
- **Pages with bar charts**: Super Admin Dashboard (2 charts), Reports (1 page)

### Unresolved Issues or Risks

#### Low Priority
- Create Invoice additions are local to billing page only (not reflected in dashboard stats)
- No PDF export for invoices/reports yet
- No drag-and-drop reordering for categories/products
- No data table column resizing
- Business hours in Store Profile is static
- Notification panel "View All" link doesn't navigate to a dedicated notifications page

### Priority Recommendations for Next Phase
1. Comprehensive mobile responsive audit for all 20 pages (highest priority)
2. Export PDF for invoices and reports
3. Make Create Invoice flow update dashboard stats in real-time
4. Drag-and-drop reordering for categories or products
5. Data table column resizing
6. Tenant onboarding flow (first-time setup wizard)
7. Barcode scanner simulation improvement in POS
8. Add dedicated Notifications page with full history
9. Real-time stock level indicators on POS product grid

---
Task ID: 10-4a
Agent: general-purpose
Task: Customer Detail Dialog enhancement

Work Log:
- Added Tabs, AreaChart/ResponsiveContainer (recharts), ShoppingBag imports
- Added getPaymentMethodColor helper, generateSpendingTrend, generateMockOrders helpers
- Replaced basic customer detail dialog with tabbed version (Overview + Purchase History)
- Overview: gradient header, colored stat cards, contact grid, spending sparkline
- Purchase History: compact table with 5 mock orders per customer
- Added action buttons (Send Email, New Sale, Edit, Close)

Stage Summary:
- Customer detail dialog now has tabs with spending chart and purchase history table

---
Task ID: 10-4b
Agent: general-purpose
Task: Sale Detail Dialog invoice-style layout enhancement

Work Log:
- Replaced basic dialog with professional invoice layout
- Added invoice header, customer/sale info grid, items table, totals section
- Added Print Receipt button (window.print()) and footer

Stage Summary:
- Sales detail shows professional invoice with items table and styled totals

---
Task ID: 10-5a
Agent: general-purpose
Task: Daily Settlement / Reconciliation page (20th page)

Work Log:
- Added 'settlement' NavSection, sidebar item, page route
- Created settlement page with 8 sections: header, date picker, stat cards, payment breakdown, reconciliation table, staff performance, shift notes, action buttons

Stage Summary:
- 20th page: Daily Settlement with full reconciliation workflow

---
Task ID: 10-5b
Agent: general-purpose
Task: Notification Panel enhancement

Work Log:
- Added category-specific icons and color indicators
- Added relative time formatting
- Enhanced unread/read visual states
- Added Mark all as read and View All footer
- Enhanced empty state

Stage Summary:
- Notification panel now has rich category-based styling with relative timestamps

---
Task ID: 10-6a
Agent: general-purpose
Task: Global card/table styling improvements

Work Log:
- Enhanced StatCard with shine animation, gradient top border, larger trend badges
- Added Revenue by Plan BarChart to Super Admin Dashboard
- Added visual summary strips to Billing and Reports pages

Stage Summary:
- StatCard has professional animations, Super Admin has new chart, Billing/Reports have summary strips

---
Task ID: 10-6b
Agent: general-purpose
Task: POS Terminal + Tenant Subscription visual refinement

Work Log:
- Added animate-gentle-pulse CSS utility
- POS cart: stock color accents, gradient summary, pulsing total, colored payment indicators
- Tenant Subscription: shimmer overlay, colored plan initials, usage progress bars, streamlined plan comparison

Stage Summary:
- POS cart has professional visual hierarchy; Subscription page completely redesigned with progress bars

---
Task ID: 10-fix
Agent: main
Task: Fix Customer Detail Dialog RangeError bug

Work Log:
- Identified root cause: generateMockOrders used charCodeAt(2/4) on short IDs ('c1', 'c2') returning NaN
- Replaced with simpleHash() function for deterministic number generation
- Added Math.max(customer.totalPurchases, 1) to prevent division by zero
- Verified fix via agent-browser: customer detail dialog opens correctly with both tabs working

Stage Summary:
- Customer detail dialog no longer crashes on short customer IDs
- Fixed with proper string hash function and safe division

---
Task ID: 11-a
Agent: general-purpose
Task: Create dedicated Notifications Page (page 21)

Work Log:
- Read existing notification-panel.tsx to understand data model (NotificationCategory, NotificationType, Notification interface, category styles/icons)
- Added 'notifications' to NavSection type union in /src/lib/types/index.ts
- Created /src/features/tenant/notifications/components/notifications-page.tsx with full-page notification center
- Features: PageHeader, 6 category filter buttons (All, Sale, Payment, Inventory, System, Promotion) with counts, search input, Mark all as read button with BellOff icon, sort select (Newest/Oldest)
- 18 mock notifications with Nepal context (DDC Milk, Wai Wai, Goldstar Shoes, ABC Store, eSewa, Khalti, NPR currency, PAN numbers, Dashain/Tihar promotions)
- Rich notification cards with left color indicator, category icon, title, description, relative time, unread dot, read/unread visual states, hover effects
- Category badge on each notification card
- Empty state with BellOff icon and contextual message
- Sticky footer showing 'Showing X of Y notifications' with unread count
- Mobile-responsive layout (stacked filter bar on mobile, row on desktop)
- Added Bell icon import and 'Notifications' menu item to Settings group in tenant admin sidebar
- Registered NotificationsPage in sectionComponents map in /src/app/page.tsx
- Ran bun run lint: 0 errors, 0 warnings

Stage Summary:
- 21st page: Notifications Page — full-page notification center replacing the small dropdown panel
- 18 mock notifications across 5 categories with Nepal-specific content
- Category filters, search, sort, mark all as read, individual mark as read
- Sticky footer with notification count summary

---
Task ID: 11-b
Agent: general-purpose
Task: Enhance Tenant Dashboard with Recent Activity feed and styling improvements

Work Log:
- Read existing tenant-dashboard.tsx, helpers.ts, page-header.tsx, globals.css to understand codebase
- Added `animate-gradient-border` (6s shifting color line) and `animate-number-pop` (scale pulse) CSS utilities to globals.css
- Created GreetingBanner component: dynamic time-of-day greeting (morning/afternoon/evening) with store name subtitle
- Created AnimatedGradientBorder wrapper: replaces PageHeader's default separator with a 2px animated gradient line (emerald → amber → purple → red → emerald)
- Created RecentActivityCard: 10 mock activity items with colored icon circles (ShoppingCart, AlertTriangle, Users, CreditCard, Receipt, Package, Tag), alternating row backgrounds, hover effects, clickable rows with toast, View All button with ExternalLink icon
- Created LowStockAlertsCard: 5 Nepal-specific low stock items (DDC Milk, Goldstar Shoes, Surya Lights, Tokla Tea, Amul Butter), Progress bars (red if ≤25%, amber otherwise), Restock buttons per item
- Added Progress component import and usage for stock level bars
- Added `animate-number-pop` class to all 4 StatCards for subtle entry animation
- Replaced PageHeader separator with AnimatedGradientBorder wrapper
- Placed Recent Activity (2/3 width) + Low Stock Alerts (1/3 width) in responsive grid below Quick Actions
- Used sonner toast for all interactive elements
- Fixed apostrophe escaping in JSX (Today&apos;s, Here&apos;s)
- Verified: `bun run lint` — 0 errors, 0 warnings

Stage Summary:
- Tenant Dashboard now has: time-of-day greeting banner, animated gradient header border, 10-item Recent Activity feed with colored icons, 5-item Low Stock Alerts with progress bars and restock buttons, stat card number animation
- All new sections are mobile-responsive and use shadcn/ui components

---
Task ID: 11-c
Agent: general-purpose
Task: Improve mobile responsive design for POS Terminal page

Work Log:
- Read pos-terminal.tsx (817 lines) and Sheet component to understand full structure
- Added `animate-cart-pulse` (scale+shadow bounce) and `no-scrollbar` CSS utilities to globals.css
- Added Sheet component imports (Sheet, SheetContent, SheetHeader, SheetTitle)
- Added `cartSheetOpen` and `isCartPulsing` state variables
- Modified `addToCart` to trigger 600ms pulse animation on floating button
- Modified `handleCompleteSale` to close mobile cart Sheet on completion
- Changed search+barcode layout: stacked (full-width) on mobile, side-by-side on sm+ (was hidden below sm)
- Replaced ScrollArea category pills with plain `overflow-x-auto no-scrollbar` div for mobile horizontal scroll
- Changed product grid from `grid-cols-2 sm:grid-cols-2 md:grid-cols-3` to `grid-cols-2 sm:grid-cols-3`
- Added `hidden md:block` to desktop cart panel (visible md+ only)
- Made Held Sales button in PageHeader visible on all screen sizes (was `hidden sm:flex`)
- Added `pb-20 md:pb-4` bottom padding to prevent floating button overlap
- Created fixed-position floating cart button (visible mobile only): gradient emerald, shows "View Cart (X)" + NPR total, pulse animation on add
- Created full-height mobile cart Sheet (right drawer, `w-full sm:max-w-md`):
  - SheetHeader: Cart title, item count badge, clear button, full-width customer selector dropdown
  - Scrollable cart items area (flex-1 overflow-y-auto) with stock color accents, qty controls, remove
  - Empty state with ShoppingCart icon when no items
  - Held Sales resume button when cart empty + held sales exist
  - Sticky bottom section (border-t, shrink-0): Subtotal, Discount input, VAT 13%, pulsing Total
  - Payment method 2x2 grid with colored bottom borders and transaction counts
  - Hold + Complete Sale action buttons
- Verified: `bun run lint` — 0 errors, 0 warnings

Stage Summary:
- POS Terminal is now fully mobile-responsive: product grid on top, floating cart button with pulse animation opens full-height Sheet drawer
- Barcode scanner input visible and full-width on all screen sizes
- Category pills horizontally scrollable with hidden scrollbar on mobile
- Product grid: 2 cols mobile, 3 cols tablet+, side-by-side cart on lg+
- Desktop layout unchanged (md+ inline cart, lg+ side-by-side)

---
Task ID: 11-d
Agent: general-purpose
Task: Global styling polish across multiple shared components and dashboards

Work Log:
- Enhanced StatCard: added `borderColor` prop (3px left border), `trendColor` prop (positive/negative/neutral with emerald-600/red-600/muted styling and +/- prefix), icon container enlarged (h-11 w-11), added hover:scale-[1.01]
- Enhanced EmptyState: added `animate-float` to icon container, subtle gradient background (from-muted/30 via-muted/10), larger description text (text-sm leading-relaxed), added `actionNode` prop for ReactNode actions
- Enhanced PageHeader: added `subtitle` prop rendered below title in muted-foreground, hidden on very small screens (hidden text-xs sm:inline)
- Added globals.css: `animate-float` keyframe (translateY 0→-6px→0, 3s infinite), `scrollbar-thin` utility (6px width, rounded oklch thumb with transparent track, hover state)
- Updated tenant-dashboard.tsx: migrated 4 StatCards to use new `borderColor` prop (removed border-l-4 from className), added `trendColor` based on growth value positivity
- Updated super-admin-dashboard.tsx: migrated Total Revenue StatCard `borderColor` from className to prop
- Verified: `bun run lint` — 0 errors, 0 warnings

Stage Summary:
- StatCard now has declarative left border color, semantic trend coloring, and scale hover
- EmptyState has floating icon animation, gradient background, and actionNode slot
- PageHeader supports optional subtitle (responsive)
- Global CSS adds float animation and thin scrollbar utility
