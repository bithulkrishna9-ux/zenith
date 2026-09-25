# 🍱 Smart Canteen Management Platform — Project Handover Document

> **Prepared by:** Development Team  
> **Handover Date:** September 25, 2026  
> **Version:** 1.0 — Black & Lavender Theme  
> **Status:** ✅ Fully Functional — Ready for Deployment / Further Development

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project File Structure](#3-project-file-structure)
4. [How to Run Locally](#4-how-to-run-locally)
5. [Architecture & Module Guide](#5-architecture--module-guide)
6. [Feature Inventory](#6-feature-inventory)
7. [Data Models & Seed Data](#7-data-models--seed-data)
8. [Design System](#8-design-system)
9. [Known Limitations](#9-known-limitations)
10. [Future Roadmap / Recommended Next Steps](#10-future-roadmap--recommended-next-steps)
11. [Developer Notes & Tips](#11-developer-notes--tips)

---

## 1. Project Overview

The **Smart Canteen Management Platform** is a fully client-side, single-page web application designed for a university campus dining system. It serves two types of users on a single shared interface:

| User | Role | Access |
|---|---|---|
| **Students** | Order food, track queue, manage wallet | Student Portal (default view) |
| **Admin / Kitchen Staff** | Manage orders, menu, inventory, analytics | Admin & Kitchen Console |

### Core Problems Solved
- ❌ Long physical lunch queues → ✅ Pre-order with token tracking
- ❌ Cash-only, slow payments → ✅ Campus Wallet + UPI simulation
- ❌ No stock visibility → ✅ Real-time availability per item
- ❌ Manual order management → ✅ Kanban-style order board for kitchen
- ❌ No feedback loop → ✅ In-app star ratings and reviews

---

## 2. Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| **Structure** | HTML5 (Semantic) | Single-file shell, multi-view toggling |
| **Styling** | Vanilla CSS (Custom Properties) | Zero dependencies, full design control |
| **Logic** | Vanilla JavaScript ES6+ (OOP Classes) | No build step, no framework overhead |
| **Fonts** | Google Fonts CDN (`Outfit`, `Space Grotesk`) | Premium typography, loaded via `@import` |
| **Audio** | Web Audio API (built-in) | Synthesized sounds, no audio file assets needed |
| **Persistence** | `localStorage` (browser) | Survives page refresh without a backend |
| **Images** | Local JPEG files in `/assets/` | AI-generated food photography |

> ⚠️ **No backend, no database, no build tools, no npm.** This is a pure static HTML/CSS/JS project. It can be served from any static file server or opened directly in a browser.

---

## 3. Project File Structure

```
d:\canteen\
│
├── index.html                  ← Master HTML shell (all views & modals live here)
├── serve.ps1                   ← PowerShell static file HTTP server
├── start-server.bat            ← One-click Windows launcher
│
├── css/
│   └── styles.css              ← Entire design system (tokens, layout, components, animations)
│
├── js/
│   ├── data.js                 ← [LOAD FIRST] All seed/mock data — menus, orders, inventory
│   ├── storage.js              ← [LOAD SECOND] Reactive state manager + localStorage wrapper
│   ├── audio.js                ← [LOAD THIRD] Web Audio API sound synthesizer
│   ├── student.js              ← [LOAD FOURTH] Student portal — all 8 tab views + cart + checkout
│   ├── admin.js                ← [LOAD FIFTH] Admin console — Kanban, analytics, inventory
│   └── app.js                  ← [LOAD LAST] Master coordinator — role switch, toasts, notifications
│
└── assets/
    ├── ASSETS_README.md        ← Full food menu + feature documentation
    ├── chicken_biryani.jpg     ← Used by: Biryani, Tikka Bowl, Kathi Roll, Momos, Burger
    ├── veg_meals.jpg           ← Used by: Veg Thali, Dal Makhani, Rajma Chawal, Gulab Jamun
    ├── paneer_fried_rice.jpg   ← Used by: Paneer Rice, Tikka Wrap, Hakka Noodles
    ├── masala_dosa.jpg         ← Used by: Masala Dosa, Idli Vada, Aloo Paratha
    ├── samosa_chai.jpg         ← Used by: Samosa Chai, Poha, Pav Bhaji, Peri-Peri Fries
    └── lime_juice.jpg          ← Used by: Lime Soda, Cold Coffee, Mango Lassi, Brownie Sundae
```

### Script Loading Order in `index.html`
```html
<!-- IMPORTANT: Load in this exact order — each depends on the previous -->
<script src="js/data.js"></script>
<script src="js/storage.js"></script>
<script src="js/audio.js"></script>
<script src="js/student.js"></script>
<script src="js/admin.js"></script>
<script src="js/app.js"></script>  <!-- Initializes everything on DOMContentLoaded -->
```

---

## 4. How to Run Locally

### Option A — PowerShell Server (Recommended)
```powershell
cd d:\canteen
.\serve.ps1
# Open browser: http://localhost:8080
```

### Option B — Double-Click Batch File
```
Double-click: start-server.bat
```

### Option C — Python (if installed)
```bash
cd d:\canteen
python -m http.server 8080
# Open browser: http://localhost:8080
```

### Option D — VS Code Live Server Extension
1. Install `ritwickdey.LiveServer` extension in VS Code
2. Right-click `index.html` → **"Open with Live Server"**

> ⚠️ **Do NOT open `index.html` directly as a `file://` URL** — font imports and asset paths require an HTTP server context.

---

## 5. Architecture & Module Guide

### Module Dependency Graph
```
data.js  ──────────────────────────────────┐
                                            │
storage.js  (depends on: data.js)  ────────┤
                                            │
audio.js    (standalone)  ─────────────────┤
                                            │
student.js  (depends on: storage, audio) ──┤
                                            │
admin.js    (depends on: storage, audio) ──┤
                                            │
app.js      (orchestrates all above)  ─────┘
```

### Class Reference

#### `INITIAL_DATA` — `js/data.js`
- Global constant (`window.INITIAL_DATA`) containing all mock data
- **Modify this file** to add/edit food items, change default student wallet balance, add inventory items, or pre-populate orders
- Key structure:
  ```js
  INITIAL_DATA = {
    currentUser: { ... },    // Default student profile
    categories: [ ... ],     // 8 food categories
    menuItems: [ ... ],      // 24 food items
    inventory: [ ... ],      // 10 ingredient records
    orders: [ ... ],         // Pre-seeded demo orders
    feedbackList: [ ... ],   // Pre-seeded student reviews
    notifications: [ ... ]   // Pre-seeded notifications
  }
  ```

#### `CanteenStorage` — `js/storage.js`
- Wraps `localStorage` with a reactive pub/sub event bus
- Key methods:
  ```js
  storage.getMenuItems()              // Get all menu items
  storage.updateMenuItem(id, changes) // Toggle availability, edit stock
  storage.saveOrder(orderObj)         // Persist new order
  storage.updateOrder(id, changes)    // Advance order status
  storage.getUser()                   // Get current student profile
  storage.topUpWallet(amount)         // Add to wallet balance
  storage.deductWallet(amount)        // Deduct from wallet (payment)
  storage.on('eventName', callback)   // Subscribe to state changes
  storage.emit('eventName', data)     // Fire a state change event
  storage.resetToDefaults()           // Wipe localStorage, reload seed data
  ```
- **Events fired:**
  - `ordersUpdated` — When any order is created or updated
  - `menuUpdated` — When menu item availability/stock changes
  - `walletUpdated` — When wallet balance changes
  - `notificationsUpdated` — When a new notification is pushed

#### `CanteenAudio` — `js/audio.js`
- Synthesizes all sounds using Web Audio API oscillators (no audio files needed)
- Key methods:
  ```js
  audio.playTap()          // UI tap/click feedback
  audio.playAddToCart()    // Item added to cart
  audio.playOrderPlaced()  // Checkout success chime
  audio.playOrderReady()   // Order ready ding
  audio.playNotification() // Notification pop
  audio.toggleSound()      // Enable/disable all audio
  ```

#### `StudentPortal` — `js/student.js`
- Manages all 8 student-facing tab views and the cart drawer
- Key methods:
  ```js
  portal.switchStudentTab('menu')     // Navigate to a tab
  portal.renderMenu()                 // Re-render food grid
  portal.renderHomeView()             // Render home dashboard
  portal.renderOrdersView()           // Render order history
  portal.renderTrackerView()          // Render live queue tracker
  portal.renderWalletView()           // Render wallet tab
  portal.openCartDrawer()             // Slide in the cart panel
  portal.addToCart(itemId)            // Add item to cart array
  portal.setPickupTime(timeSlot)      // Set pre-order pickup slot
  portal.submitCheckout()             // Process payment + place order
  portal.updateActiveOrderPill()      // Refresh navbar order pill
  portal.updateHeaderUserInfo()       // Refresh wallet balance in nav
  ```
- **State properties:**
  ```js
  portal.cart              // Array of cart items
  portal.activeTab         // Current tab name string
  portal.activeCategory    // Current category filter
  portal.activeDietary     // 'all' | 'veg' | 'nonveg'
  portal.searchQuery       // Current search string
  portal.selectedPickupTime // Pre-order time slot
  ```

#### `AdminConsole` — `js/admin.js`
- Manages all 5 admin tab views
- Key methods:
  ```js
  console.switchAdminTab('orders')          // Navigate admin tab
  console.renderMetrics()                   // Update KPI cards
  console.renderOrders()                    // Render Kanban board
  console.renderMenuManagement()            // Render menu toggle panel
  console.renderInventory()                 // Render ingredient table
  console.renderAnalytics()                 // Render sales charts
  console.renderFeedback()                  // Render student reviews
  console.updateOrderStatus(id, newStatus)  // Advance Kanban card
  console.toggleItemAvailability(id)        // On/Off menu item
  console.updateItemStock(id, qty)          // Edit stock quantity
  ```

#### `CanteenApp` — `js/app.js`
- Entry point — initialized via `DOMContentLoaded`
- Key methods:
  ```js
  app.switchRole('student' | 'admin')  // Toggle portal view
  app.showToast(title, message, icon)  // Show slide-in toast
  app.openNotifications()              // Open notification drawer
  app.topUpWallet(amount)              // Add funds to wallet
  app.resetAllDemoData()               // Factory reset
  ```
- Instantiated globally as `window.app`

---

## 6. Feature Inventory

### Student Portal

| Tab | Key Features |
|---|---|
| 🏠 **Home** | Hero banner, kitchen status pills, pre-order time selector, search bar, category pills, Veg/Non-Veg toggle, Today's Specials carousel, Popular Items grid |
| 🍽️ **Menu** | 24-item food grid, live search, category + dietary filters, availability badge, add to cart, favorites toggle, stock quantity display |
| 🛒 **Cart Drawer** | Slide-in panel, item quantity controls, 10% discount, subtotal/total, checkout CTA |
| 💳 **Checkout Modal** | Payment method (Wallet / UPI / Cash), order summary, wallet validation, animated order confirmation, token number generation |
| 📜 **Orders** | Full order history, status badges, reorder button, rate & review link |
| 🎫 **Track Order** | 5-stage animated progress stepper, token display, queue position, est. wait time, pickup celebration animation |
| 💳 **Wallet** | Balance display, ₹100/250/500/1000 quick top-ups, custom amount, transaction history |
| ❤️ **Favorites** | Saved items grid, quick add to cart, remove toggle, empty state CTA |
| ⭐ **Feedback** | 3-axis star ratings, comment field, order token link, community reviews |
| 👤 **Profile** | Student card, stats (orders, favorites), department, contact info |

### Admin Console

| Tab | Key Features |
|---|---|
| 📊 **Dashboard KPIs** | 7 metric cards: total orders, pending, completed, cancelled, revenue, queue count, low-stock alerts |
| 📋 **Live Orders** | 4-column Kanban (RECEIVED → PREPARING → READY → COLLECTED), advance/cancel order, special notes, elapsed timers |
| 🍽️ **Menu & Stock** | Toggle item availability (real-time effect on student view), inline stock editor, low-stock visual alert |
| 📦 **Inventory** | 10-ingredient table, status badges (Available/Low/Out), update stock modal, threshold alerts |
| 📈 **Analytics** | Hourly sales CSS bar chart, top-5 selling items with progress bars, payment method split |
| ⭐ **Reviews** | All student feedback, 3-metric star display per review, admin replies, timestamps |

### Global Features

| Feature | Details |
|---|---|
| Role Switcher | Top nav toggle — Student ↔ Admin, with context-aware header elements |
| Toast Notifications | Slide-in pop-up with icon, title, message — auto-dismisses in 3.8s |
| Notification Drawer | Bell icon → slide-in panel, unread badge counter, mark all read |
| Sound Effects | Web Audio API: tap, add-to-cart, checkout-success, order-ready, notification |
| Sound Toggle | 🔊/🔇 button — persisted to localStorage |
| Cart Badge | Live item count bubble on cart icon |
| Active Order Pill | Shows token # + status in navbar when order is in-progress |
| Wallet Balance Pill | Real-time balance in navbar, click → wallet tab |
| localStorage Persistence | Cart, favorites, orders, wallet, settings — all survive refresh |
| Mobile Bottom Nav | Fixed 5-tab bottom navigation on screens < 768px |
| Responsive Design | Mobile / Tablet / Desktop breakpoints in CSS |
| Demo Reset | 🔄 resets all localStorage to factory seed data + reloads page |
| SEO | `<title>`, `<meta description>`, semantic HTML5, single `<h1>` per view |
| Favicon | 🍱 emoji SVG (inline, no external file needed) |

---

## 7. Data Models & Seed Data

### Menu Item Object
```js
{
  id: "item_1",
  name: "Hyderabadi Chicken Dum Biryani",
  category: "lunch",          // "breakfast" | "lunch" | "snacks" | "fastfood" | "beverages" | "desserts"
  price: 130,                 // in ₹ (INR)
  description: "...",
  isVeg: false,               // true = green dot, false = red dot
  isSpecial: true,            // true = appears in Today's Specials
  tag: "Chef's Special ⭐",   // Badge label on card
  available: true,            // false = Sold Out overlay
  stockQuantity: 42,
  rating: 4.9,
  reviewsCount: 210,
  prepTimeMinutes: 10,
  image: "assets/chicken_biryani.jpg",
  ingredients: ["Basmati Rice", "Chicken", "Spices", "Yogurt", "Egg"],
  calories: "580 kcal",
  spiceLevel: "Medium Spicy 🌶️"
}
```

### Order Object
```js
{
  id: "ord_1042",
  tokenNumber: "A1042",
  userId: "usr_101",
  userName: "Rahul Sharma",
  userPhone: "+91 98765 43210",
  items: [{ itemId, name, price, quantity, isVeg }],
  subtotal: 160,
  discount: 16,               // Always 10% in demo
  total: 144,
  paymentMethod: "Campus Wallet",  // | "UPI (Google Pay)" | "Cash on Counter"
  paymentStatus: "Paid",
  orderStatus: "PREPARING",   // "RECEIVED" | "PREPARING" | "READY" | "COLLECTED" | "CANCELLED"
  orderType: "Pre-Order",     // | "Immediate"
  pickupTime: "1:15 PM",
  placedAt: "ISO string",
  queuePosition: 2,
  estimatedWaitMins: 6,
  notes: "Please pack raita separately"
}
```

### Inventory Item Object
```js
{
  id: "inv_1",
  name: "Basmati & Sona Masoori Rice",
  category: "Grains",
  quantity: 50,
  unit: "kg",
  minThreshold: 20,
  status: "Available",         // Auto-derived: "Available" | "Low Stock" | "Out of Stock"
  lastUpdated: "Today, 10:30 AM"
}
```

### Student / User Object
```js
{
  id: "usr_101",
  name: "Rahul Sharma",
  studentId: "CS-2023-8941",
  email: "rahul.sharma@campus.edu",
  phone: "+91 98765 43210",
  department: "Computer Science & Eng.",
  walletBalance: 450.00,
  role: "student",
  avatar: "👨‍🎓",
  favorites: ["item_1", "item_4", "item_13", "item_19"]
}
```

### Feedback Object
```js
{
  id: "fb_1",
  userName: "Rahul Sharma",
  tokenNumber: "A1035",
  ratingFood: 5,       // 1–5
  ratingService: 5,    // 1–5
  ratingValue: 5,      // 1–5
  comment: "Dosa was crispy!",
  createdAt: "Yesterday, 4:20 PM",
  reply: "Thank you Rahul!"    // Admin reply
}
```

### LocalStorage Key
```
Key:   "smart_canteen_platform_data_v1"
Value: JSON string of entire state object
```

---

## 8. Design System

### Color Tokens — Black & Lavender Theme
```css
--bg-primary:        #0A0A0F;   /* Page background — deep black       */
--bg-secondary:      #12121A;   /* Section backgrounds                 */
--bg-card:           #1A1A2E;   /* Card surfaces                       */
--accent-primary:    #A78BFA;   /* Primary lavender                    */
--accent-secondary:  #7C3AED;   /* Deep violet (buttons, CTAs)         */
--accent-glow:       rgba(167,139,250,0.2);  /* Glow / shadow effects  */
--text-primary:      #F1F0FF;   /* Main text — lavender-tinted white   */
--text-secondary:    #94A3B8;   /* Muted / secondary text              */
--text-muted:        #64748B;   /* Timestamps, labels                  */
--success:           #10B981;   /* Available, completed, positive       */
--warning:           #F59E0B;   /* Low stock, pre-order indicators      */
--error:             #EF4444;   /* Error, cancelled, out of stock       */
--border-subtle:     rgba(167,139,250,0.15);  /* Card borders          */
```

### Typography
```css
/* Headers & Display */
font-family: 'Outfit', sans-serif;     /* Weights: 400, 600, 700, 800 */

/* Body & UI */
font-family: 'Space Grotesk', sans-serif;  /* Weights: 400, 500, 600 */
```

### Key Component Classes
| Class | Purpose |
|---|---|
| `.glass-card` | Glassmorphism card with `backdrop-filter: blur(20px)` |
| `.gradient-text` | Lavender gradient text effect |
| `.nav-item-btn.active` | Active navigation tab indicator |
| `.food-card` | Food menu item card with hover lift |
| `.cat-pill-btn.active` | Active category filter pill |
| `.admin-metric-card` | Dashboard KPI card |
| `.kanban-col` | Admin order Kanban column |
| `.clean-toast` | Slide-in toast notification |
| `.modal-overlay.open` | Open modal state trigger |

---

## 9. Known Limitations

> These are intentional simplifications for the demo scope. See Section 10 for how to address each.

| # | Limitation | Impact | Priority to Fix |
|---|---|---|---|
| 1 | **No real backend** — all data is in localStorage | Data is per-browser, per-device. No shared state between admin and student on different devices | 🔴 High |
| 2 | **Single student profile** — `currentUser` is hardcoded | Cannot log in as different students | 🔴 High |
| 3 | **No real payment gateway** — UPI and wallet are simulated | Cannot process real transactions | 🔴 High |
| 4 | **Order status must be manually advanced by admin** — no auto-timer | Kitchen needs to actively update the Kanban | 🟡 Medium |
| 5 | **Images are shared** — multiple items use the same photo | Visual repetition in the menu grid | 🟡 Medium |
| 6 | **No push notifications** — no Service Worker / WebSocket | Browser tab must be open and active | 🟡 Medium |
| 7 | **Analytics data is static** — charts use hardcoded values | Does not reflect actual order data | 🟡 Medium |
| 8 | **No admin authentication** — anyone can access admin console | No security on the kitchen panel | 🟠 Low (demo context) |
| 9 | **No pagination** — full menu and all orders always rendered | May slow down on very large datasets | 🟠 Low |
| 10 | **localStorage ~5MB limit** — long-term order history may fill | Unlikely in demo, real concern for production | 🟠 Low |

---

## 10. Future Roadmap / Recommended Next Steps

### Phase 1 — Backend & Authentication (High Priority)
- [ ] **Set up Node.js + Express backend** (or Firebase / Supabase for faster start)
- [ ] **Replace localStorage with a real database** (PostgreSQL / MongoDB / Firestore)
- [ ] **JWT-based authentication** — student login with student ID + password
- [ ] **Admin role authentication** — separate admin login with canteen staff credentials
- [ ] **REST API or GraphQL** endpoints for: menu, orders, inventory, feedback, wallet

### Phase 2 — Real-Time & Payments
- [ ] **WebSocket (Socket.io)** for real-time order status push from kitchen → student tab
- [ ] **Razorpay / PayU integration** for real UPI and card payments
- [ ] **Campus wallet backend** — actual balance stored in DB, not browser
- [ ] **Push Notifications** via Web Push API + Service Worker

### Phase 3 — Enhanced Features
- [ ] **More food images** — individual photos for each of the 24 menu items
- [ ] **Admin: Live analytics** — charts computed from real order data
- [ ] **Student: Repeat order shortcut** — "Order again" from past orders
- [ ] **Menu item detail modal** — Full nutrition info, ingredient allergen tags
- [ ] **QR code token** — Printable/scannable token for pickup counter
- [ ] **Order cancellation by student** — within a 2-minute window of placing
- [ ] **Canteen operating hours** — Auto-close ordering outside defined hours
- [ ] **Multi-canteen support** — Route students to different canteen outlets

### Phase 4 — Mobile App
- [ ] **Convert to PWA** — Add `manifest.json` + Service Worker for installable app
- [ ] **React Native / Flutter** — Native mobile app for iOS and Android

---

## 11. Developer Notes & Tips

### Adding a New Menu Item
1. Open `js/data.js`
2. Add a new object to the `menuItems` array following the schema in Section 7
3. Assign a unique `id` (e.g., `"item_25"`)
4. Set `category` to one of: `breakfast`, `lunch`, `snacks`, `fastfood`, `beverages`, `desserts`
5. Point `image` to an existing asset or add a new image to `/assets/`
6. Click 🔄 Reset Demo in the browser to reload with new data (clears old localStorage)

### Toggling a Menu Item Off (Sold Out)
- **Via UI:** Admin Console → Menu & Stock → Toggle the switch OFF
- **Via Data:** Set `available: false` in `data.js` for the item

### Changing the Student Default Wallet Balance
- Edit `walletBalance` in `INITIAL_DATA.currentUser` in `js/data.js`
- Click 🔄 Reset to apply

### Adding a New Admin Tab
1. Add a `<button>` to `#admin-secondary-nav` in `index.html`
2. Add a new `<div id="admin-XXX-view">` in the admin section of `index.html`
3. Add a `case 'XXX':` to `switchAdminTab()` in `js/admin.js`
4. Create a `renderXXXView()` method in `AdminConsole`

### Changing the Theme Colors
- All colors are CSS custom properties at the top of `css/styles.css`
- Change the hex values in `:root { ... }` — changes propagate everywhere instantly
- No CSS rebuild needed

### Event Bus Usage
```js
// Subscribe to an event
window.canteenStorage.on('ordersUpdated', (data) => {
  console.log('Orders changed:', data);
  this.renderOrders(); // Re-render when orders change
});

// Fire an event
window.canteenStorage.emit('ordersUpdated', { source: 'admin' });
```

### Debugging
- Open browser DevTools → **Application** → **Local Storage** → `http://localhost:8080`
- You can inspect and manually edit the `smart_canteen_platform_data_v1` key
- Click 🔄 Reset Demo button to wipe and reload fresh seed data at any time
- All classes are accessible on `window`: `window.app`, `window.studentPortal`, `window.adminConsole`, `window.canteenStorage`, `window.canteenAudio`

---

## ✅ Handover Checklist

- [x] All source files present and working
- [x] Local dev server scripts provided (`serve.ps1`, `start-server.bat`)
- [x] All 6 food images in `/assets/`
- [x] 24 menu items seeded in `data.js`
- [x] Student portal — all 8 tabs functional
- [x] Admin console — all 5 tabs functional
- [x] Cart, checkout, and payment flow working
- [x] Live order tracker working (demo order pre-seeded)
- [x] Campus wallet top-up and deduction working
- [x] Favorites, feedback, and profile tabs working
- [x] Admin Kanban order status advancement working
- [x] Mobile responsive layout working
- [x] `ASSETS_README.md` documentation in `/assets/`
- [x] This `HANDOVER.md` created at project root

---

*Developed as a complete campus digital dining solution. All source code is documented inline.*  
*For questions, refer to inline comments in each `.js` file or the `ASSETS_README.md` for feature details.*
