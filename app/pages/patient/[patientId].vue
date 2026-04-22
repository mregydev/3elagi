<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const patientId = computed(() => String(route.params.patientId))

useHead({ title: computed(() => `${t('patientHistory.pageTitle')} — ${t('common.brandName')}`) })

// ── Tabs ──────────────────────────────────────────────────────────────
type Tab = 'prescriptions' | 'scans' | 'diagnosis' | 'symptoms'
const VALID_TABS: Tab[] = ['prescriptions', 'scans', 'diagnosis', 'symptoms']
function tabFromQuery(): Tab {
  const q = route.query.tab as string
  return VALID_TABS.includes(q as Tab) ? (q as Tab) : 'prescriptions'
}
const activeTab = ref<Tab>(tabFromQuery())
watch(() => route.query.tab, () => { activeTab.value = tabFromQuery() })

// ── Mock patient ──────────────────────────────────────────────────────
const patient = computed(() => ({
  id: patientId.value,
  name: 'Sara Ahmed',
  image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&h=200&fit=crop&q=80',
  dob: '14 Feb 1992',
  phone: '+20 100 555 7890',
  bloodType: 'O+',
  insurance: 'Allianz Egypt',
  lastVisit: '18 Apr 2026',
  conditions: ['Hypertension', 'Diabetes Type 2'],
  age: 34,
}))

// ── Upload refs (one per tab) ─────────────────────────────────────────
const uploadRefs = {
  prescriptions: ref<HTMLInputElement | null>(null),
  scans:         ref<HTMLInputElement | null>(null),
  diagnosis:     ref<HTMLInputElement | null>(null),
  symptoms:      ref<HTMLInputElement | null>(null),
}

function triggerUpload() {
  uploadRefs[activeTab.value].value?.click()
}

function handleFileSelected(tab: Tab, e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  // In production: call API to upload the file under this tab/patient
  console.log(`[${tab}] uploading`, file.name)
}

// ── Prescriptions ─────────────────────────────────────────────────────
interface Prescription {
  id: string
  date: string
  medication: string
  dosage: string
  duration: string
  refills: number
  doctor: string
  status: 'active' | 'completed' | 'cancelled'
  hasFile: boolean
}

const prescriptions = ref<Prescription[]>([
  { id: 'rx1', date: '18 Apr 2026', medication: 'Metformin 500mg', dosage: '1 tablet twice daily',  duration: '3 months', refills: 2, doctor: 'Dr. Ahmed Hassan', status: 'active',    hasFile: true  },
  { id: 'rx2', date: '10 Jan 2026', medication: 'Amlodipine 5mg',  dosage: '1 tablet daily',        duration: '6 months', refills: 1, doctor: 'Dr. Ahmed Hassan', status: 'active',    hasFile: true  },
  { id: 'rx3', date: '5 Sep 2025',  medication: 'Aspirin 100mg',   dosage: '1 tablet daily (food)',  duration: '1 month',  refills: 0, doctor: 'Dr. Mona Saleh',  status: 'completed', hasFile: false },
  { id: 'rx4', date: '2 Mar 2025',  medication: 'Atorvastatin 20mg', dosage: '1 tablet at night',   duration: '3 months', refills: 0, doctor: 'Dr. Ahmed Hassan', status: 'completed', hasFile: false },
])

// ── CT / Imaging ──────────────────────────────────────────────────────
interface Scan {
  id: string
  date: string
  type: string
  bodyPart: string
  orderedBy: string
  result: string
  hasFile: boolean
}

