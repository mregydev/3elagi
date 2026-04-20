<script setup lang="ts">
import MCQChip from '~/modules/patient/components/MCQChip.vue'
import CheckChip from '~/modules/patient/components/CheckChip.vue'
import type { OnboardingAnswers } from '~/modules/patient/types'

const { t } = useI18n()

useHead({ title: computed(() => t('meta.onboarding')) })

const stepsList = computed(() => [
  { id: 1, label: t('onboarding.steps.basic.label'), sub: t('onboarding.steps.basic.sub') },
  { id: 2, label: t('onboarding.steps.history.label'), sub: t('onboarding.steps.history.sub') },
  { id: 3, label: t('onboarding.steps.meds.label'), sub: t('onboarding.steps.meds.sub') },
  { id: 4, label: t('onboarding.steps.allergies.label'), sub: t('onboarding.steps.allergies.sub') },
  { id: 5, label: t('onboarding.steps.insurance.label'), sub: t('onboarding.steps.insurance.sub') },
  { id: 6, label: t('onboarding.steps.documents.label'), sub: t('onboarding.steps.documents.sub') },
])
const TOTAL = 6

const insuranceProviderKeys = ['allianz', 'metlife', 'axa', 'bupa', 'globemed', 'other'] as const

const conditionOptions = [
  ['diabetes', '🩸'],
  ['hypertension', '💓'],
  ['heart', '❤️'],
  ['asthma', '🫁'],
  ['kidney', '🫘'],
  ['thyroid', '🦋'],
  ['none', '✅'],
] as const

const allergyOptions = [
  ['penicillin', '💊'],
  ['aspirin', '🔴'],
  ['sulfa', '⚗️'],
  ['latex', '🧤'],
  ['food', '🥜'],
  ['none', '✅'],
] as const

const genderOptions = [
  ['male', '♂'],
  ['female', '♀'],
  ['other', '⚧'],
  ['prefer_not', '🔒'],
] as const

const step = ref(0)
const error = ref('')
const fileInputRef = ref<HTMLInputElement | null>(null)

const answers = reactive<OnboardingAnswers>({
  name: '',
  dob: '',
  gender: '',
  conditions: [],
  hasMeds: '',
  meds: '',
  allergies: [],
  hasInsurance: '',
  insuranceProvider: '',
  documents: [],
})

const isForm = computed(() => step.value >= 1 && step.value <= 6)
const isReview = computed(() => step.value === 7)
const isDone = computed(() => step.value === 8)
const pct = computed(() => Math.round((step.value / TOTAL) * 100))

function fmtConditions() {
  if (!answers.conditions.length) return t('common.dash')
  return answers.conditions.map(c => t(`onboarding.conditions.${c}`)).join(', ')
}

function fmtAllergies() {
  if (!answers.allergies.length) return t('common.dash')
  return answers.allergies.map(a => t(`onboarding.allergies.${a}`)).join(', ')
}

function genderDisplay() {
  return answers.gender ? t(`onboarding.genderKeys.${answers.gender}`) : ''
}

function yesNoDisplay(v: string) {
  return v === 'yes' ? t('common.yes') : v === 'no' ? t('common.no') : ''
}

function providerDisplay() {
  if (!answers.insuranceProvider) return ''
  return t(`onboarding.insuranceProviders.${answers.insuranceProvider}`)
}

function validate() {
  error.value = ''
  if (step.value === 1) {
    if (!answers.name.trim()) { error.value = t('onboarding.errors.name'); return false }
    if (!answers.dob.trim()) { error.value = t('onboarding.errors.dob'); return false }
    if (!answers.gender) { error.value = t('onboarding.errors.gender'); return false }
  }
  if (step.value === 2 && !answers.conditions.length) { error.value = t('onboarding.errors.conditions'); return false }
  if (step.value === 3 && !answers.hasMeds) { error.value = t('onboarding.errors.meds'); return false }
  if (step.value === 4 && !answers.allergies.length) { error.value = t('onboarding.errors.allergies'); return false }
  if (step.value === 5) {
    if (!answers.hasInsurance) { error.value = t('onboarding.errors.insurance'); return false }
    if (answers.hasInsurance === 'yes' && !answers.insuranceProvider) { error.value = t('onboarding.errors.provider'); return false }
  }
  return true
}

function next() {
  if (!validate()) return
  step.value++
}

function back() {
  error.value = ''
  step.value--
}

function goTo(s: number) {
  error.value = ''
  step.value = s
}

function toggleCondition(key: string) {
  if (key === 'none') {
    answers.conditions = answers.conditions.includes('none') ? [] : ['none']
  } else {
    const without = answers.conditions.filter(x => x !== 'none')
    answers.conditions = without.includes(key) ? without.filter(x => x !== key) : [...without, key]
  }
}

function toggleAllergy(key: string) {
  if (key === 'none') {
    answers.allergies = answers.allergies.includes('none') ? [] : ['none']
  } else {
    const without = answers.allergies.filter(x => x !== 'none')
    answers.allergies = without.includes(key) ? without.filter(x => x !== key) : [...without, key]
  }
}

