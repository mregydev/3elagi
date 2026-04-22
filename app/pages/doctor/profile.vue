<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'

const { t } = useI18n()
useHead({ title: computed(() => t('meta.doctorProfile')) })

// Doctor ID — in production this would come from the auth session
const doctorId = 'doc-001'

// ── Tabs ──────────────────────────────────────────────────────────────
type Tab = 'profile' | 'documents' | 'faq'
const activeTab = ref<Tab>('profile')

// ── Mobile sidebar toggle ─────────────────────────────────────────────
const sidebarOpen = ref(false)

// ── Profile form ──────────────────────────────────────────────────────
const form = reactive({
  name: 'Dr. Ahmed Hassan',
  email: 'ahmed.hassan@clinic.com',
  phone: '+20 100 123 4567',
  dob: '12 Mar 1980',
  clinicName: 'Cairo Heart Center',
  location: 'Maadi, Cairo',
  fee: '500',
  expYears: '12',
  about:
    'Experienced cardiologist with over 12 years in cardiovascular medicine, specializing in heart disease prevention and hypertension management. Fluent in Arabic and English.',
})

const specialties = ref(['Cardiology', 'Internal Medicine', 'Hypertension'])
const languages = ref(['Arabic', 'English'])
const newSpecialty = ref('')
const newLang = ref('')
const showSpecialtyInput = ref(false)
const showLangInput = ref(false)

function addSpecialty() {
  const v = newSpecialty.value.trim()
  if (v) { specialties.value.push(v); newSpecialty.value = '' }
  showSpecialtyInput.value = false
}

function addLang() {
  const v = newLang.value.trim()
  if (v) { languages.value.push(v); newLang.value = '' }
  showLangInput.value = false
}

// ── Documents ─────────────────────────────────────────────────────────
interface DocItem {
  key: string
  state: 'approved' | 'review' | 'rejected'
  uploadedAt: string
  hint: string
}

const documents = ref<DocItem[]>([
  { key: 'license',  state: 'approved', uploadedAt: 'Jan 12, 2024', hint: 'PDF or image, max 5 MB' },
  { key: 'national', state: 'review',   uploadedAt: 'Feb 3, 2024',  hint: 'Front and back' },
  { key: 'cert',     state: 'rejected', uploadedAt: 'Feb 3, 2024',  hint: 'Board certification' },
  { key: 'photo',    state: 'approved', uploadedAt: 'Jan 12, 2024', hint: 'Clear headshot' },
])

const docLabelMap: Record<string, string> = {
  license:  'doctorProfile.docLicense',
  national: 'doctorProfile.docNational',
  cert:     'doctorProfile.docCert',
  photo:    'doctorProfile.docPhoto',
}

const stateVariant: Record<DocItem['state'], 'default' | 'secondary' | 'destructive'> = {
  approved: 'default',
  review:   'secondary',
  rejected: 'destructive',
}

function docStateLabel(state: DocItem['state']) {
  if (state === 'approved') return t('doctorProfile.statusApproved')
  if (state === 'review')   return t('doctorProfile.statusReview')
  return t('doctorProfile.statusRejected')
}

// ── FAQ management ────────────────────────────────────────────────────
interface Faq { id: string; question: string; answer: string }

const faqs = ref<Faq[]>([
  { id: '1', question: 'Do you accept insurance?',                 answer: 'Yes, we accept most major insurance plans including Allianz, MetLife, and AXA.' },
  { id: '2', question: 'How long is each appointment?',            answer: 'Standard consultations are 30 minutes. Follow-up visits are 20 minutes.' },
  { id: '3', question: 'Is telemedicine available?',               answer: 'Yes, video consultations are available for follow-up visits and non-emergency cases.' },
])

const openFaqIdx = ref<number | null>(null)
const showFaqForm = ref(false)
const editingFaqId = ref<string | null>(null)
const faqDraft = reactive({ question: '', answer: '' })

