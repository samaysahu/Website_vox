# Robotechzone

Robotechzone is a lightweight product showcase for the Bunty lineup. It presents the Bunty Desktop companian and keychain, Bunty Desktop companian and keychain Classic, Bunty Desktop Bot products, and the Shadow Lamp collection, highlights the main features, and lets visitors start an order through WhatsApp.

## Features

- Clean product landing page with card-based navigation
- Dedicated product pages for each Bunty model
- Shadow Lamp pages with consistent image framing and slider support
- Shared header, footer, and order modal rendered through plain JavaScript
- Responsive layout for desktop and mobile
- Product videos, images, and payment artwork organized in a predictable asset structure
- No framework required for the UI
- Optional shared order API for cross-device admin syncing

## Folder Structure

```text
project-root/
  assets/
    images/
      payment/
        payment-methods.jpg
      Spiderman shadow lamp.png
      Roronoa shadow lamp.png
      Roronoa shadow lamp1.webp
      Luffy shadow lamp.png
      Luffy shadow lamp2.webp
      Dragon shadow lamp.webp
      Dragon shadow lamp4.webp
      vox-keychain.png
      vox-desktop-bot-v1.png
      vox-desktop-bot-v2.png
    videos/
      keychain.mp4
      desktop-bot-v1.mp4
  css/
    styles.css
  js/
    scripts.js
  pages/
    keychain.html
    keychain-classic.html
    desktop-bot-v1.html
    desktop-bot-v2.html
    spiderman-shadow-lamp.html
    roronoa-shadow-lamp.html
    luffy-shadow-lamp.html
    dragon-shadow-lamp.html
    goku-shadow-lamp.html
  index.html
  README.md
```

## How To Run Locally

1. Open `index.html` directly in your browser.
2. Click any product card to open the relevant product page.
3. Use the `Buy now` button on a product page to open the WhatsApp order flow.

## Cross-Device Orders

The admin dashboard currently uses browser storage by default, which only works on the same device/browser.
To make orders appear across devices, set `window.VOX_ORDER_STORE_URL` to a shared REST endpoint that supports:

- `GET` to return the current order list
- `POST` to add a new order
- `PUT` to replace the full order list after admin edits

The pages will fall back to localStorage if the remote endpoint is unavailable.

No build step is required.

## Future Improvements

- Add real ecommerce checkout integration
- Replace the WhatsApp-only flow with a proper order API and hosted order database
- Add a shared component build step if the site grows larger
- Add a media pipeline for generating optimized image and video variants
- Include analytics and conversion tracking