const scans = ref<Scan[]>([
  { id: 'sc1', date: '15 Mar 2026', type: 'CT Scan',    bodyPart: 'Chest',       orderedBy: 'Dr. Ahmed Hassan', result: 'No acute findings. Mild cardiomegaly noted.', hasFile: true  },
  { id: 'sc2', date: '20 Nov 2025', type: 'Ultrasound', bodyPart: 'Abdomen',     orderedBy: 'Dr. Mona Saleh',  result: 'Normal liver and spleen. No lesions detected.', hasFile: true  },
  { id: 'sc3', date: '8 Jun 2025',  type: 'X-Ray',      bodyPart: 'Chest',       orderedBy: 'Dr. Ahmed Hassan', result: 'Clear lung fields. Normal cardiac silhouette.',  hasFile: false },
  { id: 'sc4', date: '1 Feb 2025',  type: 'MRI',        bodyPart: 'Brain',       orderedBy: 'Dr. Khaled Nour', result: 'No abnormalities detected.',                    hasFile: true  },
])

// ── Diagnosis ─────────────────────────────────────────────────────────
interface Diagnosis {
  id: string
  date: string
  condition: string
  icd: string
  doctor: string
  severity: 'mild' | 'moderate' | 'severe'
  status: 'active' | 'resolved' | 'chronic'
  notes: string
}

const diagnoses = ref<Diagnosis[]>([
  { id: 'dx1', date: '18 Apr 2026', condition: 'Hypertension Stage 2',        icd: 'I10',    doctor: 'Dr. Ahmed Hassan', severity: 'moderate', status: 'chronic',  notes: 'Controlled with medication. Monitor blood pressure weekly.' },
  { id: 'dx2', date: '10 Jan 2026', condition: 'Type 2 Diabetes Mellitus',    icd: 'E11.9',  doctor: 'Dr. Ahmed Hassan', severity: 'moderate', status: 'chronic',  notes: 'HbA1c at 7.2%. Continue Metformin, dietary adjustments advised.' },
  { id: 'dx3', date: '5 Sep 2025',  condition: 'Acute Upper Respiratory Infection', icd: 'J06.9', doctor: 'Dr. Mona Saleh', severity: 'mild', status: 'resolved', notes: 'Resolved after 7-day course of antibiotics.' },
  { id: 'dx4', date: '2 Mar 2025',  condition: 'Dyslipidemia',                icd: 'E78.5',  doctor: 'Dr. Ahmed Hassan', severity: 'mild',     status: 'active',   notes: 'LDL elevated. Statin therapy initiated.' },
])

// ── Symptoms ──────────────────────────────────────────────────────────
interface SymptomRecord {
  id: string
  date: string
  symptoms: string[]
  severity: number
  duration: string
  onset: string
  notes: string
}

const symptomRecords = ref<SymptomRecord[]>([
  { id: 'sy1', date: '18 Apr 2026', symptoms: ['Headache', 'Dizziness', 'Blurred vision'],  severity: 7, duration: '3 days',    onset: 'Sudden',   notes: 'Associated with high BP reading of 160/100.' },
  { id: 'sy2', date: '10 Jan 2026', symptoms: ['Fatigue', 'Increased thirst', 'Polyuria'],   severity: 5, duration: '2 weeks',   onset: 'Gradual',  notes: 'Blood glucose 240 mg/dL on home monitor.' },
  { id: 'sy3', date: '5 Sep 2025',  symptoms: ['Sore throat', 'Runny nose', 'Low fever'],    severity: 3, duration: '5 days',    onset: 'Gradual',  notes: 'Temperature 37.8°C. Responded well to treatment.' },
  { id: 'sy4', date: '2 Mar 2025',  symptoms: ['Chest tightness', 'Mild shortness of breath'], severity: 6, duration: '1 week', onset: 'Exertional', notes: 'Occurs during physical activity. ECG normal.' },
])

// ── Helpers ───────────────────────────────────────────────────────────
const severityColors: Record<Diagnosis['severity'], string> = {
  mild: 'secondary', moderate: 'secondary', severe: 'destructive',
}

function diagStatusLabel(s: Diagnosis['status']) {
  if (s === 'active')   return t('patientHistory.statusActive')
  if (s === 'resolved') return t('patientHistory.statusResolved')
  return t('patientHistory.statusChronic')
}

const diagStatusVariant: Record<Diagnosis['status'], 'default' | 'secondary' | 'destructive'> = {
  active: 'default', resolved: 'secondary', chronic: 'destructive',
}

