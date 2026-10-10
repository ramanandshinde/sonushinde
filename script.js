/* =========================================================
   TALLR — Storefront interactions
   Demo only: cart is stored in memory and checkout is not live.
   ========================================================= */

"use strict";

const products = [
  {
    id: 1,
    name: "Jet Black Wide",
    category: "Jeans",
    price: 1599,
    oldPrice: 1899,
    badge: "Bestseller",
    image: "https://m.media-amazon.com/images/I/61jIIM3ATsL.jpg",
    description: "Relaxed wide-leg denim"
  },
  {
    id: 2,
    name: "Black Fade Wide",
    category: "Jeans",
    price: 1599,
    oldPrice: 1699,
    badge: "New drop",
    image: "https://m.media-amazon.com/images/I/61jIIM3ATsL.jpg",
    description: "Washed black denim"
  },
  {
    id: 3,
    name: "Grey Fade Wide",
    category: "Jeans",
    price: 1399,
    oldPrice: 1699,
    badge: "Limited",
    image: "https://m.media-amazon.com/images/I/61jIIM3ATsL.jpg",
    description: "Soft grey wash"
  },
  {
    id: 4,
    name: "Indigo Blue Wide",
    category: "Jeans",
    price: 1450,
    oldPrice: 1699,
    badge: "Everyday fit",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROuZXV_2gkbTSFmNYrnm4Zoun5I1_Ba6GkD6zetHjQeO6XilQX3et5L7yf&s=10",
    description: "Classic indigo denim"
  },
  {
    id: 5,
    name: "Gray Joggers — 300 GSM",
    category: "Joggers",
    price: 1499,
    oldPrice: 1999,
    badge: "Heavyweight",
    image: "https://www.wearduds.com/cdn/shop/files/womens-turbo-track-relaxed-fit-joggers-black-street-style-comfort_3.jpg?v=1766568423&width=2048",
    description: "Premium cotton feel"
  },
  {
    id: 6,
    name: "Carbon Fade Wide",
    category: "Jeans",
    price: 1499,
    oldPrice: 1999,
    badge: "Sale",
     image: "https://www.wearduds.com/cdn/shop/files/womens-turbo-track-relaxed-fit-joggers-black-street-style-comfort_3.jpg?v=1766568423&width=2048",
    description: "Carbon washed finish"
  },
  {
    id: 7,
    name: "Black Track Joggers",
    category: "Joggers",
    price: 1399,
    oldPrice: 1999,
    badge: "Core essential",
    image: "https://www.wearduds.com/cdn/shop/files/womens-turbo-track-relaxed-fit-joggers-black-street-style-comfort_3.jpg?v=1766568423&width=2048",
    description: "Everyday tapered joggers"
  },
  {
    id: 8,
    name: "Stone Utility Joggers",
    category: "Joggers",
    price: 1499,
    oldPrice: 1899,
    badge: "New",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROuZXV_2gkbTSFmNYrnm4Zoun5I1_Ba6GkD6zetHjQeO6XilQX3et5L7yf&s=10",
    description: "Utility-inspired comfort"
  }
];
const CART_KEY = "sixplusCart";

function loadSavedCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(saved) ? saved.map(item => ({
      ...item,
      quantity: Math.max(1, Number(item.quantity ?? item.qty) || 1),
      price: Number(item.price) || 0
    })) : [];
  } catch (error) {
    return [];
  }
}

const state = {
  activeFilter: "All",
  cart: loadSavedCart(),
  toastTimer: null
};

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(state.cart));
}

const elements = {
  productGrid: document.getElementById("productGrid"),
  searchToggle: document.getElementById("searchToggle"),
  searchPanel: document.getElementById("searchPanel"),
  searchInput: document.getElementById("searchInput"),
  cartToggle: document.getElementById("cartToggle"),
  cartDrawer: document.getElementById("cartDrawer"),
  closeCart: document.getElementById("closeCart"),
  overlay: document.getElementById("overlay"),
  cartCount: document.getElementById("cartCount"),
  drawerCount: document.getElementById("drawerCount"),
  cartItems: document.getElementById("cartItems"),
  subtotal: document.getElementById("subtotal"),
  toast: document.getElementById("toast"),
  newsletterForm: document.getElementById("newsletterForm"),
  accountBtn: document.getElementById("accountBtn"),
  checkoutBtn: document.getElementById("checkoutBtn"),
  viewAll: document.getElementById("viewAll")
};

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return entities[character];
  });
}

function getFilteredProducts() {
  const searchTerm = elements.searchInput.value.trim().toLowerCase();

  return products.filter((product) => {
    const matchesCategory =
      state.activeFilter === "All" ||
      product.category === state.activeFilter;

    const searchableText = [
      product.name,
      product.category,
      product.description,
      product.badge
    ].join(" ").toLowerCase();

    return matchesCategory && searchableText.includes(searchTerm);
  });
}

