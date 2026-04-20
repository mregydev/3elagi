Generate a new typed composable.

Usage: /project:new-composable <composableName> <module>
Arguments: $ARGUMENTS — first word is composableName, second is module name

Create src/modules/<module>/composables/<composableName>.ts with:

- Explicit return type interface named Use<Name>Return
- If it fetches: useQuery with key ['<module>', '<resource>'] as const
- If it mutates: useMutation with onSuccess that invalidates queries and dispatches event
- All state wrapped in readonly() at the return site
- No fetch calls — import from the module's api/ layer only
- No imports from other modules

Example shape:

    import { useQuery } from '@tanstack/vue-query'
    import { fetchPatientList } from '../api/patientApi'
    import type { Patient } from '../types'

    interface UsePatientListReturn {
      patients: Readonly<Ref<Patient[]>>
      isLoading: Readonly<Ref<boolean>>
      isError: Readonly<Ref<boolean>>
    }

    export function usePatientList(): UsePatientListReturn {
      const { data: patients, isLoading, isError } = useQuery({
        queryKey: ['patient', 'list'] as const,
        queryFn: fetchPatientList,
      })

      return { patients, isLoading, isError }
    }