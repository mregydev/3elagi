<script setup lang="ts">
import { Calendar } from '~/components/ui/calendar'
import type { CalendarValue } from '~/components/ui/calendar'
import type { Doctor } from '~/modules/doctor/types'

const { t, tm, te } = useI18n()

useHead({ title: computed(() => `${t('details.pageTitle')} — ${t('common.brandName')}`) })

const route = useRoute()
const router = useRouter()

function trSpecialty(key: string) {
  return te(`demo.specialty.${key}`) ? t(`demo.specialty.${key}`) : key
}
function trClinic(key: string) {
  return te(`demo.clinic.${key}`) ? t(`demo.clinic.${key}`) : key
}
function trLang(code: string) {
  return te(`langs.${code}`) ? t(`langs.${code}`) : code
}

const doctor: Doctor = {
  id: String(route.params.id),
  name: 'Dr. Sara Ahmed',
  specialty: 'cardiologist',
  clinic: 'ainShams',
  rating: 5,
  availability: 'today',
  fee: '350 EGP',
  experience: 12,
  patients: '1,200+',
  languages: ['arabic', 'english'],
  image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&q=80',
}

const reviewAvatars = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&q=80',
] as const

const selected = ref<CalendarValue | undefined>(undefined)
function handleChange(val: CalendarValue) {
  selected.value = val
}

const selectedSummary = computed(() =>
  selected.value
    ? `${selected.value.day}, ${selected.value.month} ${selected.value.date} · ${selected.value.time}`
    : t('details.selectedSlotPlaceholder'),
)

const faqs = computed(() => tm('details.faqs') as { q: string; a: string }[])

const openFaqIdx = ref<number | null>(null)
function toggleFaq(i: number) {
  openFaqIdx.value = openFaqIdx.value === i ? null : i
}

const reviews = computed(() => {
  const raw = tm('details.reviewSamples') as { id: number; name: string; rating: number; date: string; text: string }[]
  return raw.map((r, i) => ({
    ...r,
    avatar: reviewAvatars[i] ?? reviewAvatars[0],
  }))
})

const reviewsScrollRef = ref<HTMLElement | null>(null)
function scrollReviews(dir: 'left' | 'right') {
  const delta = dir === 'left' ? -300 : 300
  reviewsScrollRef.value?.scrollBy({ left: delta, behavior: 'smooth' })
}
</script>

