# Cicero — store + admin portal

Next.js 15 storefront for **Cicero** (wool coats, jackets, sweaters and knitwear for men and women), with a built-in **admin portal** at `/admin`. You never need to edit Supabase by hand: products, photos, stock, orders, discounts and store settings are all managed from the portal.

- **Store**: `/`, `/men`, `/women`, `/shop?category=…`, `/products/…`, `/collections/…`, bag, checkout (Stripe), wishlist, search, light/dark mode.
- **Admin** (`/admin`): Dashboard · Orders (ship, track, refund, CSV export) · Products (photos, colours × sizes, stock, pricing, publish) · Inventory · Categories · Collections · Discounts · Store settings (announcement, homepage hero, shipping rates) · Team.

---

## Go live in 5 steps

### 1. Set up the database (one time, 1 minute)
Supabase → **SQL Editor** → **New query** → paste all of [`supabase/setup.sql`](supabase/setup.sql) → **Run**.

It works on your existing Lucevalie database: it removes the old demo products, adds the Cicero catalogue (16 starter pieces in 4 categories), store settings, discount codes, the admin team table and the `product-images` storage bucket. It's safe to run again — it never overwrites anything you create in the admin.

### 2. Add environment variables in Vercel
Vercel → your project → **Settings → Environment Variables** (Production + Preview):

| Name | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase → API Keys → publishable (or legacy `anon`) |
| `SUPABASE_SECRET_KEY` | Supabase → API Keys → secret (or legacy `service_role`) |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | from step 4 |
| `ADMIN_EMAILS` | **your** email, e.g. `you@gmail.com` (comma-separate several) |

> The old deploy broke because these were missing at build time and because the code was half-renamed. The app now builds without any of them and tells you clearly what's missing instead of crashing.

### 3. Deploy
Push to GitHub (Vercel deploys automatically) or click **Redeploy** in Vercel.
*Vercel Hobby tip:* commits must be authored with the email of your Vercel/GitHub account, or Vercel blocks the deployment.

### 4. Connect Stripe payments
Stripe → Developers → **Webhooks** → Add endpoint
- URL: `https://YOUR-DOMAIN/api/stripe/webhook`
- Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired`
- Copy the signing secret into `STRIPE_WEBHOOK_SECRET` and redeploy.

(Orders are also confirmed on the thank-you page as a safety net, but the webhook is what makes it reliable.)

### 5. Create your admin login
Open `https://YOUR-DOMAIN/admin` → **Create owner account** → use the email from `ADMIN_EMAILS` and choose a password. The **Dashboard** shows a setup checklist until everything is connected.

---

## Everyday tasks (all in `/admin`)

| I want to… | Go to |
|---|---|
| Add a product | Products → **Add product** → name, description, price, photos (drag & drop), colours + sizes, stock → **Save & publish** |
| Change stock | **Inventory** (all variants in one table) or inside the product |
| See what to ship | **Orders → To fulfil** → open order → add tracking → **Mark shipped** |
| Refund | Open the order → **Refund full amount** (refunds through Stripe, optionally restocks) |
| Run a promotion | **Discounts** → new code (percent or fixed, minimum spend, limits, dates) |
| Change homepage / announcement / shipping prices | **Store settings** |
| Add a category (e.g. Scarves) | **Categories** — it appears in the menu and filters immediately |
| Give staff access | **Team** (owners only) |

Stock is reserved when a customer starts checkout, deducted when they pay, and released automatically if they abandon payment.

---

## Local development
```bash
cp .env.example .env.local   # fill in values
npm install
npm run dev                   # http://localhost:3000  ·  admin: /admin
```
Edit SQL in `supabase/parts/`, then run `./supabase/build.sh` to regenerate `supabase/setup.sql` (starter catalogue lives in `supabase/gen_seed.py`).

## Project map
```
src/app/(store)/        storefront pages
src/app/admin/          admin portal (login, (panel)/… pages, _actions/ server actions)
src/app/api/            checkout, discount preview, search, stripe webhook
src/components/store/   storefront UI (Header, Catalogue, ProductView, CartDrawer…)
src/components/admin/   admin UI (ProductForm, VariantEditor, ImageManager…)
src/lib/                env, Supabase/Stripe clients, catalogue queries, pricing
supabase/setup.sql      the one file to run in Supabase
```
