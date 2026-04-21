<script setup lang="ts">
const { t, tm, locale } = useI18n()

export interface CalendarValue {
  day: string
  date: string
  month: string
  year: number
  time: string
}

interface Props {
  modelValue?: CalendarValue
  morningSlots?: string[]
  afternoonSlots?: string[]
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
})

const emit = defineEmits<{
  'update:modelValue': [CalendarValue]
}>()

const today = new Date()

const dateLocale = computed(() => (locale.value === 'ar' ? 'ar-EG' : 'en-US'))

function formatMonthLong(month: number, year: number) {
  return new Intl.DateTimeFormat(dateLocale.value, { month: 'long' }).format(new Date(year, month, 1))
}

function formatMonthShort(month: number, year: number) {
  return new Intl.DateTimeFormat(dateLocale.value, { month: 'short' }).format(new Date(year, month, 1))
}

function formatWeekdayShort(dateObj: Date) {
  return new Intl.DateTimeFormat(dateLocale.value, { weekday: 'short' }).format(dateObj)
}

const morningTimes = computed(() => {
  if (props.morningSlots?.length) return props.morningSlots
  const raw = tm('calendar.morningTimes')
  return Array.isArray(raw) ? (raw as string[]) : []
})

const afternoonTimes = computed(() => {
  if (props.afternoonSlots?.length) return props.afternoonSlots
  const raw = tm('calendar.afternoonTimes')
  return Array.isArray(raw) ? (raw as string[]) : []
})

const months = computed(() =>
  Array.from({ length: 6 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1)
    return {
      full: formatMonthLong(d.getMonth(), d.getFullYear()),
      month: d.getMonth(),
      year: d.getFullYear(),
    }
  }),
)

const selectedMonthIdx = ref(0)
const selectedDayIdx = ref(0)
const selectedTime = ref(props.modelValue?.time ?? '')

const daysInSelectedMonth = computed(() => {
  const m = months.value[selectedMonthIdx.value]
  if (!m) return []
  const { month, year } = m
  const startDay = selectedMonthIdx.value === 0 ? today.getDate() : 1
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days: CalendarValue[] = []
  for (let d = startDay; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d)
    days.push({
      day: formatWeekdayShort(dateObj),
      date: String(d),
      month: formatMonthShort(month, year),
      year,
      time: selectedTime.value,
    })
  }
  return days
})

watch(
  [morningTimes, afternoonTimes, () => props.modelValue?.time],
  () => {
    const all = [...morningTimes.value, ...afternoonTimes.value]
    if (!all.length) return
    const preferred = props.modelValue?.time
    if (preferred && all.includes(preferred)) {
      selectedTime.value = preferred
      return
    }
    if (!selectedTime.value || !all.includes(selectedTime.value)) {
      selectedTime.value = morningTimes.value[0] ?? all[0]!
    }
  },
  { immediate: true },
)

// Scroll refs for months and days rows
const monthsScrollRef = ref<HTMLElement | null>(null)
const daysScrollRef = ref<HTMLElement | null>(null)

function scrollRow(el: HTMLElement | null, dir: 'left' | 'right') {
  if (!el) return
  el.scrollBy({ left: dir === 'left' ? -160 : 160, behavior: 'smooth' })
}

function emitChange() {
  const day = daysInSelectedMonth.value[selectedDayIdx.value]
  if (!day) return
  emit('update:modelValue', { day: day.day, date: day.date, month: day.month, year: day.year, time: selectedTime.value })
}

function selectMonth(idx: number) {
  selectedMonthIdx.value = idx
  selectedDayIdx.value = 0
  emitChange()
}

function selectDay(idx: number) {
  selectedDayIdx.value = idx
  emitChange()
}

function selectTime(timeStr: string) {
  selectedTime.value = timeStr
  emitChange()
}

onMounted(() => emitChange())
</script>

<template>
  <div class="cal-root" :class="{ compact }">

    <!-- ── Months ─────────────────────────────────── -->
    <div class="cal-section">
      <span class="cal-label">{{ t('calendar.month') }}</span>
      <div class="scroll-track">
        <button class="nav-arrow cn-rtl-flip" :aria-label="t('calendar.prev')" @click="scrollRow(monthsScrollRef, 'left')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <div ref="monthsScrollRef" class="scroll-row">
          <button
            v-for="(m, i) in months"
            :key="m.full"
            class="month-chip"
            :class="{ active: selectedMonthIdx === i }"
            @click="selectMonth(i)"
          >
            {{ m.full }}
          </button>
        </div>
        <button class="nav-arrow cn-rtl-flip" :aria-label="t('calendar.next')" @click="scrollRow(monthsScrollRef, 'right')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>

    <!-- ── Days ───────────────────────────────────── -->
    <div class="cal-section">
      <span class="cal-label">{{ t('calendar.day') }}</span>
      <div class="scroll-track">
        <button class="nav-arrow cn-rtl-flip" :aria-label="t('calendar.prev')" @click="scrollRow(daysScrollRef, 'left')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <div ref="daysScrollRef" class="scroll-row">
          <button
            v-for="(d, i) in daysInSelectedMonth"
            :key="`${d.month}-${d.date}`"
            class="day-chip"
            :class="{ active: selectedDayIdx === i }"
            @click="selectDay(i)"
          >
            <span class="day-name">{{ d.day }}</span>
            <span class="day-num">{{ d.date }}</span>
          </button>
        </div>
        <button class="nav-arrow cn-rtl-flip" :aria-label="t('calendar.next')" @click="scrollRow(daysScrollRef, 'right')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>

    <!-- ── Morning times ──────────────────────────── -->
    <div class="cal-section">
      <span class="cal-label">{{ t('calendar.morning') }}</span>
      <div class="times-wrap">
        <button
          v-for="slot in morningTimes"
          :key="slot"
          class="time-chip"
          :class="{ active: selectedTime === slot }"
          @click="selectTime(slot)"
        >
          {{ slot }}
        </button>
      </div>
    </div>

    <!-- ── Afternoon & Evening times ─────────────── -->
    <div class="cal-section">
      <span class="cal-label">{{ t('calendar.afternoonEvening') }}</span>
      <div class="times-wrap">
        <button
          v-for="slot in afternoonTimes"
          :key="slot"
          class="time-chip"
          :class="{ active: selectedTime === slot }"
          @click="selectTime(slot)"
        >
          {{ slot }}
        </button>
      </div>
    </div>

  </div>