function addFiles(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files) return
  Array.from(input.files).forEach(f => answers.documents.push(f.name))
  input.value = ''
}

function removeFile(i: number) {
  answers.documents.splice(i, 1)
}

const reviewSections = computed(() => [
  {
    title: t('onboarding.reviewBasic'),
    targetStep: 1,
    rows: [
      [t('onboarding.rowName'), answers.name],
      [t('onboarding.rowDob'), answers.dob],
      [t('onboarding.rowGender'), genderDisplay()],
    ],
  },
  {
    title: t('onboarding.reviewHistory'),
    targetStep: 2,
    rows: [
      [t('onboarding.rowConditions'), fmtConditions()],
      [t('onboarding.rowMedications'), answers.hasMeds === 'yes' ? (answers.meds || t('onboarding.medsNotSpecified')) : t('onboarding.medsNone')],
      [t('onboarding.rowAllergies'), fmtAllergies()],
    ],
  },
  {
    title: t('onboarding.reviewInsurance'),
    targetStep: 5,
    rows: [
      [t('onboarding.rowHasInsurance'), yesNoDisplay(answers.hasInsurance)],
      ...(answers.hasInsurance === 'yes' ? [[t('onboarding.rowProvider'), providerDisplay()] as [string, string]] : []),
    ],
  },
  {
    title: t('onboarding.reviewDocuments'),
    targetStep: 6,
    rows: [
      [t('onboarding.rowUploaded'), answers.documents.length > 0 ? t('onboarding.filesCount', { n: answers.documents.length }) : t('onboarding.filesNone')],
    ],
  },
])
</script>

