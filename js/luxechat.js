// ============================================================
// LuxeMarket AI Chatbot — luxechat.js
// Powered by Groq Chat Completions API
// ============================================================

(function () {
  // ---- SITE KNOWLEDGE BASE ----
  const SITE_CONTEXT = `
You are "Luxe", the premium AI shopping assistant for LuxeMarket — a high-end e-commerce store.
You are elegant, helpful, knowledgeable, and concise. Match the premium, sophisticated tone of the brand.

== ABOUT LUXEMARKET ==
LuxeMarket is a curated premium e-commerce store founded in 2020, based in Mumbai, India.
Tagline: "Discover the Extraordinary" — curated premium products for the discerning few.
Website coupon code: LUXE50 (gives 50% off on checkout — this is required to complete any purchase)

== PAGES & NAVIGATION ==
- Home (index.html): Hero section, featured products, categories, promo banner, testimonials
- Shop (/pages/shop.html): Full product catalog with search, filters by category/price/rating, sort options
- Product Detail (/pages/product.html?id=N): Individual product page with gallery, qty selector, add to cart
- Cart (/pages/cart.html): Shopping cart, coupon input, order summary
- Checkout (/pages/checkout.html): 3-step — Address → Payment → Coupon Gate → Order placed
- Dashboard (/pages/dashboard.html): User account, order history, profile edit, saved addresses
- Login (/pages/login.html): OTP-based login/signup (email OTP verification)
- About (/pages/about.html): Brand story, values, team
- Contact (/pages/contact.html): Contact form, FAQ

== PRODUCT CATALOG ==
Category: Watches
1. Chronos Elite Watch — ₹8,499 (was ₹12,999) | Rating 4.8 | Swiss movement, sapphire crystal, 100m water resistant
2. Obsidian Minimalist Watch — ₹6,299 (was ₹8,900) | Rating 4.7 | Ultra-slim, Japanese quartz, matte black DLC, mesh strap
3. Classic Pilot Chronograph — ₹11,999 (was ₹16,000) | Rating 4.9 | Aviation-inspired, 100hr power reserve, exhibition caseback

Category: Bags
4. Noir Leather Tote — ₹4,299 (was ₹6,499) | Rating 4.6 | Hand-stitched full grain leather, brass hardware, made in Italy
5. Velvet Crossbody Bag — ₹2,899 (was ₹4,100) | Rating 4.4 | Plush velvet, adjustable chain strap, magnetic clasp, limited edition
6. The Wanderer Backpack — ₹5,499 (was ₹7,800) | Rating 4.7 | Waxed canvas, leather trim, 30L, laptop sleeve

Category: Fragrance
7. Santal Oud Parfum — ₹3,199 (was ₹4,500) | Rating 4.9 | Sandalwood + oud + amber, 100ml EDP, 12h wear
8. Rose Petal Body Mist — ₹899 (was ₹1,299) | Rating 4.3 | Rose-based, 200ml, paraben-free
9. Amber Oud Candle — ₹1,299 (was ₹1,800) | Rating 4.9 | Soy wax, 60hr burn time, hand poured

Category: Accessories
10. Sunlight Aviator Shades — ₹2,199 (was ₹3,200) | Rating 4.5 | Gold titanium frame, polarized UV400, leather case
11. Silver Link Bracelet — ₹1,899 (was ₹2,600) | Rating 4.6 | 925 sterling silver, rhodium plated, hypoallergenic
12. Gradient Silk Scarf — ₹1,499 (was ₹2,100) | Rating 4.8 | 100% pure silk, hand-rolled edges, 90x90cm

== HOW TO SHOP ==
1. Browse Shop page or search/filter products
2. Click a product to view details
3. Add to cart (adjust quantity as needed)
4. Go to Cart — optionally apply coupon LUXE50
5. Click "Proceed to Payment" (must be logged in)
6. Fill shipping address → Choose payment method → Enter coupon code LUXE50
7. Order is placed and saved to your Dashboard

== LOGIN & ACCOUNT ==
- No password needed — OTP-based login only
- Sign up: enter name, email, phone → OTP sent to email → verify → account created
- Login: enter email → OTP sent → verify → logged in
- Dashboard: view orders, edit profile, saved addresses, coupon info

== PAYMENT ==
- Supported: Credit/Debit Card, UPI (GPay, PhonePe, Paytm), Net Banking, Cash on Delivery
- No actual payment gateway — this is a demo store
- IMPORTANT: Coupon code LUXE50 is REQUIRED at checkout to complete the purchase
- Free shipping on orders above ₹999 | ₹99 flat shipping below ₹999

== RETURNS & POLICIES ==
- 30-day easy returns on all items in original condition
- Initiate return from Dashboard → My Orders
- Authentic products, quality guaranteed
- Secure OTP-based authentication

== CONTACT ==
- Email: support@luxemarket.in
- Phone: +91 98765 43210 (Mon–Sat, 10am–7pm IST)
- Location: Bandra West, Mumbai, Maharashtra 400050

== TEAM ==
- Arjun Mehta — Founder & CEO
- Priya Sharma — Head of Curation
- Rohan Das — Tech Lead

== QUICK ANSWERS ==
- Coupon code: LUXE50 (50% off, required at checkout)
- Free shipping: orders above ₹999
- Return policy: 30 days
- Login method: Email OTP (no password)
- Support hours: Mon–Sat 10am–7pm IST

Respond in 1-3 short sentences unless the user asks for detailed info.
Be warm, elegant, and helpful. Use ₹ for prices.
If asked to navigate somewhere, provide the page name and path.
Never make up products, prices, or policies not listed above.
`;

  // ---- QUICK REPLY SUGGESTIONS ----
  const QUICK_REPLIES = [
    "What's the coupon code? 🏷️",
    "Show me watches",
    "How do I login?",
    "What's the return policy?",
    "Best fragrance?",
    "Free shipping info",
    "How to place an order?",
    "Contact support",
  ];

  // ---- CONVERSATION HISTORY ----
  let conversationHistory = [];
  let isOpen = false;
  let isTyping = false;

  // ---- AI CONFIG ----
  // NOTE: Exposing keys in frontend code is not secure for production.
  // Use a backend proxy for real deployments.
  const GROQ_API_KEY = 'YOUR_GROQ_API_KEY_HERE';
  const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
  const GROQ_MODEL = 'llama-3.3-70b-versatile';

  // ---- BUILD CHATBOT HTML ----
  function buildChatbot() {
    const html = `
    <div id="lx-chatbot-wrap">
      <!-- TOGGLE BUTTON -->
      <button id="lx-toggle-btn" aria-label="Open chat assistant" onclick="LuxeChat.toggle()">
        <span id="lx-toggle-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="currentColor"/>
            <circle cx="8" cy="11" r="1.2" fill="white" opacity="0.9"/>
            <circle cx="12" cy="11" r="1.2" fill="white" opacity="0.9"/>
            <circle cx="16" cy="11" r="1.2" fill="white" opacity="0.9"/>
          </svg>
        </span>
        <span id="lx-close-icon" style="display:none">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
        </span>
        <span id="lx-notif-dot"></span>
      </button>

      <!-- CHAT WINDOW -->
      <div id="lx-chat-window">
        <!-- HEADER -->
        <div id="lx-chat-header">
          <div id="lx-header-left">
            <div id="lx-avatar">
              <span>✦</span>
            </div>
            <div id="lx-header-info">
              <div id="lx-header-name">Luxe Assistant</div>
              <div id="lx-header-status">
                <span class="lx-status-dot"></span> Online · Powered by AI
              </div>
            </div>
          </div>
          <div id="lx-header-actions">
            <button class="lx-hdr-btn" onclick="LuxeChat.clearChat()" title="Clear chat">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14H6L5,6"/><path d="M10,11v6M14,11v6"/><path d="M9,6V4h6v2"/>
              </svg>
            </button>
            <button class="lx-hdr-btn" onclick="LuxeChat.toggle()" title="Close">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- MESSAGES -->
        <div id="lx-messages-wrap">
          <div id="lx-messages"></div>
        </div>

        <!-- QUICK REPLIES -->
        <div id="lx-quick-replies"></div>

        <!-- INPUT -->
        <div id="lx-input-wrap">
          <div id="lx-input-row">
            <textarea
              id="lx-input"
              placeholder="Ask me anything about LuxeMarket..."
              rows="1"
              maxlength="500"
              onkeydown="LuxeChat.handleKey(event)"
              oninput="LuxeChat.autoResize(this)"
            ></textarea>
            <button id="lx-send-btn" onclick="LuxeChat.send()" title="Send message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          <div id="lx-input-footer">
            <span id="lx-char-count">0/500</span>
            <span id="lx-powered-by">✦ LuxeMarket AI</span>
          </div>
        </div>
      </div>
    </div>
    `;

    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container.firstElementChild);

    injectStyles();
    renderQuickReplies();
    showWelcomeMessage();

    // Show notification dot after 3s
    setTimeout(() => {
      if (!isOpen) {
        const dot = document.getElementById('lx-notif-dot');
        if (dot) dot.style.display = 'block';
      }
    }, 3000);
  }

  // ---- WELCOME MESSAGE ----
  function showWelcomeMessage() {
    const greeting = getGreeting();
    addMessage('bot', `${greeting} I'm **Luxe**, your personal shopping assistant! ✦\n\nI can help you find the perfect product, answer questions about orders, shipping, or anything about LuxeMarket. What can I do for you today?`);
  }

  function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning!';
    if (h < 17) return 'Good afternoon!';
    return 'Good evening!';
  }

  // ---- RENDER QUICK REPLIES ----
  function renderQuickReplies(replies = QUICK_REPLIES) {
    const wrap = document.getElementById('lx-quick-replies');
    if (!wrap) return;
    wrap.innerHTML = replies.map(r => `
      <button class="lx-qr-btn" onclick="LuxeChat.sendQuick('${r.replace(/'/g, "\\'")}')">
        ${r}
      </button>
    `).join('');
  }

  // ---- ADD MESSAGE ----
  function addMessage(role, text, isLoading = false) {
    const msgs = document.getElementById('lx-messages');
    if (!msgs) return null;

    const id = 'msg-' + Date.now() + '-' + Math.random().toString(36).slice(2);
    const div = document.createElement('div');
    div.className = `lx-msg lx-msg-${role}`;
    div.id = id;

    if (isLoading) {
      div.innerHTML = `
        <div class="lx-bubble lx-bubble-${role}">
          <div class="lx-typing-indicator">
            <span></span><span></span><span></span>
          </div>
        </div>
      `;
    } else {
      const formatted = formatText(text);
      div.innerHTML = `
        ${role === 'bot' ? '<div class="lx-bot-icon">✦</div>' : ''}
        <div class="lx-bubble lx-bubble-${role}">${formatted}</div>
        <div class="lx-msg-time">${getTime()}</div>
      `;
    }

    msgs.appendChild(div);
    scrollToBottom();
    return id;
  }

  // ---- FORMAT TEXT (markdown-lite) ----
  function formatText(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_self" style="color:var(--lx-gold);text-decoration:underline">$1</a>')
      .replace(/\n/g, '<br/>');
  }

  function getTime() {
    return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }

  // ---- REMOVE MESSAGE BY ID ----
  function removeMessage(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  // ---- SCROLL ----
  function scrollToBottom() {
    const wrap = document.getElementById('lx-messages-wrap');
    if (wrap) setTimeout(() => { wrap.scrollTop = wrap.scrollHeight; }, 50);
  }

  // ---- SEND MESSAGE ----
  async function send(text) {
    const input = document.getElementById('lx-input');
    const userText = (text || (input ? input.value.trim() : '')).trim();
    if (!userText || isTyping) return;

    // Clear input
    if (input) { input.value = ''; autoResize(input); updateCharCount(''); }

    // Hide quick replies after first interaction
    const qr = document.getElementById('lx-quick-replies');
    if (qr) qr.style.display = 'none';

    // Add user message
    addMessage('user', userText);

    // Add to history
    conversationHistory.push({ role: 'user', content: userText });

    // Show typing
    isTyping = true;
    const loadingId = addMessage('bot', '', true);
    setSendBtn(false);

    try {
      const reply = await callGroqAPI(conversationHistory);
      removeMessage(loadingId);
      addMessage('bot', reply);
      conversationHistory.push({ role: 'assistant', content: reply });

      // Show contextual quick replies based on topic
      showContextualReplies(userText, reply);

    } catch (err) {
      removeMessage(loadingId);
      const fallback = getFallbackReply(userText);
      addMessage('bot', fallback);
      conversationHistory.push({ role: 'assistant', content: fallback });
      console.error('LuxeChat error:', err);
    }

    isTyping = false;
    setSendBtn(true);
  }

  // ---- CALL GROQ API ----
  async function callGroqAPI(history) {
    const messages = [
      { role: 'system', content: SITE_CONTEXT },
      ...history.slice(-12).map((m) => ({ role: m.role, content: m.content })),
    ];

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.35,
        max_tokens: 450,
        messages,
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `API error ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    return (typeof text === 'string' && text.trim())
      ? text.trim()
      : "I'm not sure about that. Can I help with products, orders, login, or checkout?";
  }

  // ---- SMART LOCAL FALLBACK ----
  function getFallbackReply(userText) {
    const q = (userText || '').toLowerCase();

    if (q.includes('coupon') || q.includes('discount') || q.includes('code')) {
      return 'Use **LUXE50** for **50% off**. It is required during checkout to place the order.';
    }
    if (q.includes('return') || q.includes('refund')) {
      return 'We offer a **30-day easy return** policy on all items in original condition. You can initiate returns from Dashboard → My Orders.';
    }
    if (q.includes('shipping') || q.includes('delivery') || q.includes('ship')) {
      return 'Shipping is **free above ₹999**. Below that, a flat **₹99** shipping fee applies.';
    }
    if (q.includes('login') || q.includes('signup') || q.includes('otp') || q.includes('account')) {
      return 'LuxeMarket uses **email OTP login** (no password). Go to **/pages/login.html**, enter your email, receive OTP, and verify.';
    }
    if (q.includes('watch')) {
      return 'Top watch picks: **Chronos Elite (₹8,499)**, **Obsidian Minimalist (₹6,299)**, and **Classic Pilot Chronograph (₹11,999)**. Want a quick comparison?';
    }
    if (q.includes('fragrance') || q.includes('perfume') || q.includes('oud') || q.includes('mist')) {
      return 'Best-rated fragrance is **Santal Oud Parfum (₹3,199, 4.9⭐)**. We also have **Rose Petal Body Mist (₹899)** and **Amber Oud Candle (₹1,299)**.';
    }
    if (q.includes('contact') || q.includes('support') || q.includes('help')) {
      return 'You can contact support at **support@luxemarket.in** or **+91 98765 43210** (Mon–Sat, 10am–7pm IST).';
    }

    return 'I can help with products, coupon **LUXE50**, login OTP, shipping, returns, checkout, and order flow. Ask me anything about LuxeMarket.';
  }

  // ---- CONTEXTUAL QUICK REPLIES ----
  function showContextualReplies(userText, botReply) {
    const lower = userText.toLowerCase();
    let replies = [];

    if (lower.includes('watch')) {
      replies = ['Compare all watches', 'Best value watch?', 'Add to cart', 'View watches in shop'];
    } else if (lower.includes('bag') || lower.includes('tote')) {
      replies = ['View all bags', 'Which bag is bestseller?', 'Bag prices?'];
    } else if (lower.includes('fragrance') || lower.includes('perfume') || lower.includes('candle')) {
      replies = ['Top rated fragrance?', 'Fragrance prices', 'Gift recommendation?'];
    } else if (lower.includes('coupon') || lower.includes('discount') || lower.includes('code')) {
      replies = ['How to apply coupon?', 'Any other offers?', 'Go to checkout'];
    } else if (lower.includes('return') || lower.includes('refund')) {
      replies = ['How to initiate return?', 'Contact support', 'Return timeline?'];
    } else if (lower.includes('login') || lower.includes('sign') || lower.includes('account')) {
      replies = ['How OTP works?', 'Go to login page', 'View my orders'];
    } else if (lower.includes('ship') || lower.includes('deliver')) {
      replies = ['Free shipping limit?', 'Track my order', 'Shipping timeline?'];
    } else {
      replies = ['Show all products', 'What\'s the coupon code? 🏷️', 'Contact support', 'View my orders'];
    }

    renderQuickReplies(replies);
    const qr = document.getElementById('lx-quick-replies');
    if (qr) qr.style.display = 'flex';
  }

  // ---- SEND QUICK REPLY ----
  function sendQuick(text) {
    const input = document.getElementById('lx-input');
    if (input) input.value = text;
    send(text);
  }

  // ---- HANDLE KEY ----
  function handleKey(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  }

  // ---- AUTO RESIZE ----
  function autoResize(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 100) + 'px';
    updateCharCount(el.value);
  }

  function updateCharCount(val) {
    const el = document.getElementById('lx-char-count');
    if (el) el.textContent = `${val.length}/500`;
  }

  // ---- TOGGLE ----
  function toggle() {
    isOpen = !isOpen;
    const win = document.getElementById('lx-chat-window');
    const toggleIcon = document.getElementById('lx-toggle-icon');
    const closeIcon = document.getElementById('lx-close-icon');
    const dot = document.getElementById('lx-notif-dot');
    const btn = document.getElementById('lx-toggle-btn');

    if (win) win.classList.toggle('lx-open', isOpen);
    if (btn) btn.classList.toggle('lx-active', isOpen);
    if (toggleIcon) toggleIcon.style.display = isOpen ? 'none' : 'flex';
    if (closeIcon) closeIcon.style.display = isOpen ? 'flex' : 'none';
    if (dot) dot.style.display = 'none';

    if (isOpen) {
      setTimeout(() => {
        const input = document.getElementById('lx-input');
        if (input) input.focus();
        scrollToBottom();
      }, 300);
    }
  }

  // ---- CLEAR CHAT ----
  function clearChat() {
    conversationHistory = [];
    const msgs = document.getElementById('lx-messages');
    if (msgs) msgs.innerHTML = '';
    showWelcomeMessage();
    renderQuickReplies();
    const qr = document.getElementById('lx-quick-replies');
    if (qr) qr.style.display = 'flex';
  }

  // ---- SEND BUTTON STATE ----
  function setSendBtn(enabled) {
    const btn = document.getElementById('lx-send-btn');
    if (btn) {
      btn.disabled = !enabled;
      btn.style.opacity = enabled ? '1' : '0.5';
    }
  }

  // ---- INJECT STYLES ----
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --lx-gold: #c9a84c;
        --lx-gold-light: #e2c47a;
        --lx-gold-dim: rgba(201,168,76,0.15);
        --lx-bg: #141414;
        --lx-bg2: #1c1c1c;
        --lx-bg3: #242424;
        --lx-border: rgba(255,255,255,0.08);
        --lx-text: #f0ece4;
        --lx-text2: #9e9b95;
        --lx-shadow: 0 25px 80px rgba(0,0,0,0.7);
        --lx-radius: 20px;
        --lx-transition: 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      /* ---- TOGGLE BUTTON ---- */
      #lx-toggle-btn {
        position: fixed;
        bottom: 28px; right: 28px;
        z-index: 9998;
        width: 60px; height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--lx-gold) 0%, #a07820 100%);
        color: #1a1200;
        border: none; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 8px 30px rgba(201,168,76,0.5), 0 0 0 0 rgba(201,168,76,0.4);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        animation: lx-pulse-ring 2.5s ease-out 3s 3;
      }

      #lx-toggle-btn:hover {
        transform: scale(1.1) rotate(-5deg);
        box-shadow: 0 12px 40px rgba(201,168,76,0.6);
      }

      #lx-toggle-btn.lx-active {
        animation: none;
        background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
        color: var(--lx-gold);
        border: 1px solid rgba(201,168,76,0.4);
        box-shadow: 0 8px 30px rgba(0,0,0,0.5);
      }

      @keyframes lx-pulse-ring {
        0% { box-shadow: 0 8px 30px rgba(201,168,76,0.5), 0 0 0 0 rgba(201,168,76,0.4); }
        70% { box-shadow: 0 8px 30px rgba(201,168,76,0.5), 0 0 0 18px rgba(201,168,76,0); }
        100% { box-shadow: 0 8px 30px rgba(201,168,76,0.5), 0 0 0 0 rgba(201,168,76,0); }
      }

      #lx-toggle-icon, #lx-close-icon {
        display: flex; align-items: center; justify-content: center;
      }

      #lx-notif-dot {
        display: none;
        position: absolute; top: 6px; right: 6px;
        width: 12px; height: 12px;
        background: #e55; border-radius: 50%;
        border: 2px solid var(--lx-bg);
        animation: lx-blink 1.5s ease-in-out infinite;
      }

      @keyframes lx-blink {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(0.85); }
      }

      /* ---- CHAT WINDOW ---- */
      #lx-chat-window {
        position: fixed;
        bottom: 104px; right: 28px;
        z-index: 9997;
        width: 380px;
        height: 560px;
        max-height: calc(100vh - 130px);
        background: var(--lx-bg);
        border: 1px solid rgba(201,168,76,0.2);
        border-radius: var(--lx-radius);
        box-shadow: var(--lx-shadow);
        display: flex; flex-direction: column;
        overflow: hidden;
        opacity: 0;
        transform: translateY(20px) scale(0.95);
        pointer-events: none;
        transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
        transform-origin: bottom right;
      }

      #lx-chat-window.lx-open {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: all;
      }

      /* ---- HEADER ---- */
      #lx-chat-header {
        display: flex; align-items: center; justify-content: space-between;
        padding: 1rem 1.2rem;
        background: linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.04));
        border-bottom: 1px solid rgba(201,168,76,0.15);
        flex-shrink: 0;
      }

      #lx-header-left { display: flex; align-items: center; gap: 0.8rem; }

      #lx-avatar {
        width: 40px; height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--lx-gold), #8b6914);
        display: flex; align-items: center; justify-content: center;
        font-size: 1rem; color: #1a1200;
        flex-shrink: 0;
        box-shadow: 0 4px 12px rgba(201,168,76,0.4);
        animation: lx-spin-avatar 8s linear infinite;
      }

      @keyframes lx-spin-avatar {
        0%, 90% { transform: rotate(0deg); }
        95% { transform: rotate(360deg); }
        100% { transform: rotate(360deg); }
      }

      #lx-header-name {
        font-family: 'Cormorant Garamond', serif;
        font-size: 1rem; font-weight: 600;
        color: var(--lx-text);
        letter-spacing: 0.03em;
      }

      #lx-header-status {
        font-size: 0.7rem; color: var(--lx-text2);
        display: flex; align-items: center; gap: 0.35rem;
      }

      .lx-status-dot {
        width: 7px; height: 7px; border-radius: 50%;
        background: #4caf77;
        animation: lx-status-pulse 2s ease-in-out infinite;
      }

      @keyframes lx-status-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      #lx-header-actions { display: flex; gap: 0.4rem; }

      .lx-hdr-btn {
        width: 28px; height: 28px;
        background: transparent;
        border: 1px solid var(--lx-border);
        border-radius: 8px;
        color: var(--lx-text2);
        cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        transition: all 0.2s ease;
      }
      .lx-hdr-btn:hover {
        border-color: var(--lx-gold);
        color: var(--lx-gold);
        background: var(--lx-gold-dim);
      }

      /* ---- MESSAGES ---- */
      #lx-messages-wrap {
        flex: 1; overflow-y: auto;
        padding: 1rem;
        scroll-behavior: smooth;
      }

      #lx-messages-wrap::-webkit-scrollbar { width: 3px; }
      #lx-messages-wrap::-webkit-scrollbar-track { background: transparent; }
      #lx-messages-wrap::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.3); border-radius: 99px; }

      .lx-msg {
        display: flex;
        flex-direction: column;
        margin-bottom: 1rem;
        animation: lx-msg-in 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
      }

      @keyframes lx-msg-in {
        from { opacity: 0; transform: translateY(12px) scale(0.97); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }

      .lx-msg-bot { align-items: flex-start; }
      .lx-msg-user { align-items: flex-end; }

      .lx-bot-icon {
        width: 24px; height: 24px;
        background: var(--lx-gold-dim);
        border: 1px solid rgba(201,168,76,0.3);
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 0.65rem; color: var(--lx-gold);
        margin-bottom: 0.3rem;
        flex-shrink: 0;
      }

      .lx-bubble {
        max-width: 88%;
        padding: 0.75rem 1rem;
        border-radius: 16px;
        font-size: 0.875rem;
        line-height: 1.6;
        word-wrap: break-word;
      }

      .lx-bubble-bot {
        background: var(--lx-bg2);
        border: 1px solid var(--lx-border);
        color: var(--lx-text);
        border-bottom-left-radius: 4px;
      }

      .lx-bubble-user {
        background: linear-gradient(135deg, var(--lx-gold), #a07820);
        color: #1a1200;
        font-weight: 500;
        border-bottom-right-radius: 4px;
      }

      .lx-bubble strong { font-weight: 700; }
      .lx-bubble em { font-style: italic; opacity: 0.85; }
      .lx-bubble code {
        background: rgba(255,255,255,0.1);
        padding: 0.1rem 0.4rem;
        border-radius: 4px;
        font-family: monospace;
        font-size: 0.8rem;
      }

      .lx-msg-time {
        font-size: 0.65rem;
        color: var(--lx-text2);
        margin-top: 0.25rem;
        opacity: 0.6;
        padding: 0 0.3rem;
      }

      /* ---- TYPING INDICATOR ---- */
      .lx-typing-indicator {
        display: flex; gap: 5px; align-items: center;
        padding: 0.2rem 0;
      }

      .lx-typing-indicator span {
        width: 7px; height: 7px;
        border-radius: 50%;
        background: var(--lx-gold);
        display: block;
        animation: lx-bounce 1.2s ease-in-out infinite;
      }
      .lx-typing-indicator span:nth-child(2) { animation-delay: 0.15s; }
      .lx-typing-indicator span:nth-child(3) { animation-delay: 0.3s; }

      @keyframes lx-bounce {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
        30% { transform: translateY(-7px); opacity: 1; }
      }

      /* ---- QUICK REPLIES ---- */
      #lx-quick-replies {
        display: flex; gap: 0.45rem;
        flex-wrap: wrap;
        padding: 0.6rem 1rem;
        border-top: 1px solid var(--lx-border);
        background: var(--lx-bg);
        flex-shrink: 0;
        max-height: 90px;
        overflow-y: auto;
      }

      #lx-quick-replies::-webkit-scrollbar { height: 2px; }
      #lx-quick-replies::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.3); }

      .lx-qr-btn {
        background: var(--lx-bg2);
        border: 1px solid var(--lx-border);
        color: var(--lx-text2);
        padding: 0.3rem 0.7rem;
        border-radius: 99px;
        font-size: 0.72rem;
        font-family: 'DM Sans', sans-serif;
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.2s ease;
        flex-shrink: 0;
      }

      .lx-qr-btn:hover {
        background: var(--lx-gold-dim);
        border-color: rgba(201,168,76,0.4);
        color: var(--lx-gold);
        transform: translateY(-1px);
      }

      /* ---- INPUT ---- */
      #lx-input-wrap {
        padding: 0.8rem 1rem;
        border-top: 1px solid var(--lx-border);
        background: var(--lx-bg);
        flex-shrink: 0;
      }

      #lx-input-row {
        display: flex; gap: 0.6rem; align-items: flex-end;
      }

      #lx-input {
        flex: 1;
        background: var(--lx-bg2);
        border: 1px solid var(--lx-border);
        border-radius: 12px;
        padding: 0.7rem 0.9rem;
        color: var(--lx-text);
        font-family: 'DM Sans', sans-serif;
        font-size: 0.875rem;
        resize: none;
        outline: none;
        line-height: 1.5;
        min-height: 40px;
        max-height: 100px;
        transition: border-color 0.2s ease, background 0.2s ease;
        overflow-y: auto;
      }

      #lx-input:focus {
        border-color: rgba(201,168,76,0.5);
        background: rgba(201,168,76,0.04);
      }

      #lx-input::placeholder { color: rgba(158,155,149,0.5); }

      #lx-send-btn {
        width: 40px; height: 40px;
        flex-shrink: 0;
        background: linear-gradient(135deg, var(--lx-gold), #a07820);
        border: none; border-radius: 12px;
        color: #1a1200;
        cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        box-shadow: 0 4px 15px rgba(201,168,76,0.3);
      }

      #lx-send-btn:hover:not(:disabled) {
        transform: scale(1.05) rotate(-5deg);
        box-shadow: 0 6px 20px rgba(201,168,76,0.5);
      }

      #lx-input-footer {
        display: flex; justify-content: space-between; align-items: center;
        margin-top: 0.4rem;
      }

      #lx-char-count { font-size: 0.65rem; color: var(--lx-text2); opacity: 0.5; }
      #lx-powered-by {
        font-size: 0.65rem; color: var(--lx-gold); opacity: 0.7;
        font-family: 'Cormorant Garamond', serif;
        letter-spacing: 0.05em;
      }

      /* ---- MOBILE ---- */
      @media (max-width: 480px) {
        #lx-chat-window {
          width: calc(100vw - 24px);
          right: 12px; bottom: 88px;
          height: calc(100vh - 110px);
          max-height: 600px;
          border-radius: 16px;
        }
        #lx-toggle-btn { right: 16px; bottom: 20px; }
      }
    `;
    document.head.appendChild(style);
  }

  // ---- PUBLIC API ----
  window.LuxeChat = {
    toggle,
    send: () => send(),
    sendQuick,
    clearChat,
    handleKey,
    autoResize,
  };

  // ---- INIT on DOM Ready ----
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildChatbot);
  } else {
    buildChatbot();
  }

})();
