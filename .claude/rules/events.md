# Cross-module event rules

Modules are isolated. The ONLY cross-module communication channel is `window.dispatchEvent`.

## SSR guard — required

`window` does not exist during SSR. Every dispatch and every `addEventListener` call must be inside an `import.meta.client` guard or a lifecycle hook that only runs on the client (`onMounted`).

## Forbidden

    // Never import another module's internals
    import { useAuthUser } from '../auth/composables/useAuthUser'
    import { patientService } from '../patient/services/patientService'

    // Never call window.* outside an import.meta.client guard or onMounted
    window.dispatchEvent(...)           // will crash on SSR
    window.addEventListener(...)        // will crash on SSR

## Correct — dispatching

    if (import.meta.client) {
      window.dispatchEvent(
        new CustomEvent<PaymentCompletedPayload>('payment:completed', {
          detail: { invoiceId, patientId, amount },
          bubbles: true,
        })
      )
    }

## Correct — listening (always clean up in onUnmounted)

    onMounted(() => window.addEventListener('auth:user-logged-in', handler))
    onUnmounted(() => window.removeEventListener('auth:user-logged-in', handler))

## Naming convention

Format: `module:action` in kebab-case.

| Event                         | Dispatched by | Payload                                  |
|-------------------------------|---------------|------------------------------------------|
| auth:user-logged-in           | auth          | { userId, role, token }                  |
| auth:user-logged-out          | auth          | { userId }                               |
| doctor:profile-updated        | doctor        | { doctorId }                             |
| doctor:appointment-requested  | doctor        | { doctorId, patientId, slotId }          |
| patient:registered            | patient       | { patientId }                            |
| patient:appointment-booked    | patient       | { appointmentId, patientId }             |
| payment:completed             | payment       | { invoiceId, patientId, amount }         |
| payment:failed                | payment       | { invoiceId, reason }                    |

## Payload interfaces

Define in the emitting module's `events/index.ts`:

    // app/modules/payment/events/index.ts
    export interface PaymentCompletedPayload {
      invoiceId: string
      patientId: string
      amount: number
    }
