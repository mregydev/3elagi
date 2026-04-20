<script setup lang="ts">
import MCQChip from '~/modules/patient/components/MCQChip.vue'
import CheckChip from '~/modules/patient/components/CheckChip.vue'
import type { IntakeAnswers } from '~/modules/patient/types'

const { t } = useI18n()

useHead({ title: computed(() => t('meta.intake')) })

const FORM_STEPS = 5

const step = ref(0)
const error = ref('')

const answers = reactive<IntakeAnswers>({
  visitReason: '',
  symptomDuration: '',
  painLevel: '',
  symptoms: [],
  documents: [],
})

const fileInput = ref<HTMLInputElement | null>(null)

const stepLabels = computed(() => [
  t('intake.steps.reason'),
  t('intake.steps.duration'),
  t('intake.steps.pain'),
  t('intake.steps.symptoms'),
  t('intake.steps.documents'),
])

const visitReasonOptions = [
  ['new', '🩺'],
  ['followup', '🔄'],
  ['routine', '✅'],
  ['tests', '📋'],
  ['rx', '💊'],
  ['other', '💬'],
] as const

const durationKeys = ['lt1d', 'd1_3', 'd4_7', 'w1_2', 'w2p'] as const

const painLevels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

const symptomKeys = ['chest', 'sob', 'dizzy', 'fatigue', 'palp', 'swell', 'nausea', 'fever'] as const

function toggleSymptom(s: string) {
  const idx = answers.symptoms.indexOf(s)
  if (idx === -1) answers.symptoms.push(s)
  else answers.symptoms.splice(idx, 1)
}

function validate(): boolean {
  error.value = ''
  if (step.value === 0 && !answers.visitReason) { error.value = t('intake.errors.reason'); return false }
  if (step.value === 1 && !answers.symptomDuration) { error.value = t('intake.errors.duration'); return false }
  if (step.value === 2 && !answers.painLevel) { error.value = t('intake.errors.pain'); return false }
  if (step.value === 3 && answers.symptoms.length === 0) { error.value = t('intake.errors.symptoms'); return false }
  return true
}

function next() {
  if (!validate()) return
  if (step.value < FORM_STEPS - 1) step.value++
  else step.value = FORM_STEPS
}

function back() {
  error.value = ''
  if (step.value > 0) step.value--
}

function addFiles(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files) return
  Array.from(files).forEach(f => {
    if (!answers.documents.includes(f.name)) answers.documents.push(f.name)
  })
}

function removeFile(name: string) {
  answers.documents = answers.documents.filter(f => f !== name)
}

const progressPct = computed(() => Math.round((step.value / FORM_STEPS) * 100))
</script>

