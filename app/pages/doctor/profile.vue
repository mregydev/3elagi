<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'

const { t } = useI18n()

useHead({ title: computed(() => t('meta.doctorProfile')) })

interface Tag { label: string }

const specialties: Tag[] = [
  { label: 'Cardiology' },
  { label: 'Internal Medicine' },
  { label: 'Hypertension' },
]

const languages = ['Arabic', 'English']

interface DocStatus {
  label: string
  state: 'approved' | 'review' | 'rejected'
}

const docStatuses: DocStatus[] = [
  { label: 'Medical License', state: 'approved' },
  { label: 'National ID', state: 'review' },
  { label: 'Specialty Certificate', state: 'rejected' },
]

function docTitle(key: string) {
  if (key === 'Medical License') return t('doctorProfile.docLicense')
  if (key === 'National ID') return t('doctorProfile.docNational')
  return t('doctorProfile.docCert')
}

function docStateLabel(state: DocStatus['state']) {
  if (state === 'approved') return t('doctorProfile.statusApproved')
  if (state === 'review') return t('doctorProfile.statusReview')
  return t('doctorProfile.statusRejected')
}

const stateVariant: Record<DocStatus['state'], 'default' | 'secondary' | 'destructive'> = {
  approved: 'default',
  review:   'secondary',
  rejected: 'destructive',
}
</script>

<template>
  <div class="page">
    <DoctorSidebarNav active="profile" />

    <main class="main">
      <div class="main-inner">
        <div class="page-header">
          <div>
            <h1 class="page-title">{{ t('doctorProfile.title') }}</h1>
            <p class="page-sub">{{ t('doctorProfile.subtitle') }}</p>
          </div>
          <Button>{{ t('doctorProfile.save') }}</Button>
        </div>

        <div class="grid">
          <!-- Left column -->
          <div class="col">
            <!-- Avatar card -->
            <Card>
              <CardContent class="pt-5">
                <div class="avatar-section">
                  <div class="avatar-lg">
                    <svg viewBox="0 0 64 64" fill="none">
                      <circle cx="32" cy="22" r="12" fill="rgba(48,87,242,0.3)" />
                      <ellipse cx="32" cy="52" rx="20" ry="14" fill="rgba(48,87,242,0.3)" />
                    </svg>
                  </div>
                  <div>
                    <div class="avatar-name">Dr. Ahmed Hassan</div>
                    <div class="avatar-spec">Cardiologist</div>
                    <Button variant="ghost" class="mt-2 h-auto px-0 text-primary text-xs font-semibold">
                      {{ t('doctorProfile.changePhoto') }}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- Personal Info -->
            <Card>
              <CardHeader class="pb-3">
                <CardTitle class="text-sm">{{ t('doctorProfile.personal') }}</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="form-grid">
                  <div class="field">
                    <Label for="p-name">{{ t('auth.fullName') }}</Label>
                    <Input id="p-name" type="text" default-value="Dr. Ahmed Hassan" />
                  </div>
                  <div class="field">
                    <Label for="p-email">{{ t('auth.email') }}</Label>
                    <Input id="p-email" type="email" default-value="ahmed.hassan@clinic.com" />
                  </div>
                  <div class="field">
                    <Label for="p-phone">{{ t('auth.phone') }}</Label>
                    <Input id="p-phone" type="tel" default-value="+20 100 123 4567" />
                  </div>
                  <div class="field">
                    <Label for="p-dob">{{ t('onboarding.dob') }}</Label>
                    <Input id="p-dob" type="text" default-value="12 Mar 1980" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Right column -->
          <div class="col">
            <!-- Clinic Info -->
            <Card>
              <CardHeader class="pb-3">
                <CardTitle class="text-sm">{{ t('doctorProfile.clinic') }}</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="form-grid">
                  <div class="field full">
                    <Label for="c-name">{{ t('doctorProfile.clinicName') }}</Label>
                    <Input id="c-name" type="text" default-value="Cairo Heart Center" />
                  </div>
                  <div class="field full">
                    <Label for="c-loc">{{ t('doctorProfile.location') }}</Label>
                    <Input id="c-loc" type="text" default-value="Maadi, Cairo" />
                  </div>
                  <div class="field">
                    <Label for="c-fee">{{ t('doctorProfile.fee') }}</Label>
                    <Input id="c-fee" type="text" default-value="500" />
                  </div>
                  <div class="field">
                    <Label for="c-exp">{{ t('doctorProfile.expYears') }}</Label>
                    <Input id="c-exp" type="text" default-value="12" />
                  </div>
                  <div class="field full">
                    <Label>{{ t('doctorProfile.languages') }}</Label>
                    <div class="tag-list">
                      <Badge v-for="lang in languages" :key="lang" variant="secondary">{{ lang }}</Badge>
                      <Button variant="outline" size="sm" class="rounded-full h-6 text-xs">{{ t('doctorProfile.add') }}</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- Specializations -->
            <Card>
              <CardHeader class="pb-3">
                <CardTitle class="text-sm">{{ t('doctorProfile.specializations') }}</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="tag-list">
                  <Badge v-for="s in specialties" :key="s.label" class="gap-1">
                    {{ s.label }}
                    <button class="ml-1 text-primary-foreground/70 hover:text-primary-foreground">×</button>
                  </Badge>
                  <Button variant="outline" size="sm" class="rounded-full h-6 text-xs">{{ t('doctorProfile.addSpecialty') }}</Button>
                </div>
              </CardContent>
            </Card>

            <!-- Document Status -->
            <Card>
              <CardHeader class="pb-3">
                <CardTitle class="text-sm">{{ t('doctorProfile.documents') }}</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="doc-list">
                  <div v-for="(doc, i) in docStatuses" :key="doc.label">
                    <div class="doc-row">
                      <span class="doc-label">{{ docTitle(doc.label) }}</span>
                      <Badge :variant="stateVariant[doc.state]">
                        {{ docStateLabel(doc.state) }}
                      </Badge>
                    </div>
                    <Separator v-if="i < docStatuses.length - 1" class="mt-3" />
                  </div>
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
.page {
  display: flex;
  min-height: 100vh;
  background: var(--gray-0);
}

.main { flex: 1; overflow-y: auto; }

.main-inner { padding: 32px 36px; max-width: 960px; }

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
}

.page-title { font-size: 22px; font-weight: 700; color: var(--ink); }
.page-sub   { font-size: 13px; color: var(--gray-3); margin-top: 2px; }

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: start;
}

.col { display: flex; flex-direction: column; gap: 20px; }

/* Avatar */
.avatar-section { display: flex; align-items: center; gap: 16px; }

.avatar-lg {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #DBEAFE;
  overflow: hidden;
  flex-shrink: 0;
}
.avatar-lg svg { width: 100%; height: 100%; }

.avatar-name { font-size: 15px; font-weight: 700; color: var(--ink); }
.avatar-spec { font-size: 13px; color: var(--gray-3); margin-top: 2px; }

/* Form */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.field { display: flex; flex-direction: column; gap: 4px; }
.field.full { grid-column: 1 / -1; }

/* Tags */
.tag-list { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }

/* Docs */
.doc-list { display: flex; flex-direction: column; gap: 12px; }
.doc-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.doc-label { font-size: 13px; font-weight: 600; color: var(--ink); }

/* Mobile */
@media (max-width: 767px) {
  .main-inner { padding: 20px 16px; }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .grid { grid-template-columns: 1fr; }

  .form-grid { grid-template-columns: 1fr; }
  .field.full { grid-column: 1; }
}
</style>
