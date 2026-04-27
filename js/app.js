// ===== LUXEMARKET APP.JS =====

// ---- AUTH HELPERS ----
const Auth = {
  isLoggedIn() {
    return !!localStorage.getItem('lm_user');
  },
  getUser() {
    const u = localStorage.getItem('lm_user');
    return u ? JSON.parse(u) : null;
  },
  setUser(user) {
    localStorage.setItem('lm_user', JSON.stringify(user));
  },
  logout() {
    localStorage.removeItem('lm_user');
    window.location.href = '/index.html';
  },
  requireLogin() {
    if (!this.isLoggedIn()) {
      window.location.href = '/pages/login.html';
      return false;
    }
    return true;
  }
};

// ---- CART HELPERS ----
const Cart = {
  get() {
    const c = localStorage.getItem('lm_cart');
    return c ? JSON.parse(c) : [];
  },
  save(cart) {
    localStorage.setItem('lm_cart', JSON.stringify(cart));
    this.updateBadge();
  },
  add(product, qty = 1) {
    const cart = this.get();
    const idx = cart.findIndex(i => i.id === product.id);
    if (idx >= 0) {
      cart[idx].qty += qty;
    } else {
      cart.push({ ...product, qty });
    }
    this.save(cart);
  },
  remove(id) {
    const cart = this.get().filter(i => i.id !== id);
    this.save(cart);
  },
  updateQty(id, qty) {
    const cart = this.get();
    const idx = cart.findIndex(i => i.id === id);
    if (idx >= 0) {
      cart[idx].qty = qty;
      if (cart[idx].qty <= 0) cart.splice(idx, 1);
    }
    this.save(cart);
  },
  count() {
    return this.get().reduce((acc, i) => acc + i.qty, 0);
  },
  total() {
    return this.get().reduce((acc, i) => acc + i.price * i.qty, 0);
  },
  clear() {
    localStorage.removeItem('lm_cart');
    this.updateBadge();
  },
  updateBadge() {
    const badge = document.getElementById('cartCount');
    if (badge) badge.textContent = this.count();
  }
};

// ---- TOAST ----
function showToast(msg, type = 'default') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<i class="fa fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i> ${msg}`;
  document.body.appendChild(t);
  requestAnimationFrame(() => {
    t.classList.add('show');
    setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 400);
    }, 3000);
  });
}

// ---- PRODUCT CARD RENDER ----
function renderProductCard(p, mini = false) {
  const stars = '★'.repeat(Math.floor(p.rating)) + (p.rating % 1 ? '½' : '');
  return `
    <div class="product-card" onclick="viewProduct(${p.id})">
      <div class="product-img-wrap">
        <img src="${p.image}" alt="${p.name}" loading="lazy"/>
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        <div class="product-actions">
          <button class="action-btn" onclick="event.stopPropagation(); quickAddToCart(${p.id})" title="Add to Cart">
            <i class="fa fa-bag-shopping"></i>
          </button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-cat">${p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-rating">
          <span class="stars">${stars}</span>
          <span class="rating-count">(${p.reviews})</span>
        </div>
        <div class="product-price-row">
          <div>
            <span class="product-price">₹${p.price.toLocaleString('en-IN')}</span>
            ${p.oldPrice ? `<span class="product-price-old">₹${p.oldPrice.toLocaleString('en-IN')}</span>` : ''}
          </div>
          <button class="add-cart-btn" onclick="event.stopPropagation(); quickAddToCart(${p.id})">
            + Cart
          </button>
        </div>
      </div>
    </div>
  `;
}

function viewProduct(id) {
  window.location.href = `/pages/product.html?id=${id}`;
}

function quickAddToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  Cart.add(product, 1);
  showToast(`<strong>${product.name}</strong> added to cart!`, 'success');
}

// ---- NAVBAR UPDATE ----
function updateNavbar() {
  const user = Auth.getUser();
  const loginBtn = document.getElementById('loginBtn');
  const nameEl = document.getElementById('navUserName');
  if (loginBtn && user) {
    nameEl.textContent = user.name.split(' ')[0];
    loginBtn.onclick = () => window.location.href = '/pages/dashboard.html';
  }
  Cart.updateBadge();
}

// ---- NAVBAR SCROLL ----
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ---- INIT ----
document.addEventListener('DOMContentLoaded', updateNavbar);
