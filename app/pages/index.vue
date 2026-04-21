<script setup lang="ts">
import DoctorListRow from '~/modules/doctor/components/DoctorListRow.vue'
import FilterChip from '~/modules/doctor/components/FilterChip.vue'
import type { Doctor } from '~/modules/doctor/types'

const { t } = useI18n()

useHead({ title: computed(() => t('meta.home')) })

const filterChipKeys = ['all', 'cardiology', 'pediatrics', 'orthopedics', 'dermatology', 'ent'] as const
const activeFilterKey = ref<(typeof filterChipKeys)[number]>('all')

const sidebarSpecialtyKeys = ['cardiology', 'pediatrics', 'orthopedics', 'dermatology', 'ent', 'ophthalmology', 'neurology'] as const
const selectedSpecialties = ref<string[]>([])

function toggleSpecialty(s: string) {
  const idx = selectedSpecialties.value.indexOf(s)
  if (idx === -1) selectedSpecialties.value.push(s)
  else selectedSpecialties.value.splice(idx, 1)
}

const activeAvailabilityIdx = ref(0)

const ratingOptions = computed(() => [
  { label: t('home.fiveStars'), value: 5 },
  { label: t('home.fourPlus'), value: 4 },
  { label: t('home.threePlus'), value: 3 },
])
const activeRating = ref(5)

const filterTelemedicine = ref(false)
const filterFollowup = ref(false)

const activeSortIdx = ref(0)

const currentPage = ref(1)
const totalPages = 6

async function goToPage(p: number) {
  if (p < 1 || p > totalPages) return
  currentPage.value = p
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
  await nextTick()
  const active = pgNumbersRef.value?.querySelector<HTMLElement>('.pg-btn.active')
  active?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
}

const pageNumbers = computed(() => {
  const pages: (number | '…')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
    return pages
  }
  pages.push(1)
  if (currentPage.value > 3) pages.push('…')
  const start = Math.max(2, currentPage.value - 1)
  const end = Math.min(totalPages - 1, currentPage.value + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (currentPage.value < totalPages - 2) pages.push('…')
  pages.push(totalPages)
  return pages
})

const doctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sara Ahmed',
    specialty: 'cardiologist',
    clinic: 'ainShams',
    rating: 5,
    availability: 'today',
    fee: '350 EGP',
    experience: 12,
    about: 'Board-certified cardiologist at Ain Shams Hospital. Specializes in preventive cardiology and echocardiography. Fluent in Arabic and English.',
    location: 'Ain Shams Hospital, Abbassia, Cairo',
    patients: '1,200+',
    languages: ['arabic', 'english'],
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&q=80',
    procedures: ['echo', 'stress', 'angio', 'holter'],
    telemedicine: true,
    followup: true,
  },
  {
    id: '2',
    name: 'Dr. Omar Fawzy',
    specialty: 'pediatrician',
    clinic: 'maadiChildren',
    rating: 4,
    availability: 'today',
    fee: '200 EGP',
    experience: 8,
    location: 'Maadi, Cairo',
    patients: '850+',
    languages: ['arabic'],
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&q=80',
    procedures: ['vax', 'growth', 'newborn'],
    telemedicine: true,
    followup: false,
  },
  {
    id: '3',
    name: 'Dr. Nour Khalil',
    specialty: 'dermatologist',
    clinic: 'cairoSkin',
    rating: 4,
    availability: 'tomorrow',
    fee: '280 EGP',
    experience: 6,
    location: 'Heliopolis, Cairo',
    patients: '600+',
    languages: ['arabic', 'english'],
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&q=80',
    procedures: ['laser', 'peel', 'acne', 'mole'],
    telemedicine: false,
    followup: true,
  },
  {
    id: '4',
    name: 'Dr. Amr Hassan',
    specialty: 'orthopedic',
    clinic: 'cleopatra',
    rating: 5,
    availability: 'today',
    fee: '450 EGP',
    experience: 15,
    location: 'Cleopatra Hospital, Heliopolis, Cairo',
    patients: '2,000+',
    languages: ['arabic', 'english'],
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&h=200&fit=crop&q=80',
    procedures: ['joint', 'arth', 'fracture', 'sports'],
    telemedicine: false,
    followup: true,
  },
]

const searchQuery = ref('')

