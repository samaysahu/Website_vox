const whatsappNumber = "918458839587";
let imageLightboxState = null;

function getBasePath() {
  return document.body?.dataset.basePath || "";
}

function joinPath(basePath, path) {
  return `${basePath}${path}`;
}

function normalizeCheckoutAssetPath(path) {
  return String(path || "")
    .replace(/^(\.\.\/)+/, "")
    .replace(/^\/+/, "");
}

function buildCheckoutUrl(productData) {
  const basePath = getBasePath();
  const params = new URLSearchParams();

  if (productData.name) params.set("product", productData.name);
  if (productData.price) params.set("price", String(productData.price));
  if (productData.image) params.set("image", normalizeCheckoutAssetPath(productData.image));
  if (productData.mrp) params.set("mrp", String(productData.mrp));
  if (productData.stock) params.set("stock", String(productData.stock));

  return `${joinPath(basePath, "checkout.html")}?${params.toString()}`;
}

function getImageSource(image) {
  return image.currentSrc || image.src;
}

function ensureImageLightbox() {
  if (imageLightboxState?.modal) {
    return imageLightboxState;
  }

  const modal = document.createElement("div");
  modal.className = "image-lightbox";
  modal.dataset.imageLightbox = "";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="image-lightbox__panel" role="dialog" aria-modal="true" aria-labelledby="image-lightbox-title">
      <h2 class="visually-hidden" id="image-lightbox-title">Image preview</h2>
      <button class="image-lightbox__close" type="button" data-lightbox-close aria-label="Close image preview">&times;</button>
      <button class="image-lightbox__control image-lightbox__control--prev" type="button" data-lightbox-prev aria-label="Previous image">
        <span aria-hidden="true">‹</span>
      </button>
      <figure class="image-lightbox__figure">
        <img class="image-lightbox__image" data-lightbox-image alt="">
        <figcaption class="image-lightbox__meta">
          <span data-lightbox-caption></span>
          <span data-lightbox-counter></span>
        </figcaption>
      </figure>
      <button class="image-lightbox__control image-lightbox__control--next" type="button" data-lightbox-next aria-label="Next image">
        <span aria-hidden="true">›</span>
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  const image = modal.querySelector("[data-lightbox-image]");
  const caption = modal.querySelector("[data-lightbox-caption]");
  const counter = modal.querySelector("[data-lightbox-counter]");
  const closeButtons = modal.querySelectorAll("[data-lightbox-close]");
  const prevButton = modal.querySelector("[data-lightbox-prev]");
  const nextButton = modal.querySelector("[data-lightbox-next]");

  imageLightboxState = {
    modal,
    image,
    caption,
    counter,
    prevButton,
    nextButton,
    images: [],
    activeIndex: 0,
  };

  const closeLightbox = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-lightbox-open");
  };

  const stepLightbox = (delta) => {
    if (imageLightboxState.images.length <= 1) {
      return;
    }

    const nextIndex = (imageLightboxState.activeIndex + delta + imageLightboxState.images.length) % imageLightboxState.images.length;
    imageLightboxState.activeIndex = nextIndex;
    syncImageLightbox();
  };

  const syncImageLightbox = () => {
    const { images, activeIndex } = imageLightboxState;
    const current = images[activeIndex];

    if (!current) {
      return;
    }

    image.src = current.src;
    image.alt = current.alt;
    if (caption) {
      caption.textContent = current.caption || "";
    }
    if (counter) {
      counter.textContent = images.length > 1 ? `${activeIndex + 1} / ${images.length}` : "";
    }
    if (prevButton) {
      prevButton.hidden = images.length <= 1;
    }
    if (nextButton) {
      nextButton.hidden = images.length <= 1;
    }
  };

  imageLightboxState.closeLightbox = closeLightbox;
  imageLightboxState.stepLightbox = stepLightbox;
  imageLightboxState.syncImageLightbox = syncImageLightbox;

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeLightbox);
  });

  prevButton?.addEventListener("click", () => stepLightbox(-1));
  nextButton?.addEventListener("click", () => stepLightbox(1));

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!imageLightboxState?.modal?.classList.contains("is-open")) {
      return;
    }

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowLeft") {
      stepLightbox(-1);
    }

    if (event.key === "ArrowRight") {
      stepLightbox(1);
    }
  });

  return imageLightboxState;
}