function toggleFaq(i: number) {
  openFaqIdx.value = openFaqIdx.value === i ? null : i
}

function openAddFaq() {
  editingFaqId.value = null
  faqDraft.question = ''
  faqDraft.answer = ''
  showFaqForm.value = true
}

function openEditFaq(faq: Faq) {
  editingFaqId.value = faq.id
  faqDraft.question = faq.question
  faqDraft.answer = faq.answer
  showFaqForm.value = true
  openFaqIdx.value = null
}

function saveFaq() {
  if (!faqDraft.question.trim() || !faqDraft.answer.trim()) return
  if (editingFaqId.value) {
    const idx = faqs.value.findIndex(f => f.id === editingFaqId.value)
    if (idx !== -1) faqs.value[idx] = { id: editingFaqId.value, question: faqDraft.question, answer: faqDraft.answer }
  } else {
    faqs.value.push({ id: Date.now().toString(), question: faqDraft.question, answer: faqDraft.answer })
  }
  cancelFaq()
}

function deleteFaq(id: string) {
  faqs.value = faqs.value.filter(f => f.id !== id)
  openFaqIdx.value = null
}

function cancelFaq() {
  showFaqForm.value = false
  editingFaqId.value = null
  faqDraft.question = ''
  faqDraft.answer = ''
}
</script>

