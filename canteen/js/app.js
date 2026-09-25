/**
 * Smart Canteen Management Platform
 * Master App Controller - Modern White & Dark Navy Blue Theme
 */

class CanteenApp {
  constructor() {
    this.currentRole = "student"; // 'student' | 'admin'
    this.init();
  }

  init() {
    // Initialize portals
    window.studentPortal = new StudentPortal(window.canteenStorage, window.canteenAudio);
    window.adminConsole = new AdminConsole(window.canteenStorage, window.canteenAudio);

    // Initial renders
    window.studentPortal.renderActiveView();
    window.studentPortal.updateActiveOrderPill();
    window.studentPortal.updateHeaderUserInfo();
    window.adminConsole.renderMetrics();

    // Event listeners
    this.bindEvents();

    // Update notifications badge
    this.updateNotificationsBadge();
    window.canteenStorage.on("notificationsUpdated", () => this.updateNotificationsBadge());
  }

  bindEvents() {
    // Search input with instant filtering
    const searchInput = document.getElementById("menu-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        window.studentPortal.searchQuery = e.target.value;
        if (window.studentPortal.activeTab !== "menu") {
          window.studentPortal.switchStudentTab("menu");
        } else {
          window.studentPortal.renderMenu();
        }
      });
    }

    // Category pills
    document.querySelectorAll(".cat-pill-btn").forEach(pill => {
      pill.addEventListener("click", () => {
        document.querySelectorAll(".cat-pill-btn").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        window.studentPortal.activeCategory = pill.dataset.cat;
        if (window.studentPortal.activeTab !== "menu") {
          window.studentPortal.switchStudentTab("menu");
        } else {
          window.studentPortal.renderMenu();
        }
      });
    });

    // Dietary filters
    document.querySelectorAll(".diet-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".diet-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        window.studentPortal.activeDietary = btn.dataset.diet;
        if (window.studentPortal.activeTab !== "menu") {
          window.studentPortal.switchStudentTab("menu");
        } else {
          window.studentPortal.renderMenu();
        }
      });
    });
  }

  // --- Role Switcher (Student vs Admin) ---
  switchRole(role) {
    this.currentRole = role;
    document.querySelectorAll(".role-toggle-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.role === role);
    });

    const studentView = document.getElementById("student-portal-wrapper");
    const adminView = document.getElementById("admin-portal-wrapper");
    const studentSecNav = document.getElementById("student-secondary-nav");
    const adminSecNav = document.getElementById("admin-secondary-nav");
    const studentHeaderItems = document.querySelectorAll(".student-header-elem");
    const mobileBottomNav = document.getElementById("mobile-bottom-nav");

    if (role === "student") {
      if (studentView) studentView.style.display = "block";
      if (adminView) adminView.style.display = "none";
      if (studentSecNav) studentSecNav.style.display = "block";
      if (adminSecNav) adminSecNav.style.display = "none";
      if (mobileBottomNav) mobileBottomNav.style.display = "flex";
      studentHeaderItems.forEach(el => el.style.display = "flex");
      window.studentPortal.renderActiveView();
    } else {
      if (studentView) studentView.style.display = "none";
      if (adminView) adminView.style.display = "block";
      if (studentSecNav) studentSecNav.style.display = "none";
      if (adminSecNav) adminSecNav.style.display = "block";
      if (mobileBottomNav) mobileBottomNav.style.display = "none";
      studentHeaderItems.forEach(el => el.style.display = "none");
      window.adminConsole.renderMetrics();
      window.adminConsole.switchAdminTab("orders");
    }

    window.canteenAudio.playTap();
  }

  // --- Sound Toggle ---
  toggleSound() {
    const enabled = window.canteenAudio.toggleSound();
    const btn = document.getElementById("sound-toggle-btn");
    if (btn) {
      btn.textContent = enabled ? "🔊" : "🔇";
      btn.title = enabled ? "Mute Sound Effects" : "Enable Sound Effects";
    }
    if (enabled) window.canteenAudio.playTap();
  }

  // --- Toast Notifications (Clean Navy Style) ---
  showToast(title, message, icon = "🔔") {
    const container = document.getElementById("toast-stack");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "clean-toast";
    toast.innerHTML = `
      <div style="font-size: 1.3rem;">${icon}</div>
      <div>
        <div class="toast-message-title">${title}</div>
        <div class="toast-message-desc">${message}</div>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      toast.style.transition = "all 0.25s ease";
      setTimeout(() => toast.remove(), 250);
    }, 3800);
  }

  // --- In-App Notifications Drawer ---
  openNotifications() {
    const modal = document.getElementById("notifications-modal");
    if (!modal) return;

    const notifs = window.canteenStorage.getNotifications();
    const list = document.getElementById("notifications-list");
    if (list) {
      if (notifs.length === 0) {
        list.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--text-secondary);">No new notifications</div>`;
      } else {
        list.innerHTML = notifs.map(n => `
          <div style="padding: 0.85rem; border-radius: var(--radius-xs); background: ${n.read ? 'var(--bg-light)' : 'var(--navy-light)'}; border: 1px solid var(--border-light); display: flex; gap: 0.75rem; align-items: flex-start;">
            <div style="font-size: 1.25rem;">${n.type === 'ready' ? '🔔' : (n.type === 'payment' ? '💳' : (n.type === 'wallet' ? '💰' : '📋'))}</div>
            <div style="flex: 1;">
              <div style="font-weight: 700; font-size: 0.9rem; color: var(--primary-navy); margin-bottom: 0.15rem;">${n.title}</div>
              <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.2rem;">${n.message}</div>
              <div style="font-size: 0.7rem; color: var(--text-muted);">${n.time}</div>
            </div>
          </div>
        `).join("");
      }
    }

    window.canteenStorage.markNotificationsRead();
    this.updateNotificationsBadge();
    modal.classList.add("open");
  }

  closeNotifications() {
    const modal = document.getElementById("notifications-modal");
    if (modal) modal.classList.remove("open");
  }

  updateNotificationsBadge() {
    const notifs = window.canteenStorage.getNotifications();
    const unread = notifs.filter(n => !n.read).length;
    const badge = document.getElementById("notif-badge");
    if (badge) {
      badge.textContent = unread;
      badge.style.display = unread > 0 ? "flex" : "none";
    }
  }

  // --- Student Profile & Campus Wallet Modal ---
  openWalletModal() {
    const modal = document.getElementById("wallet-modal");
    if (!modal) return;

    const user = window.canteenStorage.getUser();
    document.getElementById("profile-name").textContent = user.name;
    document.getElementById("profile-campus-id").textContent = user.studentId;
    document.getElementById("profile-wallet-balance").textContent = `₹${user.walletBalance.toFixed(2)}`;

    modal.classList.add("open");
  }

  closeWalletModal() {
    const modal = document.getElementById("wallet-modal");
    if (modal) modal.classList.remove("open");
  }

  topUpWallet(amount) {
    window.canteenStorage.topUpWallet(amount);
    window.canteenAudio.playTap();
    const user = window.canteenStorage.getUser();
    const balEl = document.getElementById("profile-wallet-balance");
    if (balEl) balEl.textContent = `₹${user.walletBalance.toFixed(2)}`;
    this.showToast("Wallet Reloaded!", `₹${amount} added successfully.`, "💰");
    if (window.studentPortal.activeTab === "wallet") {
      window.studentPortal.renderWalletView();
    }
  }

  customTopUp() {
    const amt = prompt("Enter amount to add to Campus Wallet (₹):", "250");
    if (amt && !isNaN(amt) && parseFloat(amt) > 0) {
      this.topUpWallet(parseFloat(amt));
    }
  }

  resetAllDemoData() {
    if (confirm("Reset the entire platform to fresh demo factory settings? (This reloads all menus, realistic orders, and campus wallet balances)")) {
      window.canteenStorage.resetToDefaults();
      location.reload();
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.app = new CanteenApp();
});
