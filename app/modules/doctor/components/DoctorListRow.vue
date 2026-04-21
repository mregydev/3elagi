<script setup lang="ts">
import { Calendar } from '~/components/ui/calendar'
import type { CalendarValue } from '~/components/ui/calendar'
import type { Doctor } from '~/modules/doctor/types'

interface Props {
  doctor: Doctor
}

const props = defineProps<Props>()

const { t, te } = useI18n()
const selected = ref<CalendarValue | undefined>(undefined)

function trSpecialty(key: string) {
  return te(`demo.specialty.${key}`) ? t(`demo.specialty.${key}`) : key
}
function trClinic(key: string) {
  return te(`demo.clinic.${key}`) ? t(`demo.clinic.${key}`) : key
}
function trProcedure(key: string) {
  return te(`demo.procedure.${key}`) ? t(`demo.procedure.${key}`) : key
}
function trLang(code: string) {
  return te(`langs.${code}`) ? t(`langs.${code}`) : code
}

function handleChange(val: CalendarValue) {
  selected.value = val
}
</script>

<template>
  <section class="row">

    <!-- Left: doctor summary -->
    <div class="left">
      <NuxtLink :to="`/doctors/${props.doctor.id}`" class="doctor-link">
        <img
          class="photo"
          :src="props.doctor.image ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(props.doctor.name)}&background=DBEAFE&color=2563EB&size=96`"
          :alt="`Photo of ${props.doctor.name}`"
          loading="lazy"
          decoding="async"
        />
        <div class="meta">
          <span class="name">{{ props.doctor.name }}</span>
          <span class="spec">{{ trSpecialty(props.doctor.specialty) }} · {{ trClinic(props.doctor.clinic) }}</span>
          <div class="rating">
            <StarRating :value="props.doctor.rating" :size="13" />
            <span class="rating-text">{{ props.doctor.rating }}.0 · {{ t('doctor.expYearsShort', { n: props.doctor.experience }) }}</span>
          </div>
          <!-- Procedure tags — directly under rating -->
          <div v-if="props.doctor.procedures?.length" class="procedures">
            <span
              v-for="p in props.doctor.procedures"
              :key="p"
              class="proc-tag"
            >{{ trProcedure(p) }}</span>
          </div>
        </div>
      </NuxtLink>

      <!-- Availability + telemedicine + followup + fee row -->
      <div class="chips">
        <div class="badge-group">
          <span
            class="avail-tag"
            :class="props.doctor.availability === 'today' ? 'green' : 'yellow'"
          >{{ props.doctor.availability === 'today' ? t('doctor.availableToday') : t('doctor.tomorrow') }}</span>
          <span v-if="props.doctor.telemedicine" class="badge tele">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M15 10l4.553-2.276A1 1 0 0 1 21 8.723v6.554a1 1 0 0 1-1.447.894L15 14M3 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" />
            </svg>
            {{ t('doctor.telemedicine') }}
          </span>
          <span v-if="props.doctor.followup" class="badge followup">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M1 4v6h6M23 20v-6h-6" />
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" />
            </svg>
            {{ t('doctor.followUp') }}
          </span>
        </div>
        <div class="fee-block">
          <span class="fee-amount">{{ props.doctor.fee }}</span>
          <span class="fee-label">{{ t('doctor.perVisit') }}</span>
        </div>
      </div>
    </div>

    <!-- Right: appointment selection -->
    <div class="right">
      <span class="picker-title">{{ t('doctor.selectAppointment') }}</span>

      <Calendar
        :compact="true"
        @update:model-value="handleChange"
      />

      <div class="cta">
        <div class="summary">
          <span class="summary-label">{{ t('doctor.selected') }}</span>
          <span class="summary-value">
            <template v-if="selected">
              {{ selected.day }}, {{ selected.month }} {{ selected.date }} · {{ selected.time }}
            </template>
            <template v-else>—</template>
          </span>
        </div>
        <NuxtLink to="/auth/login" class="reserve-btn">{{ t('doctor.reserve') }}</NuxtLink>
      </div>
    </div>

  </section>