const availabilityLabels = computed(() => [
  t('home.anyTime'),
  t('home.today'),
  t('home.tomorrow'),
  t('home.thisWeek'),
])

const sortLabels = computed(() => [
  t('home.relevance'),
  t('home.rating'),
  t('home.priceLow'),
])

const chipsRef = ref<HTMLElement | null>(null)
const pgNumbersRef = ref<HTMLElement | null>(null)

function scrollChips(dir: number) {
  if (!chipsRef.value) return
  chipsRef.value.scrollBy({ left: dir * 150, behavior: 'smooth' })
}
</script>

<template>
  <div class="page">
    <AppNavBar />

    <!-- Mobile: search + filter chips -->
    <div class="mobile-search-bar">
      <div class="search-input">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2.5">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input v-model="searchQuery" :placeholder="t('home.searchMobile')" />
      </div>
      <div class="chips-wrap">
        <button class="chips-arrow" aria-label="previous" @click="scrollChips(-1)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <div ref="chipsRef" class="filter-chips">
          <FilterChip
            v-for="key in filterChipKeys"
            :key="key"
            :label="key === 'all' ? t('filter.all') : t(`filter.${key}`)"
            :active="activeFilterKey === key"
            @click="activeFilterKey = key"
          />
        </div>
        <button class="chips-arrow" aria-label="next" @click="scrollChips(1)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Desktop: content with sidebar -->
    <div class="content-area">

      <!-- Sidebar (desktop only) -->
      <aside class="sidebar">

        <!-- Specialty — checkboxes -->
        <div class="sidebar-section">
          <span class="section-label">{{ t('home.specialty') }}</span>
          <label
            v-for="s in sidebarSpecialtyKeys"
            :key="s"
            class="sidebar-check"
          >
            <span
              class="checkbox"
              :class="{ checked: selectedSpecialties.includes(s) }"
              @click="toggleSpecialty(s)"
            >
              <svg v-if="selectedSpecialties.includes(s)" width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="white" stroke-width="1.8" stroke-linecap="round" />
              </svg>
            </span>
            <span class="sidebar-item-text">{{ t(`filter.${s}`) }}</span>
          </label>
        </div>

        <div class="sidebar-divider" />

        <!-- Availability -->
        <div class="sidebar-section">
          <span class="section-label">{{ t('home.availability') }}</span>
          <label
            v-for="(a, i) in availabilityLabels"
            :key="a"
            class="sidebar-check"
          >
            <span
              class="radio"
              :class="{ checked: activeAvailabilityIdx === i }"
              @click="activeAvailabilityIdx = i"
            />
            <span class="sidebar-item-text">{{ a }}</span>
          </label>
        </div>

        <div class="sidebar-divider" />

        <!-- Consultation type -->
        <div class="sidebar-section">
          <span class="section-label">{{ t('home.consultationType') }}</span>
          <label class="sidebar-check">
            <span
              class="checkbox"
              :class="{ checked: filterTelemedicine }"
              @click="filterTelemedicine = !filterTelemedicine"
            >
              <svg v-if="filterTelemedicine" width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="white" stroke-width="1.8" stroke-linecap="round" />
              </svg>
            </span>
            <span class="sidebar-item-text">
              <span class="consult-icon">📹</span> {{ t('home.telemedicine') }}
            </span>
          </label>
          <label class="sidebar-check">
            <span
              class="checkbox"
              :class="{ checked: filterFollowup }"
              @click="filterFollowup = !filterFollowup"
            >
              <svg v-if="filterFollowup" width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="white" stroke-width="1.8" stroke-linecap="round" />
              </svg>
            </span>
            <span class="sidebar-item-text">
              <span class="consult-icon">🔁</span> {{ t('home.followUpVisits') }}
            </span>
          </label>
        </div>

        <div class="sidebar-divider" />

        <!-- Rating -->
        <div class="sidebar-section">
          <span class="section-label">{{ t('home.ratingLabel') }}</span>
          <label
            v-for="r in ratingOptions"
            :key="r.value"
            class="sidebar-check"
          >
            <span
              class="radio"
              :class="{ checked: activeRating === r.value }"
              @click="activeRating = r.value"
            />
            <StarRating :value="r.value" :size="11" />
            <span class="sidebar-item-text">{{ r.label }}</span>
          </label>
        </div>

      </aside>

      <!-- Main results -->
      <div class="main">

        <!-- Desktop search bar -->
        <div class="desktop-search-bar">
          <div class="search-input desktop">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2.5">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input v-model="searchQuery" :placeholder="t('home.searchDesktop')" />
          </div>
          <button class="search-btn">{{ t('home.searchBtn') }}</button>
        </div>

        <!-- Results header -->
        <div class="results-header">
          <span class="results-count">
            <span class="mobile-count">24 {{ t('home.doctorsFound') }}</span>
            <span class="desktop-count">{{ t('home.showing') }} <strong>24 {{ t('home.doctors') }}</strong> {{ t('home.inCairo') }}</span>
          </span>
          <div class="sort-row">
            <button class="sort-filter-btn mobile-only">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.5">
                <line x1="4" y1="6" x2="11" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="13" y1="18" x2="20" y2="18" />
              </svg>
              {{ t('home.sortFilter') }}
            </button>
            <div class="sort-tabs desktop-only">
              <button
                v-for="(s, i) in sortLabels"
                :key="s"
                class="sort-tab"
                :class="{ active: activeSortIdx === i }"
                @click="activeSortIdx = i"
              >{{ s }}</button>
            </div>
          </div>
        </div>

        <!-- Cards -->
        <div class="results-list">
          <DoctorListRow
            v-for="doc in doctors"
            :key="doc.id"
            :doctor="doc"
          />
        </div>

        <!-- Pagination -->
        <div class="pagination">
          <!-- Prev — always points left ← -->
          <button
            class="pg-arrow"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <div ref="pgNumbersRef" class="pg-numbers">
            <template v-for="p in pageNumbers" :key="p">
              <span v-if="p === '…'" class="pg-ellipsis">…</span>
              <button
                v-else
                class="pg-btn"
                :class="{ active: currentPage === p }"
                @click="goToPage(p as number)"
              >{{ p }}</button>
            </template>
          </div>

          <!-- Next — always points right → -->
          <button
            class="pg-arrow"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--gray-0);
}

