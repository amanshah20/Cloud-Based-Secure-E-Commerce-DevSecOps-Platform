# 🛍️ LUXEMARKET — Premium E-Commerce Website

A fully functional, beautifully designed e-commerce website built with pure HTML, CSS & JavaScript.

---

## 📁 Project Structure

```
ecommerce/
├── index.html              ← Homepage
├── css/
│   ├── style.css           ← Global styles, components
│   └── home.css            ← Homepage-specific styles
├── js/
│   ├── data.js             ← Product database & constants
│   ├── app.js              ← Auth, Cart, Toast utilities
│   └── home.js             ← Homepage logic
└── pages/
    ├── login.html          ← Login/Signup with OTP
    ├── shop.html           ← Shop with filters & search
    ├── product.html        ← Product detail page
    ├── cart.html           ← Shopping cart
    ├── checkout.html       ← Checkout with payment & coupon gate
    ├── dashboard.html      ← User dashboard & orders
    ├── about.html          ← About page
    └── contact.html        ← Contact & FAQ
```

---

## 🚀 How to Run

### Option 1: Open directly
Just open `index.html` in your browser. Most features work without a server.

### Option 2: Local server (recommended)
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Then open http://localhost:8000
```

---

## 🔑 Key Features

### ✅ OTP Login / Signup
- User signs up with name, email, phone
- OTP is sent to their email via **EmailJS**
- OTP verified → account created → logged in
- Same flow for login

### 📧 Setting up Real Email (EmailJS)
1. Go to **emailjs.com** → create free account
2. Add an **Email Service** (Gmail works)
3. Create a **Template** with these variables:
  - `{{to_email}}` — recipient email
  - `{{to_name}}` — recipient name
  - `{{from_email}}` — sender email (configured as `devops123cse@gmail.com`)
  - `{{otp_code}}` — the 6-digit OTP
  - `{{store_name}}` — LuxeMarket
4. Copy your **Service ID**, **Template ID**, and **Public Key**
5. Open `pages/login.html` and replace:
   ```js
  const EMAILJS_SERVICE_ID = 'your_service_id';
  const EMAILJS_TEMPLATE_ID = 'your_template_id';
  const EMAILJS_PUBLIC_KEY  = 'your_public_key';
  const OTP_FROM_EMAIL = 'devops123cse@gmail.com';
   ```

> **Demo Mode**: Without EmailJS setup, OTPs appear in a browser alert popup for testing.

---

## 🎟️ Coupon Code
The default coupon code is: **`LUXE50`**  
This gives **50% discount** on checkout.

To change it, edit `js/data.js`:
```js
const COUPON_CODE = 'LUXE50';
const COUPON_DISCOUNT = 50; // percentage
```

---

## 🛒 Shopping Flow
1. Browse products on **Shop** page
2. Click product → **Product Detail** page
3. Add to cart → **Cart** page
4. Apply coupon `LUXE50` (optional)
5. Proceed to **Checkout**
6. Fill address → choose payment → enter coupon → **Place Order**
7. Order confirmed → saved to **Dashboard**

---

## 💾 Data Storage
All data is stored in **localStorage** (browser):
- `lm_user` — current logged-in user
- `lm_users` — all registered users
- `lm_cart` — cart items
- `lm_orders` — all placed orders

---

## 🎨 Tech Stack
- **HTML5** — semantic structure
- **CSS3** — custom properties, grid, flexbox, animations
- **Vanilla JavaScript** — no frameworks
- **Google Fonts** — Cormorant Garamond + DM Sans
- **Font Awesome 6** — icons
- **EmailJS** — OTP email delivery

---

## 📱 Responsive
Fully responsive on mobile, tablet & desktop.

---

## 🤖 AI Chatbot (Luxe Assistant)

The chatbot (`js/luxechat.js`) is powered by **Anthropic Claude API** and appears on every page as a floating button (bottom-right corner).

### Features
- Full site knowledge — products, prices, policies, navigation
- Multi-turn conversation with memory
- Contextual quick reply suggestions
- Typing indicator, message timestamps
- Mobile responsive
- Works on every page automatically

### Setup (Required for chatbot to work)
The chatbot calls the Anthropic API directly from the browser.  
You need a **CORS-enabled proxy** or use the API from a backend in production.

For **local testing / Minikube**, the simplest approach is to add your API key to `js/luxechat.js`:

> ⚠️ Never expose your API key in a public production deployment. Use a backend proxy instead.

In `js/luxechat.js`, the `callClaudeAPI` function makes a fetch to:
```
https://api.anthropic.com/v1/messages
```

For local dev, add your key to the headers:
```js
headers: {
  'Content-Type': 'application/json',
  'x-api-key': 'sk-ant-YOUR_KEY_HERE',      // add this
  'anthropic-version': '2023-06-01',          // add this
},
```

For production, route through a backend (Node.js/Python) that adds the API key server-side.

### Coupon Code
The chatbot always knows the coupon code is **LUXE50** and will tell users when asked.

---

## 🔧 Customization

### Add Products
Edit `js/data.js` → add to the `PRODUCTS` array:
```js
{
  id: 13,
  name: "Your Product",
  category: "accessories",
  price: 2999,
  oldPrice: 4500,
  rating: 4.7,
  reviews: 50,
  badge: "New",
  image: "https://your-image-url.jpg",
  description: "Product description here.",
  stock: 20
}
```

### Change Theme Colors
Edit `css/style.css` → `:root` variables:
```css
:root {
  --gold: #c9a84c;       /* Primary accent */
  --bg: #0d0d0d;         /* Main background */
  --text: #f0ece4;       /* Main text color */
}
```

---

© 2025 LuxeMarket
