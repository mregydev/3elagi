<script setup lang="ts">
import type { UploadState } from '~/modules/patient/types'

const { t } = useI18n()

useHead({ title: computed(() => t('meta.doctorOnboarding')) })

interface DocItem {
  key: string
  title: string
  subtitle: string
  state: UploadState
}

const docs = computed<DocItem[]>(() => [
  { key: 'license', title: t('doctorOnboarding.docs.license'), subtitle: t('doctorOnboarding.docs.licenseSub'), state: 'uploaded' },
  { key: 'national-id', title: t('doctorOnboarding.docs.national'), subtitle: t('doctorOnboarding.docs.nationalSub'), state: 'review' },
  { key: 'cert', title: t('doctorOnboarding.docs.cert'), subtitle: t('doctorOnboarding.docs.certSub'), state: 'rejected' },
  { key: 'photo', title: t('doctorOnboarding.docs.photo'), subtitle: t('doctorOnboarding.docs.photoSub'), state: 'pending' },
])

const hasRejected = computed(() => docs.value.some(d => d.state === 'rejected'))

const stepLabels = computed(() => [
  t('doctorOnboarding.steps.account'),
  t('doctorOnboarding.steps.personal'),
  t('doctorOnboarding.steps.clinic'),
  t('doctorOnboarding.steps.documents'),
  t('doctorOnboarding.steps.review'),
])
</script>

<template>
  <div class="page">
    <!-- Mobile layout -->
    <div class="mobile-layout">
      <div class="mob-header">
        <NuxtLink to="/" class="mob-logo">
          <AppLogo :height="28" />
        </NuxtLink>
        <div class="mob-progress">
          <div class="mob-prog-bar">
            <div class="mob-prog-fill" style="width: 80%" />
          </div>
          <span class="mob-prog-label">{{ t('doctorOnboarding.stepProgress') }}</span>
        </div>
      </div>

      <div class="mob-body">
        <div class="mob-step-title">{{ t('doctorOnboarding.title') }}</div>
        <div class="mob-step-sub">{{ t('doctorOnboarding.subtitle') }}</div>

        <div v-if="hasRejected" class="warning-banner">
          <span class="warn-icon">⚠️</span>
          <span class="warn-text">{{ t('doctorOnboarding.warning') }}</span>
        </div>

        <div class="doc-list">
          <UploadCard
            v-for="doc in docs"
            :key="doc.key"
            :title="doc.title"
            :subtitle="doc.subtitle"
            :state="doc.state"
          />
        </div>
      </div>

      <div class="mob-footer">
        <NuxtLink to="/doctor/onboarding/step3" class="btn-back">{{ t('doctorOnboarding.back') }}</NuxtLink>
        <NuxtLink to="/doctor/onboarding/step5" class="btn-next">{{ t('doctorOnboarding.continue') }}</NuxtLink>
      </div>
    </div>

    <!-- Desktop layout -->
    <div class="desk-layout">
      <aside class="desk-sidebar">
        <NuxtLink to="/" class="sidebar-logo">
          <AppLogo :height="28" dark />
        </NuxtLink>

        <div class="stepper">
          <div v-for="(item, i) in stepLabels" :key="i" class="step-row">
            <div class="step-connector-wrap">
              <div class="step-circle" :class="i < 3 ? 'done' : i === 3 ? 'active' : 'future'">
                <template v-if="i < 3">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#1C3FAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </template>
                <template v-else>{{ i + 1 }}</template>
              </div>
              <div v-if="i < 4" class="step-line" :class="{ done: i < 3 }" />
            </div>
            <div class="step-label-col">
              <span class="step-label" :class="{ 'step-label-active': i === 3, 'step-label-done': i < 3 }">{{ item }}</span>
            </div>
          </div>
        </div>

        <div class="sidebar-badge">
          <span class="badge-icon">🔒</span>
          <span class="badge-text">{{ t('doctorOnboarding.secureBadge') }}</span>
        </div>
      </aside>

      <main class="desk-main">
        <div class="desk-progress-dots">
          <span v-for="n in 5" :key="n" class="prog-dot" :class="{ active: n === 4, done: n < 4 }" />
        </div>

        <div class="desk-content">
          <h2 class="desk-title">{{ t('doctorOnboarding.title') }}</h2>
          <p class="desk-sub">{{ t('doctorOnboarding.subtitle') }}</p>

          <div v-if="hasRejected" class="warning-banner">
            <span class="warn-icon">⚠️</span>
            <span class="warn-text">{{ t('doctorOnboarding.warning') }}</span>
          </div>

          <div class="doc-grid">
            <UploadCard
              v-for="doc in docs"
              :key="doc.key"
              :title="doc.title"
              :subtitle="doc.subtitle"
              :state="doc.state"
            />
          </div>
        </div>

        <div class="desk-footer">
          <NuxtLink to="/doctor/onboarding/step3" class="btn-back">{{ t('doctorOnboarding.back') }}</NuxtLink>
          <NuxtLink to="/doctor/onboarding/step5" class="btn-next">{{ t('doctorOnboarding.continue') }}</NuxtLink>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* ── shared ── */