<template>
  <div class="page">

    <!-- ── Mobile overlay ───────────────────────────────────────── -->
    <div v-if="sidebarOpen" class="overlay" @click="sidebarOpen = false" />

    <!-- ── Sidebar ──────────────────────────────────────────────── -->
    <div class="sidebar-wrap" :class="{ open: sidebarOpen }">
      <DoctorSidebarNav active="profile" />
    </div>

    <!-- ── Main ─────────────────────────────────────────────────── -->
    <main class="main">

      <!-- Mobile top bar -->
      <div class="mobile-topbar">
        <button class="hamburger" aria-label="Menu" @click="sidebarOpen = true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <span class="mobile-title">{{ t('doctorProfile.title') }}</span>
        <Button size="sm" class="save-btn-mobile" @click="() => {}">{{ t('doctorProfile.save') }}</Button>
      </div>

      <div class="main-inner">

        <!-- Desktop page header -->
        <div class="page-header">
          <div>
            <h1 class="page-title">{{ t('doctorProfile.title') }}</h1>
            <p class="page-sub">{{ t('doctorProfile.subtitle') }} · <span class="doctor-id">ID: {{ doctorId }}</span></p>
          </div>
          <Button @click="() => {}">{{ t('doctorProfile.save') }}</Button>
        </div>

        <!-- Tab navigation -->
        <div class="tabs-nav" role="tablist">
          <button
            v-for="tab in (['profile', 'documents', 'faq'] as Tab[])"
            :key="tab"
            role="tab"
            class="tab-btn"
            :class="{ active: activeTab === tab }"
            :aria-selected="activeTab === tab"
            @click="activeTab = tab"
          >
            <span v-if="tab === 'profile'">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="tab-icon"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              {{ t('doctorProfile.tabProfile') }}
            </span>
            <span v-else-if="tab === 'documents'">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="tab-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              {{ t('doctorProfile.tabDocuments') }}
              <span v-if="documents.some(d => d.state === 'rejected')" class="tab-dot rejected" />
              <span v-else-if="documents.some(d => d.state === 'review')" class="tab-dot review" />
            </span>
            <span v-else>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="tab-icon"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              {{ t('doctorProfile.tabFaq') }}
            </span>
          </button>
        </div>

        <!-- ════ Profile Tab ════════════════════════════════════ -->
        <div v-if="activeTab === 'profile'" class="tab-content">

          <!-- Avatar + name row -->
          <Card class="avatar-card">
            <CardContent class="pt-5">
              <div class="avatar-row">
                <div class="avatar-circle">
                  <svg viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="22" r="12" fill="rgba(48,87,242,0.25)" />
                    <ellipse cx="32" cy="52" rx="20" ry="14" fill="rgba(48,87,242,0.25)" />
                  </svg>
                </div>
                <div class="avatar-info">
                  <p class="avatar-name">{{ form.name }}</p>
                  <p class="avatar-spec">{{ specialties[0] }}</p>
                  <Button variant="ghost" class="change-photo-btn">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                    {{ t('doctorProfile.changePhoto') }}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Two-column grid for info cards -->
          <div class="info-grid">

            <!-- Personal Info -->
            <Card>
              <CardHeader class="card-header-compact">
                <CardTitle class="card-title-sm">{{ t('doctorProfile.personal') }}</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="form-grid">
                  <div class="field full">
                    <Label for="p-name">{{ t('auth.fullName') }}</Label>
                    <Input id="p-name" v-model="form.name" type="text" />
                  </div>
                  <div class="field full">
                    <Label for="p-email">{{ t('auth.email') }}</Label>
                    <Input id="p-email" v-model="form.email" type="email" />
                  </div>
                  <div class="field">
                    <Label for="p-phone">{{ t('auth.phone') }}</Label>
                    <Input id="p-phone" v-model="form.phone" type="tel" />
                  </div>
                  <div class="field">
                    <Label for="p-dob">{{ t('onboarding.dob') }}</Label>
                    <Input id="p-dob" v-model="form.dob" type="text" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- Clinic Info -->
            <Card>
              <CardHeader class="card-header-compact">
                <CardTitle class="card-title-sm">{{ t('doctorProfile.clinic') }}</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="form-grid">
                  <div class="field full">
                    <Label for="c-name">{{ t('doctorProfile.clinicName') }}</Label>
                    <Input id="c-name" v-model="form.clinicName" type="text" />
                  </div>
                  <div class="field full">
                    <Label for="c-loc">{{ t('doctorProfile.location') }}</Label>
                    <Input id="c-loc" v-model="form.location" type="text" />
                  </div>
                  <div class="field">
                    <Label for="c-fee">{{ t('doctorProfile.fee') }}</Label>
                    <Input id="c-fee" v-model="form.fee" type="text" />
                  </div>
                  <div class="field">
                    <Label for="c-exp">{{ t('doctorProfile.expYears') }}</Label>
                    <Input id="c-exp" v-model="form.expYears" type="text" />
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          <!-- Specializations -->
          <Card>
            <CardHeader class="card-header-compact">
              <CardTitle class="card-title-sm">{{ t('doctorProfile.specializations') }}</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="tag-row">
                <Badge
                  v-for="(s, i) in specialties"
                  :key="s"
                  class="tag-badge"
                >
                  {{ s }}
                  <button class="tag-remove" :aria-label="`Remove ${s}`" @click="specialties.splice(i, 1)">×</button>
                </Badge>
                <div v-if="showSpecialtyInput" class="inline-input-row">
                  <Input
                    v-model="newSpecialty"
                    class="inline-input"
                    :placeholder="t('doctorProfile.addSpecialty')"
                    autofocus
                    @keyup.enter="addSpecialty"
                    @keyup.escape="showSpecialtyInput = false"
                  />
                  <Button size="sm" @click="addSpecialty">{{ t('doctorProfile.saveFaq') }}</Button>
                  <Button size="sm" variant="ghost" @click="showSpecialtyInput = false">{{ t('doctorProfile.cancelFaq') }}</Button>
                </div>
                <Button v-else variant="outline" size="sm" class="add-tag-btn" @click="showSpecialtyInput = true">
                  {{ t('doctorProfile.addSpecialty') }}
                </Button>
              </div>
            </CardContent>
          </Card>

          <!-- Languages -->
          <Card>
            <CardHeader class="card-header-compact">
              <CardTitle class="card-title-sm">{{ t('doctorProfile.languages') }}</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="tag-row">
                <Badge
                  v-for="(lang, i) in languages"
                  :key="lang"
                  variant="secondary"
                  class="tag-badge"
                >
                  {{ lang }}
                  <button class="tag-remove" :aria-label="`Remove ${lang}`" @click="languages.splice(i, 1)">×</button>
                </Badge>
                <div v-if="showLangInput" class="inline-input-row">
                  <Input
                    v-model="newLang"
                    class="inline-input"
                    :placeholder="t('doctorProfile.add')"
                    autofocus
                    @keyup.enter="addLang"
                    @keyup.escape="showLangInput = false"
                  />
                  <Button size="sm" @click="addLang">{{ t('doctorProfile.saveFaq') }}</Button>
                  <Button size="sm" variant="ghost" @click="showLangInput = false">{{ t('doctorProfile.cancelFaq') }}</Button>
                </div>
                <Button v-else variant="outline" size="sm" class="add-tag-btn" @click="showLangInput = true">
                  {{ t('doctorProfile.add') }}
                </Button>
              </div>
            </CardContent>
          </Card>

          <!-- About -->
          <Card>
            <CardHeader class="card-header-compact">
              <CardTitle class="card-title-sm">{{ t('doctorProfile.about') }}</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                v-model="form.about"
                class="about-textarea"
                rows="4"
                :placeholder="t('doctorProfile.aboutPlaceholder')"
              />
            </CardContent>
          </Card>

        </div>

        <!-- ════ Documents Tab ══════════════════════════════════ -->
        <div v-else-if="activeTab === 'documents'" class="tab-content">

          <p class="doc-hint">{{ t('doctorProfile.docStatusNote') }}</p>

          <div class="doc-grid">
            <Card
              v-for="doc in documents"
              :key="doc.key"
              class="doc-card"
              :class="{ 'doc-card--rejected': doc.state === 'rejected' }"
            >
              <CardContent class="doc-card-inner">
                <!-- Icon -->
                <div class="doc-icon" :class="`doc-icon--${doc.state}`">
                  <svg v-if="doc.state === 'approved'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 6L9 17l-5-5"/></svg>
                  <svg v-else-if="doc.state === 'review'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
                </div>

                <!-- Info -->
                <div class="doc-info">
                  <p class="doc-name">{{ t(docLabelMap[doc.key]) }}</p>
                  <p class="doc-hint-text">{{ doc.hint }}</p>
                  <p class="doc-uploaded">{{ t('doctorProfile.uploadedAt') }}: {{ doc.uploadedAt }}</p>
                </div>

                <!-- Status + actions -->
                <div class="doc-right">
                  <Badge :variant="stateVariant[doc.state]" class="doc-badge">
                    {{ docStateLabel(doc.state) }}
                  </Badge>
                  <div class="doc-actions">
                    <Button v-if="doc.state === 'rejected'" size="sm" class="reupload-btn">
                      {{ t('doctorProfile.reupload') }}
                    </Button>
                    <Button v-else size="sm" variant="outline">
                      {{ t('doctorProfile.viewDocument') }}
                    </Button>
                    <Button size="sm" variant="ghost">
                      {{ t('doctorProfile.uploadNew') }}
                    </Button>
                  </div>
                </div>
              </CardContent>

              <!-- Rejection notice -->
              <div v-if="doc.state === 'rejected'" class="rejection-banner">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                Document was rejected — please re-upload a clear, valid copy.
              </div>
            </Card>
          </div>

        </div>

        <!-- ════ FAQ Tab ════════════════════════════════════════ -->
        <div v-else class="tab-content">

          <!-- Add/Edit form -->
          <Card v-if="showFaqForm" class="faq-form-card">
            <CardHeader class="card-header-compact">
              <CardTitle class="card-title-sm">
                {{ editingFaqId ? t('doctorProfile.editFaq') : t('doctorProfile.addFaq') }}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="faq-form">
                <div class="field full">
                  <Label for="faq-q">{{ t('doctorProfile.questionLabel') }}</Label>
                  <Input
                    id="faq-q"
                    v-model="faqDraft.question"
                    :placeholder="t('doctorProfile.questionPlaceholder')"
                  />
                </div>
                <div class="field full">
                  <Label for="faq-a">{{ t('doctorProfile.answerLabel') }}</Label>
                  <textarea
                    id="faq-a"
                    v-model="faqDraft.answer"
                    class="about-textarea"
                    rows="3"
                    :placeholder="t('doctorProfile.answerPlaceholder')"
                  />
                </div>
                <div class="faq-form-actions">
                  <Button @click="saveFaq">{{ t('doctorProfile.saveFaq') }}</Button>
                  <Button variant="outline" @click="cancelFaq">{{ t('doctorProfile.cancelFaq') }}</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Header row -->
          <div class="faq-section-header">
            <div>
              <h2 class="faq-section-title">{{ t('doctorProfile.faqSection') }}</h2>
              <p class="faq-section-sub">{{ faqs.length }} {{ faqs.length === 1 ? 'question' : 'questions' }}</p>
            </div>
            <Button v-if="!showFaqForm" @click="openAddFaq">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="btn-icon"><path d="M12 5v14M5 12h14"/></svg>
              {{ t('doctorProfile.addFaq') }}
            </Button>
          </div>

          <!-- Empty state -->
          <div v-if="faqs.length === 0" class="faq-empty">
            <div class="faq-empty-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
            </div>
            <p class="faq-empty-title">{{ t('doctorProfile.noFaqs') }}</p>
            <p class="faq-empty-sub">{{ t('doctorProfile.noFaqsSub') }}</p>
            <Button class="mt-4" @click="openAddFaq">{{ t('doctorProfile.addFaq') }}</Button>
          </div>

          <!-- FAQ accordion list -->
          <Card v-else class="faq-list-card">
            <CardContent class="faq-list-inner">
              <div
                v-for="(faq, i) in faqs"
                :key="faq.id"
                class="faq-item"
              >
                <div class="faq-header" @click="toggleFaq(i)">
                  <span class="faq-number">{{ i + 1 }}</span>
                  <span class="faq-q">{{ faq.question }}</span>
                  <div class="faq-controls" @click.stop>
                    <button class="faq-action-btn" :title="t('doctorProfile.editFaq')" @click="openEditFaq(faq)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>
                    </button>
                    <button class="faq-action-btn danger" :title="t('doctorProfile.deleteFaq')" @click="deleteFaq(faq.id)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    </button>
                    <svg
                      class="faq-chevron"
                      :class="{ open: openFaqIdx === i }"
                      width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </div>
                <div class="faq-body" :class="{ expanded: openFaqIdx === i }">
                  <p class="faq-answer">{{ faq.answer }}</p>
                </div>
                <Separator v-if="i < faqs.length - 1" />
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* ── Layout ──────────────────────────────────────────────────────────── */
.page {
  display: flex;
  min-height: 100vh;
  background: var(--gray-0);
  position: relative;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 40;
}