<template>
  <div>
    <!-- ════════════════════════════════════════════
         MOBILE: centered card on blue background
         ════════════════════════════════════════════ -->
    <div class="mobile-shell">
      <div class="mobile-card">

        <!-- Card header -->
        <div v-if="step > 0 && step < 8" class="card-header">
          <div class="card-header-top">
            <AppLogo :height="30" />
            <span class="step-badge">{{ isReview ? t('onboarding.reviewBadge') : stepsList[step - 1]?.label }}</span>
          </div>
          <div v-if="isForm" class="progress-bar-wrap">
            <div class="progress-labels">
              <span>{{ t('onboarding.stepOf', { current: step, total: TOTAL }) }}</span>
              <span class="progress-pct">{{ pct }}%</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" :style="{ width: pct + '%' }" />
            </div>
          </div>
          <div v-if="isReview" class="progress-bar-wrap">
            <div class="progress-labels">
              <span>{{ t('onboarding.reviewStep') }}</span>
              <span class="progress-pct">100%</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" style="width: 100%" />
            </div>
          </div>
        </div>

        <!-- Step content -->
        <div class="card-body">

          <!-- ── Welcome ───────────────────────────── -->
          <div v-if="step === 0" class="welcome-screen">
            <AppLogo :height="48" />
            <div class="welcome-heading">
              <h1>{{ t('onboarding.welcomeTitle') }}</h1>
              <p>{{ t('onboarding.welcomeSubtitle') }}</p>
            </div>
            <div class="welcome-checklist">
              <p class="checklist-title">{{ t('onboarding.checklistTitle') }}</p>
              <div class="checklist-item"><span>🧍</span><span>{{ t('onboarding.checklist1') }}</span></div>
              <div class="checklist-item"><span>🏥</span><span>{{ t('onboarding.checklist2') }}</span></div>
              <div class="checklist-item"><span>💊</span><span>{{ t('onboarding.checklist3') }}</span></div>
              <div class="checklist-item"><span>🪪</span><span>{{ t('onboarding.checklist4') }}</span></div>
            </div>
            <p class="welcome-hint">{{ t('onboarding.timeHint') }}</p>
            <button class="primary-btn" @click="step = 1">{{ t('onboarding.getStarted') }}</button>
          </div>

          <!-- ── Step 1: Basic Info ─────────────────── -->
          <div v-else-if="step === 1" class="step-content">
            <div class="step-heading">
              <h2>{{ t('onboarding.basicHeading') }}</h2>
              <p>{{ t('onboarding.basicSub') }}</p>
            </div>
            <div class="field-grid">
              <div class="field">
                <label>{{ t('onboarding.fullName') }}</label>
                <input v-model="answers.name" type="text" :placeholder="t('onboarding.namePlaceholder')" />
              </div>
              <div class="field">
                <label>{{ t('onboarding.dob') }}</label>
                <input v-model="answers.dob" type="text" :placeholder="t('onboarding.dobPlaceholder')" />
              </div>
            </div>
            <div class="chip-section">
              <label class="chip-label">{{ t('onboarding.gender') }}</label>
              <div class="chip-grid">
                <MCQChip
                  v-for="[g, icon] in genderOptions"
                  :key="g"
                  :label="t(`onboarding.genderKeys.${g}`)"
                  :icon="icon"
                  :selected="answers.gender === g"
                  @select="answers.gender = g"
                />
              </div>
            </div>
          </div>

          <!-- ── Step 2: Medical History ───────────── -->
          <div v-else-if="step === 2" class="step-content">
            <div class="step-heading">
              <h2>{{ t('onboarding.historyHeading') }}</h2>
              <p>{{ t('onboarding.historySub') }}</p>
            </div>
            <div class="chip-grid">
              <CheckChip
                v-for="[c, icon] in conditionOptions"
                :key="c"
                :label="t(`onboarding.conditions.${c}`)"
                :icon="icon"
                :selected="answers.conditions.includes(c)"
                @toggle="toggleCondition(c)"
              />
            </div>
          </div>

          <!-- ── Step 3: Medications ───────────────── -->
          <div v-else-if="step === 3" class="step-content">
            <div class="step-heading">
              <h2>{{ t('onboarding.medsHeading') }}</h2>
              <p>{{ t('onboarding.medsSub') }}</p>
            </div>
            <div class="chip-section">
              <label class="chip-label">{{ t('onboarding.medsQuestion') }}</label>
              <div class="chip-grid">
                <MCQChip
                  :label="t('common.yes')"
                  :selected="answers.hasMeds === 'yes'"
                  @select="answers.hasMeds = 'yes'"
                />
                <MCQChip
                  :label="t('common.no')"
                  :selected="answers.hasMeds === 'no'"
                  @select="answers.hasMeds = 'no'"
                />
              </div>
            </div>
            <div v-if="answers.hasMeds === 'yes'" class="field">
              <label>{{ t('onboarding.medsListLabel') }} <span class="optional">{{ t('common.optional') }}</span></label>
              <input v-model="answers.meds" type="text" :placeholder="t('onboarding.medsListPlaceholder')" />
            </div>
          </div>

          <!-- ── Step 4: Allergies ─────────────────── -->
          <div v-else-if="step === 4" class="step-content">
            <div class="step-heading">
              <h2>{{ t('onboarding.allergiesHeading') }}</h2>
              <p>{{ t('onboarding.historySub') }}</p>
            </div>
            <div class="chip-grid">
              <CheckChip
                v-for="[a, icon] in allergyOptions"
                :key="a"
                :label="t(`onboarding.allergies.${a}`)"
                :icon="icon"
                :selected="answers.allergies.includes(a)"
                @toggle="toggleAllergy(a)"
              />
            </div>
          </div>

          <!-- ── Step 5: Insurance ─────────────────── -->
          <div v-else-if="step === 5" class="step-content">
            <div class="step-heading">
              <h2>{{ t('onboarding.insuranceHeading') }}</h2>
              <p>{{ t('onboarding.insuranceSub') }}</p>
            </div>
            <div class="chip-section">
              <label class="chip-label">{{ t('onboarding.insuranceQuestion') }}</label>
              <div class="chip-grid">
                <MCQChip
                  :label="t('common.yes')"
                  :selected="answers.hasInsurance === 'yes'"
                  @select="() => { answers.hasInsurance = 'yes' }"
                />
                <MCQChip
                  :label="t('common.no')"
                  :selected="answers.hasInsurance === 'no'"
                  @select="() => { answers.hasInsurance = 'no'; answers.insuranceProvider = '' }"
                />
              </div>
            </div>
            <div v-if="answers.hasInsurance === 'yes'" class="chip-section">
              <label class="chip-label">{{ t('onboarding.insurancePick') }}</label>
              <div class="chip-grid">
                <MCQChip
                  v-for="p in insuranceProviderKeys"
                  :key="p"
                  :label="t(`onboarding.insuranceProviders.${p}`)"
                  :selected="answers.insuranceProvider === p"
                  @select="answers.insuranceProvider = p"
                />
              </div>
            </div>
          </div>

          <!-- ── Step 6: Documents ─────────────────── -->
          <div v-else-if="step === 6" class="step-content">
            <div class="step-heading">
              <h2>{{ t('onboarding.documentsHeading') }}</h2>
              <p>{{ t('onboarding.documentsSub') }}</p>
            </div>
            <div class="hint-box">
              {{ t('onboarding.documentsHint') }}
            </div>
            <div class="upload-zone" @click="fileInputRef?.click()">
              <span class="upload-icon">📎</span>
              <span class="upload-title">{{ t('onboarding.uploadTap') }}</span>
              <span class="upload-hint">{{ t('onboarding.uploadTypes') }}</span>
              <input ref="fileInputRef" type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none" @change="addFiles" />
            </div>
            <div v-for="(f, i) in answers.documents" :key="i" class="file-item">
              <span>📄</span>
              <span class="file-name">{{ f }}</span>
              <button class="remove-file" @click="removeFile(i)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p class="optional-note">{{ t('onboarding.documentsOptional') }}</p>
          </div>

          <!-- ── Review ────────────────────────────── -->
          <div v-else-if="isReview" class="step-content">
            <div class="step-heading">
              <h2>{{ t('onboarding.reviewHeading') }}</h2>
              <p>{{ t('onboarding.reviewSub') }}</p>
            </div>
            <div class="review-grid">
              <div v-for="sec in reviewSections" :key="sec.title" class="review-card">
                <div class="review-card-header">
                  <span class="review-card-title">{{ sec.title }}</span>
                  <button class="edit-btn" @click="goTo(sec.targetStep)">{{ t('common.edit') }}</button>
                </div>
                <div v-for="[k, v] in sec.rows" :key="k" class="review-row">
                  <span class="review-key">{{ k }}</span>
                  <span class="review-val">{{ v || t('common.dash') }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- ── Done ──────────────────────────────── -->
          <div v-else-if="isDone" class="done-screen">
            <div class="done-circle">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2.5" stroke-linecap="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <div>
              <h2 class="done-title">{{ t('onboarding.doneTitle') }}</h2>
              <p class="done-desc">{{ t('onboarding.doneDesc') }}</p>
            </div>
            <div class="done-info-box">
              <span class="done-info-title">{{ t('onboarding.doneNext') }}</span>
              <p>{{ t('onboarding.doneNextBody') }}</p>
            </div>
            <NuxtLink to="/" class="primary-btn">{{ t('onboarding.findDoctor') }}</NuxtLink>
          </div>

        </div>

        <!-- Error banner -->
        <div v-if="error" class="error-banner">{{ error }}</div>

        <!-- Card footer nav -->
        <div v-if="isForm || isReview" class="card-footer">
          <button v-if="step > 1" class="secondary-btn" @click="back">{{ t('onboarding.footerBack') }}</button>
          <button
            class="primary-btn footer-primary"
            @click="isReview ? (step = 8) : next()"
          >
            {{ isReview ? t('onboarding.submitProfile') : step === 6 ? t('onboarding.reviewNav') : t('onboarding.nextNav') }}
          </button>
        </div>

      </div>
    </div>

    <!-- ════════════════════════════════════════════
         DESKTOP: sidebar + right panel
         ════════════════════════════════════════════ -->
    <div class="desktop-shell">

      <!-- Sidebar -->
      <aside v-if="!isDone" class="onboarding-sidebar">
        <AppLogo :height="38" dark />

        <div class="stepper">
          <div
            v-for="s in stepsList"
            :key="s.id"
            class="stepper-item"
          >
            <!-- Connector line -->
            <div
              class="stepper-line"
              :class="{ done: step > s.id }"
            />
            <!-- Dot -->
            <div
              class="stepper-dot"
              :class="{
                done: step > s.id,
                active: step === s.id,
                future: step < s.id,
              }"
            >
              <svg v-if="step > s.id" width="14" height="14" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="#1C3FAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span v-else :class="{ 'dot-active': step === s.id, 'dot-future': step < s.id }">{{ s.id }}</span>
            </div>
            <!-- Label -->
            <div
              class="stepper-label"
              :class="{ clickable: step > s.id }"
              @click="step > s.id && goTo(s.id)"
            >
              <span :class="{ 'label-active': step === s.id || step > s.id, 'label-future': step < s.id }">{{ s.label }}</span>
              <span class="label-sub" :class="{ 'sub-active': step === s.id, 'sub-future': step < s.id }">{{ s.sub }}</span>
            </div>
          </div>

          <!-- Review pseudo-step -->
          <div class="stepper-item last">
            <div
              class="stepper-dot"
              :class="{
                done: step > 7,
                active: step === 7,
                future: step < 7,
              }"
            >
              <svg v-if="step > 7" width="14" height="14" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="#1C3FAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span v-else :class="{ 'dot-active': step === 7, 'dot-future': step < 7 }">✓</span>
            </div>
            <div class="stepper-label">
              <span :class="{ 'label-active': step >= 7, 'label-future': step < 7 }">{{ t('onboarding.reviewSidebar') }}</span>
              <span class="label-sub" :class="{ 'sub-active': step === 7, 'sub-future': step < 7 }">{{ t('onboarding.reviewSidebarSub') }}</span>
            </div>
          </div>
        </div>

        <div class="security-badge">
          <span>{{ t('onboarding.securityTitle') }}</span>
          <p>{{ t('onboarding.securityText') }}</p>
        </div>
      </aside>

      <!-- Right panel -->
      <div class="desktop-right" :class="{ 'done-bg': isDone }">

        <!-- Progress dots (form steps only) -->
        <div v-if="isForm" class="desktop-progress-bar">
          <div class="desktop-dots">
            <div
              v-for="s in stepsList"
              :key="s.id"
              class="desktop-dot"
              :class="{ filled: step >= s.id }"
            />
          </div>
          <span class="desktop-step-label">{{ t('onboarding.stepOf', { current: step, total: TOTAL }) }}</span>
        </div>

        <!-- Scrollable content -->
        <div class="desktop-content">

          <!-- Welcome -->
          <div v-if="step === 0" class="welcome-desktop">
            <div>
              <h1 class="welcome-h1">{{ t('onboarding.welcomeTitle') }}</h1>
              <p class="welcome-p">{{ t('onboarding.welcomeSubtitle') }}</p>
            </div>
            <div class="welcome-checklist">
              <p class="checklist-title">{{ t('onboarding.checklistTitle') }}</p>
              <div class="checklist-item"><span>🧍</span><span>{{ t('onboarding.checklist1') }}</span></div>
              <div class="checklist-item"><span>🏥</span><span>{{ t('onboarding.checklist2') }}</span></div>
              <div class="checklist-item"><span>💊</span><span>{{ t('onboarding.checklist3') }}</span></div>
              <div class="checklist-item"><span>🪪</span><span>{{ t('onboarding.checklist4') }}</span></div>
            </div>
            <p class="welcome-hint">{{ t('onboarding.timeHint') }}</p>
            <button class="primary-btn desktop-start-btn" @click="step = 1">{{ t('onboarding.getStarted') }}</button>
          </div>

          <!-- Steps 1–6 -->
          <template v-else-if="isForm">
            <div v-if="step === 1" class="step-content">
              <div class="step-heading desktop">
                <h2>{{ t('onboarding.basicHeading') }}</h2>
                <p>{{ t('onboarding.basicSub') }}</p>
              </div>
              <div class="field-grid two-col">
                <div class="field">
                  <label>{{ t('onboarding.fullName') }}</label>
                  <input v-model="answers.name" type="text" :placeholder="t('onboarding.namePlaceholder')" />
                </div>
                <div class="field">
                  <label>{{ t('onboarding.dob') }}</label>
                  <input v-model="answers.dob" type="text" :placeholder="t('onboarding.dobPlaceholder')" />
                </div>
              </div>
              <div class="chip-section">
                <label class="chip-label">{{ t('onboarding.gender') }}</label>
                <div class="chip-grid two-col">
                  <MCQChip
                    v-for="[g, icon] in genderOptions"
                    :key="g"
                    :label="t(`onboarding.genderKeys.${g}`)"
                    :icon="icon"
                    :selected="answers.gender === g"
                    :wide="true"
                    @select="answers.gender = g"
                  />
                </div>
              </div>
            </div>

            <div v-else-if="step === 2" class="step-content">
              <div class="step-heading desktop">
                <h2>{{ t('onboarding.historyHeading') }}</h2>
                <p>{{ t('onboarding.historySub') }}</p>
              </div>
              <div class="chip-grid two-col">
                <CheckChip
                  v-for="[c, icon] in conditionOptions"
                  :key="c"
                  :label="t(`onboarding.conditions.${c}`)"
                  :icon="icon"
                  :selected="answers.conditions.includes(c)"
                  :wide="true"
                  @toggle="toggleCondition(c)"
                />
              </div>
            </div>

            <div v-else-if="step === 3" class="step-content">
              <div class="step-heading desktop"><h2>{{ t('onboarding.medsHeading') }}</h2><p>{{ t('onboarding.medsSub') }}</p></div>
              <div class="chip-section">
                <label class="chip-label">{{ t('onboarding.medsQuestion') }}</label>
                <div class="chip-grid two-col">
                  <MCQChip :label="t('common.yes')" :selected="answers.hasMeds === 'yes'" :wide="true" @select="answers.hasMeds = 'yes'" />
                  <MCQChip :label="t('common.no')" :selected="answers.hasMeds === 'no'" :wide="true" @select="answers.hasMeds = 'no'" />
                </div>
              </div>
              <div v-if="answers.hasMeds === 'yes'" class="field">
                <label>{{ t('onboarding.medsListLabel') }} <span class="optional">{{ t('common.optional') }}</span></label>
                <input v-model="answers.meds" type="text" :placeholder="t('onboarding.medsListPlaceholder')" />
              </div>
            </div>

            <div v-else-if="step === 4" class="step-content">
              <div class="step-heading desktop"><h2>{{ t('onboarding.allergiesHeading') }}</h2><p>{{ t('onboarding.historySub') }}</p></div>
              <div class="chip-grid two-col">
                <CheckChip
                  v-for="[a, icon] in allergyOptions"
                  :key="a"
                  :label="t(`onboarding.allergies.${a}`)"
                  :icon="icon"
                  :selected="answers.allergies.includes(a)"
                  :wide="true"
                  @toggle="toggleAllergy(a)"
                />
              </div>
            </div>

            <div v-else-if="step === 5" class="step-content">
              <div class="step-heading desktop"><h2>{{ t('onboarding.insuranceHeading') }}</h2><p>{{ t('onboarding.insuranceSub') }}</p></div>
              <div class="chip-section">
                <label class="chip-label">{{ t('onboarding.insuranceQuestion') }}</label>
                <div class="chip-grid two-col">
                  <MCQChip
                    :label="t('common.yes')"
                    :selected="answers.hasInsurance === 'yes'"
                    :wide="true"
                    @select="() => { answers.hasInsurance = 'yes' }"
                  />
                  <MCQChip
                    :label="t('common.no')"
                    :selected="answers.hasInsurance === 'no'"
                    :wide="true"
                    @select="() => { answers.hasInsurance = 'no'; answers.insuranceProvider = '' }"
                  />
                </div>
              </div>
              <div v-if="answers.hasInsurance === 'yes'" class="chip-section">
                <label class="chip-label">{{ t('onboarding.insurancePick') }}</label>
                <div class="chip-grid two-col">
                  <MCQChip
                    v-for="p in insuranceProviderKeys"
                    :key="p"
                    :label="t(`onboarding.insuranceProviders.${p}`)"
                    :selected="answers.insuranceProvider === p"
                    :wide="true"
                    @select="answers.insuranceProvider = p"
                  />
                </div>
              </div>
            </div>

            <div v-else-if="step === 6" class="step-content">
              <div class="step-heading desktop"><h2>{{ t('onboarding.documentsHeading') }}</h2><p>{{ t('onboarding.documentsSub') }}</p></div>
              <div class="hint-box">{{ t('onboarding.documentsHint') }}</div>
              <div class="upload-zone" @click="fileInputRef?.click()">
                <span class="upload-icon">📎</span>
                <span class="upload-title">{{ t('onboarding.uploadClick') }}</span>
                <span class="upload-hint">{{ t('onboarding.uploadTypes') }}</span>
                <input ref="fileInputRef" type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style="display: none" @change="addFiles" />
              </div>
              <div v-for="(f, i) in answers.documents" :key="i" class="file-item">
                <span>📄</span>
                <span class="file-name">{{ f }}</span>
                <button class="remove-file" @click="removeFile(i)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              </div>
              <p class="optional-note">{{ t('onboarding.documentsOptional') }}</p>
            </div>
          </template>

          <!-- Review -->
          <div v-else-if="isReview" class="step-content">
            <div class="step-heading desktop"><h2>{{ t('onboarding.reviewHeading') }}</h2><p>{{ t('onboarding.reviewSub') }}</p></div>
            <div class="review-grid two-col">
              <div v-for="sec in reviewSections" :key="sec.title" class="review-card">
                <div class="review-card-header">
                  <span class="review-card-title">{{ sec.title }}</span>
                  <button class="edit-btn" @click="goTo(sec.targetStep)">{{ t('common.edit') }}</button>
                </div>
                <div v-for="[k, v] in sec.rows" :key="k" class="review-row">
                  <span class="review-key">{{ k }}</span>
                  <span class="review-val">{{ v || t('common.dash') }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Done -->
          <div v-else-if="isDone" class="done-screen desktop">
            <div class="done-circle">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2.5" stroke-linecap="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <div>
              <h2 class="done-title lg">{{ t('onboarding.doneTitle') }}</h2>
              <p class="done-desc">{{ t('onboarding.doneDesc') }}</p>
            </div>
            <div class="done-info-box">
              <span class="done-info-title">{{ t('onboarding.doneNext') }}</span>
              <p>{{ t('onboarding.doneNextBody') }}</p>
            </div>
            <NuxtLink to="/" class="primary-btn done-cta">{{ t('onboarding.findDoctor') }}</NuxtLink>
          </div>

        </div>

        <!-- Error banner -->
        <div v-if="error" class="error-banner desktop">{{ error }}</div>

        <!-- Bottom nav bar -->
        <div v-if="isForm || isReview" class="desktop-footer">
          <div>
            <button v-if="step > 1" class="secondary-btn" @click="back">{{ t('onboarding.footerBack') }}</button>
          </div>
          <button class="primary-btn desktop-next-btn" @click="isReview ? (step = 8) : next()">
            {{ isReview ? t('onboarding.submitProfile') : step === 6 ? t('onboarding.reviewNav') : t('onboarding.continueNav') }}
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* ── Show/hide shells ─────────────────────────────── */
.mobile-shell {
  min-height: 100vh;
  background: #EFF6FF;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.desktop-shell { display: none; }

/* ── Mobile card ─────────────────────────────────── */
.mobile-card {
  width: 100%;
  max-width: 420px;
  background: var(--white);
  border-radius: 20px;
  box-shadow: 0 8px 48px rgba(0, 0, 0, 0.10);
  overflow: hidden;
  min-height: 600px;
  display: flex;
  flex-direction: column;
}

.card-header {
  padding: 18px 20px 14px;
  border-bottom: 1px solid var(--gray-1);
}

.card-header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.step-badge {
  font-size: 12px;
  font-weight: 600;
  color: var(--gray-3);
}

.progress-bar-wrap { width: 100%; }

.progress-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 12px;
  color: var(--gray-3);
  font-weight: 500;
}

.progress-pct { font-weight: 600; color: #3057F2; }

.progress-track {
  width: 100%;
  height: 5px;
  background: var(--gray-1);
  border-radius: 99px;
}

.progress-fill {
  height: 100%;
  background: #3057F2;
  border-radius: 99px;
  transition: width 0.4s ease;
}

.card-body {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  max-height: 72vh;
}

.card-footer {
  padding: 14px 20px;
  border-top: 1px solid var(--gray-1);
  display: flex;
  gap: 10px;
  background: var(--white);
  flex-shrink: 0;
}

/* ── Welcome screen ───────────────────────────────── */
.welcome-screen {
  padding: 48px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  text-align: center;
}

.welcome-heading h1 {
  font-size: 26px;
  font-weight: 700;
  line-height: 1.2;
}

.welcome-heading p {
  font-size: 15px;
  color: var(--gray-3);
  margin-top: 12px;
  line-height: 1.6;
}

.welcome-checklist {
  background: #EFF6FF;
  border-radius: 14px;
  padding: 18px 22px;
  width: 100%;
  text-align: left;
}

.checklist-title {
  font-size: 13px;
  font-weight: 600;
  color: #3057F2;
  margin-bottom: 10px;
}

.checklist-item {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 8px;
  font-size: 13px;
  color: var(--gray-4);
}

.welcome-hint {
  font-size: 12px;
  color: var(--gray-2);
  margin-top: -8px;
}

/* ── Step content ─────────────────────────────────── */
.step-content {
  padding: 22px 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.step-heading h2 {
  font-size: 20px;
  font-weight: 700;
}

.step-heading p {
  font-size: 14px;
  color: var(--gray-3);
  margin-top: 4px;
}

.step-heading.desktop h2 { font-size: 26px; }
.step-heading.desktop p  { font-size: 15px; }

.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.field label {
  font-size: 13px;
  font-weight: 600;
  color: var(--gray-4);
  display: flex;
  justify-content: space-between;
}

.optional {
  font-size: 12px;
  color: var(--gray-2);
  font-weight: 400;
}

.field input {
  width: 100%;
  height: 44px;
  padding: 0 14px;
  border: 1.5px solid var(--gray-1);
  border-radius: 10px;
  font-size: 14px;
  color: var(--ink);
  background: var(--white);
  outline: none;
  transition: border-color 0.12s;
  font-family: 'DM Sans', sans-serif;
}

.field input:focus { border-color: #3057F2; }
.field input::placeholder { color: var(--gray-2); }

.field-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}

.field-grid.two-col {
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.chip-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chip-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--gray-4);
  display: block;
}

.chip-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.chip-grid.two-col {
  grid-template-columns: 1fr 1fr;
}

/* ── Upload ───────────────────────────────────────── */
.hint-box {
  background: var(--gray-0);
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 12px;
  color: var(--gray-3);
}

.upload-zone {
  border: 2px dashed #3057F2;
  border-radius: 12px;
  padding: 32px 20px;
  text-align: center;
  cursor: pointer;
  background: #EFF6FF;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.upload-icon { font-size: 32px; }

.upload-title {
  font-size: 14px;
  font-weight: 600;
  color: #3057F2;
}

.upload-hint {
  font-size: 12px;
  color: var(--gray-3);
}

.file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--white);
  border: 1px solid var(--gray-1);
  border-radius: 8px;
  padding: 8px 14px;
}

.file-name { font-size: 13px; flex: 1; }

.remove-file {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.optional-note {
  font-size: 12px;
  color: var(--gray-2);
  text-align: center;
}

/* ── Review ───────────────────────────────────────── */
.review-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}

.review-grid.two-col {
  grid-template-columns: 1fr 1fr;
}

.review-card {
  background: var(--white);
  border: 1px solid var(--gray-1);
  border-radius: 12px;
  padding: 14px 16px;
}

.review-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.review-card-title {
  font-size: 13px;
  font-weight: 700;
  color: #3057F2;
}

.edit-btn {
  font-size: 12px;
  font-weight: 600;
  color: #3057F2;
  background: none;
  border: none;
  cursor: pointer;
}

.review-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 10px 0;
  border-bottom: 1px solid var(--gray-1);
}

