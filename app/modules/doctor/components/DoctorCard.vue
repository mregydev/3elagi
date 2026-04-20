<script setup lang="ts">
import type { Doctor } from '../types'

interface Props {
  doctor: Doctor
  showExperience?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showExperience: false,
})

const { t, te } = useI18n()

function trSpecialty(key: string) {
  return te(`demo.specialty.${key}`) ? t(`demo.specialty.${key}`) : key
}
function trClinic(key: string) {
  return te(`demo.clinic.${key}`) ? t(`demo.clinic.${key}`) : key
}
</script>

<template>
  <NuxtLink :to="`/doctors/${props.doctor.id}`" class="card">
    <UserAvatar :size="48" class="avatar-mobile" />
    <UserAvatar :size="52" class="avatar-desktop" />

    <div class="content">
      <div class="top-row">
        <div class="name-col">
          <span class="name">{{ props.doctor.name }}</span>
          <span class="spec">{{ trSpecialty(props.doctor.specialty) }} · {{ trClinic(props.doctor.clinic) }}</span>
          <div class="rating-row">
            <StarRating :value="props.doctor.rating" :size="11" />
            <span class="rating-text">
              {{ props.doctor.rating }}.0
              <template v-if="showExperience"> · {{ t('doctor.expYearsShort', { n: props.doctor.experience }) }}</template>
            </span>
          </div>
        </div>
        <div class="fee-col">
          <span class="fee">{{ props.doctor.fee }}</span>
          <span v-if="showExperience" class="per-visit">{{ t('doctorCard.perVisit') }}</span>
        </div>
      </div>

      <div class="divider desktop-only" />

      <div class="bottom-row">
        <span
          class="avail-tag"
          :class="props.doctor.availability === 'today' ? 'green' : 'yellow'"
          >{{ props.doctor.availability === 'today' ? t('doctor.availableToday') : t('doctor.tomorrow') }}</span
        >
        <button class="book-btn" @click.prevent="$router.push(`/doctors/${props.doctor.id}`)">
          <span class="btn-label-mobile">{{ t('doctorCard.bookNow') }}</span>
          <span class="btn-label-desktop">{{ t('doctorCard.bookAppointment') }}</span>
        </button>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.card {
  background: var(--white);
  border: 1px solid var(--gray-1);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  gap: 12px;
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.15s;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.avatar-desktop {
  display: none;
}

.content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.top-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.name-col {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.name {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.spec {
  font-size: 12px;
  color: var(--gray-3);
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}

.rating-text {
  font-size: 11px;
  color: var(--gray-3);
}

.fee-col {
  text-align: end;
  flex-shrink: 0;
}

.fee {
  font-size: 13px;
  font-weight: 600;
  color: var(--blue-m);
  display: block;
}

.per-visit {
  font-size: 11px;
  color: var(--gray-2);
  display: block;
}

.divider {
  width: 100%;
  height: 1px;
  background: var(--gray-1);
}

.desktop-only {
  display: none;
}

.bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.avail-tag {
  display: inline-flex;
  align-items: center;
  border-radius: 99px;
  padding: 2px 10px;
  font-size: 11px;
  font-weight: 600;
}

.avail-tag.green {
  background: var(--green-l);
  color: var(--green);
}

.avail-tag.yellow {
  background: var(--yellow-l);
  color: var(--yellow);
}

.book-btn {
  height: 30px;
  padding: 0 12px;
  border-radius: 8px;
  background: var(--blue-m);
  border: 1.5px solid var(--blue-m);
  color: var(--white);
  font-size: 12px;
  font-weight: 600;
  transition: background 0.15s;
}

.book-btn:hover {
  background: var(--blue);
  border-color: var(--blue);
}

.btn-label-desktop {
  display: none;
}

@media (min-width: 768px) {
  .card {
    padding: 18px;
    gap: 14px;
    flex-direction: column;
  }

  .top-row {
    flex-direction: row;
  }

  /* Show the bigger avatar on desktop */
  .avatar-mobile {
    display: none;
  }
  .avatar-desktop {
    display: flex;
  }

  /* Re-layout top-row as a flex row with avatar inline */
  .card {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .content {
    gap: 12px;
  }

  .name {
    font-size: 15px;
  }

  .fee {
    font-size: 16px;
    font-weight: 700;
  }

  .desktop-only {
    display: block;
  }

  .book-btn {
    height: 34px;
    padding: 0 16px;
  }

  .btn-label-mobile {
    display: none;
  }
  .btn-label-desktop {
    display: inline;
  }
}
</style>