function renderProducts() {
  const visibleProducts = getFilteredProducts();

  if (visibleProducts.length === 0) {
    elements.productGrid.innerHTML = `
      <p class="empty-results">
        No products match your search. Try another term.
      </p>
    `;
    return;
  }

  elements.productGrid.innerHTML = visibleProducts.map((product) => `
    <article class="product-card">
      <div class="product-image">
        <img
          src="${product.image}"
          alt="${escapeHTML(product.name)}"
          loading="lazy"
          onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=850&q=80';"
        >
        <span class="badge">${escapeHTML(product.badge)}</span>
        <button
          class="quick-add"
          type="button"
          data-add-to-cart="${product.id}"
          aria-label="Add ${escapeHTML(product.name)} to bag"
        >
          Quick add +
        </button>
      </div>
      <div class="product-info">
        <div class="product-title">${escapeHTML(product.name)}</div>
        <div class="price">
          ${formatPrice(product.price)}
          <span class="old-price">${formatPrice(product.oldPrice)}</span>
        </div>
        <div class="product-sub">
          ${escapeHTML(product.category)} · Extended length
        </div>
      </div>
    </article>
  `).join("");
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");

  window.clearTimeout(state.toastTimer);
  state.toastTimer = window.setTimeout(() => {
    elements.toast.classList.remove("show");
  }, 2400);
}

function addToCart(productId) {
  const product = products.find((item) => item.id === Number(productId));

  if (!product) return;

  const existingItem = state.cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    state.cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  renderCart();
  openCart();
  showToast(`${product.name} added to your bag.`);
}

function removeFromCart(productId) {
  state.cart = state.cart.filter((item) => item.id !== Number(productId));
  saveCart();
  renderCart();
}

function renderCart() {
  const itemCount = state.cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = state.cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  elements.cartCount.textContent = itemCount;
  elements.drawerCount.textContent = itemCount;
  elements.subtotal.textContent = formatPrice(subtotal);

  if (state.cart.length === 0) {
    elements.cartItems.innerHTML = `
      <div class="cart-empty">
        Your bag is empty. Find your new everyday fit.
      </div>
    `;
    return;
  }

  elements.cartItems.innerHTML = state.cart.map((item) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${escapeHTML(item.name)}">
      <div>
        <strong>${escapeHTML(item.name)}</strong>
        <small>${escapeHTML(item.category)} · Tall fit</small>
        <small>Quantity: ${item.quantity}</small>
        <button
          class="remove"
          type="button"
          data-remove-item="${item.id}"
          aria-label="Remove ${escapeHTML(item.name)} from bag"
        >
          Remove
        </button>
      </div>
      <strong>${formatPrice(item.price * item.quantity)}</strong>
    </div>
  `).join("");
}

function openCart() {
  elements.cartDrawer.classList.add("show");
  elements.overlay.classList.add("show");
  elements.cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("cart-open");
  elements.closeCart.focus();
}

function closeCart() {
  elements.cartDrawer.classList.remove("show");
  elements.overlay.classList.remove("show");
  elements.cartDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("cart-open");
}

function setFilter(filterName) {
  state.activeFilter = filterName;

  document.querySelectorAll(".filter").forEach((button) => {
    const isActive = button.dataset.filter === filterName;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  renderProducts();
}

function toggleSearch() {
  const isOpen = elements.searchPanel.classList.toggle("show");

  if (isOpen) {
    elements.searchInput.focus();
  } else {
    elements.searchInput.value = "";
    renderProducts();
  }
}

/* Product actions use event delegation so rerendering the grid is safe. */
elements.productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-to-cart]");

  if (addButton) {
    addToCart(addButton.dataset.addToCart);
  }
});

elements.cartItems.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove-item]");

  if (removeButton) {
    removeFromCart(removeButton.dataset.removeItem);
  }
});

elements.cartToggle.addEventListener("click", openCart);
elements.closeCart.addEventListener("click", closeCart);
elements.overlay.addEventListener("click", closeCart);
elements.searchToggle.addEventListener("click", toggleSearch);
elements.searchInput.addEventListener("input", renderProducts);

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => setFilter(button.dataset.filter));
});

document.querySelectorAll("[data-filter-link]").forEach((link) => {
  link.addEventListener("click", () => {
    setFilter(link.dataset.filterLink);
  });
});

elements.viewAll.addEventListener("click", () => setFilter("All"));

elements.newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  showToast("Thanks for signing up! (Demo only)");
  elements.newsletterForm.reset();
});

elements.accountBtn.addEventListener("click", () => {
  showToast("Account sign-in can be connected to your backend.");
});

elements.checkoutBtn.addEventListener("click", () => {
  if (state.cart.length === 0) {
    showToast("Your bag is empty.");
    return;
  }

  saveCart();
  window.location.href = "checkout.html";
});

document.querySelectorAll(".info-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showToast("Add your store policy or destination page here.");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
    elements.searchPanel.classList.remove("show");
  }
});

/* Initial page render */
renderProducts();
renderCart();