.review-row:last-child { border-bottom: none; }

.review-key {
  font-size: 13px;
  color: var(--gray-3);
  width: 38%;
  flex-shrink: 0;
}

.review-val {
  font-size: 13px;
  font-weight: 500;
  color: var(--ink);
  text-align: right;
  flex: 1;
}

/* ── Done screen ──────────────────────────────────── */
.done-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 28px;
  gap: 24px;
  text-align: center;
}

.done-screen.desktop {
  max-width: 500px;
  margin: 0 auto;
  padding: 64px 48px;
  justify-content: center;
}

.done-circle {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: #DCFCE7;
  display: flex;
  align-items: center;
  justify-content: center;
}

.done-title {
  font-size: 24px;
  font-weight: 700;
}

.done-title.lg { font-size: 30px; }

.done-desc {
  font-size: 15px;
  color: var(--gray-3);
  margin-top: 10px;
  line-height: 1.6;
}

.done-info-box {
  background: #EFF6FF;
  border: 1px solid #DBEAFE;
  border-radius: 14px;
  padding: 18px 22px;
  width: 100%;
  text-align: left;
}

.done-info-title {
  font-size: 14px;
  font-weight: 600;
  color: #3057F2;
  display: block;
  margin-bottom: 6px;
}

.done-info-box p {
  font-size: 13px;
  color: var(--gray-3);
}

