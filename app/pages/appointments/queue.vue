<script setup lang="ts">
const { t } = useI18n()

useHead({ title: computed(() => t('meta.queue')) })

type QueueState = 'waiting' | 'soon' | 'your-turn'

interface Props {
  state?: QueueState
}

const props = withDefaults(defineProps<Props>(), { state: 'waiting' })

const patientNumber = 7
const totalInQueue = 12
const aheadOf = computed(() => patientNumber - 1)

const stateStyle: Record<QueueState, { ring: string; ringBg: string; badge: string; badgeBg: string; icon: string }> = {
  waiting: {
    ring: '#3057F2',
    ringBg: '#DBEAFE',
    badge: '#1C3FAA',
    badgeBg: '#DBEAFE',
    icon: '⏳',
  },
  soon: {
    ring: '#D97706',
    ringBg: '#FEF3C7',
    badge: '#92400E',
    badgeBg: '#FEF3C7',
    icon: '🔔',
  },
  'your-turn': {
    ring: '#16A34A',
    ringBg: '#DCFCE7',
    badge: '#14532D',
    badgeBg: '#DCFCE7',
    icon: '✅',
  },
}

const cfg = computed(() => {
  const st = props.state
  const style = stateStyle[st]
  const prefix = st === 'waiting' ? 'patientQueue.states.waiting' : st === 'soon' ? 'patientQueue.states.soon' : 'patientQueue.states.yourTurn'
  return {
    ...style,
    title: t(`${prefix}.title`),
    subtitle: t(`${prefix}.subtitle`),
  }
})

const progressPct = computed(() => {
  if (props.state === 'your-turn') return 100
  return Math.round(((totalInQueue - aheadOf.value) / totalInQueue) * 100)
})

const estimatedWait = computed(() => {
  if (props.state === 'your-turn') return t('patientQueue.waitMin0')
  if (props.state === 'soon') return t('patientQueue.waitMin5')
  return t('patientQueue.waitMinEst', { n: aheadOf.value * 8 })
})
</script>

<template>
  <div class="page">
    <!-- Header -->
    <header class="mob-header">
      <NuxtLink to="/" class="back-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </NuxtLink>
      <span class="header-title">{{ t('patientQueue.title') }}</span>
      <div style="width:20px" />
    </header>

    <!-- Doctor info strip -->
    <div class="doctor-strip">
      <div class="doc-avatar">
        <svg viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="16" r="9" fill="rgba(48,87,242,0.25)" />
          <ellipse cx="24" cy="38" rx="15" ry="10" fill="rgba(48,87,242,0.25)" />
        </svg>
      </div>
      <div>
        <div class="doc-name">Dr. Ahmed Hassan</div>
        <div class="doc-spec">Cardiologist · Cairo Heart Center</div>
      </div>
    </div>

    <!-- Ring indicator -->
    <div class="ring-section">
      <div class="ring-outer" :style="{ background: cfg.ringBg }">
        <div class="ring-inner" :style="{ borderColor: cfg.ring }">
          <span class="ring-icon">{{ cfg.icon }}</span>
          <span class="ring-num" :style="{ color: cfg.ring }">#{{ patientNumber }}</span>
          <span class="ring-label">{{ t('patientQueue.yourNumber') }}</span>
        </div>
      </div>
    </div>

    <!-- Status badge -->
    <div class="status-badge-wrap">
      <span class="status-badge" :style="{ background: cfg.badgeBg, color: cfg.badge }">
        {{ cfg.title }}
      </span>
    </div>

    <!-- Subtitle -->
    <p class="status-sub">{{ cfg.subtitle }}</p>

    <!-- Stats row -->
    <div class="stats-row">
      <div class="stat">
        <span class="stat-val">{{ aheadOf }}</span>
        <span class="stat-lbl">{{ t('patientQueue.ahead') }}</span>
      </div>
      <div class="stat-divider" />
      <div class="stat">
        <span class="stat-val">{{ estimatedWait }}</span>
        <span class="stat-lbl">{{ t('patientQueue.wait') }}</span>
      </div>
      <div class="stat-divider" />
      <div class="stat">
        <span class="stat-val">{{ totalInQueue }}</span>
        <span class="stat-lbl">{{ t('patientQueue.total') }}</span>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="progress-section">
      <div class="progress-header">
        <span class="progress-label">{{ t('patientQueue.progress') }}</span>
        <span class="progress-pct">{{ progressPct }}%</span>
      </div>
      <div class="progress-track">
        <div
          class="progress-fill"
          :style="{ width: `${progressPct}%`, background: cfg.ring }"
        />
      </div>
    </div>

    <!-- Mini queue bubbles -->
    <div class="mini-queue">
      <span
        v-for="n in totalInQueue"
        :key="n"
        class="bubble"
        :class="{
          'bubble-done':    n < patientNumber,
          'bubble-mine':    n === patientNumber,
          'bubble-waiting': n > patientNumber,
        }"
        :style="n === patientNumber ? { background: cfg.ring } : {}"
      >{{ n }}</span>
    </div>

    <!-- CTA -->
    <div v-if="state === 'your-turn'" class="cta-section">
      <NuxtLink to="/appointments/intake" class="btn-intake">
        {{ t('patientQueue.intakeCta') }}
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--gray-0);
  display: flex;
  flex-direction: column;
  max-width: 480px;
  margin: 0 auto;
}

