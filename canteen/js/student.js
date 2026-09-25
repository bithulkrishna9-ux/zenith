/**
 * Smart Canteen Management Platform
 * Student Portal Logic - Modern Clean Premium Black & Lavender Theme
 */

class StudentPortal {
  constructor(storage, audio) {
    this.storage = storage;
    this.audio = audio;
    this.cart = [];
    this.activeCategory = "all";
    this.activeDietary = "all";
    this.searchQuery = "";
    this.activeTab = "home"; // 'home' | 'menu' | 'orders' | 'tracker' | 'wallet' | 'favorites' | 'feedback' | 'profile'
    this.selectedPickupTime = "ASAP";
    this.selectedPaymentMethod = "Campus Wallet";
    this.currentTrackingOrderId = null;

    this.init();
  }

  init() {
    this.storage.on("menuUpdated", () => {
      if (this.activeTab === "menu" || this.activeTab === "home") this.renderActiveView();
      if (this.activeTab === "favorites") this.renderFavorites();
    });
    this.storage.on("ordersUpdated", () => {
      this.updateActiveOrderPill();
      if (this.activeTab === "tracker") this.renderOrderTracker();
      if (this.activeTab === "orders") this.renderPastOrders();
    });
    this.storage.on("userUpdated", () => {
      this.updateHeaderUserInfo();
      if (this.activeTab === "favorites") this.renderFavorites();
      if (this.activeTab === "wallet") this.renderWalletView();
      if (this.activeTab === "profile") this.renderProfileView();
    });

    // Check for existing active order
    const orders = this.storage.getOrders();
    const user = this.storage.getUser();
    const activeOrder = orders.find(o => 
      o.userId === user.id && 
      !["COLLECTED", "CANCELLED"].includes(o.orderStatus)
    );
    if (activeOrder) {
      this.currentTrackingOrderId = activeOrder.id;
    }
  }

  // --- Cart Operations ---
  addToCart(itemId) {
    const item = this.storage.getMenuItems().find(i => i.id === itemId);
    if (!item || !item.available) return;

    const existing = this.cart.find(c => c.itemId === itemId);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.cart.push({
        itemId: item.id,
        name: item.name,
        price: item.price,
        isVeg: item.isVeg,
        image: item.image,
        quantity: 1
      });
    }