function rxStatusLabel(s: Prescription['status']) {
  if (s === 'active')    return t('patientHistory.statusActive')
  if (s === 'completed') return t('patientHistory.statusCompleted')
  return t('patientHistory.statusCancelled')
}

const rxStatusVariant: Record<Prescription['status'], 'default' | 'secondary' | 'destructive'> = {
  active: 'default', completed: 'secondary', cancelled: 'destructive',
}

function severityBar(n: number) {
  return Math.max(1, Math.round(n / 2))
}
</script>

<template>
  <div class="page">

    <!-- Hidden file inputs, one per tab -->
    <input
      ref="uploadRefs.prescriptions.value"
      type="file"
      accept=".pdf,.jpg,.jpeg,.png"
      class="hidden-input"
      @change="handleFileSelected('prescriptions', $event)"
    />
    <input
      ref="uploadRefs.scans.value"
      type="file"
      accept=".pdf,.jpg,.jpeg,.png"
      class="hidden-input"
      @change="handleFileSelected('scans', $event)"
    />
    <input
      ref="uploadRefs.diagnosis.value"
      type="file"
      accept=".pdf,.jpg,.jpeg,.png"
      class="hidden-input"
      @change="handleFileSelected('diagnosis', $event)"
    />
    <input
      ref="uploadRefs.symptoms.value"
      type="file"
      accept=".pdf,.jpg,.jpeg,.png"
      class="hidden-input"
      @change="handleFileSelected('symptoms', $event)"
    />

    <!-- Sidebar -->
    <DoctorSidebarNav active="appointments" />

    <!-- Main -->
    <main class="main">

      <!-- Mobile top bar -->
      <div class="mobile-topbar">
        <button class="back-btn" @click="router.back()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <span class="mobile-title">{{ patient.name }}</span>
      </div>

      <div class="main-inner">

        <!-- Back link (desktop) -->
        <button class="back-link" @click="router.back()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
          {{ t('patientHistory.backToPatients') }}
        </button>

        <!-- Patient header card -->
        <Card class="patient-card">
          <CardContent class="patient-card-inner">

            <!-- Avatar -->
            <div class="patient-avatar">
              <img :src="patient.image" :alt="patient.name" class="patient-avatar-img" />
            </div>

            <!-- Name + meta -->
            <div class="patient-meta">
              <div class="patient-name-row">
                <h1 class="patient-name">{{ patient.name }}</h1>
                <span class="patient-age">{{ patient.age }} yrs</span>
                <Badge class="blood-badge">{{ patient.bloodType }}</Badge>
              </div>
              <p class="patient-id-text">{{ t('patientHistory.patientId') }}: <code>{{ patient.id }}</code></p>

              <div class="patient-stats">
                <div class="pstat">
                  <span class="pstat-lbl">{{ t('patientHistory.dob') }}</span>
                  <span class="pstat-val">{{ patient.dob }}</span>
                </div>
                <div class="pstat">
                  <span class="pstat-lbl">{{ t('auth.phone') }}</span>
                  <span class="pstat-val">{{ patient.phone }}</span>
                </div>
                <div class="pstat">
                  <span class="pstat-lbl">{{ t('patientHistory.insurance') }}</span>
                  <span class="pstat-val">{{ patient.insurance }}</span>
                </div>
                <div class="pstat">
                  <span class="pstat-lbl">{{ t('patientHistory.lastVisit') }}</span>
                  <span class="pstat-val">{{ patient.lastVisit }}</span>
                </div>
              </div>

              <div class="conditions-row">
                <span class="conditions-label">{{ t('patientHistory.conditions') }}:</span>
                <Badge v-for="c in patient.conditions" :key="c" variant="secondary" class="condition-badge">{{ c }}</Badge>
              </div>
            </div>

          </CardContent>
        </Card>

        <!-- Tab navigation + upload button -->
        <div class="tabs-bar">
          <div class="tabs-nav" role="tablist">
            <button
              v-for="tab in (['prescriptions', 'scans', 'diagnosis', 'symptoms'] as Tab[])"
              :key="tab"
              role="tab"
              class="tab-btn"
              :class="{ active: activeTab === tab }"
              :aria-selected="activeTab === tab"
              @click="activeTab = tab"
            >
              <!-- Prescriptions -->
              <template v-if="tab === 'prescriptions'">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="tab-icon"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><path d="M9 12h6M9 16h4"/></svg>
                {{ t('patientHistory.tabPrescriptions') }}
                <span class="tab-count">{{ prescriptions.length }}</span>
              </template>
              <!-- CT Scans -->
              <template v-else-if="tab === 'scans'">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="tab-icon"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                {{ t('patientHistory.tabScans') }}
                <span class="tab-count">{{ scans.length }}</span>
              </template>
              <!-- Diagnosis -->
              <template v-else-if="tab === 'diagnosis'">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="tab-icon"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                {{ t('patientHistory.tabDiagnosis') }}
                <span class="tab-count">{{ diagnoses.length }}</span>
              </template>
              <!-- Symptoms -->
              <template v-else>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="tab-icon"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                {{ t('patientHistory.tabSymptoms') }}
                <span class="tab-count">{{ symptomRecords.length }}</span>
              </template>
            </button>
          </div>

          <!-- Upload button -->
          <Button class="upload-btn" @click="triggerUpload">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" class="btn-icon">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            {{ t('patientHistory.uploadDocument') }}
          </Button>
        </div>

        <!-- Upload hint -->
        <p class="upload-hint">{{ t('patientHistory.uploadHint') }}</p>

        <!-- ════ Prescriptions ════════════════════════════════════════ -->
        <div v-if="activeTab === 'prescriptions'">
          <div v-if="prescriptions.length === 0" class="empty-state">
            <EmptyHistoryState :label="t('patientHistory.noRecords')" :sub="t('patientHistory.noRecordsSub')" />
          </div>
          <div v-else class="record-list">
            <Card v-for="rx in prescriptions" :key="rx.id" class="record-card">
              <CardContent class="record-inner">
                <div class="record-icon rx-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><path d="M9 12h6M9 16h4"/></svg>
                </div>
                <div class="record-body">
                  <div class="record-top">
                    <span class="record-title">{{ rx.medication }}</span>
                    <Badge :variant="rxStatusVariant[rx.status]" class="record-badge">{{ rxStatusLabel(rx.status) }}</Badge>
                  </div>
                  <div class="record-meta-grid">
                    <div class="rmeta">
                      <span class="rmeta-lbl">{{ t('patientHistory.prescriptions.dosage') }}</span>
                      <span class="rmeta-val">{{ rx.dosage }}</span>
                    </div>
                    <div class="rmeta">
                      <span class="rmeta-lbl">{{ t('patientHistory.prescriptions.duration') }}</span>
                      <span class="rmeta-val">{{ rx.duration }}</span>
                    </div>
                    <div class="rmeta">
                      <span class="rmeta-lbl">{{ t('patientHistory.prescriptions.refills') }}</span>
                      <span class="rmeta-val">{{ rx.refills }}</span>
                    </div>
                    <div class="rmeta">
                      <span class="rmeta-lbl">{{ t('patientHistory.doctor') }}</span>
                      <span class="rmeta-val">{{ rx.doctor }}</span>
                    </div>
                  </div>
                </div>
                <div class="record-right">
                  <span class="record-date">{{ rx.date }}</span>
                  <Button v-if="rx.hasFile" variant="outline" size="sm" class="view-btn">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    {{ t('patientHistory.viewDocument') }}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <!-- ════ CT / Imaging ════════════════════════════════════════ -->
        <div v-else-if="activeTab === 'scans'">
          <div v-if="scans.length === 0" class="empty-state">
            <p class="empty-title">{{ t('patientHistory.noRecords') }}</p>
          </div>
          <div v-else class="record-list">
            <Card v-for="sc in scans" :key="sc.id" class="record-card">
              <CardContent class="record-inner">
                <div class="record-icon scan-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                </div>
                <div class="record-body">
                  <div class="record-top">
                    <span class="record-title">{{ sc.type }} — {{ sc.bodyPart }}</span>
                  </div>
                  <p class="record-notes">{{ sc.result }}</p>
                  <div class="record-meta-grid">
                    <div class="rmeta">
                      <span class="rmeta-lbl">{{ t('patientHistory.scans.orderedBy') }}</span>
                      <span class="rmeta-val">{{ sc.orderedBy }}</span>
                    </div>
                  </div>
                </div>
                <div class="record-right">
                  <span class="record-date">{{ sc.date }}</span>
                  <Button v-if="sc.hasFile" variant="outline" size="sm" class="view-btn">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    {{ t('patientHistory.viewDocument') }}
                  </Button>
                  <span v-else class="no-file-label">No file</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <!-- ════ Diagnosis ═══════════════════════════════════════════ -->
        <div v-else-if="activeTab === 'diagnosis'">
          <div v-if="diagnoses.length === 0" class="empty-state">
            <p class="empty-title">{{ t('patientHistory.noRecords') }}</p>
          </div>
          <div v-else class="record-list">
            <Card v-for="dx in diagnoses" :key="dx.id" class="record-card" :class="{ 'record-card--chronic': dx.status === 'chronic' }">
              <CardContent class="record-inner">
                <div class="record-icon dx-icon" :class="`dx-icon--${dx.status}`">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                </div>
                <div class="record-body">
                  <div class="record-top">
                    <span class="record-title">{{ dx.condition }}</span>
                    <Badge :variant="diagStatusVariant[dx.status]" class="record-badge">{{ diagStatusLabel(dx.status) }}</Badge>
                  </div>
                  <p class="record-notes">{{ dx.notes }}</p>
                  <div class="record-meta-grid">
                    <div class="rmeta">
                      <span class="rmeta-lbl">{{ t('patientHistory.diagnosis.icd') }}</span>
                      <span class="rmeta-val icd-code">{{ dx.icd }}</span>
                    </div>
                    <div class="rmeta">
                      <span class="rmeta-lbl">{{ t('patientHistory.doctor') }}</span>
                      <span class="rmeta-val">{{ dx.doctor }}</span>
                    </div>
                    <div class="rmeta">
                      <span class="rmeta-lbl">{{ t('patientHistory.diagnosis.severity') }}</span>
                      <span class="rmeta-val severity-tag" :class="`severity--${dx.severity}`">{{ dx.severity }}</span>
                    </div>
                  </div>
                </div>
                <div class="record-right">
                  <span class="record-date">{{ dx.date }}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <!-- ════ Symptoms ════════════════════════════════════════════ -->
        <div v-else>
          <div v-if="symptomRecords.length === 0" class="empty-state">
            <p class="empty-title">{{ t('patientHistory.noRecords') }}</p>
          </div>
          <div v-else class="record-list">
            <Card v-for="sy in symptomRecords" :key="sy.id" class="record-card">
              <CardContent class="record-inner">
                <div class="record-icon sy-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                </div>
                <div class="record-body">
                  <div class="record-top">
                    <div class="symptoms-tags">
                      <Badge v-for="s in sy.symptoms" :key="s" variant="secondary" class="symptom-tag">{{ s }}</Badge>
                    </div>
                  </div>
                  <p class="record-notes">{{ sy.notes }}</p>
                  <div class="record-meta-grid">
                    <div class="rmeta">
                      <span class="rmeta-lbl">{{ t('patientHistory.symptoms.severity') }}</span>
                      <span class="rmeta-val">
                        <span class="severity-bar">
                          <span
                            v-for="n in 5"
                            :key="n"
                            class="severity-pip"
                            :class="{ filled: n <= severityBar(sy.severity) }"
                          />
                        </span>
                        {{ sy.severity }}/10
                      </span>
                    </div>
                    <div class="rmeta">
                      <span class="rmeta-lbl">{{ t('patientHistory.symptoms.duration') }}</span>
                      <span class="rmeta-val">{{ sy.duration }}</span>
                    </div>
                    <div class="rmeta">
                      <span class="rmeta-lbl">{{ t('patientHistory.symptoms.onset') }}</span>
                      <span class="rmeta-val">{{ sy.onset }}</span>
                    </div>
                  </div>
                </div>
                <div class="record-right">
                  <span class="record-date">{{ sy.date }}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<style scoped>
