
document.addEventListener("DOMContentLoaded", () => {

  // =====================================
  // 1. MOBILE MENU
  // =====================================

  const menuBtn = document.querySelector(".menu-toggle, .menu-btn");
  const nav = document.querySelector(".site-header nav, .nav");

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      const menuClass = nav.matches(".site-header nav") ? "open" : "active";
      const isOpen = nav.classList.toggle(menuClass);

      menuBtn.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open", "active");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }


  // =====================================
  // 2. PRODUCT SEARCH
  // =====================================

  const searchInput = document.querySelector(
    ".product-search, .search-box input"
  );

  if (searchInput) {
    searchInput.addEventListener("input", () => {

      const keyword = searchInput.value
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      document.querySelectorAll(".product-card, .product").forEach(product => {

        const productText = product.textContent
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");

        product.style.display = productText.includes(keyword) ? "" : "none";

      });
    });
  }


  // =====================================
  // 3. CART DATA
  // =====================================

  let cart = [];

  try {
    const savedCart = JSON.parse(localStorage.getItem("mustyCart"));

    if (Array.isArray(savedCart)) {
      cart = savedCart.filter(item =>
        item &&
        typeof item.name === "string" &&
        Number.isFinite(Number(item.price)) &&
        Number(item.price) > 0 &&
        Number.isInteger(Number(item.quantity)) &&
        Number(item.quantity) > 0
      ).map(item => ({
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity)
      }));
    }
  } catch (error) {
    cart = [];
  }

  const cartBtn = document.querySelector(".cart-open, .cart-btn");
  const cartDrawer = document.querySelector(".cart-drawer, .cart-overlay");
  const cartClose = document.querySelector(".cart-close, .close-cart");
  const cartItems = document.querySelector(".cart-items");
  const cartCount = document.querySelector(".cart-count");
  const cartTotal = document.querySelector(
    ".cart-total-line .cart-total, .cart-total"
  );


  function formatMoney(number) {
    return number.toLocaleString("vi-VN") + "₫";
  }


  // =====================================
  // 4. UPDATE CART
  // =====================================

  function updateCart() {

    const totalQuantity = cart.reduce(
      (sum, item) => sum + item.quantity, 0
    );

    const totalPrice = cart.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    );

    // Lưu giỏ hàng vào trình duyệt
    try {
      localStorage.setItem("mustyCart", JSON.stringify(cart));
    } catch (error) {
      console.warn("Không thể lưu giỏ hàng:", error);
    }

    if (cartCount) {
      cartCount.textContent = totalQuantity;
    }

    if (cartTotal) {
      cartTotal.textContent = formatMoney(totalPrice);
    }

    if (!cartItems) return;

    if (cart.length === 0) {
      cartItems.innerHTML = "<p>Giỏ hàng đang trống.</p>";
      return;
    }

    cartItems.innerHTML = cart.map((item, index) => `
      <div class="cart-item cart-row">

        <div>
          <strong></strong>

          <p>
            ${formatMoney(item.price)} × ${item.quantity}
          </p>

          <p>
            Thành tiền: ${formatMoney(item.price * item.quantity)}
          </p>
        </div>

        <button
          type="button"
          class="remove-item"
          data-index="${index}"
          aria-label="Xóa sản phẩm">
          ✕
        </button>

      </div>
    `).join("");

    // Hiển thị tên sản phẩm an toàn
    cartItems.querySelectorAll(".cart-item strong").forEach((element, index) => {
      element.textContent = cart[index].name;
    });
  }


  // =====================================
  // 5. OPEN CART
  // =====================================

  function openCart() {
    if (!cartDrawer) return;

    if (cartDrawer.classList.contains("cart-drawer")) {
      cartDrawer.classList.add("open");
    } else {
      cartDrawer.classList.add("active");
    }

    cartDrawer.setAttribute("aria-hidden", "false");
    updateCart();
  }

  if (cartBtn) {
    cartBtn.addEventListener("click", openCart);
  }


  // =====================================
  // 6. CLOSE CART
  // =====================================

  function closeCart() {
    if (!cartDrawer) return;

    cartDrawer.classList.remove("open", "active");
    cartDrawer.setAttribute("aria-hidden", "true");
  }

  if (cartClose) {
    cartClose.addEventListener("click", closeCart);
  }

  if (cartDrawer) {
    cartDrawer.addEventListener("click", event => {
      if (event.target === cartDrawer) {
        closeCart();
      }
    });
  }


  // =====================================
  // 7. ADD PRODUCT TO CART
  // =====================================

  document.addEventListener("click", event => {

    const button = event.target.closest(".add-to-cart");

    if (!button) return;

    let name = button.dataset.name;
    let price = Number(button.dataset.price);

    const productCard = button.closest(".product-card, .product");

    if (!name && productCard) {
      name =
        productCard.querySelector(".product-name")?.textContent.trim() ||
        productCard.querySelector("h3")?.textContent.trim();
    }

    if ((!price || !Number.isFinite(price)) && productCard) {
      const priceElement = productCard.querySelector(
        ".product-price, .price, strong"
      );

      if (priceElement) {
        price = Number(
          priceElement.textContent.replace(/[^\d]/g, "")
        );
      }
    }

    if (!name || !Number.isFinite(price) || price <= 0) {
      alert("Không thể thêm sản phẩm. Vui lòng kiểm tra thông tin sản phẩm.");
      return;
    }

    const existingProduct = cart.find(
      item => item.name === name
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({
        name: name,
        price: price,
        quantity: 1
      });
    }

    updateCart();

    const originalText = button.textContent;

    button.textContent = "ĐÃ THÊM VÀO GIỎ ✓";

    // Nút trong cửa sổ chi tiết không bị khóa
    if (button.id === "detailAddCart") {

      setTimeout(() => {
        button.textContent = originalText;
      }, 1000);

    } else {

      button.disabled = true;

      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 1000);

    }

  });


  // =====================================
  // 8. REMOVE PRODUCT FROM CART
  // =====================================

  if (cartItems) {

    cartItems.addEventListener("click", event => {

      const button = event.target.closest(".remove-item");

      if (!button) return;

      const index = Number(button.dataset.index);

      if (
        Number.isInteger(index) &&
        index >= 0 &&
        index < cart.length
      ) {
        cart.splice(index, 1);
        updateCart();
      }

    });

  }


  // =====================================
  // 9. SMOOTH SCROLL
  // =====================================

  document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

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


  // =====================================
  // 10. CURRENT YEAR
  // =====================================

  document.querySelectorAll(".current-year").forEach(element => {
    element.textContent = new Date().getFullYear();
  });


  // =====================================
  // 11. INITIALIZE
  // =====================================

  updateCart();

});