.sidebar-wrap {
  flex-shrink: 0;
}

.main {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
}

.main-inner {
  padding: 28px 32px;
  max-width: 980px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── Mobile top bar ──────────────────────────────────────────────────── */
.mobile-topbar {
  display: none;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: var(--white);
  border-bottom: 1px solid var(--gray-1);
  position: sticky;
  top: 0;
  z-index: 30;
}

.hamburger {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: var(--ink);
  display: flex;
  align-items: center;
}

.mobile-title {
  flex: 1;
  font-size: 15px;
  font-weight: 700;
  color: var(--ink);
}

.save-btn-mobile { flex-shrink: 0; }

/* ── Desktop page header ─────────────────────────────────────────────── */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.page-title { font-size: 22px; font-weight: 700; color: var(--ink); }
.page-sub   { font-size: 13px; color: var(--gray-3); margin-top: 3px; }
.doctor-id  { font-family: monospace; font-size: 11px; color: var(--gray-2); }

/* ── Tab navigation ──────────────────────────────────────────────────── */
.tabs-nav {
  display: flex;
  gap: 4px;
  border-bottom: 2px solid var(--gray-1);
  padding-bottom: 0;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  padding: 9px 18px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-3);
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  border-radius: 6px 6px 0 0;
  transition: color 0.15s, border-color 0.15s;
}

