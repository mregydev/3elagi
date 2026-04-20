# Module structure

Every module must follow this exact folder shape:

    app/modules/<module>/
      components/     Vue SFCs with Props interfaces
      composables/    State and business logic hooks using Vue Query
      services/       Pure business logic — no Vue reactivity, no $fetch
      api/            Typed async $fetch functions only
      types/          TypeScript interfaces and types
      events/         CustomEvent payload interfaces
      __tests__/      Colocated component and composable tests

## Layer rules

- components  -> may import from composables, types, shadcn-vue only
- composables -> may import from services, api, types only
- services    -> may import from types only
- api         -> may import from types only
- nothing     -> may import from another module's internals

## Canonical component

Nuxt auto-imports Vue APIs and composables — do not manually import `ref`, `computed`, `onMounted`, etc.

    <script setup lang="ts">
    import { Button } from '~/components/ui/button'
    import { useDoctorProfile } from '../composables/useDoctorProfile'

    interface Props {
      doctorId: string
      showActions?: boolean
    }

    const props = withDefaults(defineProps<Props>(), {
      showActions: true,
    })

    const { doctor, isLoading } = useDoctorProfile(props.doctorId)
    </script>

    <template>
      <div v-if="isLoading">Loading...</div>
      <div v-else-if="doctor">
        <h2>{{ doctor.name }}</h2>
        <Button v-if="showActions">Book appointment</Button>
      </div>
    </template>

## Canonical composable

    import { useQuery } from '@tanstack/vue-query'
    import { fetchDoctorProfile } from '../api/doctorApi'
    import type { Doctor } from '../types'

    export function useDoctorProfile(doctorId: string) {
      const { data: doctor, isLoading, isError } = useQuery({
        queryKey: ['doctor', 'profile', doctorId] as const,
        queryFn: () => fetchDoctorProfile(doctorId),
      })

      return { doctor, isLoading, isError }
    }

## Canonical API function

Use `$fetch` — it throws on non-2xx automatically and returns typed JSON directly.

    import type { Doctor } from '../types'

    export async function fetchDoctorProfile(id: string): Promise<Doctor> {
      return $fetch<Doctor>(`/api/doctors/${id}`)
    }

## Canonical types

    export interface Doctor {
      id: string
      name: string
      specialty: string
      licenseNumber: string
    }
