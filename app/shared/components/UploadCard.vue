<script setup lang="ts">
import type { UploadState } from '~/modules/patient/types'

interface Props {
  title: string
  subtitle?: string
  state: UploadState
}

defineProps<Props>()

const { t } = useI18n()

const stateConfig = computed((): Record<UploadState, { label: string; bg: string; border: string; dot: string; icon: string }> => ({
  pending: {
    label: t('upload.pending'),
    bg: '#F8FAFC',
    border: '#E2E8F0',
    dot: '#94A3B8',
    icon: '⬜',
  },
  uploaded: {
    label: t('upload.uploaded'),
    bg: '#F0FDF4',
    border: '#16A34A',
    dot: '#16A34A',
    icon: '✅',
  },
  review: {
    label: t('upload.review'),
    bg: '#FEF3C7',
    border: '#D97706',
    dot: '#D97706',
    icon: '🔍',
  },
  approved: {
    label: t('upload.approved'),
    bg: '#F0FDF4',
    border: '#16A34A',
    dot: '#16A34A',
    icon: '✅',
  },
  rejected: {
    label: t('upload.rejected'),
    bg: '#FEE2E2',
    border: '#DC2626',
    dot: '#DC2626',
    icon: '❌',
  },
}))
</script>

<template>
  <div
    class="card"
    :style="{
      background: stateConfig[state].bg,
      borderColor: stateConfig[state].border,
    }"
  >
    <div class="card-top">
      <div class="card-info">
        <span class="card-title">{{ title }}</span>
        <span v-if="subtitle" class="card-subtitle">{{ subtitle }}</span>
        <span v-if="state === 'rejected'" class="reject-reason">
          {{ t('upload.rejectReason') }}
        </span>
      </div>
      <div class="card-badge-col">
        <span class="card-icon">{{ stateConfig[state].icon }}</span>
        <span class="state-badge" :style="{ background: stateConfig[state].dot }">
          {{ stateConfig[state].label }}
        </span>
      </div>
    </div>

    <div
      v-if="state === 'pending' || state === 'rejected'"
      class="upload-action"
      :style="{ borderColor: stateConfig[state].border }"
    >
      <div class="upload-btn">
        <span>📎</span>
        <span class="upload-btn-text">
          {{ state === 'rejected' ? t('upload.reupload') : t('upload.uploadDoc') }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border: 1.5px solid;
  border-radius: 10px;
  padding: 12px 14px;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.card-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  display: block;
}

.card-subtitle {
  font-size: 12px;
  color: var(--gray-3);
  display: block;
}

.reject-reason {
  font-size: 11px;
  color: #DC2626;
  display: block;
  margin-top: 4px;
}

.card-badge-col {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 0;
}

html[dir="rtl"] .card-badge-col {
  align-items: flex-start;
}

.card-icon { font-size: 18px; }

.state-badge {
  border-radius: 99px;
  padding: 2px 8px;
  font-size: 10px;
  font-weight: 600;
  color: white;
}

.upload-action {
  margin-top: 10px;
  border-top: 1px solid;
  padding-top: 10px;
}

.upload-btn {
  border: 1.5px dashed #3057F2;
  border-radius: 8px;
  padding: 8px 12px;
  background: var(--blue-xl);
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.upload-btn-text {
  font-size: 12px;
  font-weight: 600;
  color: #3057F2;
}
</style>
