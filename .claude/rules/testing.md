# Testing rules

- Vitest as test runner
- @testing-library/vue for mounting and asserting
- Never use wrapper.vm or Vue Test Utils selectors
- Every component must have a colocated __tests__/ComponentName.spec.ts
- Always access component by their roles , text or names  and avoid using test-id

## File location

    components/DoctorCard.vue  ->  __tests__/DoctorCard.spec.ts

## Canonical test

    import { describe, it, expect, vi, beforeEach } from 'vitest'
    import { render, screen } from '@testing-library/vue'
    import { userEvent } from '@testing-library/user-event'
    import { VueQueryPlugin } from '@tanstack/vue-query'
    import DoctorCard from '../components/DoctorCard.vue'

    vi.mock('../api/doctorApi', () => ({
      fetchDoctorProfile: vi.fn(),
    }))

    import { fetchDoctorProfile } from '../api/doctorApi'

    const mockDoctor = {
      id: '1',
      name: 'Dr. Sara Hassan',
      specialty: 'Cardiology',
      licenseNumber: 'LIC-001',
    }

    describe('DoctorCard', () => {
      beforeEach(() => {
        vi.mocked(fetchDoctorProfile).mockResolvedValue(mockDoctor)
      })

      it('renders doctor name after loading', async () => {
        render(DoctorCard, {
          props: { doctorId: '1' },
          global: { plugins: [VueQueryPlugin] },
        })
        expect(await screen.findByText('Dr. Sara Hassan')).toBeInTheDocument()
      })

      it('hides actions when showActions is false', async () => {
        render(DoctorCard, {
          props: { doctorId: '1', showActions: false },
          global: { plugins: [VueQueryPlugin] },
        })
        await screen.findByText('Dr. Sara Hassan')
        expect(screen.queryByRole('button', { name: /book/i })).not.toBeInTheDocument()
      })
    })

## Rules

- Always mock the api/ layer — no real HTTP calls in tests
- Use screen.findBy* (async) when component fetches data
- Use screen.getBy* (sync) for static content
- Clean up window event listeners after each test
- One describe per component, one it per behavior