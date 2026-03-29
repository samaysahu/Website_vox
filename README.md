# Vox Website

Vox Website is a lightweight product showcase for the Vox lineup from Robotechzone. It presents the Vox Keychain and Vox Desktop Bot products, highlights the main features, and lets visitors start an order through WhatsApp.

## Features

- Clean product landing page with card-based navigation
- Dedicated product pages for each Vox model
- Shared header, footer, and order modal rendered through plain JavaScript
- Responsive layout for desktop and mobile
- Product videos, images, and payment artwork organized in a predictable asset structure
- No framework or backend required

## Folder Structure

```text
project-root/
  assets/
    images/
      payment/
        payment-methods.jpg
      vox-keychain.png
      vox-desktop-bot-v1.png
      vox-desktop-bot-v2.png
      vox-desktop-bot-v3.png
    videos/
      keychain.mp4
      desktop-bot-v1.mp4
      desktop-bot-v3.mp4
  css/
    styles.css
  js/
    scripts.js
  pages/
    keychain.html
    desktop-bot-v1.html
    desktop-bot-v2.html
    desktop-bot-v3.html
  index.html
  README.md
```

## How To Run Locally

1. Open `index.html` directly in your browser.
2. Click any product card to open the relevant product page.
3. Use the `Buy now` button on a product page to open the WhatsApp order flow.

No build step is required.

## Future Improvements

- Add real ecommerce checkout integration
- Replace the WhatsApp-only flow with a proper order API
- Add a shared component build step if the site grows larger
- Add a media pipeline for generating optimized image and video variants
- Include analytics and conversion tracking
