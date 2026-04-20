# Project overview

This is a **Nuxt 4** + TypeScript healthcare platform built with Domain-Driven Design (DDD).
The project is organized into four bounded contexts: Authentication, Doctor, Patient, and Payment.
Each module is fully self-contained and isolated from other modules.

## Tech stack

- Nuxt 4 with Vue 3 Composition API and `<script setup>`
- TypeScript strict mode — no `any` allowed
- @tanstack/vue-query for ALL async data fetching (see data-fetching policy below)
- shadcn-vue as the design system — use its primitives before building custom UI
- Vitest + @testing-library/vue for all component tests
- Composables handle module-level state — Pinia is NOT used
- `$fetch` (Nuxt's oFetch wrapper) for all HTTP calls in the api/ layer — never raw `fetch`

## Project structure

    app/
      modules/
        auth/
        doctor/
        patient/
        payment/
      pages/          ← Nuxt file-based routing — no manual router setup
      plugins/        ← Nuxt plugins (e.g. Vue Query registration)
      middleware/     ← Route middleware (auth guards, etc.)
      shared/
        types/
        components/

## Nuxt-specific rules — never violate

1. Use `~/` or `@/` path aliases — both resolve to the `app/` directory
2. Never use `process.env` on the client — use `useRuntimeConfig()` instead
3. All `window.*` calls must be guarded with `if (import.meta.client)` — SSR will crash otherwise
4. Use `$fetch` in the api/ layer — it handles base URL, SSR cookies, and throws on non-2xx automatically
5. Nuxt auto-imports Vue APIs (`ref`, `computed`, `onMounted`, etc.) and composables in `composables/` — do not manually import these
6. Route middleware lives in `app/middleware/` — never inside a module

## Data-fetching policy

| Use case | Tool |
|---|---|
| Component-level fetching with caching, pagination, or mutations | Vue Query (`useQuery` / `useMutation`) |
| One-off SSR data needed for initial page render | `useAsyncData` / `useFetch` (Nuxt built-ins) |
| Raw HTTP in the api/ layer | `$fetch` only |

Never mix: composables that wrap Vue Query must call api/ functions using `$fetch`, not `useFetch`.

## Architecture rules — never violate

1. Each module owns its own components, composables, services, api, types, and events
2. Modules never import from each other's internals
3. Cross-module communication uses `window.dispatchEvent` only — always guard with `import.meta.client`
4. All HTTP calls go through Vue Query — no `$fetch` calls directly inside components or composables
5. Every component has a Props interface and a colocated .spec.ts test file
6. Pages import only from module components and composables — no business logic in pages

## Module list

| Module  | Responsibility                                      |
|---------|-----------------------------------------------------|
| auth    | Login, registration, token management, user session |
| doctor  | Doctor profiles, schedules, availability            |
| patient | Patient records, medical history, appointments      |
| payment | Billing, invoices, payment processing               |
