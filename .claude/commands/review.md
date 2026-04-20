Review the file or module at: $ARGUMENTS

Check every item below. For each failure include the file path, line number, violation, and corrected snippet.

TypeScript
- No `any` used anywhere
- Every component has interface Props
- Every composable has an explicit return type interface
- All API functions return Promise<T>

Module boundaries
- No imports from another module's composables/, services/, or api/
- Cross-module communication only via window.dispatchEvent
- No business logic inside .vue script setup blocks

API layer
- No fetch or axios in components or composables
- All fetching uses useQuery or useMutation
- Query keys follow ['module', 'resource', id?] as const
- Mutations invalidate queries on success
- Mutations dispatch domain event on success when relevant

Components
- Every .vue file has a colocated .spec.ts
- shadcn-vue used for all UI primitives
- No inline styles

Tests
- API layer is mocked — no real HTTP calls
- No wrapper.vm or Vue Test Utils selectors
- screen.findBy* used for async content
- Event listeners cleaned up after each test