<template>
  <div class="page">
    <!-- Mobile layout -->
    <div class="mobile-layout">
      <div class="mob-header">
        <NuxtLink to="/" class="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </NuxtLink>
        <div class="mob-progress-wrap">
          <div class="mob-prog-bar">
            <div class="mob-prog-fill" :style="{ width: `${progressPct}%` }" />
          </div>
          <span class="mob-prog-label">
            <template v-if="step < FORM_STEPS">{{ t('intake.stepProgress', { n: step + 1, total: FORM_STEPS }) }}</template>
            <template v-else>{{ t('intake.complete') }}</template>
          </span>
        </div>
      </div>

      <!-- Done screen -->
      <div v-if="step === FORM_STEPS" class="done-screen">
        <div class="done-circle">✓</div>
        <h2 class="done-title">{{ t('intake.doneTitle') }}</h2>
        <p class="done-sub">{{ t('intake.doneSub') }}</p>
        <NuxtLink to="/appointments/queue" class="btn-done">{{ t('intake.backToQueue') }}</NuxtLink>
      </div>

      <template v-else>
        <div class="mob-body">
          <!-- Step 0: Visit reason -->
          <template v-if="step === 0">
            <h2 class="step-title">{{ t('intake.reasonTitle') }}</h2>
            <p class="step-sub">{{ t('intake.reasonSub') }}</p>
            <div class="reasons-grid">
              <MCQChip
                v-for="[key, icon] in visitReasonOptions"
                :key="key"
                :label="t(`intake.reasons.${key}`)"
                :icon="icon"
                :selected="answers.visitReason === key"
                @select="answers.visitReason = key"
              />
            </div>
          </template>

          <!-- Step 1: Duration -->
          <template v-else-if="step === 1">
            <h2 class="step-title">{{ t('intake.durationTitle') }}</h2>
            <p class="step-sub">{{ t('intake.durationSub') }}</p>
            <div class="stack">
              <MCQChip
                v-for="d in durationKeys"
                :key="d"
                :label="t(`intake.durations.${d}`)"
                :selected="answers.symptomDuration === d"
                @select="answers.symptomDuration = d"
              />
            </div>
          </template>

          <!-- Step 2: Pain level -->
          <template v-else-if="step === 2">
            <h2 class="step-title">{{ t('intake.painTitle') }}</h2>
            <p class="step-sub">{{ t('intake.painSub') }}</p>
            <div class="pain-grid">
              <button
                v-for="lvl in painLevels"
                :key="lvl"
                class="pain-btn"
                :class="{ selected: answers.painLevel === lvl }"
                @click="answers.painLevel = lvl"
              >{{ lvl }}</button>
            </div>
            <div class="pain-legend">
              <span>{{ t('intake.painMin') }}</span>
              <span>{{ t('intake.painMax') }}</span>
            </div>
          </template>

          <!-- Step 3: Symptoms -->
          <template v-else-if="step === 3">
            <h2 class="step-title">{{ t('intake.symptomsTitle') }}</h2>
            <p class="step-sub">{{ t('intake.symptomsSub') }}</p>
            <div class="stack">
              <CheckChip
                v-for="s in symptomKeys"
                :key="s"
                :label="t(`intake.symptoms.${s}`)"
                :selected="answers.symptoms.includes(s)"
                @toggle="toggleSymptom(s)"
              />
            </div>
          </template>

          <!-- Step 4: Documents -->
          <template v-else-if="step === 4">
            <h2 class="step-title">{{ t('intake.docsTitle') }}</h2>
            <p class="step-sub">{{ t('intake.docsSub') }}</p>
            <div
              class="upload-zone"
              @click="fileInput?.click()"
            >
              <span class="upload-icon">📎</span>
              <span class="upload-text">{{ t('intake.uploadTap') }}</span>
              <span class="upload-hint">{{ t('intake.uploadHint') }}</span>
              <input ref="fileInput" type="file" multiple hidden @change="addFiles" />
            </div>
            <div v-if="answers.documents.length" class="file-list">
              <div v-for="fname in answers.documents" :key="fname" class="file-row">
                <span class="file-icon">📄</span>
                <span class="file-name">{{ fname }}</span>
                <button class="file-remove" @click="removeFile(fname)">×</button>
              </div>
            </div>
          </template>

          <p v-if="error" class="error-msg">{{ error }}</p>
        </div>

        <div class="mob-footer">
          <button v-if="step > 0" class="btn-back" @click="back">{{ t('common.back') }}</button>
          <button class="btn-next" @click="next">
            {{ step === FORM_STEPS - 1 ? t('common.submit') : t('common.continue') }}
          </button>
        </div>
      </template>
    </div>

    <!-- Desktop layout -->
    <div class="desk-layout">
      <!-- Left sidebar step tracker -->
      <aside class="desk-sidebar">
        <NuxtLink to="/" class="back-btn desk-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          {{ t('intake.backQueueLink') }}
        </NuxtLink>

        <div class="desk-stepper">
          <div
            v-for="(label, i) in stepLabels"
            :key="i"
            class="desk-step"
            :class="{ active: i === step, done: i < step }"
          >
            <div class="desk-step-circle">
              <template v-if="i < step">✓</template>
              <template v-else>{{ i + 1 }}</template>
            </div>
            <span class="desk-step-label">{{ label }}</span>
          </div>
        </div>

        <!-- Doctor info -->
        <div class="sidebar-doc">
          <div class="doc-avatar-sm">
            <svg viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="13" r="7" fill="rgba(255,255,255,0.3)" />
              <ellipse cx="20" cy="32" rx="12" ry="8" fill="rgba(255,255,255,0.3)" />
            </svg>
          </div>
          <div>
            <div class="sidebar-doc-name">Dr. Ahmed Hassan</div>
            <div class="sidebar-doc-spec">{{ t('demo.specialty.cardiologist') }}</div>
          </div>
        </div>
      </aside>

      <!-- Main -->
      <main class="desk-main">
        <!-- Done screen -->
        <div v-if="step === FORM_STEPS" class="done-screen">
          <div class="done-circle">✓</div>
          <h2 class="done-title">{{ t('intake.doneTitle') }}</h2>
          <p class="done-sub">{{ t('intake.doneSubDesk') }}</p>
          <NuxtLink to="/appointments/queue" class="btn-done">{{ t('intake.backToQueue') }}</NuxtLink>
        </div>

        <template v-else>
          <div class="desk-content">
            <!-- Step 0: Visit reason -->
            <template v-if="step === 0">
              <h2 class="step-title">{{ t('intake.reasonTitle') }}</h2>
              <p class="step-sub">{{ t('intake.reasonSub') }}</p>
              <div class="reasons-grid-desk">
                <MCQChip
                  v-for="[key, icon] in visitReasonOptions"
                  :key="key"
                  :label="t(`intake.reasons.${key}`)"
                  :icon="icon"
                  :selected="answers.visitReason === key"
                  @select="answers.visitReason = key"
                />
              </div>
            </template>

            <!-- Step 1: Duration -->
            <template v-else-if="step === 1">
              <h2 class="step-title">{{ t('intake.durationTitle') }}</h2>
              <p class="step-sub">{{ t('intake.durationSub') }}</p>
              <div class="desk-options-grid">
                <MCQChip
                  v-for="d in durationKeys"
                  :key="d"
                  :label="t(`intake.durations.${d}`)"
                  :selected="answers.symptomDuration === d"
                  @select="answers.symptomDuration = d"
                />
              </div>
            </template>

            <!-- Step 2: Pain level -->
            <template v-else-if="step === 2">
              <h2 class="step-title">{{ t('intake.painTitle') }}</h2>
              <p class="step-sub">{{ t('intake.painSub') }}</p>
              <div class="pain-grid">
                <button
                  v-for="lvl in painLevels"
                  :key="lvl"
                  class="pain-btn"
                  :class="{ selected: answers.painLevel === lvl }"
                  @click="answers.painLevel = lvl"
                >{{ lvl }}</button>
              </div>
              <div class="pain-legend">
                <span>{{ t('intake.painMin') }}</span>
                <span>{{ t('intake.painMax') }}</span>
              </div>
            </template>

            <!-- Step 3: Symptoms -->
            <template v-else-if="step === 3">
              <h2 class="step-title">{{ t('intake.symptomsTitle') }}</h2>
              <p class="step-sub">{{ t('intake.symptomsSub') }}</p>
              <div class="desk-options-grid">
                <CheckChip
                  v-for="s in symptomKeys"
                  :key="s"
                  :label="t(`intake.symptoms.${s}`)"
                  :selected="answers.symptoms.includes(s)"
                  @toggle="toggleSymptom(s)"
                />
              </div>
            </template>

            <!-- Step 4: Documents -->
            <template v-else-if="step === 4">
              <h2 class="step-title">{{ t('intake.docsTitle') }}</h2>
              <p class="step-sub">{{ t('intake.docsSub') }}</p>
              <div class="upload-zone" @click="fileInput?.click()">
                <span class="upload-icon">📎</span>
                <span class="upload-text">{{ t('intake.uploadClick') }}</span>
                <span class="upload-hint">{{ t('intake.uploadHint') }}</span>
                <input ref="fileInput" type="file" multiple hidden @change="addFiles" />
              </div>
              <div v-if="answers.documents.length" class="file-list">
                <div v-for="fname in answers.documents" :key="fname" class="file-row">
                  <span class="file-icon">📄</span>
                  <span class="file-name">{{ fname }}</span>
                  <button class="file-remove" @click="removeFile(fname)">×</button>
                </div>
              </div>
            </template>

            <p v-if="error" class="error-msg">{{ error }}</p>
          </div>

          <div class="desk-footer">
            <button v-if="step > 0" class="btn-back" @click="back">{{ t('common.back') }}</button>
            <button class="btn-next" @click="next">
              {{ step === FORM_STEPS - 1 ? t('common.submit') : t('common.continue') }}
            </button>
          </div>
        </template>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* ── shared ── */