.tab-btn span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.tab-btn:hover { color: var(--blue-m); }

.tab-btn.active {
  color: var(--blue-m);
  border-bottom-color: var(--blue-m);
  font-weight: 600;
}

.tab-icon { flex-shrink: 0; }

.tab-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
}
.tab-dot.rejected { background: #ef4444; }
.tab-dot.review   { background: #f59e0b; }

/* ── Tab content ─────────────────────────────────────────────────────── */
.tab-content {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* ── Card helpers ────────────────────────────────────────────────────── */
.card-header-compact { padding-bottom: 10px; }
.card-title-sm       { font-size: 13px; font-weight: 600; }

/* ── Avatar card ─────────────────────────────────────────────────────── */
.avatar-card { }

.avatar-row {
  display: flex;
  align-items: center;
  gap: 18px;
}

.avatar-circle {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: #DBEAFE;
  overflow: hidden;
  flex-shrink: 0;
}
.avatar-circle svg { width: 100%; height: 100%; }

.avatar-name { font-size: 16px; font-weight: 700; color: var(--ink); }
.avatar-spec { font-size: 13px; color: var(--gray-3); margin-top: 2px; }

.change-photo-btn {
  margin-top: 8px;
  height: auto;
  padding: 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--blue-m);
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

/* ── Info grid (Personal + Clinic) ───────────────────────────────────── */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

/* ── Form grid inside cards ──────────────────────────────────────────── */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.field       { display: flex; flex-direction: column; gap: 5px; }
.field.full  { grid-column: 1 / -1; }

/* ── Tags ────────────────────────────────────────────────────────────── */
.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.tag-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px 4px 12px;
  height: auto;
}

.tag-remove {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: currentColor;
  opacity: 0.6;
  padding: 0;
  line-height: 1;
  transition: opacity 0.15s;
}
.tag-remove:hover { opacity: 1; }

.inline-input-row {
  display: flex;
  align-items: center;
  gap: 6px;
}
.inline-input-row :deep(button) { padding-inline: 14px; }
.inline-input { height: 32px; width: 160px; font-size: 13px; }

.add-tag-btn { border-radius: 99px; height: 26px; font-size: 12px; padding-inline: 14px; }

/* ── About textarea ──────────────────────────────────────────────────── */
.about-textarea {
  width: 100%;
  border: 1px solid var(--gray-1);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--ink);
  background: var(--white);
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.15s;
  box-sizing: border-box;
}
.about-textarea:focus {
  outline: none;
  border-color: var(--blue-m);
  box-shadow: 0 0 0 3px rgba(48,87,242,0.08);
}

/* ── Documents grid ──────────────────────────────────────────────────── */
.doc-hint {
  font-size: 12px;
  color: var(--gray-3);
  background: var(--gray-0);
  border: 1px solid var(--gray-1);
  border-radius: 8px;
  padding: 8px 14px;
}

.doc-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.doc-card { overflow: hidden; }

.doc-card--rejected {
  border-color: #fca5a5;
}

.doc-card-inner {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  flex-wrap: wrap;
}

.doc-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.doc-icon--approved { background: #dcfce7; color: #16a34a; }
.doc-icon--review   { background: #fef9c3; color: #ca8a04; }
.doc-icon--rejected { background: #fee2e2; color: #dc2626; }

.doc-info {
  flex: 1;
  min-width: 140px;
}
.doc-name        { font-size: 14px; font-weight: 600; color: var(--ink); }
.doc-hint-text   { font-size: 11px; color: var(--gray-2); margin-top: 2px; }
.doc-uploaded    { font-size: 11px; color: var(--gray-3); margin-top: 4px; }

.doc-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}
.doc-badge { font-size: 11px; padding: 4px 10px; height: auto; }

.doc-actions {
  display: flex;
  gap: 6px;
}
.doc-actions :deep(button) { padding-inline: 14px; }

.reupload-btn {
  background: var(--blue-m);
  color: white;
  padding-inline: 14px;
}

.rejection-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: #fff1f2;
  border-top: 1px solid #fca5a5;
  font-size: 12px;
  color: #dc2626;
}

/* ── FAQ section ─────────────────────────────────────────────────────── */
.faq-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.faq-section-title { font-size: 16px; font-weight: 700; color: var(--ink); }
.faq-section-sub   { font-size: 12px; color: var(--gray-3); margin-top: 2px; }

.btn-icon { margin-inline-end: 4px; }

.faq-form-card { border: 2px solid var(--blue-m); }

.faq-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.faq-form-actions {
  display: flex;
  gap: 8px;
}
.faq-form-actions :deep(button) { padding-inline: 20px; }

/* FAQ empty state */
.faq-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 48px 24px;
  background: var(--white);
  border: 1px solid var(--gray-1);
  border-radius: 14px;
}

.faq-empty-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--gray-0);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-2);
  margin-bottom: 16px;
}

