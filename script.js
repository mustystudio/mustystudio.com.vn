document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-header nav");

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      const opened = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(opened));
    });
  }

  const drawer = document.querySelector(".cart-drawer");
  const openCart = document.querySelector(".cart-open");
  const closeCart = document.querySelector(".cart-close");
  const itemsBox = document.querySelector(".cart-items");
  const totalBox = document.querySelector(".cart-total");
  const countBox = document.querySelector(".cart-count");

  let cart = [];

  const money = value =>
    new Intl.NumberFormat("vi-VN").format(value) + "₫";

  function renderCart() {
    if (countBox) {
      countBox.textContent = cart.reduce(
        (n, item) => n + item.qty,
        0
      );
    }

    if (itemsBox) {
      if (!cart.length) {
        itemsBox.innerHTML = "<p>Giỏ hàng đang trống.</p>";
      } else {
        itemsBox.innerHTML = cart.map((item, i) =>
          `<div class="cart-row">
            <div>
              <strong>${item.name}</strong><br>
              <small>${money(item.price)} × ${item.qty}</small>
            </div>
            <div>
              <strong>${money(item.price * item.qty)}</strong><br>
              <button type="button" data-remove="${i}" aria-label="Xóa sản phẩm">×</button>
            </div>
          </div>`
        ).join("");
      }
    }

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    if (totalBox) {
      totalBox.textContent = money(total);
    }
  }

  function showCart(show) {
    if (!drawer) return;

    drawer.classList.toggle("open", show);
    drawer.setAttribute("aria-hidden", String(!show));
  }

  openCart?.addEventListener("click", () => showCart(true));
  closeCart?.addEventListener("click", () => showCart(false));

  drawer?.addEventListener("click", e => {
    if (e.target === drawer) {
      showCart(false);
    }
  });

  itemsBox?.addEventListener("click", e => {
    const button = e.target.closest("[data-remove]");

    if (!button) return;

    const i = Number(button.dataset.remove);
    cart.splice(i, 1);
    renderCart();
  });

  document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
      const name = button.dataset.name;
      const price = Number(button.dataset.price);

      if (!name || !Number.isFinite(price)) return;

      const existing = cart.find(item => item.name === name);

      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({
          name,
          price,
          qty: 1
        });
      }

      renderCart();

      const old = button.textContent;
      button.textContent = "ĐÃ THÊM ✓";

      window.setTimeout(() => {
        button.textContent = old;
      }, 1000);
    });
  });

  const search = document.querySelector(".product-search");

  search?.addEventListener("input", () => {
    const term = search.value.trim().toLocaleLowerCase("vi");

    document.querySelectorAll(
      ".searchable-products .product-card"
    ).forEach(card => {
      card.hidden = !card.textContent
        .toLocaleLowerCase("vi")
        .includes(term);
    });
  });

  const form = document.querySelector("#contactForm");

  form?.addEventListener("submit", event => {
    event.preventDefault();

    const data = new FormData(form);

    const subject = encodeURIComponent(
      data.get("subject") || "Liên hệ MUSTY STUDIO"
    );

    const body = encodeURIComponent(
      `Họ tên: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`
    );

    const feedback = form.querySelector(".form-feedback");

    if (feedback) {
      feedback.textContent =
        "Đang mở ứng dụng email để gửi tin nhắn cho Musty.";
    }

    // Thay email bên dưới bằng địa chỉ nhận đơn chính thức trước khi sử dụng.
    window.location.href =
      `mailto:hello@mustystudio.com?subject=${subject}&body=${body}`;
  });

  document.querySelectorAll(".current-year").forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  renderCart();
});
