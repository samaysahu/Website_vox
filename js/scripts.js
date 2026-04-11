const whatsappNumber = "918458839587";

function getBasePath() {
  return document.body?.dataset.basePath || "";
}

function joinPath(basePath, path) {
  return `${basePath}${path}`;
}

function renderHeader() {
  const basePath = getBasePath();
  const pageType = document.body?.dataset.page || "home";
  const brandHref = joinPath(basePath, "index.html");

  return `
    <a class="brand" href="${brandHref}" aria-label="Robotechzone home">
      <span class="brand-mark">RZ</span>
      <span class="brand-name">Robotechzone</span>
    </a>
    ${
      pageType === "home"
        ? '<span class="back-link" aria-hidden="true">Products and details</span>'
        : `<a class="back-link" href="${brandHref}">Back to products</a>`
    }
  `;
}

function renderFooter() {
  return `
    <div>
      <strong>Robotechzone</strong>
      <p class="contact-email">Email <a href="mailto:samay700@gmail.com">samay700@gmail.com</a></p>
    </div>
    <p class="footer-copy">© 2026 Robotechzone</p>
  `;
}

function renderSharedLayout() {
  const header = document.querySelector("[data-site-header]");
  const footer = document.querySelector("[data-site-footer]");

  if (header) header.innerHTML = renderHeader();
  if (footer) footer.innerHTML = renderFooter();
}

function initProductGalleries() {
  document.querySelectorAll("[data-product-gallery]").forEach((gallery) => {
    const slides = Array.from(gallery.querySelectorAll("[data-gallery-slide]"));
    const prevButton = gallery.querySelector("[data-gallery-prev]");
    const nextButton = gallery.querySelector("[data-gallery-next]");
    const dots = gallery.querySelector("[data-gallery-dots]");

    if (slides.length === 0) {
      return;
    }

    if (slides.length <= 1) {
      if (prevButton) prevButton.hidden = true;
      if (nextButton) nextButton.hidden = true;
      if (dots) dots.hidden = true;
      slides[0].classList.add("is-active");
      slides[0].setAttribute("aria-hidden", "false");
      return;
    }

    let activeIndex = 0;

    const renderState = () => {
      slides.forEach((slide, index) => {
        const isActive = index === activeIndex;
        slide.classList.toggle("is-active", isActive);
        slide.setAttribute("aria-hidden", isActive ? "false" : "true");
      });

      if (dots) {
        Array.from(dots.children).forEach((dot, index) => {
          dot.classList.toggle("is-active", index === activeIndex);
          dot.setAttribute("aria-current", index === activeIndex ? "true" : "false");
        });
      }
    };

    const setActive = (index) => {
      activeIndex = (index + slides.length) % slides.length;
      renderState();
    };

    if (prevButton) {
      prevButton.hidden = false;
      prevButton.addEventListener("click", () => setActive(activeIndex - 1));
    }

    if (nextButton) {
      nextButton.hidden = false;
      nextButton.addEventListener("click", () => setActive(activeIndex + 1));
    }

    if (dots) {
      dots.hidden = false;
      dots.innerHTML = "";

      slides.forEach((slide, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "product-gallery__dot";
        dot.setAttribute("aria-label", `Show image ${index + 1} of ${slides.length}`);
        dot.addEventListener("click", () => setActive(index));
        dots.appendChild(dot);
      });
    }

    renderState();
  });
}

function renderOrderModal() {
  const productName = document.body?.dataset.productName;

  if (!productName || document.querySelector("[data-order-modal]")) {
    return;
  }

  const modal = document.createElement("div");
  modal.className = "order-modal";
  modal.dataset.orderModal = "";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="order-modal__card" role="dialog" aria-modal="true" aria-labelledby="order-title">
      <button class="order-close" type="button" aria-label="Close order form">&times;</button>
      <p class="eyebrow">Order</p>
      <h3 class="order-modal__title" id="order-title">
        <span class="order-product-name">${productName}</span>
      </h3>
      <p class="order-modal__note">Opens WhatsApp with your details.</p>
      <div class="payment-block">
        <div class="payment-card" role="img" aria-label="Accepted payments: UPI, PhonePe, Paytm, Google Pay">
          <img src="${joinPath(getBasePath(), "assets/images/payment/payment-methods.jpg")}" alt="" loading="lazy" decoding="async">
        </div>
        <p class="payment-note">No COD. Payment by UPI only.</p>
      </div>
      <form class="order-form" id="order-form" data-product="${productName}">
        <label>
          Full name
          <input name="name" type="text" placeholder="Your name" autocomplete="name" required>
        </label>
        <label>
          Phone number
          <input name="phone" type="tel" placeholder="98480xxxxx" inputmode="tel" autocomplete="tel" required>
        </label>
        <label>
          Delivery address
          <textarea name="address" rows="2" placeholder="Full address" autocomplete="street-address" required></textarea>
        </label>
        <button class="btn btn-primary" type="submit">Place order</button>
      </form>
    </div>
  `;

  document.body.appendChild(modal);
}

function openOrderModal(productName) {
  const modal = document.querySelector("[data-order-modal]");
  const productLabel = document.querySelector(".order-product-name");
  const orderForm = document.querySelector("#order-form");

  if (!modal || !orderForm) return;

    const name = productName || orderForm.dataset.product || document.body.dataset.productName || "Robotechzone";

  if (productLabel) {
    productLabel.textContent = name;
  }

  orderForm.dataset.product = name;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}

function closeOrderModal() {
  const modal = document.querySelector("[data-order-modal]");
  const orderForm = document.querySelector("#order-form");

  if (!modal || !orderForm) return;

  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  orderForm.reset();
}

function createWhatsAppUrl(message) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function bindOrderModal() {
  const modal = document.querySelector("[data-order-modal]");
  const closeBtn = document.querySelector(".order-close");
  const orderForm = document.querySelector("#order-form");

  if (!modal || !orderForm) {
    return;
  }

  document.querySelectorAll(".buy-now").forEach((btn) => {
    btn.addEventListener("click", () => {
      openOrderModal(btn.dataset.product);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", closeOrderModal);
  }

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeOrderModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeOrderModal();
    }
  });

  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(orderForm);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const address = String(formData.get("address") || "").trim();
    const productName = orderForm.dataset.product || document.body.dataset.productName || "Robotechzone";

    const message = [
      "Hello Robotechzone concierge,",
      `Product: ${productName}`,
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Address: ${address}`,
    ].join("\n");

    window.open(createWhatsAppUrl(message), "_blank", "noopener,noreferrer");
    closeOrderModal();
  });
}

function init() {
  renderSharedLayout();
  initProductGalleries();
  renderOrderModal();
  bindOrderModal();
}

document.addEventListener("DOMContentLoaded", init);