    this.audio.playTap();
    this.renderActiveView();
    this.renderCart();
    this.updateCartBadge();
  }

  updateCartQty(itemId, delta) {
    const idx = this.cart.findIndex(c => c.itemId === itemId);
    if (idx !== -1) {
      this.cart[idx].quantity += delta;
      if (this.cart[idx].quantity <= 0) {
        this.cart.splice(idx, 1);
      }
    }
    this.audio.playTap();
    this.renderActiveView();
    this.renderCart();
    this.updateCartBadge();
  }

  clearCart() {
    this.cart = [];
    this.renderActiveView();
    this.renderCart();
    this.updateCartBadge();
  }

  getCartTotals() {
    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = Math.round(subtotal * 0.10 * 100) / 100; // 10% Campus discount
    const gst = Math.round((subtotal - discount) * 0.05 * 100) / 100; // 5% GST
    const total = Math.max(0, Math.round((subtotal - discount + gst) * 100) / 100);
    return { subtotal, discount, gst, total };
  }

  updateCartBadge() {
    const badge = document.getElementById("cart-badge");
    const count = this.cart.reduce((acc, i) => acc + i.quantity, 0);
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? "flex" : "none";
    }
  }

  toggleFavorite(itemId, event) {
    if (event) event.stopPropagation();
    const isFav = this.storage.toggleFavorite(itemId);
    this.audio.playTap();
    this.renderActiveView();
    window.app.showToast(
      isFav ? "Saved to Favorites" : "Removed from Favorites",
      isFav ? "Dish added to your campus favorites list." : "Dish removed from favorites.",
      isFav ? "❤️" : "🤍"
    );
  }

  // --- Render Food Card HTML (Black & Lavender) ---
  renderFoodCard(item) {
    const user = this.storage.getUser();
    const isFav = (user.favorites || []).includes(item.id);
    const inCart = this.cart.find(c => c.itemId === item.id);
    const isAvailable = item.available && item.stockQuantity > 0;
    const isLowStock = isAvailable && item.stockQuantity <= 5;

    let availBadge = `<span class="status-badge available">● Available</span>`;
    if (!isAvailable) {
      availBadge = `<span class="status-badge sold-out">✕ Sold Out</span>`;
    } else if (isLowStock) {
      availBadge = `<span class="status-badge low-stock">⚠️ Only ${item.stockQuantity} Left!</span>`;
    }

    let btnHtml = "";
    if (!isAvailable) {
      btnHtml = `<button class="btn-primary" disabled>Sold Out</button>`;
    } else if (inCart) {
      btnHtml = `
        <div class="quantity-stepper">
          <button class="stepper-btn" onclick="window.studentPortal.updateCartQty('${item.id}', -1)" aria-label="Decrease quantity">−</button>
          <span class="stepper-value">${inCart.quantity}</span>
          <button class="stepper-btn" onclick="window.studentPortal.updateCartQty('${item.id}', 1)" aria-label="Increase quantity">+</button>
        </div>
      `;
    } else {
      btnHtml = `
        <button class="btn-primary" onclick="window.studentPortal.addToCart('${item.id}')">
          <span>+</span> Add to Cart
        </button>
      `;
    }

    return `
      <div class="food-card ${!isAvailable ? 'sold-out' : ''}" data-id="${item.id}">
        <div class="food-card-thumb">
          <img src="${item.image}" alt="${item.name}" class="food-card-img" loading="lazy" onerror="this.src='assets/chicken_biryani.jpg'" />
          ${item.isSpecial ? `<div class="card-tag-badge">⭐ ${item.tag || "Today's Special"}</div>` : ''}
          <button class="card-fav-btn ${isFav ? 'active' : ''}" onclick="window.studentPortal.toggleFavorite('${item.id}', event)" title="${isFav ? 'Remove favorite' : 'Add to favorites'}">
            ${isFav ? '❤️' : '🤍'}
          </button>
          <div class="card-veg-symbol">
            <span class="${item.isVeg ? 'symbol-veg' : 'symbol-nonveg'}" title="${item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}"></span>
          </div>
        </div>
        <div class="food-card-content">
          <div class="food-name-row">
            <h3 class="food-name-title">${item.name}</h3>
            <div class="food-rating-tag">★ ${item.rating || 4.8}</div>
          </div>
          <p class="food-brief">${item.description}</p>
          <div class="food-status-row">
            ${availBadge}
            <span class="prep-time-text">⏱️ ~${item.prepTimeMinutes || 8} mins</span>
          </div>
          <div class="food-card-bottom">
            <div class="food-price-amount">₹${item.price}</div>
            ${btnHtml}
          </div>
        </div>
      </div>
    `;
  }

  // --- Home Tab View ---
  renderHomeView() {
    const container = document.getElementById("student-home-view");
    if (!container) return;

    const items = this.storage.getMenuItems();
    const specials = items.filter(i => i.isSpecial);
    const popular = items.filter(i => !i.isSpecial);

    container.innerHTML = `
      <!-- Daily Specials Section -->
      <div class="section-header" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.5rem;">
        <div>
          <h2 class="section-title">⭐ Today's Daily Specials</h2>
          <p class="section-subtitle">Chef-curated campus specials prepared fresh with limited daily portions</p>
        </div>
        <button class="btn-secondary" onclick="window.studentPortal.switchStudentTab('menu')">
          View Full Menu →
        </button>
      </div>

      <div class="food-grid" style="margin-bottom: 3rem;">
        ${specials.map(item => this.renderFoodCard(item)).join("")}
      </div>

      <!-- Popular Campus Favorites Section -->
      <div class="section-header">
        <h2 class="section-title">🔥 Campus Popular Favorites</h2>
        <p class="section-subtitle">Most frequently ordered meal combos and afternoon bites</p>
      </div>

      <div class="food-grid">
        ${popular.slice(0, 4).map(item => this.renderFoodCard(item)).join("")}
      </div>
    `;
  }

  // --- Full Menu View ---
  renderMenu() {
    const grid = document.getElementById("menu-grid");
    if (!grid) return;

    const items = this.storage.getMenuItems();
    const filtered = items.filter(item => {
      // Category filter
      if (this.activeCategory === "specials" && !item.isSpecial) return false;
      if (this.activeCategory !== "all" && this.activeCategory !== "specials" && item.category !== this.activeCategory) return false;

      // Dietary filter
      if (this.activeDietary === "veg" && !item.isVeg) return false;
      if (this.activeDietary === "nonveg" && item.isVeg) return false;

      // Search filter
      if (this.searchQuery.trim() !== "") {
        const q = this.searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = (item.description || "").toLowerCase().includes(q);
        const matchesTag = (item.tag || "").toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesTag) return false;
      }

      return true;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-secondary); background: var(--bg-surface); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div style="font-size: 3rem; margin-bottom: 0.75rem;">🔍🍽️</div>
          <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.35rem; color: #FFFFFF;">No matching food items</h3>
          <p style="font-size: 0.9rem;">Try selecting a different category, veg/non-veg filter, or keyword search.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(item => this.renderFoodCard(item)).join("");
  }

  // --- Favorites Tab View ---
  renderFavorites() {
    const container = document.getElementById("student-favorites-view");
    if (!container) return;

    const user = this.storage.getUser();
    const favIds = user.favorites || [];
    const allItems = this.storage.getMenuItems();
    const favItems = allItems.filter(i => favIds.includes(i.id));

    if (favItems.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem; background: var(--bg-surface); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div style="font-size: 3rem; margin-bottom: 0.75rem;">🤍</div>
          <h3 style="font-size: 1.25rem; font-weight: 700; color: #FFFFFF; margin-bottom: 0.4rem;">No Favorites Saved Yet</h3>
          <p style="color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 0.9rem;">Tap the heart icon on any dish to save your campus favorites here!</p>
          <button class="btn-primary" onclick="window.studentPortal.switchStudentTab('menu')">
            Explore Daily Menu →
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="section-header">
        <h2 class="section-title">❤️ Your Campus Favorites (${favItems.length})</h2>
        <p class="section-subtitle">Quickly re-order the dishes you love the most</p>
      </div>
      <div class="food-grid">
        ${favItems.map(item => this.renderFoodCard(item)).join("")}
      </div>
    `;
  }

  // --- Wallet View ---
  renderWalletView() {
    const container = document.getElementById("student-wallet-view");
    if (!container) return;

    const user = this.storage.getUser();

    container.innerHTML = `
      <div style="max-width: 680px; margin: 0 auto; background: var(--bg-surface); border: 1px solid var(--border-lavender); border-radius: var(--radius-lg); padding: 2.25rem; box-shadow: var(--shadow-md);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1.25rem;">
          <div>
            <h2 class="section-title" style="margin-bottom: 0.25rem;">💳 Campus Student Wallet</h2>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">Direct prepaid campus meal card connected to Student ID #${user.studentId}</p>
          </div>
          <span style="font-size: 0.8rem; background: var(--success-light); color: var(--success); font-weight: 700; padding: 0.35rem 0.85rem; border-radius: var(--radius-full); border: 1px solid rgba(16, 185, 129, 0.3);">
            ✓ Verified
          </span>
        </div>

        <div style="background: linear-gradient(135deg, rgba(27, 27, 40, 0.9), rgba(184, 146, 255, 0.15)); border: 1px solid var(--border-lavender); border-radius: var(--radius-md); padding: 2rem; text-align: center; margin-bottom: 1.75rem; box-shadow: 0 0 25px var(--lavender-glow);">
          <div style="font-size: 0.85rem; color: var(--lavender-bright); text-transform: uppercase; font-weight: 700; letter-spacing: 0.08em;">Available Dining Balance</div>
          <div style="font-family: var(--font-heading); font-size: 3.2rem; font-weight: 900; color: #FFFFFF; margin: 0.35rem 0; text-shadow: 0 0 20px var(--lavender-glow);">₹${user.walletBalance.toFixed(2)}</div>
          <div style="font-size: 0.8rem; color: var(--text-secondary);">Automatic 10% Campus Subsidy applies on every order</div>
        </div>

        <h3 style="font-size: 1rem; font-weight: 700; color: #FFFFFF; margin-bottom: 0.85rem;">Fast Wallet Recharge</h3>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; margin-bottom: 1.5rem;">
          <button class="btn-secondary" onclick="window.app.topUpWallet(100)">+ ₹100</button>
          <button class="btn-secondary" onclick="window.app.topUpWallet(200)">+ ₹200</button>
          <button class="btn-secondary" onclick="window.app.topUpWallet(500)">+ ₹500</button>
          <button class="btn-secondary" onclick="window.app.customTopUp()">Custom</button>
        </div>

        <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 1.15rem; font-size: 0.85rem; color: var(--text-secondary);">
          <strong style="color: var(--lavender-bright);">💡 Wallet Perks:</strong> One-tap checkout, zero transaction fees, instant automated refunds upon order cancellation.
        </div>
      </div>
    `;
  }

  // --- Profile View ---
  renderProfileView() {
    const container = document.getElementById("student-profile-view");
    if (!container) return;

    const user = this.storage.getUser();

    container.innerHTML = `
      <div style="max-width: 680px; margin: 0 auto; background: var(--bg-surface); border: 1px solid var(--border-lavender); border-radius: var(--radius-lg); padding: 2.25rem; box-shadow: var(--shadow-md);">
        <div style="display: flex; align-items: center; gap: 1.25rem; margin-bottom: 1.75rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1.25rem;">
          <div style="width: 68px; height: 68px; border-radius: 50%; background: linear-gradient(135deg, var(--lavender-primary), var(--lavender-deep)); color: #0A0A0C; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; box-shadow: 0 4px 16px var(--lavender-glow);">
            ${user.avatar || '👨‍🎓'}
          </div>
          <div>
            <h2 class="section-title" style="margin-bottom: 0.25rem;">${user.name}</h2>
            <div style="font-size: 0.85rem; color: var(--text-secondary);">Campus ID: <strong style="color: var(--lavender-bright);">${user.studentId}</strong> • ${user.department}</div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem; font-size: 0.9rem;">
          <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--border-subtle);">
            <span style="color: var(--text-secondary);">Email Address</span>
            <span style="font-weight: 600; color: #FFFFFF;">${user.email}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--border-subtle);">
            <span style="color: var(--text-secondary);">Phone Number</span>
            <span style="font-weight: 600; color: #FFFFFF;">${user.phone}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--border-subtle);">
            <span style="color: var(--text-secondary);">Current Status</span>
            <span style="font-weight: 700; color: var(--success);">Student (Verified)</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--border-subtle);">
            <span style="color: var(--text-secondary);">Prepaid Wallet Balance</span>
            <span style="font-family: var(--font-heading); font-size: 1.2rem; font-weight: 800; color: var(--lavender-bright);">₹${user.walletBalance.toFixed(2)}</span>
          </div>
        </div>

        <div style="margin-top: 2rem; display: flex; gap: 0.75rem;">
          <button class="btn-primary" onclick="window.studentPortal.switchStudentTab('wallet')">
            Manage Wallet Balance →
          </button>
          <button class="btn-secondary" onclick="window.studentPortal.switchStudentTab('orders')">
            View Order History
          </button>
        </div>
      </div>
    `;
  }

  // --- Feedback View ---
  renderFeedbackView() {
    const container = document.getElementById("student-feedback-view");
    if (!container) return;

    const feedbackList = this.storage.getFeedback();

    container.innerHTML = `
      <div style="max-width: 840px; margin: 0 auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 class="section-title">⭐ Student Dining Reviews & Feedback</h2>
            <p class="section-subtitle">Real feedback from campus peers on food taste, kitchen hygiene, and pickup speed</p>
          </div>
          <button class="btn-primary" onclick="window.studentPortal.openGeneralFeedbackModal()">
            + Write a Review
          </button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${feedbackList.map(fb => `
            <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.35rem; box-shadow: var(--shadow-sm);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                <div>
                  <strong style="color: #FFFFFF; font-size: 0.95rem;">${fb.userName}</strong>
                  <span style="font-size: 0.8rem; color: var(--lavender-bright); margin-left: 0.5rem;">Token #${fb.tokenNumber} • ${fb.createdAt}</span>
                </div>
                <div style="color: #FBBF24; font-weight: 700; font-size: 0.95rem;">
                  ★ ${fb.ratingFood || 5}.0
                </div>
              </div>

              <p style="font-size: 0.9rem; color: var(--text-lavender); margin-bottom: 0.75rem;">
                "${fb.comment || 'Good food and quick service.'}"
              </p>

              ${fb.reply ? `
                <div style="background: var(--bg-surface-elevated); border-left: 3px solid var(--lavender-primary); padding: 0.75rem 1rem; border-radius: 4px; font-size: 0.85rem;">
                  <strong style="color: var(--lavender-bright);">Canteen Response:</strong>
                  <span style="color: var(--text-secondary); margin-left: 4px;">${fb.reply}</span>
                </div>
              ` : ''}
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  // --- Cart Drawer Rendering ---
  renderCart() {
    const list = document.getElementById("cart-items-list");
    const footer = document.getElementById("cart-footer");
    if (!list || !footer) return;

    if (this.cart.length === 0) {
      list.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--text-secondary);">
          <div style="font-size: 3rem; margin-bottom: 0.75rem;">🛒</div>
          <p style="font-weight: 700; color: #FFFFFF; margin-bottom: 0.25rem;">Your tray is empty</p>
          <p style="font-size: 0.85rem;">Add some mouth-watering campus meals from the menu!</p>
        </div>
      `;
      footer.style.display = "none";
      return;
    }

    footer.style.display = "block";
    list.innerHTML = this.cart.map(item => `
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; padding: 0.85rem; background: var(--bg-surface-elevated); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
        <img src="${item.image}" alt="${item.name}" style="width: 48px; height: 48px; object-fit: cover; border-radius: 8px;" onerror="this.src='assets/chicken_biryani.jpg'" />
        <div style="flex: 1;">
          <div style="font-size: 0.9rem; font-weight: 700; color: #FFFFFF;">${item.name}</div>
          <div style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 600;">₹${item.price} × ${item.quantity} = <strong style="color: var(--lavender-bright);">₹${item.price * item.quantity}</strong></div>
        </div>
        <div class="quantity-stepper">
          <button class="stepper-btn" onclick="window.studentPortal.updateCartQty('${item.itemId}', -1)">−</button>
          <span class="stepper-value">${item.quantity}</span>
          <button class="stepper-btn" onclick="window.studentPortal.updateCartQty('${item.itemId}', 1)">+</button>
        </div>
      </div>
    `).join("");

    const { subtotal, discount, gst, total } = this.getCartTotals();

    footer.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1.25rem; font-size: 0.85rem;">
        <div style="display: flex; justify-content: space-between; color: var(--text-secondary);">
          <span>Subtotal</span>
          <span>₹${subtotal.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; color: var(--success); font-weight: 600;">
          <span>Campus Subsidy (10%)</span>
          <span>-₹${discount.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; color: var(--text-secondary);">
          <span>GST (5%)</span>
          <span>₹${gst.toFixed(2)}</span>
        </div>
        <div style="border-top: 1px dashed var(--border-subtle); margin: 0.35rem 0;"></div>
        <div style="display: flex; justify-content: space-between; font-size: 1.25rem; font-weight: 900; color: var(--lavender-bright);">
          <span>Total Payable</span>
          <span>₹${total.toFixed(2)}</span>
        </div>
      </div>
      <button class="btn-primary" style="width: 100%; padding: 0.85rem;" onclick="window.studentPortal.openCheckoutModal()">
        Proceed to Checkout →
      </button>
    `;
  }

  // --- Checkout Modal ---
  openCheckoutModal() {
    this.closeCartDrawer();
    const modal = document.getElementById("checkout-modal");
    if (!modal) return;

    const { total } = this.getCartTotals();
    const user = this.storage.getUser();

    document.getElementById("checkout-total-amt").textContent = `₹${total.toFixed(2)}`;
    document.getElementById("wallet-avail-balance").textContent = `₹${user.walletBalance.toFixed(2)}`;

    this.selectPaymentMethod(this.selectedPaymentMethod);
    modal.classList.add("open");
  }

  closeCheckoutModal() {
    const modal = document.getElementById("checkout-modal");
    if (modal) modal.classList.remove("open");
  }

  selectPaymentMethod(method) {
    this.selectedPaymentMethod = method;
    document.querySelectorAll(".payment-method-card").forEach(c => {
      const isMatch = c.dataset.method === method;
      c.style.borderColor = isMatch ? "var(--lavender-primary)" : "var(--border-subtle)";
      c.style.background = isMatch ? "var(--lavender-light)" : "var(--bg-surface-elevated)";
      c.style.boxShadow = isMatch ? "0 0 14px var(--lavender-glow)" : "none";
    });

    const upiContainer = document.getElementById("upi-details-box");
    const walletContainer = document.getElementById("wallet-details-box");
    const cardContainer = document.getElementById("card-details-box");

    if (upiContainer) upiContainer.style.display = method === "UPI" ? "block" : "none";
    if (walletContainer) walletContainer.style.display = method === "Campus Wallet" ? "block" : "none";
    if (cardContainer) cardContainer.style.display = method === "Debit/Credit Card" ? "block" : "none";
  }

  setPickupTime(timeStr) {
    this.selectedPickupTime = timeStr;
    document.querySelectorAll(".time-slot-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.time === timeStr);
    });
  }

  submitOrder() {
    if (this.cart.length === 0) return;

    const { subtotal, discount, total } = this.getCartTotals();
    const user = this.storage.getUser();

    if (this.selectedPaymentMethod === "Campus Wallet" && user.walletBalance < total) {
      alert(`Insufficient Campus Wallet balance (Current: ₹${user.walletBalance.toFixed(2)}). Please top up your wallet or select UPI!`);
      return;
    }

    const notesInput = document.getElementById("order-notes-input");
    const notes = notesInput ? notesInput.value.trim() : "";

    const orderData = {
      userId: user.id,
      userName: user.name,
      userPhone: user.phone,
      items: this.cart.map(c => ({
        itemId: c.itemId,
        name: c.name,
        price: c.price,
        quantity: c.quantity,
        isVeg: c.isVeg
      })),
      subtotal,
      discount,
      total,
      paymentMethod: this.selectedPaymentMethod,
      paymentStatus: "Paid",
      orderType: this.selectedPickupTime === "ASAP" ? "Immediate" : "Pre-Order",
      pickupTime: this.selectedPickupTime === "ASAP" ? "ASAP (~10 mins)" : this.selectedPickupTime,
      notes
    };

    this.closeCheckoutModal();
    this.showPaymentProcessingScreen(orderData);
  }

  showPaymentProcessingScreen(orderData) {
    const processingModal = document.getElementById("payment-processing-modal");
    if (!processingModal) {
      this.finalizeOrderPlacement(orderData);
      return;
    }

    processingModal.classList.add("open");

    setTimeout(() => {
      processingModal.classList.remove("open");
      this.finalizeOrderPlacement(orderData);
    }, 1200);
  }

  finalizeOrderPlacement(orderData) {
    const newOrder = this.storage.createOrder(orderData);
    this.currentTrackingOrderId = newOrder.id;
    this.cart = [];
    this.updateCartBadge();
    this.renderActiveView();

    this.audio.playOrderSuccess();

    window.app.showToast(
      `Order Confirmed! Token #${newOrder.tokenNumber}`,
      `Your meal is in queue. Monitor live cooking progress!`,
      "🎉"
    );

    this.switchStudentTab("tracker");
  }

  // --- Dedicated Queue Card & Order Tracking ---
  renderOrderTracker() {
    const container = document.getElementById("order-tracker-container");
    if (!container) return;

    const orders = this.storage.getOrders();
    const user = this.storage.getUser();

    let targetOrder = null;
    if (this.currentTrackingOrderId) {
      targetOrder = orders.find(o => o.id === this.currentTrackingOrderId);
    }
    if (!targetOrder) {
      targetOrder = orders.find(o => o.userId === user.id && !["COLLECTED", "CANCELLED"].includes(o.orderStatus));
    }
    if (!targetOrder) {
      targetOrder = orders.find(o => o.userId === user.id);
    }

    if (!targetOrder) {
      container.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem; color: var(--text-secondary); background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
          <div style="font-size: 3rem; margin-bottom: 0.75rem;">🎫</div>
          <h3 style="font-size: 1.25rem; font-weight: 700; color: #FFFFFF; margin-bottom: 0.35rem;">No Active Orders</h3>
          <p style="margin-bottom: 1.5rem; font-size: 0.9rem;">You don't have any ongoing canteen orders right now.</p>
          <button class="btn-primary" onclick="window.studentPortal.switchStudentTab('menu')">
            Browse Menu & Order Food →
          </button>
        </div>
      `;
      return;
    }

    const { tokenNumber, orderStatus, pickupTime, orderType, total, items, placedAt, estimatedWaitMins } = targetOrder;

    const timelineSteps = [
      { key: "PLACED", title: "Order Confirmed", desc: "Received at central campus kitchen" },
      { key: "PAYMENT_CONFIRMED", title: "Payment Completed", desc: `${targetOrder.paymentMethod} verified` },
      { key: "PREPARING", title: "Preparing", desc: "Chef is cooking your fresh meal" },
      { key: "READY", title: "Ready for Pickup", desc: "Hot at Counter 2 ready to collect" },
      { key: "COLLECTED", title: "Collected", desc: "Handed over to student" }
    ];

    const statusHierarchy = ["PLACED", "PAYMENT_CONFIRMED", "PREPARING", "READY", "COLLECTED"];
    let currentIdx = statusHierarchy.indexOf(orderStatus);
    if (orderStatus === "ACCEPTED") currentIdx = 1;

    const isReady = orderStatus === "READY";
    const isCollected = orderStatus === "COLLECTED";
    const isCancelled = orderStatus === "CANCELLED";

    const progressPercent = Math.min(100, Math.max(10, ((currentIdx + 1) / timelineSteps.length) * 100));

    container.innerHTML = `
      <div class="order-tracking-layout">
        <!-- Main Tracking Left -->
        <div class="tracking-main-card">

          ${isReady ? `
            <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid var(--success); border-radius: var(--radius-md); padding: 1.25rem; text-align: center; margin-bottom: 1.5rem; box-shadow: 0 0 20px rgba(16, 185, 129, 0.25);">
              <h3 style="color: #34D399; font-family: var(--font-heading); font-size: 1.3rem; font-weight: 800; margin-bottom: 0.25rem;">🔔 ORDER READY FOR PICKUP!</h3>
              <p style="font-size: 0.85rem; color: #A7F3D0;">Please head over to <strong>Counter 2</strong> and present Token <strong>#${tokenNumber}</strong>.</p>
            </div>
          ` : ''}

          <!-- Dedicated Queue Card in Black and Lavender Theme -->
          <div class="queue-card-navy">
            <div class="token-center-display">
              <div class="token-small-title">Campus Food Token</div>
              <div class="token-giant-number">#${tokenNumber}</div>
              <div class="token-sub-instruction">Present this token at Counter 2 when marked ready</div>
            </div>

            <!-- Queue Progress Bar -->
            <div class="queue-progress-bar-container">
              <div class="queue-progress-labels">
                <span>Queue Flow</span>
                <span>${progressPercent}% Complete</span>
              </div>
              <div class="queue-progress-track">
                <div class="queue-progress-fill" style="width: ${progressPercent}%;"></div>
              </div>
            </div>

            <!-- Queue Metrics Strip (4 metrics) -->
            <div class="queue-metrics-strip">
              <div class="queue-metric-item">
                <span class="queue-metric-num">${tokenNumber}</span>
                <span class="queue-metric-desc">Your Token</span>
              </div>
              <div class="queue-metric-item">
                <span class="queue-metric-num" style="color: var(--lavender-bright);">#A1038</span>
                <span class="queue-metric-desc">Now Serving</span>
              </div>
              <div class="queue-metric-item">
                <span class="queue-metric-num">${isReady ? '0' : '3'}</span>
                <span class="queue-metric-desc">People Ahead</span>
              </div>
              <div class="queue-metric-item">
                <span class="queue-metric-num" style="color: ${isReady ? 'var(--success)' : 'var(--lavender-primary)'};">
                  ${isReady ? '0 min' : (estimatedWaitMins || '6') + ' min'}
                </span>
                <span class="queue-metric-desc">Est. Waiting</span>
              </div>
            </div>
          </div>

          <!-- Order Tracking Timeline (Black & Lavender) -->
          <h3 class="timeline-title">Order Status Timeline</h3>
          <div class="order-timeline-track">
            ${timelineSteps.map((step, idx) => {
              let cls = "";
              if (currentIdx > idx) cls = "completed";
              else if (currentIdx === idx) cls = "active";

              let icon = idx + 1;
              if (currentIdx > idx) icon = "✓";

              return `
                <div class="timeline-step ${cls}">
                  <div class="step-circle">${icon}</div>
                  <div class="step-details">
                    <div class="step-heading">${step.title}</div>
                    <div class="step-subinfo">${step.desc}</div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>

          <!-- Demo Controller -->
          <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-lavender); border-radius: var(--radius-sm); padding: 1.25rem; margin-top: 1.5rem;">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--lavender-bright); text-transform: uppercase; margin-bottom: 0.4rem;">
              ⚡ Interactive Demo Status Controller
            </div>
            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.75rem;">Simulate canteen kitchen moving this order through each milestone:</p>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button class="btn-primary" style="padding: 0.5rem 1rem; font-size: 0.8rem;" onclick="window.studentPortal.simulateNextStatus('${targetOrder.id}')">
                Advance Status (${this.getNextStatusLabel(orderStatus)}) →
              </button>
              ${!isCollected && !isCancelled ? `
                <button class="btn-secondary" style="color: var(--error); border-color: rgba(244, 63, 94, 0.4); padding: 0.5rem 1rem; font-size: 0.8rem;" onclick="window.studentPortal.cancelActiveOrder('${targetOrder.id}')">
                  Cancel & Refund to Wallet ✕
                </button>
              ` : ''}
            </div>
          </div>

        </div>

        <!-- Order Summary Sidebar Right -->
        <div class="order-summary-card">
          <div class="summary-heading">Order Receipt</div>
          <div style="font-size: 0.85rem; color: var(--text-secondary);">
            <div><strong>Mode:</strong> ${orderType} (${pickupTime})</div>
            <div><strong>Placed:</strong> ${new Date(placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div><strong>Payment:</strong> ${targetOrder.paymentMethod} (${targetOrder.paymentStatus})</div>
          </div>

          <div class="order-items-table">
            ${items.map(it => `
              <div class="order-item-line">
                <div>
                  <strong style="color: var(--lavender-bright);">${it.quantity}×</strong> ${it.name}
                </div>
                <span style="font-weight: 700; color: #FFFFFF;">₹${it.price * it.quantity}</span>
              </div>
            `).join("")}
          </div>

          <div class="summary-math">
            <div style="display: flex; justify-content: space-between;">
              <span>Subtotal</span>
              <span>₹${targetOrder.subtotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; color: var(--success);">
              <span>Campus Subsidy</span>
              <span>-₹${(targetOrder.discount || 0).toFixed(2)}</span>
            </div>
            <div class="summary-math-total">
              <span>Total Paid</span>
              <span>₹${total.toFixed(2)}</span>
            </div>
          </div>

          ${isCollected && !targetOrder.hasFeedback ? `
            <button class="btn-primary" style="width: 100%; margin-top: 0.5rem;" onclick="window.studentPortal.openFeedbackModal('${targetOrder.id}')">
              ⭐ Rate Food & Service
            </button>
          ` : ''}

          <button class="btn-secondary" style="width: 100%;" onclick="window.print()">
            🖨️ Print Digital Receipt
          </button>
        </div>
      </div>
    `;
  }

  getNextStatusLabel(currentStatus) {
    switch (currentStatus) {
      case "PLACED": return "Mark Paid";
      case "PAYMENT_CONFIRMED": return "Start Cooking";
      case "PREPARING": return "Mark Ready 🔔";
      case "READY": return "Mark Collected";
      default: return "Completed";
    }
  }

  simulateNextStatus(orderId) {
    const order = this.storage.getOrders().find(o => o.id === orderId);
    if (!order) return;

    const transitions = {
      "PLACED": "PAYMENT_CONFIRMED",
      "PAYMENT_CONFIRMED": "PREPARING",
      "ACCEPTED": "PREPARING",
      "PREPARING": "READY",
      "READY": "COLLECTED"
    };

    const next = transitions[order.orderStatus];
    if (next) {
      this.storage.updateOrderStatus(orderId, next);
      if (next === "READY") {
        this.audio.playOrderReady();
        window.app.showToast(`Order Ready! #${order.tokenNumber}`, "Your meal is hot and ready at Counter 2!", "🔔");
      } else {
        this.audio.playTap();
      }
      this.renderOrderTracker();
    }
  }

  cancelActiveOrder(orderId) {
    if (!confirm("Are you sure you want to cancel this order? The total amount will be credited back to your Campus Wallet.")) return;
    this.storage.updateOrderStatus(orderId, "CANCELLED");
    this.audio.playTap();
    window.app.showToast("Order Cancelled", "Full refund credited to Campus Wallet.", "↩️");
    this.renderOrderTracker();
  }

  // --- Past Orders History ---
  renderPastOrders() {
    const container = document.getElementById("student-orders-view");
    if (!container) return;

    const user = this.storage.getUser();
    const orders = this.storage.getOrders().filter(o => o.userId === user.id);

    if (orders.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem; background: var(--bg-surface); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div style="font-size: 3rem; margin-bottom: 0.75rem;">📜</div>
          <h3 style="font-size: 1.25rem; font-weight: 700; color: #FFFFFF; margin-bottom: 0.35rem;">No Past Orders Yet</h3>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">Your previous meals and receipts will be stored here.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="section-header">
        <h2 class="section-title">📜 Order History & Receipts (${orders.length})</h2>
        <p class="section-subtitle">Review previous campus meals or reorder favorites with one click</p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 880px;">
        ${orders.map(o => `
          <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.35rem; box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
              <div>
                <span class="ticket-token">Token #${o.tokenNumber}</span>
                <span style="font-size: 0.8rem; color: var(--text-secondary); margin-left: 0.5rem;">${new Date(o.placedAt).toLocaleDateString()} at ${new Date(o.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <span class="status-pill ${o.orderStatus === 'COLLECTED' ? 'Available' : (o.orderStatus === 'CANCELLED' ? 'Critical' : 'Low-Stock')}">
                ● ${o.orderStatus}
              </span>
            </div>

            <div style="font-size: 0.85rem; color: var(--text-lavender); margin-bottom: 0.75rem;">
              ${o.items.map(it => `<div><strong style="color: #FFFFFF;">${it.quantity}×</strong> ${it.name}</div>`).join("")}
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 0.75rem;">
              <div style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: var(--lavender-bright);">₹${o.total.toFixed(2)}</div>
              <div style="display: flex; gap: 0.5rem;">
                <button class="btn-secondary" onclick="window.studentPortal.reorderItems('${o.id}')">
                  🔁 Re-order
                </button>
                ${o.orderStatus === 'COLLECTED' ? `
                  <button class="btn-primary" onclick="window.studentPortal.openFeedbackModal('${o.id}')">
                    ${o.hasFeedback ? '★ Reviewed' : '⭐ Rate'}
                  </button>
                ` : `
                  <button class="btn-primary" onclick="window.studentPortal.viewActiveOrder('${o.id}')">
                    Track Live →
                  </button>
                `}
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  reorderItems(orderId) {
    const order = this.storage.getOrders().find(o => o.id === orderId);
    if (!order) return;

    order.items.forEach(it => {
      this.addToCart(it.itemId);
    });

    this.openCartDrawer();
    window.app.showToast("Items Added", "Re-ordered items loaded into your tray.", "🛒");
  }

  viewActiveOrder(orderId) {
    this.currentTrackingOrderId = orderId;
    this.switchStudentTab("tracker");
  }

  // --- Feedback Modal ---
  openFeedbackModal(orderId) {
    const modal = document.getElementById("feedback-modal");
    if (!modal) return;

    modal.dataset.orderId = orderId;
    const order = this.storage.getOrders().find(o => o.id === orderId);
    if (order) {
      document.getElementById("feedback-token-label").textContent = `Order #${order.tokenNumber}`;
    }

    modal.classList.add("open");
  }

  openGeneralFeedbackModal() {
    const modal = document.getElementById("feedback-modal");
    if (!modal) return;
    modal.dataset.orderId = "";
    document.getElementById("feedback-token-label").textContent = "General Dining Feedback";
    modal.classList.add("open");
  }

  closeFeedbackModal() {
    const modal = document.getElementById("feedback-modal");
    if (modal) modal.classList.remove("open");
  }

  submitFeedback() {
    const modal = document.getElementById("feedback-modal");
    const orderId = modal ? modal.dataset.orderId : null;
    const foodRating = 5;
    const serviceRating = 5;
    const valueRating = 5;
    const comment = document.getElementById("feedback-comment-input")?.value || "";

    const user = this.storage.getUser();
    const order = this.storage.getOrders().find(o => o.id === orderId);

    this.storage.addFeedback({
      orderId,
      tokenNumber: order ? order.tokenNumber : "General",
      userName: user.name,
      ratingFood: foodRating,
      ratingService: serviceRating,
      ratingValue: valueRating,
      comment
    });

    this.closeFeedbackModal();
    this.audio.playTap();
    window.app.showToast("Review Submitted!", "Thank you for helping us improve campus dining!", "⭐");
    if (this.activeTab === "feedback") this.renderFeedbackView();
    if (this.activeTab === "orders") this.renderPastOrders();
    if (this.activeTab === "tracker") this.renderOrderTracker();
  }

  // --- Active Tab Switching ---
  switchStudentTab(tab) {
    this.activeTab = tab;

    // Update secondary navbar desktop buttons
    document.querySelectorAll(".nav-item-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tab);
    });

    // Update mobile bottom nav buttons
    document.querySelectorAll(".mobile-nav-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tab);
    });

    const views = [
      "student-home-view",
      "student-menu-view",
      "student-orders-view",
      "student-tracker-view",
      "student-wallet-view",
      "student-favorites-view",
      "student-feedback-view",
      "student-profile-view"
    ];

    views.forEach(vId => {
      const el = document.getElementById(vId);
      if (el) el.style.display = "none";
    });

    const heroEl = document.getElementById("student-hero-banner");
    const searchEl = document.getElementById("student-search-bar");

    if (heroEl) heroEl.style.display = (tab === "home" || tab === "menu") ? "flex" : "none";
    if (searchEl) searchEl.style.display = (tab === "home" || tab === "menu") ? "flex" : "none";

    const targetView = document.getElementById(`student-${tab}-view`);
    if (targetView) targetView.style.display = "block";

    this.renderActiveView();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  renderActiveView() {
    switch (this.activeTab) {
      case "home":
        this.renderHomeView();
        break;
      case "menu":
        this.renderMenu();
        break;
      case "orders":
        this.renderPastOrders();
        break;
      case "tracker":
        this.renderOrderTracker();
        break;
      case "wallet":
        this.renderWalletView();
        break;
      case "favorites":
        this.renderFavorites();
        break;
      case "feedback":
        this.renderFeedbackView();
        break;
      case "profile":
        this.renderProfileView();
        break;
    }
  }

  openCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    if (drawer) drawer.classList.add("open");
  }

  closeCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    if (drawer) drawer.classList.remove("open");
  }

  updateActiveOrderPill() {
    const pill = document.getElementById("nav-active-order-pill");
    if (!pill) return;

    const user = this.storage.getUser();
    const orders = this.storage.getOrders();
    const active = orders.find(o => o.userId === user.id && !["COLLECTED", "CANCELLED"].includes(o.orderStatus));

    if (active) {
      pill.style.display = "flex";
      pill.innerHTML = `<span>⚡</span> Token #${active.tokenNumber}: <strong>${active.orderStatus}</strong>`;
      pill.onclick = () => {
        this.currentTrackingOrderId = active.id;
        window.app.switchRole("student");
        this.switchStudentTab("tracker");
      };
    } else {
      pill.style.display = "none";
    }
  }

  updateHeaderUserInfo() {
    const user = this.storage.getUser();
    const walletEl = document.getElementById("nav-wallet-balance");
    if (walletEl) {
      walletEl.textContent = `₹${user.walletBalance.toFixed(2)}`;
    }
  }
}

window.StudentPortal = StudentPortal;