.faq-empty-title { font-size: 15px; font-weight: 600; color: var(--ink); }
.faq-empty-sub   { font-size: 13px; color: var(--gray-3); margin-top: 6px; max-width: 320px; }

/* FAQ accordion list */
.faq-list-card { }

.faq-list-inner {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
}

.faq-item { display: flex; flex-direction: column; }

.faq-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  cursor: pointer;
  user-select: none;
  transition: background 0.12s;
}
.faq-header:hover { background: var(--gray-0); }

.faq-number {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--gray-1);
  color: var(--gray-3);
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.faq-q {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: var(--ink);
  line-height: 1.5;
}

.faq-controls {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.faq-action-btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--gray-3);
  transition: background 0.12s, color 0.12s;
}
.faq-action-btn:hover         { background: var(--gray-1); color: var(--blue-m); }
.faq-action-btn.danger:hover  { background: #fee2e2; color: #dc2626; }

.faq-chevron {
  color: var(--gray-2);
  transition: transform 0.25s ease;
  margin-inline-start: 4px;
}
.faq-chevron.open {
  transform: rotate(180deg);
  color: var(--blue-m);
}

.faq-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}
.faq-body.expanded { max-height: 300px; }

.faq-answer {
  padding: 0 20px 16px 54px;
  font-size: 13px;
  color: var(--gray-3);
  line-height: 1.7;
}