</template>

<style scoped>
/* ── Card ─────────────────────────────────────────── */
.row {
  background: var(--white);
  border: 1px solid var(--gray-1);
  border-radius: 16px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.13);
  transition: box-shadow 0.15s;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}
.row:hover { box-shadow: 0 6px 24px rgba(0, 0, 0, 0.13); }

/* ── Left column ──────────────────────────────────── */
.left {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  width: 100%;
  max-width: 100%;
}

.doctor-link {
  display: flex;
  gap: 14px;
  text-decoration: none;
  color: inherit;
  align-items: flex-start;
  min-width: 0;
  width: 100%;
}

.photo {
  width: 62px;
  height: 62px;
  border-radius: 999px;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid var(--gray-1);
  background: var(--blue-l);
}

.meta {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.name {
  font-size: 17px;
  font-weight: 700;
  color: var(--ink);
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.spec {
  font-size: 14px;
  color: var(--gray-3);
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rating {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 2px;
}

.rating-text {
  font-size: 13px;
  color: var(--gray-3);
  line-height: 1.4;
}

/* ── Procedure tags — inside .meta ───────────────── */
.procedures {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.proc-tag {
  display: inline-flex;
  align-items: center;
  height: 26px;
  padding: 0 10px;
  border-radius: 6px;
  background: var(--blue-xl);
  color: var(--blue-m);
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
}

/* ── Chips row (availability + badges + fee) ──────── */
.chips {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.badge-group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.avail-tag {
  display: inline-flex;
  align-items: center;
  height: 26px;
  border-radius: 99px;
  padding: 0 10px;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}
.avail-tag.green { background: var(--green-l); color: var(--green); }
.avail-tag.yellow { background: var(--yellow-l); color: var(--yellow); }

.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 26px;
  padding: 0 10px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}
.badge.tele { background: #EFF6FF; color: #2563EB; border: 1px solid #BFDBFE; }
.badge.followup { background: #F0FDF4; color: #16A34A; border: 1px solid #BBF7D0; }

.fee-block {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
}

html[dir="rtl"] .fee-block {
  align-items: flex-start;
}

.fee-amount {
  font-size: 22px;
  font-weight: 800;
  color: var(--blue-m);
  line-height: 1.1;
}

.fee-label {
  font-size: 11px;
  color: var(--gray-2);
  line-height: 1.4;
}

/* ── Right column ─────────────────────────────────── */
.right {
  border-top: 1px solid var(--gray-1);
  padding-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

.picker-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--gray-3);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  line-height: 1.4;
}

/* ── CTA row ──────────────────────────────────────── */
.cta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding-top: 4px;
}

.summary {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.summary-label {
  font-size: 12px;
  color: var(--gray-2);
  line-height: 1.4;
}

.summary-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.reserve-btn {
  height: 40px;
  padding: 0 22px;
  border-radius: 10px;
  background: var(--blue-m);
  border: 1.5px solid var(--blue-m);
  color: var(--white);
  font-size: 14px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  transition: background 0.15s;
  flex-shrink: 0;
}
.reserve-btn:hover { background: var(--blue); border-color: var(--blue); }

/* ── Desktop ──────────────────────────────────────── */
@media (min-width: 768px) {
  .row {
    padding: 24px;
    flex-direction: row;
    align-items: stretch;
    gap: 24px;
  }

  .left {
    width: 320px;
    flex-shrink: 0;
    justify-content: space-between;
  }

  .photo { width: 68px; height: 68px; }

  .name { font-size: 18px; }
  .spec { font-size: 15px; }
  .rating-text { font-size: 14px; }
  .fee-amount { font-size: 26px; }
  .fee-label { font-size: 12px; }

  .right {
    flex: 1;
    border-top: none;
    border-inline-start: 1px solid var(--gray-1);
    padding-top: 0;
    padding-inline-start: 24px;
    min-width: 0;
    overflow: hidden;
  }
}
</style>