/* ── Layout ──────────────────────────────────────────────────────────── */
.page { display: flex; min-height: 100vh; background: var(--gray-0); }

.hidden-input { display: none; }

.main { flex: 1; min-width: 0; overflow-y: auto; }

.main-inner {
  padding: 24px 32px 48px;
  max-width: 980px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
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

.back-btn {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: var(--ink);
  display: flex;
  align-items: center;
}

.mobile-title { font-size: 15px; font-weight: 700; color: var(--ink); }

/* ── Back link ───────────────────────────────────────────────────────── */
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  color: var(--blue-m);
  font-weight: 500;
  padding: 0;
}
.back-link:hover { text-decoration: underline; }

/* ── Patient header card ─────────────────────────────────────────────── */
.patient-card { }

.patient-card-inner {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 20px 24px;
}

.patient-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #DBEAFE;
  overflow: hidden;
  flex-shrink: 0;
}
.patient-avatar-img { width: 100%; height: 100%; object-fit: cover; }

.patient-meta { flex: 1; min-width: 0; }

.patient-name-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.patient-name {
  font-size: 20px;
  font-weight: 700;
  color: var(--ink);
}

.patient-age {
  font-size: 13px;
  color: var(--gray-3);
  background: var(--gray-0);
  border: 1px solid var(--gray-1);
  padding: 4px 12px;
  border-radius: 99px;
}