function openImageLightbox(images, activeIndex = 0) {
  const state = ensureImageLightbox();

  if (!state || images.length === 0) {
    return;
  }

  state.images = images;
  state.activeIndex = Math.max(0, Math.min(activeIndex, images.length - 1));
  state.syncImageLightbox();
  state.modal.classList.add("is-open");
  state.modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-lightbox-open");
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
  const basePath = getBasePath();
  const adminHref = joinPath(basePath, "admin-login.html");

  return `
    <div>
      <strong>Robotechzone</strong>
      <p class="contact-email">Email <a href="mailto:samay700@gmail.com">samay700@gmail.com</a></p>
    </div>
    <div class="footer-meta">
      <p class="footer-copy">© 2026 Robotechzone</p>
      <a class="footer-admin" href="${adminHref}">Admin</a>
    </div>
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
    const images = slides
      .map((slide) => slide.querySelector("img"))
      .filter((image) => image && image.tagName === "IMG")
      .map((image) => ({
        src: getImageSource(image),
        alt: image.alt || "",
        caption: image.alt || "",
      }));

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

    slides.forEach((slide) => {
      slide.addEventListener("click", () => {
        openImageLightbox(images, activeIndex);
      });
    });

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

function initImageZoom() {
  document.querySelectorAll(".product-visual img").forEach((image) => {
    image.setAttribute("tabindex", "0");
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", image.alt ? `Open ${image.alt}` : "Open image");
    image.classList.add("is-zoomable");

    const open = () => {
      openImageLightbox([
        {
          src: getImageSource(image),
          alt: image.alt || "",
          caption: image.alt || "",
        },
      ]);
    };

    image.addEventListener("click", open);
    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
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
        <label>
          Payment method
          <select name="payment" autocomplete="off" required>
            <option value="" selected disabled>Select payment method</option>
            <option value="COD">COD</option>
            <option value="UPI">UPI</option>
          </select>
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
    const paymentMethod = String(formData.get("payment") || "").trim();
    const productName = orderForm.dataset.product || document.body.dataset.productName || "Robotechzone";

    const message = [
      "Hello Robotechzone concierge,",
      `Product: ${productName}`,
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Address: ${address}`,
      `Payment method: ${paymentMethod}`,
    ].join("\n");

    window.open(createWhatsAppUrl(message), "_blank", "noopener,noreferrer");
    closeOrderModal();
  });
}

function bindCheckoutButtons() {
  document.querySelectorAll(".buy-now").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productData = {
        name: btn.dataset.checkoutName || btn.dataset.product || "Robotechzone",
        price: btn.dataset.checkoutPrice || "",
        image: btn.dataset.checkoutImage || "",
        mrp: btn.dataset.checkoutMrp || "",
        stock: btn.dataset.checkoutStock || "5",
      };

      localStorage.setItem("rz_checkout_product", productData.name);
      localStorage.setItem("rz_checkout_price", productData.price);
      localStorage.setItem("rz_checkout_image", normalizeCheckoutAssetPath(productData.image));
      localStorage.setItem("rz_checkout_mrp", productData.mrp);
      localStorage.setItem("rz_checkout_stock", productData.stock);

      window.location.href = buildCheckoutUrl(productData);
    });
  });
}

function init() {
  renderSharedLayout();
  initProductGalleries();
  initImageZoom();
  bindCheckoutButtons();
}

document.addEventListener("DOMContentLoaded", init);
