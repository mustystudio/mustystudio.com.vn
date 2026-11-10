document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // MOBILE MENU
  // =========================
  const menuBtn = document.querySelector(".menu-btn");
  const nav = document.querySelector(".nav");

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      nav.classList.toggle("active");
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");
      });
    });
  }

  // =========================
  // SEARCH
  // =========================
  const searchBtn = document.querySelector(".search-btn");
  const searchBox = document.querySelector(".search-box");
  const searchInput = document.querySelector(".search-box input");

  if (searchBtn && searchBox) {
    searchBtn.addEventListener("click", () => {
      searchBox.classList.toggle("active");

      if (searchBox.classList.contains("active") && searchInput) {
        searchInput.focus();
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        const keyword = searchInput.value.trim().toLowerCase();

        if (keyword === "") return;

        const products = document.querySelectorAll(".product-card");

        products.forEach(product => {
          const text = product.textContent.toLowerCase();

          if (text.includes(keyword)) {
            product.style.display = "";
          } else {
            product.style.display = "none";
          }
        });
      }
    });
  }

  // =========================
  // CART
  // =========================
  let cart = [];

  const cartBtn = document.querySelector(".cart-btn");
  const cartOverlay = document.querySelector(".cart-overlay");
  const cartClose = document.querySelector(".cart-close");
  const cartItems = document.querySelector(".cart-items");
  const cartCount = document.querySelector(".cart-count");
  const cartTotal = document.querySelector(".cart-total");

  function updateCart() {
    if (cartCount) {
      cartCount.textContent = cart.length;
    }

    if (!cartItems) return;

    if (cart.length === 0) {
      cartItems.innerHTML = `
        <p class="empty-cart">Your cart is empty.</p>
      `;
    } else {
      cartItems.innerHTML = cart
        .map((item, index) => `
          <div class="cart-item">
            <div>
              <strong>${item.name}</strong>
              <span>${item.price.toLocaleString("vi-VN")}₫</span>
            </div>

            <button class="remove-item" data-index="${index}">
              ×
            </button>
          </div>
        `)
        .join("");
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    if (cartTotal) {
      cartTotal.textContent = `${total.toLocaleString("vi-VN")}₫`;
    }

    document.querySelectorAll(".remove-item").forEach(button => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.index);

        cart.splice(index, 1);

        updateCart();
      });
    });
  }

  if (cartBtn && cartOverlay) {
    cartBtn.addEventListener("click", () => {
      cartOverlay.classList.add("active");
      updateCart();
    });
  }

  if (cartClose && cartOverlay) {
    cartClose.addEventListener("click", () => {
      cartOverlay.classList.remove("active");
    });
  }

  if (cartOverlay) {
    cartOverlay.addEventListener("click", event => {
      if (event.target === cartOverlay) {
        cartOverlay.classList.remove("active");
      }
    });
  }

  // =========================
  // ADD TO CART
  // =========================
  const addButtons = document.querySelectorAll(".add-to-cart");

  addButtons.forEach(button => {
    button.addEventListener("click", () => {
      const product = button.closest(".product-card");

      if (!product) return;

      const nameElement = product.querySelector(".product-name");
      const priceElement = product.querySelector(".product-price");

      if (!nameElement || !priceElement) return;

      const name = nameElement.textContent.trim();

      const price = parseInt(
        priceElement.textContent.replace(/[^\d]/g, ""),
        10
      );

      cart.push({
        name,
        price
      });

      updateCart();

      button.textContent = "ADDED ✓";

      setTimeout(() => {
        button.textContent = "ADD TO CART";
      }, 1200);
    });
  });

  // =========================
  // SMOOTH SCROLL
  // =========================
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const targetId = link.getAttribute("href");

      if (targetId === "#") return;

      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  // =========================
  // CURRENT YEAR
  // =========================
  const yearElement = document.querySelector(".current-year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Initial cart display
  updateCart();
});