/* ── Mobile search bar ──────────────────────────── */
.mobile-search-bar {
  background: var(--white);
  border-bottom: 1px solid var(--gray-1);
  padding: 14px 16px;
}

.search-input {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1.5px solid var(--gray-1);
  border-radius: 10px;
  background: var(--white);
  padding: 0 14px;
  height: 42px;
}

.search-input input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 15px;
  color: var(--ink);
  background: transparent;
  line-height: 1.5;
}

.search-input input::placeholder { color: var(--gray-2); }

.chips-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  /* Force LTR so ← is always on the left and → always on the right */
  direction: ltr;
}

.chips-arrow {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1.5px solid var(--gray-1);
  background: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  color: var(--gray-3);
  transition: all 0.15s;
}

.chips-arrow:hover {
  border-color: var(--blue-m);
  color: var(--blue-m);
}

.filter-chips {
  flex: 1;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 2px;
  scrollbar-width: none;
  direction: rtl; /* restore document direction inside ltr chips-wrap */
}
.filter-chips::-webkit-scrollbar { display: none; }

/* ── Content area ────────────────────────────────── */
.content-area {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* ── Sidebar ─────────────────────────────────────── */
.sidebar { display: none; }

.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.section-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--gray-3);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 10px;
  display: block;
}

.sidebar-check {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 7px 10px;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.12s;
}
.sidebar-check:hover { background: var(--gray-0); }

.checkbox {
  width: 17px;
  height: 17px;
  border-radius: 5px;
  border: 1.5px solid var(--gray-2);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.12s;
}
.checkbox.checked { background: var(--blue-m); border-color: var(--blue-m); }

.radio {
  width: 17px;
  height: 17px;
  border-radius: 50%;
  border: 1.5px solid var(--gray-2);
  background: transparent;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.12s;
}
.radio.checked { background: var(--blue-m); border-color: var(--blue-m); }

.sidebar-item-text {
  font-size: 14px;
  color: var(--gray-4);
  line-height: 1.5;
  display: flex;
  align-items: center;
  gap: 6px;
}

.consult-icon { font-size: 14px; }

.sidebar-divider { height: 1px; background: var(--gray-1); }

/* ── Main results ─────────────────────────────────── */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.desktop-search-bar { display: none; }

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px 6px;
}