<template>
  <div class="page">

    <!-- ════════════════ MOBILE ════════════════ -->
    <div class="mobile-view">

      <!-- Blue header -->
      <div class="m-header">
        <div class="m-header-top">
          <button class="back-btn cn-rtl-flip" @click="router.back()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <span class="m-header-title">{{ t('details.doctorDetails') }}</span>
          <NuxtLink
            class="chat-btn"
            :to="{ path: '/', query: { view: 'chat', doctorId: doctor.id } }"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span class="chat-label">{{ t('common.chat') }}</span>
          </NuxtLink>
        </div>
        <div class="m-hero">
          <img class="m-avatar" :src="doctor.image" :alt="doctor.name" />
          <div>
            <span class="m-name">{{ doctor.name }}</span>
            <span class="m-spec">{{ trSpecialty(doctor.specialty) }} · {{ t('doctor.expYearsShort', { n: doctor.experience }) }}</span>
            <div class="m-rating">
              <StarRating :value="doctor.rating" />
              <span class="m-rating-text">{{ doctor.rating }}.0 · {{ t('doctor.reviewsCount', { n: 128 }) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mobile-scroll">
        <div class="mobile-inner">
          <!-- Doctor Details card -->
          <div class="m-card">
        <span class="card-label">{{ t('details.doctorDetails') }}</span>
        <div class="stats-row">
          <div v-for="s in [{v: String(doctor.experience), l: t('details.experience')}, {v: doctor.patients, l: t('details.patients')}, {v: `${doctor.rating}.0`, l: t('details.rating')}]" :key="s.l" class="stat-cell">
            <span class="stat-val">{{ s.v }}</span>
            <span class="stat-lbl">{{ s.l }}</span>
          </div>
        </div>
        <p class="about-text">{{ t('details.demoAbout') }}</p>
        <div class="divider" />
        <div class="tags-row">
          <span class="tag green">{{ t('details.availableToday') }}</span>
          <span class="tag blue-outline">{{ t('details.telemedicine') }}</span>
          <span class="tag blue-outline">{{ t('details.followUp') }}</span>
        </div>
        <div class="fee-row">
          <div>
            <span class="fee-lbl">{{ t('details.consultationFee') }}</span>
            <span class="fee-val">{{ doctor.fee }}</span>
          </div>
          <div class="lang-tags">
            <span v-for="(l, i) in doctor.languages" :key="l" class="lang-tag" :class="i === 0 ? 'primary' : 'secondary'">{{ trLang(l) }}</span>
          </div>
        </div>
      </div>

      <!-- Map card -->
      <div class="m-card m-card-no-gap">
        <div class="map-placeholder">
          <div v-for="x in [20,40,60,80]" :key="`mx${x}`" class="map-grid-v" :style="`left:${x}%`" />
          <div v-for="y in [33,66]" :key="`my${y}`" class="map-grid-h" :style="`top:${y}%`" />
          <div class="map-pin" />
        </div>
        <div class="map-footer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue-m)" stroke-width="2">
            <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z" /><circle cx="12" cy="10" r="3" />
          </svg>
          <div>
            <span class="loc-name">{{ trClinic(doctor.clinic) }}</span>
            <span class="loc-detail">{{ t('details.demoLocation') }}</span>
          </div>
          <button class="dir-btn">{{ t('details.directions') }}</button>
        </div>
      </div>

      <!-- Select Appointment card -->
      <div class="m-card">
        <span class="card-label">{{ t('details.selectAppointment') }}</span>
        <Calendar @update:model-value="handleChange" />
        <NuxtLink to="/auth/login" class="reserve-btn-full">{{ t('details.reserveAppointment') }}</NuxtLink>
      </div>

      <!-- Reviews carousel card -->
      <div class="m-card">
        <div class="section-header">
          <span class="card-label">{{ t('details.reviews') }}</span>
          <span class="see-all">{{ t('details.seeAll') }}</span>
        </div>
        <div class="reviews-carousel-wrap">
          <button class="rev-arrow cn-rtl-flip" @click="scrollReviews('left')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div ref="reviewsScrollRef" class="reviews-scroll">
            <div v-for="r in reviews" :key="r.id" class="rev-card">
              <div class="rev-top">
                <img class="rev-avatar" :src="r.avatar" :alt="r.name" />
                <div class="rev-meta">
                  <span class="rev-name">{{ r.name }}</span>
                  <span class="rev-date">{{ r.date }}</span>
                </div>
                <StarRating :value="r.rating" :size="11" class="rev-stars" />
              </div>
              <p class="rev-text">{{ r.text }}</p>
            </div>
          </div>
          <button class="rev-arrow cn-rtl-flip" @click="scrollReviews('right')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      <!-- FAQ accordion card -->
      <div class="m-card m-card-last">
        <span class="card-label">{{ t('details.faq') }}</span>
        <div v-for="(f, i) in faqs" :key="i" class="faq-item" @click="toggleFaq(i)">
          <div class="faq-header">
            <span class="faq-q">{{ f.q }}</span>
            <svg
              class="faq-chevron"
              :class="{ open: openFaqIdx === i }"
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
          <div class="faq-body" :class="{ expanded: openFaqIdx === i }">
            <p class="faq-answer">{{ f.a }}</p>
          </div>
        </div>
      </div>
        </div>
      </div>

    </div>

    <!-- ════════════════ DESKTOP ════════════════ -->
    <div class="desktop-view">
      <div class="d-top">
        <AppNavBar />
      </div>

      <div class="d-scroll">
      <div class="d-content">

        <!-- Row 1: Doctor info + Map -->
        <div class="d-row">

          <!-- Doctor info card -->
          <div class="d-card d-card-overflow">
            <div class="d-card-header">
              <img class="d-avatar" :src="doctor.image" :alt="doctor.name" />
              <div>
                <span class="d-name">{{ doctor.name }}</span>
                <span class="d-spec">{{ trSpecialty(doctor.specialty) }} · {{ trClinic(doctor.clinic) }}</span>
                <div class="d-rating">
                  <StarRating :value="doctor.rating" :size="13" />
                  <span class="d-rating-text">{{ doctor.rating }}.0 · {{ t('doctor.reviewsCount', { n: 128 }) }}</span>
                </div>
              </div>
            </div>
            <div class="d-card-body">
              <div class="d-stats">
                <div v-for="s in [{v: String(doctor.experience), l: t('details.experience')}, {v: doctor.patients, l: t('details.patients')}, {v: `${doctor.rating}.0`, l: t('details.rating')}]" :key="s.l" class="d-stat">
                  <span class="d-stat-val">{{ s.v }}</span>
                  <span class="d-stat-lbl">{{ s.l }}</span>
                </div>
              </div>
              <p class="d-about">{{ t('details.demoAbout') }}</p>
              <div class="divider" />
              <div class="tags-row">
                <span class="tag green">{{ t('details.availableToday') }}</span>
                <span class="tag blue-outline">{{ t('details.telemedicine') }}</span>
                <span class="tag blue-outline">{{ t('details.followUp') }}</span>
              </div>
              <div class="d-fee-row">
                <div>
                  <span class="fee-lbl">{{ t('details.consultationFee') }}</span>
                  <span class="d-fee-val">{{ doctor.fee }}</span>
                </div>
                <div class="lang-tags">
                  <span v-for="(l, i) in doctor.languages" :key="l" class="lang-tag" :class="i === 0 ? 'primary' : 'secondary'">{{ trLang(l) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Map card -->
          <div class="d-card d-card-overflow d-map-card">
            <div class="d-map-placeholder">
              <div v-for="x in [15,30,45,60,75]" :key="`dmx${x}`" class="map-grid-v" :style="`left:${x}%`" />
              <div v-for="y in [25,50,75]" :key="`dmy${y}`" class="map-grid-h" :style="`top:${y}%`" />
              <div class="d-map-pin" />
            </div>
            <div class="map-footer d-map-footer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue-m)" stroke-width="2">
                <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              <div>
                <span class="loc-name">{{ trClinic(doctor.clinic) }}</span>
                <span class="loc-detail">{{ t('details.demoLocation') }}</span>
              </div>
              <button class="dir-btn">{{ t('details.getDirections') }}</button>
            </div>
          </div>

        </div>

        <!-- Row 2: Select Appointment -->
        <div class="d-card">
          <span class="d-section-title">{{ t('details.selectAppointment') }}</span>
          <Calendar @update:model-value="handleChange" />
        </div>

        <!-- Row 3: Reviews carousel -->
        <div class="d-card">
          <div class="section-header">
            <span class="d-section-title">{{ t('details.reviews') }}</span>
            <span class="see-all">{{ t('details.seeAllArrow') }}</span>
          </div>
          <div class="reviews-carousel-wrap">
            <button class="rev-arrow cn-rtl-flip" @click="scrollReviews('left')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <div ref="reviewsScrollRef" class="reviews-scroll">
              <div v-for="r in reviews" :key="r.id" class="rev-card">
                <div class="rev-top">
                  <img class="rev-avatar" :src="r.avatar" :alt="r.name" />
                  <div class="rev-meta">
                    <span class="rev-name">{{ r.name }}</span>
                    <span class="rev-date">{{ r.date }}</span>
                  </div>
                  <StarRating :value="r.rating" :size="12" class="rev-stars" />
                </div>
                <p class="rev-text">{{ r.text }}</p>
              </div>
            </div>
            <button class="rev-arrow cn-rtl-flip" @click="scrollReviews('right')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>

        <!-- Row 4: FAQ accordion -->
        <div class="d-card">
          <span class="d-section-title">{{ t('details.faq') }}</span>
          <div class="d-faq-list">
            <div v-for="(f, i) in faqs" :key="i" class="faq-item" @click="toggleFaq(i)">
              <div class="faq-header">
                <span class="faq-q">{{ f.q }}</span>
                <svg
                  class="faq-chevron"
                  :class="{ open: openFaqIdx === i }"
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
              <div class="faq-body" :class="{ expanded: openFaqIdx === i }">
                <p class="faq-answer">{{ f.a }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sticky bottom bar -->
        <div class="d-cta-bar">
          <div>
            <span class="d-cta-label">{{ t('details.selected') }}: {{ selectedSummary }}</span>
            <span class="d-cta-fee">{{ doctor.fee }}</span>
          </div>
          <NuxtLink to="/auth/login" class="confirm-btn">{{ t('details.confirmReservation') }}</NuxtLink>
        </div>

      </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* ── Page ────────────────────────────────────────── */
.page { min-height: 100vh; }
.mobile-view {
  display: flex;
  flex-direction: column;
  background: var(--gray-0);
  height: 100vh;
  height: 100dvh;
  max-height: 100dvh;
  overflow: hidden;
  min-height: 0;
}
.mobile-scroll {
  flex: 1;
  min-height: 0;
  min-width: 0;
  width: 100%;
  max-width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

.mobile-inner {
  width: 100%;
  max-width: 560px;
  margin-inline: auto;
  padding: 10px 14px 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.desktop-view { display: none; }

/* ── Shared ──────────────────────────────────────── */
.divider { height: 1px; background: var(--gray-1); }

.card-label {
  font-size: 14px;
  font-weight: 700;
  color: var(--ink);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.see-all { font-size: 12px; color: var(--blue-m); cursor: pointer; }

.tags-row { display: flex; gap: 6px; flex-wrap: wrap; }

.tag {
  display: inline-flex;
  align-items: center;
  border-radius: 99px;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 600;
}
.tag.green { background: var(--green-l); color: var(--green); }
.tag.blue-outline { background: var(--blue-xl); color: var(--blue-m); border: 1px solid var(--blue-l); }

.lang-tags { display: flex; gap: 6px; }
.lang-tag {
  display: inline-flex;
  align-items: center;
  border-radius: 99px;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 600;
}
.lang-tag.primary { background: var(--blue-xl); color: var(--blue-m); }
.lang-tag.secondary { background: var(--gray-0); color: var(--gray-4); border: 1px solid var(--gray-1); }

.fee-lbl { font-size: 11px; color: var(--gray-2); display: block; }
.fee-val { font-size: 20px; font-weight: 700; color: var(--blue-m); display: block; }

/* ── Map ─────────────────────────────────────────── */
.map-placeholder {
  height: 110px;
  background: #E8F0FE;
  position: relative;
  overflow: hidden;
}
.map-grid-v { position: absolute; top: 0; bottom: 0; width: 1px; background: rgba(37,99,235,0.08); }
.map-grid-h { position: absolute; left: 0; right: 0; height: 1px; background: rgba(37,99,235,0.08); }
.map-pin {
  position: absolute;
  top: 30%;
  left: 48%;
  width: 18px;
  height: 18px;
  background: var(--blue-m);
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.map-footer {
  padding: 10px 14px;
  display: flex;
  gap: 8px;
  align-items: center;
  background: var(--white);
}

.loc-name { font-size: 13px; font-weight: 600; display: block; color: var(--ink); }
.loc-detail { font-size: 11px; color: var(--gray-3); display: block; }

.dir-btn {
  margin-inline-start: auto;
  height: 28px;
  padding: 0 12px;
  border-radius: 7px;
  background: var(--white);
  border: 1.5px solid var(--blue-m);
  color: var(--blue-m);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}

/* ── Reviews carousel ────────────────────────────── */
.reviews-carousel-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rev-arrow {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1.5px solid var(--gray-1);
  background: var(--white);
  color: var(--gray-3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
.rev-arrow:hover { border-color: var(--blue-m); color: var(--blue-m); }

.reviews-scroll {
  flex: 1;
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
}
.reviews-scroll::-webkit-scrollbar { display: none; }

.rev-card {
  flex-shrink: 0;
  width: 240px;
  background: var(--gray-0);
  border: 1px solid var(--gray-1);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rev-top {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rev-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.rev-meta {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.rev-name { font-size: 13px; font-weight: 700; color: var(--ink); }
.rev-date { font-size: 11px; color: var(--gray-2); }
.rev-stars { flex-shrink: 0; }
.rev-text { font-size: 13px; color: var(--gray-3); line-height: 1.6; }

/* ── FAQ accordion ───────────────────────────────── */
.faq-item {
  border-top: 1px solid var(--gray-1);
  cursor: pointer;
  user-select: none;
}
.faq-item:first-of-type { border-top: none; }

.faq-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 13px 0;
}

.faq-q {
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-4);
  flex: 1;
  line-height: 1.5;
}

.faq-item:hover .faq-q { color: var(--blue-m); }

.faq-chevron {
  flex-shrink: 0;
  color: var(--gray-2);
  transition: transform 0.25s ease;
}
.faq-chevron.open {
  transform: rotate(180deg);
  color: var(--blue-m);
}

.faq-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s ease;
}
.faq-body.expanded { max-height: 400px; }

.faq-answer {
  font-size: 13px;
  color: var(--gray-3);
  line-height: 1.7;
  padding-bottom: 14px;
}

/* ── MOBILE: header ───────────────────────────────── */
.m-header {
  background: var(--blue-m);
  padding: 14px 16px 20px;
  flex-shrink: 0;
}
.m-header-top { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
.back-btn { background: none; border: none; padding: 0; display: flex; align-items: center; cursor: pointer; }
.m-header-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--white);
  flex: 1;
  min-width: 0;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.45);
  background: rgba(255,255,255,0.12);
  color: var(--white);
  text-decoration: none;
  flex-shrink: 0;
}

.chat-label {
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
}

.m-hero { display: flex; gap: 12px; align-items: center; }
.m-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255,255,255,0.5);
  flex-shrink: 0;
  background: rgba(255,255,255,0.2);
}
.m-name { font-size: 17px; font-weight: 700; color: var(--white); display: block; }
.m-spec { font-size: 12px; color: rgba(255,255,255,0.75); display: block; margin-top: 2px; }
.m-rating { display: flex; align-items: center; gap: 5px; margin-top: 5px; }
.m-rating-text { font-size: 11px; color: rgba(255,255,255,0.8); }

/* ── MOBILE: cards ───────────────────────────────── */
.m-card {
  background: var(--white);
  border: 1px solid var(--gray-1);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.m-card-no-gap { gap: 0; padding: 0; overflow: hidden; }
.m-card-last { }

.stats-row { display: flex; gap: 8px; }
.stat-cell {
  flex: 1;
  text-align: center;
  padding: 8px 4px;
  background: var(--gray-0);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.stat-val { font-size: 14px; font-weight: 700; color: var(--blue-m); }
.stat-lbl { font-size: 10px; color: var(--gray-3); }

.about-text { font-size: 12px; color: var(--gray-3); line-height: 1.6; }

.fee-row { display: flex; justify-content: space-between; align-items: flex-end; }

.reserve-btn-full {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  border-radius: 10px;
  background: var(--blue-m);
  border: 1.5px solid var(--blue-m);
  color: var(--white);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.15s;
}
.reserve-btn-full:hover { background: var(--blue); }

/* ── DESKTOP ─────────────────────────────────────── */
@media (min-width: 768px) {
  .mobile-view { display: none; }
  .desktop-view {
    display: flex;
    flex-direction: column;
    height: 100vh;
    height: 100dvh;
    max-height: 100dvh;
    min-height: 0;
    overflow: hidden;
    background: var(--gray-0);
  }

  .d-top {
    flex-shrink: 0;
  }

  .d-scroll {
    flex: 1;
    min-height: 0;
    min-width: 0;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }

  .d-content {
    min-height: 0;
    min-width: 0;
    padding: 24px 28px 120px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  .d-row {
    display: flex;
    gap: 16px;
    align-items: stretch;
  }

  .d-card {
    background: var(--white);
    border: 1px solid var(--gray-1);
    border-radius: 14px;
    padding: 18px 24px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .d-card-overflow { overflow: hidden; padding: 0; }

  .d-row .d-card { flex: 1; }

  .d-map-card { display: flex; flex-direction: column; }

  .d-card-header {
    background: var(--blue-m);
    padding: 20px 24px;
    display: flex;
    gap: 16px;
    align-items: center;
  }

  .d-avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(255,255,255,0.5);
    flex-shrink: 0;
    background: rgba(255,255,255,0.2);
  }

  .d-name { font-size: 20px; font-weight: 700; color: var(--white); display: block; }
  .d-spec { font-size: 13px; color: rgba(255,255,255,0.75); display: block; margin-top: 2px; }
  .d-rating { display: flex; gap: 5px; align-items: center; margin-top: 6px; }
  .d-rating-text { font-size: 13px; color: rgba(255,255,255,0.8); }

  .d-card-body {
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .d-stats { display: flex; gap: 10px; }
  .d-stat {
    flex: 1;
    text-align: center;
    padding: 8px 4px;
    background: var(--gray-0);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .d-stat-val { font-size: 15px; font-weight: 700; color: var(--blue-m); display: block; }
  .d-stat-lbl { font-size: 11px; color: var(--gray-3); }

  .d-about { font-size: 13px; color: var(--gray-3); line-height: 1.6; }

  .d-fee-row { display: flex; justify-content: space-between; align-items: flex-end; }
  .d-fee-val { font-size: 22px; font-weight: 700; color: var(--blue-m); display: block; }

  .d-map-placeholder {
    flex: 1;
    min-height: 180px;
    background: #E8F0FE;
    position: relative;
    overflow: hidden;
  }

  .d-map-pin {
    position: absolute;
    top: 38%;
    left: 46%;
    width: 22px;
    height: 22px;
    background: var(--blue-m);
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }

  .d-map-footer {
    padding: 12px 16px;
  }

  .dir-btn { height: 32px; padding: 0 14px; font-size: 12px; }

  .d-section-title { font-size: 15px; font-weight: 700; color: var(--ink); }

  .rev-card { width: 300px; }
  .rev-avatar { width: 40px; height: 40px; }
  .rev-text { font-size: 14px; }

  .d-faq-list { display: flex; flex-direction: column; }
  .d-faq-list .faq-q { font-size: 14px; }
  .d-faq-list .faq-answer { font-size: 14px; }

  /* Sticky bottom CTA */
  .d-cta-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--white);
    border-top: 1px solid var(--gray-1);
    padding: 14px 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 50;
    box-shadow: 0 -4px 16px rgba(0,0,0,0.06);
  }

  .d-cta-label { font-size: 12px; color: var(--gray-2); display: block; }
  .d-cta-fee { font-size: 22px; font-weight: 700; color: var(--blue-m); display: block; }

  .confirm-btn {
    height: 46px;
    padding: 0 32px;
    border-radius: 10px;
    background: var(--blue-m);
    border: 1.5px solid var(--blue-m);
    color: var(--white);
    font-size: 15px;
    font-weight: 600;
    display: flex;
    align-items: center;
    text-decoration: none;
    transition: background 0.15s;
  }
  .confirm-btn:hover { background: var(--blue); }
}
</style>