/* ── Buttons ──────────────────────────────────────── */
.primary-btn {
  width: 100%;
  height: 52px;
  background: #3057F2;
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: background 0.15s;
}

.primary-btn:hover { background: #2448C8; }

.footer-primary { flex: 2; height: 46px; font-size: 15px; }

.secondary-btn {
  flex: 1;
  height: 46px;
  background: var(--white);
  border: 1.5px solid var(--gray-1);
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  color: var(--gray-4);
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
}

/* ── Error ───────────────────────────────────────── */
.error-banner {
  background: #FEE2E2;
  border: 1px solid #DC2626;
  border-radius: 8px;
  padding: 9px 20px;
  margin: 0 20px;
  font-size: 13px;
  color: #DC2626;
}

.error-banner.desktop {
  margin: 0 52px;
}

/* ════════════════════════════════════════════
   DESKTOP layout (900px+)
   ════════════════════════════════════════════ */
@media (min-width: 900px) {
  .mobile-shell { display: none; }

  .desktop-shell {
    display: flex;
    height: 100vh;
    overflow: hidden;
  }

  /* Sidebar */
  .onboarding-sidebar {
    width: 320px;
    background: #1C3FAA;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    padding: 40px 32px;
    height: 100%;
    overflow-y: auto;
  }

  .stepper {
    margin-top: 48px;
    flex: 1;
  }

  .stepper-item {
    display: flex;
    gap: 14px;
    position: relative;
  }

  .stepper-item:not(.last) { padding-bottom: 32px; }

  .stepper-line {
    position: absolute;
    left: 17px;
    top: 36px;
    width: 2px;
    height: 32px;
    background: rgba(255, 255, 255, 0.15);
    transition: background 0.3s;
  }

  .stepper-line.done { background: rgba(255, 255, 255, 0.5); }

  .stepper-dot {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s;
  }

  .stepper-dot.done    { background: rgba(255, 255, 255, 0.9); }
  .stepper-dot.active  { background: white; }
  .stepper-dot.future  { background: rgba(255, 255, 255, 0.12); border: 2px solid rgba(255, 255, 255, 0.25); }

  .dot-active { font-size: 13px; font-weight: 700; color: #3057F2; }
  .dot-future { font-size: 13px; font-weight: 700; color: rgba(255, 255, 255, 0.5); }

  .stepper-label { display: flex; flex-direction: column; gap: 2px; padding-top: 6px; }
  .stepper-label.clickable { cursor: pointer; }

  .label-active { font-size: 14px; font-weight: 700; color: white; display: block; }
  .label-future { font-size: 14px; font-weight: 400; color: rgba(255, 255, 255, 0.45); display: block; }

  .label-sub   { font-size: 12px; }
  .sub-active  { color: rgba(255, 255, 255, 0.65); }
  .sub-future  { color: rgba(255, 255, 255, 0.3); }

  .security-badge {
    margin-top: 32px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 14px 16px;
  }

  .security-badge span { font-size: 12px; color: rgba(255, 255, 255, 0.5); display: block; margin-bottom: 4px; }
  .security-badge p    { font-size: 12px; color: rgba(255, 255, 255, 0.35); }

  /* Right panel */
  .desktop-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: var(--white);
    overflow: hidden;
  }

  .desktop-right.done-bg { background: #EFF6FF; }

  .desktop-progress-bar {
    padding: 28px 52px 0;
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .desktop-dots {
    display: flex;
    gap: 8px;
  }

  .desktop-dot {
    width: 32px;
    height: 4px;
    border-radius: 99px;
    background: var(--gray-1);
    transition: background 0.3s;
  }

  .desktop-dot.filled { background: #3057F2; }

  .desktop-step-label {
    font-size: 13px;
    color: var(--gray-3);
    font-weight: 500;
  }

  .desktop-content {
    flex: 1;
    overflow-y: auto;
    padding: 28px 52px;
  }

  .welcome-desktop {
    max-width: 520px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding-top: 40px;
  }

  .welcome-h1 { font-size: 34px; font-weight: 700; line-height: 1.2; }
  .welcome-p  { font-size: 16px; color: var(--gray-3); margin-top: 12px; line-height: 1.6; }

  .desktop-start-btn {
    max-width: 320px;
    height: 52px;
    font-size: 16px;
  }

  .desktop-footer {
    padding: 20px 52px;
    border-top: 1px solid var(--gray-1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    background: var(--white);
  }

  .desktop-next-btn {
    width: auto;
    padding: 0 36px;
    height: 44px;
    font-size: 15px;
    border-radius: 10px;
  }

  .secondary-btn {
    height: 44px;
    flex: none;
    padding: 0 24px;
    border-radius: 10px;
  }

  .done-cta {
    max-width: 320px;
    height: 52px;
  }
}
</style>