.page { min-height: 100vh; }

.step-title { font-size: 20px; font-weight: 700; color: var(--ink); margin-bottom: 6px; }
.step-sub   { font-size: 13px; color: var(--gray-3); margin-bottom: 20px; }

.stack { display: flex; flex-direction: column; gap: 8px; }

.reasons-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.pain-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  margin-bottom: 10px;
}

.pain-btn {
  aspect-ratio: 1;
  border-radius: 10px;
  border: 2px solid var(--gray-1);
  background: white;
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
  cursor: pointer;
  transition: all 0.12s;
}
.pain-btn.selected {
  border-color: #3057F2;
  background: #3057F2;
  color: white;
}

.pain-legend {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--gray-3);
  margin-bottom: 8px;
}

.upload-zone {
  border: 2px dashed #3057F2;
  border-radius: 12px;
  background: var(--blue-xl);
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  margin-bottom: 12px;
}
.upload-icon { font-size: 24px; }
.upload-text { font-size: 14px; font-weight: 600; color: #3057F2; }
.upload-hint { font-size: 12px; color: var(--gray-3); }

.file-list  { display: flex; flex-direction: column; gap: 6px; }
.file-row   { display: flex; align-items: center; gap: 8px; background: white; border: 1.5px solid var(--gray-1); border-radius: 8px; padding: 8px 12px; }
.file-icon  { font-size: 14px; }
.file-name  { flex: 1; font-size: 12px; color: var(--ink); }
.file-remove { background: none; border: none; font-size: 16px; color: var(--gray-3); cursor: pointer; }

.error-msg { font-size: 13px; color: #DC2626; margin-top: 8px; }

.btn-back {
  padding: 11px 24px;
  border-radius: 10px;
  border: 1.5px solid var(--gray-1);
  background: white;
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-4);
  cursor: pointer;
}
.btn-next {
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  background: #3057F2;
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: white;
  cursor: pointer;
}

/* Done */
.done-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  gap: 12px;
}