.blood-badge {
  background: #fee2e2;
  color: #dc2626;
  border: none;
  font-weight: 700;
  padding: 4px 10px;
  height: auto;
}

.patient-id-text {
  font-size: 12px;
  color: var(--gray-3);
  margin-top: 4px;
}
.patient-id-text code {
  font-family: monospace;
  background: var(--gray-0);
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid var(--gray-1);
}

.patient-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 14px;
}

.pstat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.pstat-lbl { font-size: 11px; color: var(--gray-2); text-transform: uppercase; letter-spacing: 0.04em; }
.pstat-val { font-size: 13px; font-weight: 600; color: var(--ink); }

.conditions-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 14px;
}
.conditions-label { font-size: 12px; color: var(--gray-3); font-weight: 500; }
.condition-badge  { font-size: 11px; padding: 4px 10px; height: auto; }

/* ── Tabs bar ────────────────────────────────────────────────────────── */
.tabs-bar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 2px solid var(--gray-1);
}

.tabs-nav {
  display: flex;
  gap: 2px;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-3);
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  border-radius: 6px 6px 0 0;
  white-space: nowrap;
  transition: color 0.15s, border-color 0.15s;
}
.tab-btn:hover { color: var(--blue-m); }
.tab-btn.active { color: var(--blue-m); border-bottom-color: var(--blue-m); font-weight: 600; }

