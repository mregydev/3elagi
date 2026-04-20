Generate a new Vue component with its test file.

Usage: /project:new-component <ComponentName> <module>
Arguments: $ARGUMENTS — first word is ComponentName, second is module name

1. Create src/modules/<module>/components/<ComponentName>.vue
   interface Props with all required and optional props typed
   withDefaults for optional props
   shadcn-vue primitives for all UI elements
   No business logic — delegate to composables
   Cross-module side effects via window.dispatchEvent only

2. Create src/modules/<module>/__tests__/<ComponentName>.spec.ts
   Mock the api/ layer with vi.mock
   Wrap with VueQueryPlugin
   Test: renders with required props
   Test: loading state
   Test: user interaction
   Test: event dispatch if applicable
   Use screen.findBy* for async, getBy* for static

Confirm when done: "Created <ComponentName>.vue and <ComponentName>.spec.ts in module <module>"