.results-count { font-size: 14px; color: var(--gray-2); }
.desktop-count { display: none; }
.desktop-count strong { color: var(--ink); font-weight: 600; }

.sort-filter-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: var(--blue-m);
}

.sort-tabs { display: none; }
.desktop-only { display: none; }

.results-list {
  padding: 8px 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* ── Desktop layout ───────────────────────────────── */
@media (min-width: 1024px) {
  .mobile-search-bar { display: none; }

  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 260px;
    background: var(--white);
    border-inline-end: 1px solid var(--gray-1);
    padding: 28px 22px;
    overflow-y: auto;
    flex-shrink: 0;
  }

  .desktop-search-bar {
    display: flex;
    gap: 12px;
    padding: 18px 28px;
    border-bottom: 1px solid var(--gray-1);
    background: var(--white);
  }

  .search-input.desktop { flex: 1; height: 44px; }

  .search-btn {
    height: 44px;
    padding: 0 24px;
    border-radius: 10px;
    background: var(--blue-m);
    border: 1.5px solid var(--blue-m);
    color: var(--white);
    font-size: 15px;
    font-weight: 600;
    flex-shrink: 0;
    cursor: pointer;
    transition: background 0.15s;
  }
  .search-btn:hover { background: var(--blue); border-color: var(--blue); }

  .results-header { padding: 18px 28px 10px; }
  .results-count { font-size: 15px; color: var(--gray-3); }
  .mobile-count { display: none; }
  .desktop-count { display: inline; }

  .mobile-only { display: none !important; }
  .desktop-only { display: flex !important; }

  .sort-tabs { display: flex; gap: 8px; }
  .sort-tab {
    padding: 7px 16px;
    border-radius: 8px;
    border: 1px solid var(--gray-1);
    background: var(--white);
    font-size: 13px;
    color: var(--gray-4);
    cursor: pointer;
    transition: all 0.12s;
  }
  .sort-tab.active {
    border-color: var(--blue-m);
    background: var(--blue-xl);
    color: var(--blue-m);
    font-weight: 600;
  }

  .results-list {
    padding: 24px 28px 0;
    max-width: 1120px;
    margin: 0 auto;
    width: 100%;
  }
}

/* ── Mobile/tablet: no horizontal overflow ─────────── */
@media (max-width: 1023px) {
  .page { overflow-x: hidden; }

  .results-header {
    width: 90%;
    margin-inline: auto;
    padding-inline: 0;
  }

  .pagination {
    gap: 8px;
    padding-inline: 12px;
  }

  .pg-numbers {
    flex: 1;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    padding: 4px 2px;
    gap: 6px;
    justify-content: flex-start;
  }

  .pg-numbers::-webkit-scrollbar { display: none; }

  .pg-btn { scroll-snap-align: center; flex-shrink: 0; }
  .pg-ellipsis { flex-shrink: 0; }
}

/* ── Pagination ───────────────────────────────────── */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 24px 16px 32px;
  /* Force LTR so ← is always on the left and → always on the right */
  direction: ltr;
}

.pg-numbers {
  display: flex;
  align-items: center;
  gap: 6px;
}

.pg-btn {
  min-width: 40px;
  height: 40px;
  padding: 0 6px;
  border-radius: 10px;
  border: 1.5px solid var(--gray-1);
  background: var(--white);
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-4);
  cursor: pointer;
  transition: all 0.15s;
  line-height: 1;
}

.pg-btn:hover:not(.active) {
  border-color: var(--blue-m);
  color: var(--blue-m);
}

.pg-btn.active {
  background: var(--blue-m);
  border-color: var(--blue-m);
  color: var(--white);
  font-weight: 700;
}

.pg-arrow {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1.5px solid var(--gray-1);
  background: var(--white);
  color: var(--gray-3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;
}

.pg-arrow:hover:not(:disabled) {
  border-color: var(--blue-m);
  color: var(--blue-m);
}

.pg-arrow:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.pg-ellipsis {
  font-size: 15px;
  color: var(--gray-3);
  padding: 0 4px;
  user-select: none;
}

@media (min-width: 1024px) {
  .pagination {
    padding: 28px 28px 40px;
    gap: 8px;
  }

  .pg-btn {
    min-width: 44px;
    height: 44px;
    font-size: 15px;
  }

  .pg-arrow {
    width: 44px;
    height: 44px;
  }
}
</style>