/* Header */
.mob-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid var(--gray-1);
}

.back-btn {
  color: var(--ink);
  display: flex;
  align-items: center;
}

.header-title { font-size: 15px; font-weight: 700; color: var(--ink); }

/* Doctor strip */
.doctor-strip {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: white;
  border-bottom: 1px solid var(--gray-1);
}

.doc-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--blue-xl);
  overflow: hidden;
  flex-shrink: 0;
}
.doc-avatar svg { width: 100%; height: 100%; }

.doc-name { font-size: 14px; font-weight: 700; color: var(--ink); }
.doc-spec  { font-size: 12px; color: var(--gray-3); margin-top: 1px; }

/* Ring */
.ring-section {
  display: flex;
  justify-content: center;
  padding: 32px 20px 16px;
}

.ring-outer {
  width: 168px;
  height: 168px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring-inner {
  width: 132px;
  height: 132px;
  border-radius: 50%;
  border: 4px solid;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.ring-icon  { font-size: 20px; }
.ring-num   { font-size: 36px; font-weight: 900; line-height: 1; }
.ring-label { font-size: 11px; color: var(--gray-3); }

/* Badge */
.status-badge-wrap {
  display: flex;
  justify-content: center;
  padding: 0 20px 8px;
}

.status-badge {
  font-size: 13px;
  font-weight: 700;
  padding: 5px 16px;
  border-radius: 99px;
}

/* Subtitle */
.status-sub {
  font-size: 13px;
  color: var(--gray-3);
  text-align: center;
  padding: 0 28px;
  margin-bottom: 24px;
  line-height: 1.6;
}

/* Stats */
.stats-row {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 12px;
  margin: 0 20px 20px;
  border: 1.5px solid var(--gray-1);
  overflow: hidden;
}

.stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 8px;
  gap: 3px;
}

.stat-val { font-size: 18px; font-weight: 800; color: var(--ink); }
.stat-lbl { font-size: 11px; color: var(--gray-3); }

.stat-divider { width: 1px; height: 40px; background: var(--gray-1); }

/* Progress */
.progress-section { padding: 0 20px 20px; }

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.progress-label { font-size: 12px; font-weight: 600; color: var(--gray-4); }
.progress-pct   { font-size: 12px; font-weight: 700; color: var(--ink); }

.progress-track {
  height: 8px;
  background: var(--gray-1);
  border-radius: 99px;
  overflow: hidden;
}

.progress-fill { height: 100%; border-radius: 99px; transition: width 0.4s; }

/* Mini queue bubbles */
.mini-queue {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0 20px 24px;
}

.bubble {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
}

.bubble-done    { background: #DCFCE7; color: #16A34A; }
.bubble-mine    { color: white; }
.bubble-waiting { background: var(--gray-1); color: var(--gray-3); }

/* CTA */
.cta-section { padding: 0 20px 32px; }

.btn-intake {
  display: block;
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  background: #3057F2;
  font-size: 14px;
  font-weight: 700;
  color: white;
  text-decoration: none;
  text-align: center;
}
</style>
