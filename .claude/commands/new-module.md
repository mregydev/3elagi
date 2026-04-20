Scaffold a complete DDD module for: $ARGUMENTS

Create all files below. Replace <Module> with PascalCase and <module> with camelCase from $ARGUMENTS.

1. src/modules/<module>/types/index.ts
   Root entity interface with id, createdAt, updatedAt
   Create<Module>Input interface
   Update<Module>Input interface

2. src/modules/<module>/events/index.ts
   <Module>CreatedPayload interface
   <Module>UpdatedPayload interface
   <Module>DeletedPayload interface

3. src/modules/<module>/api/<module>Api.ts
   fetchAll, fetchById, create, update, deleteById
   All functions typed with interfaces from types/

4. src/modules/<module>/services/<module>Service.ts
   Pure business logic functions
   No Vue reactivity, no fetch calls

5. src/modules/<module>/composables/use<Module>List.ts
   useQuery with key ['<module>', 'list'] as const

6. src/modules/<module>/composables/use<Module>Detail.ts
   useQuery with key ['<module>', 'detail', id] as const

7. src/modules/<module>/composables/use<Module>Mutations.ts
   useMutation for create, update, delete
   Invalidate queries on success
   Dispatch domain event on success

8. src/modules/<module>/components/<Module>Card.vue
   Props interface with id prop
   Uses use<Module>Detail composable
   Uses shadcn-vue Card component

9. src/modules/<module>/components/<Module>Form.vue
   Props interface with optional initialData and onSubmit callback
   Uses shadcn-vue form primitives

10. src/modules/<module>/__tests__/<Module>Card.spec.ts
    Mock the api layer
    Test: renders correctly
    Test: loading state
    Test: error state

After creating all files print a summary tree.