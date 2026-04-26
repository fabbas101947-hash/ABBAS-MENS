const cartKey = "abbas_cart_v1";

const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");

let cart = loadCart();

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(cartKey)) || {};
  } catch (e) {
    return {};
  }
}

function saveCart() {
  localStorage.setItem(cartKey, JSON.stringify(cart));
}

function updateCartUI() {
  if (!cartItems || !cartTotal || !cartCount) return;

  const entries = Object.values(cart);
  const totalQty = entries.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = entries.reduce((sum, item) => sum + item.qty * item.price, 0);

  cartCount.textContent = String(totalQty);
  cartTotal.textContent = `$${totalPrice.toFixed(2)}`;

  if (entries.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  cartItems.innerHTML = entries
    .map(
      (item) => `
      <div class="cart-row">
        <div>
          <h4>${item.name}</h4>
          <p>$${item.price.toFixed(2)} x ${item.qty}</p>
          <button data-remove="${item.id}">Remove</button>
        </div>
        <strong>$${(item.price * item.qty).toFixed(2)}</strong>
      </div>`
    )
    .join("");
}

function addToCart(id, name, price) {
  if (!cart[id]) {
    cart[id] = { id, name, price: Number(price), qty: 1 };
  } else {
    cart[id].qty += 1;
  }
  saveCart();
  updateCartUI();
}

function removeFromCart(id) {
  delete cart[id];
  saveCart();
  updateCartUI();
}

function openCart() {
  if (!cartDrawer || !cartOverlay) return;
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("show");
}

function closeCart() {
  if (!cartDrawer || !cartOverlay) return;
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("show");
}

if (openCartBtn) {
  openCartBtn.addEventListener("click", openCart);
}

if (closeCartBtn) {
  closeCartBtn.addEventListener("click", closeCart);
}

if (cartOverlay) {
  cartOverlay.addEventListener("click", closeCart);
}

document.addEventListener("click", (e) => {
  const addBtn = e.target.closest(".add-to-cart");
  if (addBtn) {
    addToCart(addBtn.dataset.id, addBtn.dataset.name, addBtn.dataset.price);
    return;
  }

  const removeBtn = e.target.closest("[data-remove]");
  if (removeBtn) {
    removeFromCart(removeBtn.dataset.remove);
  }
});

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    siteNav.classList.toggle("open");
  });
}

const filterButtons = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".product-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;

    productCards.forEach((card) => {
      const category = card.dataset.category || "";
      const show = filter === "all" || category.includes(filter);
      card.classList.toggle("hidden", !show);
    });
  });
});

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

updateCartUI();