.done-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #DCFCE7;
  color: #16A34A;
  font-size: 28px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.done-title { font-size: 22px; font-weight: 700; color: var(--ink); }
.done-sub   { font-size: 14px; color: var(--gray-3); max-width: 320px; line-height: 1.6; }

.btn-done {
  padding: 12px 32px;
  border-radius: 10px;
  background: #3057F2;
  font-size: 14px;
  font-weight: 600;
  color: white;
  text-decoration: none;
  margin-top: 8px;
}

/* ── mobile ── */
.desk-layout { display: none; }

.mobile-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--gray-0);
}

.mob-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid var(--gray-1);
}

.back-btn {
  color: var(--ink);
  display: flex;
  align-items: center;
  flex-shrink: 0;
  text-decoration: none;
}

.mob-progress-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.mob-prog-bar {
  height: 6px;
  background: var(--gray-1);
  border-radius: 99px;
  overflow: hidden;
}
.mob-prog-fill { height: 100%; background: #3057F2; border-radius: 99px; transition: width 0.3s; }
.mob-prog-label { font-size: 11px; color: var(--gray-3); }

.mob-body {
  flex: 1;
  padding: 24px 20px;
  overflow-y: auto;
}

.mob-footer {
  background: white;
  border-top: 1px solid var(--gray-1);
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
    width: 260px;
    background: #1C3FAA;
    padding: 28px 24px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    flex-shrink: 0;
  }

  .desk-back {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: rgba(255,255,255,0.7);
    font-weight: 500;
    text-decoration: none;
  }

  .desk-stepper { display: flex; flex-direction: column; gap: 0; }

  .desk-step {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 0;
    position: relative;
  }

  .desk-step::before {
    content: '';
    position: absolute;
    left: 15px;
    top: 36px;
    width: 2px;
    height: calc(100% - 20px);
    background: rgba(255,255,255,0.15);
  }
  .desk-step:last-child::before { display: none; }
  .desk-step.done::before { background: rgba(255,255,255,0.5); }

  .desk-step-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    flex-shrink: 0;
    border: 2px solid rgba(255,255,255,0.3);
    color: rgba(255,255,255,0.4);
    position: relative;
    z-index: 1;
    background: #1C3FAA;
  }
  .desk-step.active .desk-step-circle { border-color: white; color: white; background: rgba(255,255,255,0.15); }
  .desk-step.done   .desk-step-circle { border-color: white; color: #1C3FAA; background: white; }

  .desk-step-label { font-size: 13px; color: rgba(255,255,255,0.45); }
  .desk-step.active .desk-step-label { color: white; font-weight: 600; }
  .desk-step.done   .desk-step-label { color: rgba(255,255,255,0.7); }

  .sidebar-doc {
    margin-top: auto;
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(255,255,255,0.08);
    border-radius: 10px;
    padding: 12px;
  }

  .doc-avatar-sm {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255,255,255,0.15);
    overflow: hidden;
    flex-shrink: 0;
  }
  .doc-avatar-sm svg { width: 100%; height: 100%; }

  .sidebar-doc-name { font-size: 13px; font-weight: 700; color: white; }
  .sidebar-doc-spec  { font-size: 11px; color: rgba(255,255,255,0.5); }

  .desk-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 48px 56px;
    background: var(--gray-0);
  }

  .desk-content { flex: 1; max-width: 560px; }

  .reasons-grid-desk {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .desk-options-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .desk-footer {
    display: flex;
    gap: 12px;
    align-items: center;
    padding-top: 24px;
    max-width: 380px;
  }
  .desk-footer .btn-next { flex: unset; padding: 12px 40px; }
}
</style>
