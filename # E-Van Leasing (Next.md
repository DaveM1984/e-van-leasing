# E-Van Leasing (Next.js 14)

Production-ready scaffold for **e-van-leasing.co.uk** — inspired by best-practice van-leasing UX (mega-menu, hero search, faceted catalog, PDP with finance, compare). Original copy + components.

## Tech
- Next.js 14 (App Router), TypeScript, Tailwind
- Zustand (compare, finance), RHF + Zod (forms)
- MongoDB (optional; falls back to JSON), CSV importer
- Jest + RTL, Playwright
- ESLint, Prettier, Husky (pre-commit)
- SEO: Metadata API + JSON-LD, next-sitemap

## Quick start

```bash
pnpm dlx create-next-app@latest e-van-leasing --typescript --eslint --app --src-dir --tailwind --import-alias "@/*"
cd e-van-leasing
# Replace the scaffold with this repo's files, then:
pnpm add zustand zod react-hook-form class-variance-authority lucide-react mongodb next-sitemap
pnpm add -D @testing-library/react @testing-library/jest-dom jest ts-jest playwright eslint-config-next husky lint-staged csv-parse @types/csv-parse tsx
pnpm install
pnpm prepare