.page { min-height: 100vh; }

.warning-banner {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  background: #FEF3C7;
  border: 1.5px solid #D97706;
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 16px;
}
.warn-icon { font-size: 16px; flex-shrink: 0; }
.warn-text { font-size: 13px; color: #92400E; line-height: 1.5; }

.btn-back {
  padding: 11px 24px;
  border-radius: 10px;
  border: 1.5px solid var(--gray-1);
  background: white;
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-4);
  text-decoration: none;
  cursor: pointer;
}
.btn-next {
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  background: #3057F2;
  font-size: 14px;
  font-weight: 600;
  color: white;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
}

/* ── mobile ── */
.desk-layout { display: none; }

.mobile-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--blue-xl);
}

.mob-header {
  padding: 20px 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mob-logo { display: block; }

.mob-progress { display: flex; flex-direction: column; gap: 6px; }

.mob-prog-bar {
  height: 6px;
  background: #DBEAFE;
  border-radius: 99px;
  overflow: hidden;
}
.mob-prog-fill { height: 100%; background: #3057F2; border-radius: 99px; }
.mob-prog-label { font-size: 12px; color: var(--gray-3); }

.mob-body {
  flex: 1;
  background: white;
  border-radius: 16px 16px 0 0;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

.mob-step-title { font-size: 18px; font-weight: 700; color: var(--ink); }
.mob-step-sub   { font-size: 13px; color: var(--gray-3); margin-top: -8px; }

.doc-list { display: flex; flex-direction: column; gap: 10px; }

.mob-footer {
  background: white;
  padding: 12px 20px 24px;
  display: flex;
  gap: 10px;
  align-items: center;
}

/* ── desktop ── */
@media (min-width: 900px) {
  .mobile-layout { display: none; }
  .desk-layout {
    display: flex;
    min-height: 100vh;
  }

  .desk-sidebar {
    width: 320px;
    background: #1C3FAA;
    padding: 36px 28px;
    display: flex;
    flex-direction: column;
    gap: 0;
    flex-shrink: 0;
  }

  .sidebar-logo { display: block; margin-bottom: 48px; }

  .stepper { display: flex; flex-direction: column; }

  .step-row {
    display: flex;
    align-items: flex-start;
    gap: 14px;
  }

  .step-connector-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
  }

  .step-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    flex-shrink: 0;
  }
  .step-circle.done   { background: white; color: #1C3FAA; }
  .step-circle.active { background: white; color: #3057F2; }
  .step-circle.future { background: transparent; border: 2px solid rgba(255,255,255,0.3); color: rgba(255,255,255,0.4); }

  .step-line {
    width: 2px;
    height: 28px;
    background: rgba(255,255,255,0.2);
  }
  .step-line.done { background: rgba(255,255,255,0.6); }

  .step-label-col {
    padding: 6px 0 20px;
  }

  .step-label {
    font-size: 13px;
    font-weight: 400;
    color: rgba(255,255,255,0.5);
  }
  .step-label-active { color: white; font-weight: 600; }
  .step-label-done   { color: rgba(255,255,255,0.75); }

  .sidebar-badge {
    margin-top: auto;
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.08);
    border-radius: 8px;
    padding: 10px 12px;
  }
  .badge-icon { font-size: 14px; }
  .badge-text { font-size: 11px; color: rgba(255,255,255,0.6); }

  .desk-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: var(--gray-0);
    padding: 40px 48px;
  }

  .desk-progress-dots {
    display: flex;
    gap: 6px;
    margin-bottom: 32px;
  }
  .prog-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--gray-1);
  }
  .prog-dot.done   { background: #3057F2; }
  .prog-dot.active { background: #3057F2; width: 24px; border-radius: 4px; }

  .desk-content { flex: 1; max-width: 640px; }

  .desk-title { font-size: 24px; font-weight: 700; color: var(--ink); margin-bottom: 6px; }
  .desk-sub   { font-size: 14px; color: var(--gray-3); margin-bottom: 24px; }

  .doc-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .desk-footer {
    display: flex;
    gap: 12px;
    align-items: center;
    padding-top: 24px;
    max-width: 400px;
  }
  .desk-footer .btn-next { flex: unset; padding: 12px 40px; }
}
</style>
