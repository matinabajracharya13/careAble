# AdminOS — React Admin Panel

A production-grade admin panel built with React + Vite, featuring dark/light mode, 5 customisable color themes, full auth flow, data fetching, and form validation.

---

## Stack

| Layer | Library |
|---|---|
| Framework | React 18 + Vite 5 |
| Language | TypeScript |
| Styling | Tailwind CSS v3 + shadcn/ui (Radix UI) |
| Routing | React Router v6 |
| Data fetching | TanStack Query v5 |
| HTTP client | Axios (with interceptors) |
| Forms | React Hook Form v7 |
| Validation | Zod v3 |
| State management | Zustand v4 |
| Charts | Recharts |
| Icons | Lucide React |

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and set your API URL
cp .env.example .env

# 3. Start dev server
npm run dev
```

> **Demo login**: any valid email + password ≥ 8 characters works in demo mode.

---

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui primitives (Button, Card, Input, …)
│   ├── layout/          # AppLayout, Sidebar, Topbar
│   ├── dashboard/       # StatCard, RevenueChart, ActivityFeed
│   └── auth/            # ProtectedRoute
├── hooks/
│   ├── use-users.ts     # TanStack Query hooks for users CRUD
│   └── use-dashboard.ts # Dashboard stats + activity hooks
├── lib/
│   ├── api.ts           # Axios instance + interceptors
│   ├── query-client.ts  # TanStack QueryClient config
│   ├── utils.ts         # cn(), formatDate(), formatCurrency()
│   └── validations.ts   # All Zod schemas
├── pages/
│   ├── dashboard.tsx
│   ├── users.tsx
│   ├── analytics.tsx
│   ├── notifications.tsx
│   ├── settings.tsx
│   └── login.tsx
├── store/
│   ├── auth-store.ts    # Zustand: user, token, isAuthenticated
│   ├── theme-store.ts   # Zustand: mode, colorTheme, sidebarCollapsed
│   └── ui-store.ts      # Zustand: toasts
└── types/
    └── index.ts         # All shared TypeScript types
```

---

## Themes

### Color Modes
Three options: `light`, `dark`, `system` — persisted to localStorage.

### Accent Colors
Five built-in palettes switchable at runtime via CSS variables:

| Theme | Hue |
|---|---|
| `indigo` (default) | 243° |
| `rose` | 346° |
| `emerald` | 152° |
| `amber` | 32° |
| `cyan` | 189° |

Change the theme in **Settings → Appearance**.

---

## API Integration

### Connecting to your backend

Edit `VITE_API_BASE_URL` in `.env`. The Axios instance in `src/lib/api.ts` automatically:
- Attaches `Authorization: Bearer <token>` from Zustand
- Redirects to `/login` on 401

### Replacing mock data

Each page uses TanStack Query hooks. Swap out `placeholderData` with real calls:

```ts
// Before (demo)
placeholderData: { totalUsers: 8420, ... }

// After (real API)
queryFn: () => get<DashboardStats>("/dashboard/stats"),
```

### Auth

Replace the simulated login in `src/pages/login.tsx`:

```ts
// Replace this simulation:
await new Promise((r) => setTimeout(r, 800));

// With your real API:
const response = await post<AuthResponse>("/auth/login", values);
setAuth(response.user, response.token, response.refreshToken);
```

---

## Adding a New Page

1. Create `src/pages/my-page.tsx`
2. Add a route in `src/App.tsx` inside the protected `<AppLayout>` route
3. Add a nav item in `src/components/layout/sidebar.tsx`

---

## Build

```bash
npm run build   # outputs to dist/
npm run preview # preview production build
```