/* ── Responsive: tablet ──────────────────────────────────────────────── */
@media (max-width: 900px) {
  .info-grid { grid-template-columns: 1fr; }
}

/* ── Responsive: mobile ──────────────────────────────────────────────── */
@media (max-width: 767px) {
  .sidebar-wrap {
    position: fixed;
    inset-block: 0;
    inset-inline-start: -240px;
    z-index: 50;
    transition: inset-inline-start 0.25s ease;
  }
  .sidebar-wrap.open { inset-inline-start: 0; }

  .mobile-topbar { display: flex; }

  .main-inner {
    padding: 16px;
    gap: 14px;
  }

  .page-header { display: none; }

  .tabs-nav {
    overflow-x: auto;
    scrollbar-width: none;
  }
  .tabs-nav::-webkit-scrollbar { display: none; }

  .tab-btn { padding: 8px 14px; font-size: 12px; white-space: nowrap; }

  .info-grid { grid-template-columns: 1fr; }

  .form-grid { grid-template-columns: 1fr; }
  .field.full { grid-column: 1; }

  .doc-card-inner { flex-direction: column; align-items: flex-start; gap: 12px; }
  .doc-right { align-items: flex-start; flex-direction: row; align-items: center; justify-content: space-between; width: 100%; }

  .faq-answer { padding-inline-start: 34px; }
}
</style>