</template>

<style scoped>
.cal-root {
  display: flex;
  flex-direction: column;
  gap: 22px;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
}
.cal-root.compact { gap: 16px; }

/* ── Section ──────────────────────────────────────── */
.cal-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  width: 100%;
  max-width: 100%;
}

.cal-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--gray-3);
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

/* ── Scroll track (arrows + row) ─────────────────── */
.scroll-track {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  width: 100%;
  max-width: 100%;
}

/* ── Nav arrows ───────────────────────────────────── */
.nav-arrow {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1.5px solid var(--gray-1);
  background: var(--white);
  color: var(--gray-3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.nav-arrow:hover {
  border-color: var(--blue-m);
  color: var(--blue-m);
}

/* ── Scrollable row ───────────────────────────────── */
.scroll-row {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: row;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 2px;
  scrollbar-width: none;
  overscroll-behavior-x: contain;
}
.scroll-row::-webkit-scrollbar { display: none; }

/* ── Month chip ───────────────────────────────────── */
.month-chip {
  flex-shrink: 0;
  height: 32px;
  padding: 0 16px;
  border-radius: 99px;
  border: 1.5px solid var(--gray-1);
  background: var(--white);
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-4);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.15s;
}
.month-chip.active {
  background: var(--blue-m);
  border-color: var(--blue-m);
  color: var(--white);
  font-weight: 700;
}
.month-chip:hover:not(.active) {
  border-color: var(--blue-m);
  color: var(--blue-m);
}

/* ── Day chip ─────────────────────────────────────── */
.day-chip {
  flex-shrink: 0;
  width: 52px;
  height: 64px;
  border-radius: 99px;
  border: 1.5px solid var(--gray-1);
  background: var(--white);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  cursor: pointer;
  transition: all 0.15s;
}
.day-chip.active {
  background: var(--blue-m);
  border-color: var(--blue-m);
}
.day-chip:hover:not(.active) { border-color: var(--blue-m); }

.day-name {
  font-size: 10px;
  font-weight: 700;
  color: var(--gray-3);
  letter-spacing: 0.5px;
}
.day-chip.active .day-name { color: rgba(255, 255, 255, 0.8); }

.day-num {
  font-size: 17px;
  font-weight: 800;
  color: var(--ink);
  line-height: 1;
}
.day-chip.active .day-num { color: var(--white); }

/* ── Time chips — wrapped ─────────────────────────── */
.times-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;
  max-width: 100%;
}

.time-chip {
  flex-shrink: 0;
  height: 36px;
  padding: 0 14px;
  border-radius: 8px;
  border: 1.5px solid var(--gray-1);
  background: var(--white);
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-4);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.15s;
}
.time-chip.active {
  background: var(--blue-xl);
  border-color: var(--blue-m);
  color: var(--blue-m);
  font-weight: 700;
}
.time-chip:hover:not(.active) {
  border-color: var(--blue-m);
  color: var(--blue-m);
}

/* ── Compact tweaks ───────────────────────────────── */
.compact .month-chip { height: 28px; padding: 0 12px; font-size: 12px; }
.compact .day-chip { width: 46px; height: 56px; }
.compact .day-num { font-size: 15px; }
.compact .time-chip { height: 32px; padding: 0 12px; font-size: 12px; }
.compact .nav-arrow { width: 24px; height: 24px; }

/* ── Desktop ──────────────────────────────────────── */
@media (min-width: 768px) {
  .cal-root { gap: 28px; }
  .scroll-row { gap: 10px; }

  .nav-arrow { width: 32px; height: 32px; }

  .month-chip { height: 36px; font-size: 14px; padding: 0 18px; }

  .day-chip { width: 58px; height: 72px; }
  .day-name { font-size: 11px; }
  .day-num { font-size: 20px; }

  .times-wrap { gap: 10px; }
  .time-chip { height: 40px; padding: 0 18px; font-size: 14px; }
}
</style>
