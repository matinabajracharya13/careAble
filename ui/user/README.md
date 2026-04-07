# SkillBridge

> A full-stack-ready Next.js 14 app for skill assessment, certification, and talent matching.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS custom properties for theming
- **UI Components**: Radix UI primitives (shadcn-style)
- **Data fetching**: TanStack React Query v5
- **Forms**: React Hook Form + Zod
- **Animations**: Tailwind keyframes + CSS transitions

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Career seeker | `career@demo.com` | `demo123` |
| Employer | `employer@demo.com` | `demo123` |

Or sign up with any email — role is chosen during registration.

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — hero, features, partners, contact |
| `/login` | Login with demo quick-fill buttons |
| `/signup` | Registration with role selection (Career / Employer) |
| `/onboarding` | Multi-step questionnaire loaded from API per role |
| `/dashboard` | Role-aware dashboard (Career or Employer view) |
| `/assessment` | Assessment listing with search & filter |
| `/assessment/[id]` | Assessment taking with timer + results |
| `/certificate/[id]` | Printable certificate with verification |
| `/employer` | Talent pool (Employer only) |

---

## Theming

### Color themes (6 presets)
Change color via the palette icon in the navbar — or programmatically:

```tsx
import { useColorTheme } from "@/context/ThemeContext";

const { setColorTheme } = useColorTheme();
setColorTheme("emerald"); // cobalt | emerald | violet | rose | amber | slate
```

Each theme maps to a `data-theme` attribute on `<html>` and overrides CSS variables:
```css
[data-theme="emerald"] {
  --primary: 160 84% 39%;
  --accent: 173 80% 40%;
  /* ... */
}
```

### Dark mode
Toggle via the moon/sun icon in the theme panel. Controlled via the `.dark` class on `<html>`.

### Adding a new theme
Add to `app/globals.css`:
```css
[data-theme="ocean"] {
  --primary: 200 100% 40%;
  --accent: 180 80% 45%;
  --ring: 200 100% 40%;
}
```
Add to `context/ThemeContext.tsx` `COLOR_THEMES` array and it will appear in the picker automatically.

---

## Connecting a real backend

All API calls are in `lib/api.ts`. Each function has a comment showing where to swap the mock for a real `fetchWithAuth` call:

```ts
// MOCK: replace with real call
const result = await fetchWithAuth<LoginResponse>("/auth/login", {
  method: "POST",
  body: JSON.stringify({ email, password }),
});
```

Set `NEXT_PUBLIC_API_URL` in `.env.local`:
```
NEXT_PUBLIC_API_URL=https://api.yourbackend.com
```

---

## Project Structure

```
skillbridge/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Landing
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── onboarding/page.tsx
│   ├── dashboard/page.tsx
│   ├── assessment/
│   │   ├── page.tsx        # Assessment list
│   │   └── [id]/page.tsx   # Assessment session
│   ├── certificate/[id]/page.tsx
│   ├── employer/page.tsx
│   ├── globals.css         # CSS variables & Tailwind base
│   └── layout.tsx          # Root layout with all providers
├── components/
│   ├── ui/                 # Headless UI components (shadcn-style)
│   ├── layout/             # Navbar, Footer
│   └── shared/             # QueryProvider, etc.
├── context/
│   ├── AuthContext.tsx      # Auth state
│   └── ThemeContext.tsx     # Color theme state
├── lib/
│   ├── api.ts              # All API calls (mock + real)
│   └── utils.ts            # cn(), formatDate(), etc.
├── types/index.ts          # All TypeScript interfaces
└── tailwind.config.ts      # Extended Tailwind config
```
