# FE-Pharmacy

Next.js 15 frontend for the Smart Pharmacy Application. Provides the patient-facing shop, cart, and MediGenius AI consultation interface, as well as the admin dashboard for catalogue and order management.

## Prerequisites

- Node.js 20 or higher
- pnpm (recommended) or npm
- The BE-Pharmacy backend running at `http://localhost:5000` (see BE-Pharmacy README)

## Project Structure

```
FE-Pharmacy/
├── src/
│   ├── app/
│   │   ├── admin/          # Admin pages (dashboard, products, orders, users)
│   │   ├── users/          # Patient pages (cart, orders, profile, health profile)
│   │   ├── shop/           # Public shop landing page
│   │   ├── products/       # Public product listing and detail pages
│   │   ├── ai-assistant/   # MediGenius chat interface
│   │   ├── login/          # Login page
│   │   └── register/       # Registration page
│   ├── components/
│   │   ├── ui/             # Reusable primitives (Radix UI + CVA + Tailwind)
│   │   ├── main/           # Shared layout components including ProtectedRoute
│   │   ├── desktop/        # Desktop-specific layout components
│   │   └── mobile/         # Mobile-specific layout components
│   └── lib/
│       └── utils.ts        # cn() class-merging utility
├── api/                    # Typed API call functions per domain
│   └── apiEndpoints.ts     # Centralized endpoint path definitions
├── config/
│   └── axios.ts            # Axios instance with Bearer token interceptor
├── stores/
│   └── authStore.ts        # Zustand auth store (persisted to localStorage)
├── types/                  # Shared TypeScript type definitions
└── public/                 # Static assets
```

## Environment Variables

Create a `.env` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1/
```

This is the only required variable. It must point to the running BE-Pharmacy API.

## Installation and Running

```bash
# 1. Install dependencies
pnpm install

# 2. Start the development server
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Other Commands

```bash
pnpm build    # Production build
pnpm start    # Start production server (requires pnpm build first)
pnpm lint     # Run ESLint
```

## Running the Full Project

Both servers must be running at the same time. Open two terminals:

**Terminal 1 (backend):**
```bash
cd BE-Pharmacy
npm run dev
```

**Terminal 2 (frontend):**
```bash
cd FE-Pharmacy
pnpm dev
```

If MediGenius LLM responses are needed, Ollama must also be running:
```bash
ollama serve
```

Then open `http://localhost:3000` in a browser.

## Demo Credentials

| Role | Email | Password |
| ---- | ----- | -------- |
| Admin | admin@demo.local | Admin@123 |
| Patient | patient@demo.local | Patient@123 |

Accounts are created by the BE-Pharmacy seed scripts. See the BE-Pharmacy README for seeding instructions.

## Route Overview

| Path | Access | Description |
| ---- | ------ | ----------- |
| `/shop` | Public | Product landing page |
| `/products` | Public | Product listing with filters |
| `/products/:slug` | Public | Product detail page |
| `/login` | Public | Login form |
| `/register` | Public | Registration form |
| `/ai-assistant` | Public (limited) / Patient | MediGenius chat |
| `/users/cart` | Patient | Cart and checkout |
| `/users/profile` | Patient | Account settings |
| `/users/profile/health` | Patient | Allergy and health profile |
| `/users/profile/orders` | Patient | Order history |
| `/admin` | Admin | Dashboard |
| `/admin/products` | Admin | Product management |
| `/admin/orders` | Admin | Order management |
| `/admin/users` | Admin | User management |

## Architecture Notes

- **Route protection:** `src/components/main/ProtectedRoute.tsx` reads role and token from the Zustand store and redirects unauthenticated users to `/login`. PATIENT users are blocked from `/admin` routes and vice versa.
- **Auth state:** Stored in Zustand (`stores/authStore.ts`) and persisted to `localStorage` under the key `auth-storage`. The Axios interceptor in `config/axios.ts` reads the token from this key and attaches it as a Bearer header to every outgoing request.
- **API layer:** All API calls go through typed functions in `api/`. Endpoint paths are centralized in `api/apiEndpoints.ts`. Components do not call Axios directly.
- **Styling:** Tailwind CSS with `cn()` from `src/lib/utils.ts` for conditional class merging. UI primitives in `src/components/ui/` use Radix UI and CVA variants.
