# API layer rules

All data fetching must go through Vue Query. No `$fetch` or axios calls directly inside components or composables — only in the api/ layer.

## Query key pattern

    ['doctor', 'list']                      // collection
    ['doctor', 'profile', doctorId]         // single resource
    ['patient', 'appointments', patientId]  // nested resource

Always append `as const` to query key arrays.

## API layer — use $fetch, typed async functions only, no Vue reactivity

`$fetch` is Nuxt's HTTP client (oFetch). It:
- Throws automatically on non-2xx — no manual `if (!res.ok)` needed
- Handles SSR base URL and forwarded cookies transparently
- Returns typed JSON directly — no `.json()` call needed

    import type { Patient, CreatePatientInput } from '../types'

    export async function fetchPatient(id: string): Promise<Patient> {
      return $fetch<Patient>(`/api/patients/${id}`)
    }

    export async function createPatient(input: CreatePatientInput): Promise<Patient> {
      return $fetch<Patient>('/api/patients', {
        method: 'POST',
        body: input,
      })
    }

## Mutation pattern — invalidate and dispatch on success

    const { mutate, isPending } = useMutation({
      mutationFn: createInvoice,
      onSuccess: (invoice) => {
        queryClient.invalidateQueries({ queryKey: ['payment', 'invoice'] as const })
        if (import.meta.client) {
          window.dispatchEvent(
            new CustomEvent<PaymentCompletedPayload>('payment:completed', {
              detail: { invoiceId: invoice.id, patientId: invoice.patientId, amount: invoice.amount },
              bubbles: true,
            })
          )
        }
      },
    })
