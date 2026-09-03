# Sundry — E-Commerce Frontend

A modern e-commerce storefront built with **Next.js 16**, **TypeScript**, **Redux Toolkit**, and **Tailwind CSS**.  
This project was developed as a **Junior Frontend Developer portfolio piece**, showcasing real-world UI patterns, API integration, and state management.

> **Backend API:** [Route Academy E-Commerce API](https://ecommerce.routemisr.com) (Route Misr)

---

## Live Demo

> Add your deployed URL here after publishing (e.g. Vercel / Netlify).

---

## Screenshots

| Home | Shop | Product Details |
|------|------|-----------------|
| _Add screenshot_ | _Add screenshot_ | _Add screenshot_ |

---

## Features

- **Product browsing** — Home page, shop with search/filter/sort, categories, and brands
- **Product details** — Image gallery, ratings, add to cart, wishlist, and reviews
- **Authentication** — Sign up, sign in, forgot password, and AES-GCM encrypted JWT storage
- **Cart & checkout** — Redux cart, promo codes, cash on delivery & Stripe online payment
- **User account** — Profile settings, password change, order history
- **Responsive UI** — Mobile-first layout with sticky navbar and polished animations
- **TypeScript** — Typed API models, Redux slices, and component prop modules

---

## Tech Stack

| Category | Tools |
|----------|-------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State | Redux Toolkit |
| Forms | React Hook Form + Zod |
| UI / UX | Framer Motion, Sonner (toasts), React Icons |
| API | Route Academy REST API |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages & components
│   ├── auth/               # Sign in, sign up, forgot password
│   ├── account/            # Profile & orders
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout flow
│   ├── shop/               # Product listing
│   ├── products/           # Product details & reviews
│   ├── categories/         # Category pages
│   ├── brands/             # Brand pages
│   ├── components/         # Shared UI (Navbar, Footer, ProductCard…)
│   └── lib/                # API config, auth helpers, shared types
│       └── types/          # Central TypeScript models
└── redux/                  # Redux store, hooks, and slices
    └── slices/
        ├── auth/
        ├── cart/
        └── wishlist/
```

Each feature component that needs explicit typing has a co-located `*.types.ts` file (e.g. `ProductCard.types.ts`, `SignInForm.types.ts`).

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd sundry
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Copy the example env file and adjust if needed:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_API_BASE_URL=https://ecommerce.routemisr.com
NEXT_PUBLIC_TOKEN_ENCRYPTION_KEY=replace-with-a-32-character-secret
```

JWT tokens are encrypted with **AES-GCM** before they are saved in `localStorage`. Use a unique `NEXT_PUBLIC_TOKEN_ENCRYPTION_KEY` (32+ characters) in production.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production

```bash
npm run build
npm start
```

---

## API Reference

This project consumes the **Route Academy** e-commerce API:

- **Base URL:** `https://ecommerce.routemisr.com/api/v1`
- **Docs / Course:** [Route Academy](https://route-academy.com)

Endpoints used include products, categories, brands, auth, cart, orders, and reviews.  
All endpoints are centralized in `src/app/lib/api.ts`.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm start` | Run production server |
| `npm run lint` | Run ESLint |

---

## Author

**Ziad Sayed** — Junior Frontend Developer

- GitHub: _add your link_
- LinkedIn: _add your link_

---

## License

This project is open source and available for portfolio and learning purposes.
