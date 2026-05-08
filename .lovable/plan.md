
# ShopEase — Plan

A TanStack Start React app with mock data + localStorage persistence, real order-confirmation emails via Lovable Email, and a downloadable Java + Selenium + TestNG framework targeting the deployed app.

## Scope reconciliation

Your spec assumes Node/Express + MongoDB + Nodemailer + Java Selenium. Lovable can't run Node/Mongo or Java. Based on your answers:

- **Backend** → mock API in the browser (products seeded in code, cart/orders in `localStorage`, fake JWT, simulated latency + loading states). All `data-testid` hooks present so Selenium works exactly as planned.
- **Email** → real sends via Lovable Email. One small server route (`/api/orders/email`) renders an HTML order-confirmation template and sends it. Requires setting up an email sender domain (one-click dialog).
- **Selenium** → full Maven POM framework generated as `/mnt/documents/shopease-automation.zip` for you to unzip and run with `mvn test` locally. CI yaml + README included.

Everything else (Express server, MongoDB, Nodemailer SMTP, docker-compose, multi-service GitHub Actions) is replaced by the above. Tell me if you'd rather skip Lovable Email and have the success page just *display* "email sent" without actually sending — that removes the domain-setup step.

## Frontend pages (TanStack Start, Tailwind v4)

Routes under `src/routes/`:

```
index.tsx              /              Home — hero, featured grid, category chips
products.tsx           /products      List + search + category/price filter + sort
products.$id.tsx       /products/:id  Detail + Add to Cart
cart.tsx               /cart          Items, qty, remove, totals
checkout.tsx           /checkout      Shipping form + summary + Place Order
order-success.$id.tsx  /order-success/:id   Confetti + success UI
orders.tsx             /orders        Order history (auth required)
orders.$id.tsx         /orders/:id    Order detail
login.tsx              /login
register.tsx           /register
```

Shared `__root.tsx` adds a header (logo, nav, cart badge, login/logout) and footer.

### State
- React Context for `auth` (mock JWT stored in `localStorage` under `shopease_token`) and `cart` (persisted to `localStorage`).
- Orders persisted to `localStorage` keyed by user id.
- A thin `mockApi.ts` module mimics REST: returns Promises with 200–600 ms delay, throws on bad input, so loading spinners + error toasts behave like real network calls.

### Order Success Page (the centerpiece)
- `canvas-confetti` fires on mount: 4–5 second burst, gold / green / blue palette, multiple origins.
- Big animated green ✅, "🎉 Order Placed Successfully!", sub-message about email.
- Order ID, total, ETA (today + 5 business days).
- "Continue Shopping" → `/`, "View Order History" → `/orders`.
- All required `data-testid` attributes wired.

### data-testid coverage (every spec'd hook + more)
`login-email-input`, `login-password-input`, `login-submit-btn`, `register-*`, `search-input`, `category-filter-<slug>`, `sort-select`, `product-card`, `product-card-<id>`, `add-to-cart-btn`, `cart-item`, `cart-qty-input`, `cart-remove-btn`, `cart-total`, `checkout-name-input`, `checkout-address-input`, `checkout-city-input`, `checkout-zip-input`, `checkout-submit-btn`, `order-success-message`, `order-id`, `order-total`, `confetti-container`, `continue-shopping-btn`, `view-orders-btn`, `order-history-row`, `nav-cart`, `nav-login`, `nav-logout`.

### Mock data
20 products across 4 categories (Electronics, Apparel, Home, Books), each with image (Unsplash), price, rating, stock, description.

## Email (Lovable Email)

- Server route `src/routes/api/orders/email.ts` accepts `{ orderId, email, customerName, items, total }` and enqueues a transactional email.
- React Email template `order-confirmation.tsx` matches your spec: brand header, thank-you heading, order metadata, items table, totals, "View Your Order" button → `/orders/:id`, support footer.
- Subject: `🎉 Order Confirmed! Your ShopEase Order #<orderId>`.
- Triggered from `CheckoutPage` after the local order is saved, before redirecting to success page. Failure is non-blocking — shows toast but still navigates.
- First time you build, the email-domain setup dialog opens; once verified, sends are live. Pre-verification, the order flow still completes (email skipped silently).

## Selenium framework (downloadable zip)

Generated under `/mnt/documents/shopease-automation/` and zipped to `shopease-automation.zip`.

```
automation/
├── pom.xml              Selenium 4, TestNG 7, WebDriverManager, Allure-TestNG, Surefire
├── README.md            How to configure base.url, run mvn test, generate Allure
├── .github/workflows/ci.yml   Sets up JDK 17 + Chrome, runs `mvn test`, uploads allure-results
└── src/
    ├── main/java/
    │   ├── pages/        BasePage, LoginPage, RegisterPage, HomePage, ProductPage,
    │   │                 CartPage, CheckoutPage, OrderSuccessPage
    │   └── utils/        ConfigReader, ScreenshotUtil, EmailVerificationUtil (stub)
    └── test/
        ├── java/tests/   BaseTest + LoginTest, RegisterTest, SearchTest, CartTest,
        │                 CheckoutTest, OrderSuccessTest, OrderHistoryTest
        └── resources/    testng.xml, config.properties, allure.properties
```

- POM strict, `By.cssSelector("[data-testid='…']")` everywhere, zero `Thread.sleep`, `WebDriverWait` + `ExpectedConditions`.
- `BaseTest` `@BeforeMethod`/`@AfterMethod` driver lifecycle, screenshot-on-failure via TestNG `ITestListener`.
- Allure `@Step`, `@Description`, `@Severity` on every test; ≥3 cases per module covering all scenarios you listed including the OrderSuccess + confetti container assertions.
- `config.properties` defaults to `base.url=http://localhost:3000` — change to your published Lovable URL to run against the live deploy.
- Delivered via `<lov-artifact path="shopease-automation.zip" mime_type="application/zip"></lov-artifact>`.

## What I will NOT produce (and why)

- `backend/` Express + Mongo, `.env` with SMTP creds, `docker-compose.yml`, multi-service GitHub Actions — Lovable's runtime can't host them. The Selenium zip's own `ci.yml` is included.
- Real bcrypt/JWT — auth is mocked client-side. Selenium tests still pass against the mock.

## Deliverables checklist

1. Full TanStack Start ShopEase app with all pages, mock API, cart/auth contexts, confetti success page.
2. Lovable Email integration for order confirmations (one-time domain setup prompt).
3. `shopease-automation.zip` artifact with the complete Maven Selenium framework + README + CI yml.
4. Project README updated to explain the mock-API model, how to publish, and how to point Selenium at the deployed URL.
