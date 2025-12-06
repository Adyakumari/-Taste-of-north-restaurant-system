# Taste of North - Restaurant Booking & Ordering

Taste of North is a full-stack restaurant ordering and booking demo built with Next.js (React), featuring:

- Home page and menu browsing
- Item detail pages
- Cart and checkout
- Order placement with unique tracking token
- Payment integration (Stripe optional, mock fallback)
- Order tracking page

## Tech

- Next.js 14 (App Router), React 18, TypeScript
- File-based JSON storage for orders (development/demo)
- Optional Stripe Checkout (test mode)

## Getting Started

1) Install dependencies

```bash
npm install
```

2) Run the dev server

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Environment Variables (optional for Stripe)

Create `.env.local`:

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_SUCCESS_URL=http://localhost:3000/order/success
STRIPE_CANCEL_URL=http://localhost:3000/checkout?cancelled=1
```

If Stripe keys are not present, the app uses a mock payment flow.

## Project Structure

```
app/                 # Next.js App Router pages and API routes
components/          # UI components and providers
data/                # Static menu data, orders JSON store
lib/                 # Utilities and types
styles/              # Global styles
```

## Notes

- Orders are stored at `data/orders.json` for local development only.
- A short token is generated per order for tracking (share-safe).
- For production, replace file storage with a database.