.tab-icon { flex-shrink: 0; }

.tab-count {
  background: var(--gray-1);
  color: var(--gray-3);
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 99px;
  min-width: 20px;
  text-align: center;
}
.tab-btn.active .tab-count { background: rgba(48,87,242,0.1); color: var(--blue-m); }

.upload-btn {
  flex-shrink: 0;
  margin-bottom: 8px;
  gap: 6px;
  padding-inline: 20px;
}
.btn-icon { flex-shrink: 0; }

/* ── Upload hint ─────────────────────────────────────────────────────── */
.upload-hint {
  font-size: 11px;
  color: var(--gray-2);
  margin-top: -8px;
}

/* ── Record list ─────────────────────────────────────────────────────── */
.record-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.record-card { }
.record-card--chronic { border-color: #fca5a5; }

.record-inner {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 20px;
}

/* Record icons */
.record-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.rx-icon   { background: #eff6ff; color: var(--blue-m); }
.scan-icon { background: #f0fdf4; color: #16a34a; }
.dy-icon   { background: #fef9c3; color: #ca8a04; }

.dx-icon--active   { background: #eff6ff; color: var(--blue-m); }
.dx-icon--chronic  { background: #fee2e2; color: #dc2626; }
.dx-icon--resolved { background: #f0fdf4; color: #16a34a; }

.sy-icon { background: #fef3c7; color: #d97706; }

/* Record body */
.record-body { flex: 1; min-width: 0; }

.record-top {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}

.record-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
}

.record-badge { font-size: 11px; padding: 4px 10px; height: auto; }

.record-notes {
  font-size: 12px;
  color: var(--gray-3);
  line-height: 1.6;
  margin-bottom: 10px;
}

.record-meta-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
}

.rmeta { display: flex; flex-direction: column; gap: 2px; }
.rmeta-lbl { font-size: 10px; color: var(--gray-2); text-transform: uppercase; letter-spacing: 0.04em; }
.rmeta-val { font-size: 12px; font-weight: 500; color: var(--ink); }

.icd-code {
  font-family: monospace;
  background: var(--gray-0);
  border: 1px solid var(--gray-1);
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
}

.severity-tag { font-size: 12px; font-weight: 600; }
.severity--mild     { color: #16a34a; }
.severity--moderate { color: #ca8a04; }
.severity--severe   { color: #dc2626; }

/* Record right column */
.record-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  flex-shrink: 0;
}

.record-date {
  font-size: 11px;
  color: var(--gray-2);
  white-space: nowrap;
}

.view-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  padding-inline: 14px;
}

.no-file-label { font-size: 11px; color: var(--gray-1); }

/* ── Symptoms tab ────────────────────────────────────────────────────── */
.symptoms-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.symptom-tag   { font-size: 11px; padding: 4px 10px; height: auto; }

.severity-bar {
  display: inline-flex;
  gap: 3px;
  vertical-align: middle;
  margin-inline-end: 5px;
}

.severity-pip {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background: var(--gray-1);
  transition: background 0.15s;
}
.severity-pip.filled { background: var(--blue-m); }

/* ── Empty state ─────────────────────────────────────────────────────── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 60px 24px;
  background: var(--white);
  border: 1px solid var(--gray-1);
  border-radius: 14px;
}
.empty-title { font-size: 15px; font-weight: 600; color: var(--ink); }

/* ── Responsive: tablet ──────────────────────────────────────────────── */
@media (max-width: 900px) {
  .patient-stats { gap: 14px; }
}

/* ── Responsive: mobile ──────────────────────────────────────────────── */
@media (max-width: 767px) {
  /* Hide sidebar — it stays in DOM but sidebar component handles its own display */
  :deep(.sidebar-nav) { display: none; }

  .mobile-topbar { display: flex; }

  .back-link { display: none; }

  .main-inner { padding: 14px 14px 40px; gap: 14px; }

  .patient-card-inner { flex-direction: column; gap: 14px; }

  .patient-stats { gap: 12px; }

  .tabs-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    border-bottom: none;
  }

  .tabs-nav {
    overflow-x: auto;
    scrollbar-width: none;
    width: 100%;
    border-bottom: 2px solid var(--gray-1);
  }
  .tabs-nav::-webkit-scrollbar { display: none; }

  .tab-btn { padding: 8px 12px; font-size: 12px; }

  .upload-btn { width: 100%; justify-content: center; margin-bottom: 0; }

  .record-inner { flex-direction: column; gap: 12px; }
  .record-right { align-items: flex-start; flex-direction: row; justify-content: space-between; width: 100%; }
}
</style>
