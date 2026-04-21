<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'

const { t, locale } = useI18n()

useHead({ title: computed(() => t('meta.doctorQueue')) })

const dateLocale = computed(() => (locale.value === 'ar' ? 'ar-EG' : 'en-GB'))

type QueueStatus = 'current' | 'waiting' | 'skipped' | 'completed'

interface QueueEntry {
  id: string
  number: number
  name: string
  time: string
  status: QueueStatus
}

const queue = ref<QueueEntry[]>([
  { id: '1', number: 1, name: 'Sara Mohamed',   time: '09:00 AM', status: 'completed' },
  { id: '2', number: 2, name: 'Khaled Ibrahim',  time: '09:30 AM', status: 'current'   },
  { id: '3', number: 3, name: 'Nour Elsayed',    time: '10:00 AM', status: 'waiting'   },
  { id: '4', number: 4, name: 'Ahmed Tawfik',    time: '10:30 AM', status: 'waiting'   },
  { id: '5', number: 5, name: 'Mona Farouk',     time: '11:00 AM', status: 'skipped'   },
  { id: '6', number: 6, name: 'Omar Adel',       time: '11:30 AM', status: 'waiting'   },
])

const current   = computed(() => queue.value.find(q => q.status === 'current'))
const waiting   = computed(() => queue.value.filter(q => q.status === 'waiting').length)
const done      = computed(() => queue.value.filter(q => q.status === 'completed').length)
const skipped   = computed(() => queue.value.filter(q => q.status === 'skipped').length)

const statusVariant: Record<QueueStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  current:   'default',
  waiting:   'secondary',
  skipped:   'destructive',
  completed: 'outline',
}

function callNext() {
  const idx = queue.value.findIndex(q => q.status === 'current')
  if (idx !== -1) queue.value[idx].status = 'completed'
  const nextWaiting = queue.value.find(q => q.status === 'waiting')
  if (nextWaiting) nextWaiting.status = 'current'
}

function statusLabel(s: QueueStatus) {
  return t(`doctorQueue.status.${s}`)
}

const todayLabel = computed(() =>
  t('doctorQueue.today', {
    date: new Date().toLocaleDateString(dateLocale.value, { weekday: 'long', day: 'numeric', month: 'long' }),
  }),
)
</script>

<template>
  <div class="page">
    <DoctorSidebarNav active="queue" />

    <main class="main">
      <div class="main-inner">
        <div class="page-header">
          <div>
            <h1 class="page-title">{{ t('doctorQueue.title') }}</h1>
            <p class="page-sub">{{ todayLabel }}</p>
          </div>
          <Button variant="outline" @click="navigateTo('/doctor/waiting-room')">
            {{ t('doctorQueue.openWaiting') }}
          </Button>
        </div>

        <div class="layout">
          <div class="queue-section">
            <!-- Current patient hero -->
            <div v-if="current" class="current-card">
              <div class="current-header">
                <span class="current-label">{{ t('doctorQueue.nowServing') }}</span>
                <span class="current-num">#{{ current.number }}</span>
              </div>
              <div class="current-body">
                <div class="current-avatar">
                  <svg viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="16" r="9" fill="rgba(255,255,255,0.4)" />
                    <ellipse cx="24" cy="38" rx="15" ry="10" fill="rgba(255,255,255,0.4)" />
                  </svg>
                </div>
                <div>
                  <div class="current-name">{{ current.name }}</div>
                  <div class="current-time">{{ t('doctorQueue.scheduled', { time: current.time }) }}</div>
                </div>
              </div>
              <Button class="w-full bg-white text-[#1C3FAA] hover:bg-white/90 font-bold" @click="callNext">
                {{ t('doctorQueue.callNext') }}
              </Button>
            </div>

            <!-- Queue list -->
            <Card>
              <div class="list-header">
                <span class="list-title">{{ t('doctorQueue.listTitle', { n: queue.length }) }}</span>
              </div>
              <Separator />
              <CardContent class="p-0">
                <div
                  v-for="entry in queue"
                  :key="entry.id"
                  class="queue-row"
                  :class="{ 'queue-row-current': entry.status === 'current' }"
                >
                  <div class="queue-num">{{ entry.number }}</div>
                  <div class="queue-info">
                    <span class="queue-name">{{ entry.name }}</span>
                    <span class="queue-time">{{ entry.time }}</span>
                  </div>
                  <Badge :variant="statusVariant[entry.status]">
                    {{ statusLabel(entry.status) }}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Stats sidebar -->
          <aside class="stats-sidebar">
            <Card v-for="stat in [{ val: queue.length, label: t('doctorQueue.statTotal'), cls: '' }, { val: waiting, label: t('doctorQueue.statWaiting'), cls: 'text-primary' }, { val: done, label: t('doctorQueue.statDone'), cls: 'text-green-600' }, { val: skipped, label: t('doctorQueue.statSkipped'), cls: 'text-destructive' }]" :key="stat.label">
              <CardContent class="pt-4 text-center">
                <div class="stat-value" :class="stat.cls">{{ stat.val }}</div>
                <div class="stat-label">{{ stat.label }}</div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page { display: flex; min-height: 100vh; background: var(--gray-0); }
.main { flex: 1; overflow-y: auto; }
.main-inner { padding: 32px 36px; max-width: 900px; }

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
}

.page-title { font-size: 22px; font-weight: 700; color: var(--ink); }
.page-sub   { font-size: 13px; color: var(--gray-3); margin-top: 2px; }

.layout { display: flex; gap: 20px; align-items: flex-start; }
.queue-section { flex: 1; display: flex; flex-direction: column; gap: 16px; }

/* Current patient hero */
.current-card {
  background: #1C3FAA;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.current-header { display: flex; justify-content: space-between; align-items: center; }
.current-label { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.7); letter-spacing: 0.05em; text-transform: uppercase; }
.current-num   { font-size: 28px; font-weight: 800; color: white; }
.current-body  { display: flex; align-items: center; gap: 14px; }
.current-avatar {
  width: 52px; height: 52px; border-radius: 50%;
  background: rgba(255,255,255,0.15); flex-shrink: 0; overflow: hidden;
}
.current-avatar svg { width: 100%; height: 100%; }
.current-name { font-size: 17px; font-weight: 700; color: white; }
.current-time { font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 2px; }

/* Queue list */
.list-header { padding: 14px 16px; }
.list-title  { font-size: 14px; font-weight: 700; color: var(--ink); }

.queue-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--gray-0);
  transition: background 0.1s;
}
.queue-row:last-child { border-bottom: none; }
.queue-row-current { background: #EFF6FF; }

.queue-num {
  width: 28px; height: 28px; border-radius: 50%;
  background: var(--gray-1);
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700; color: var(--gray-4); flex-shrink: 0;
}
.queue-info { flex: 1; display: flex; flex-direction: column; gap: 1px; }
.queue-name { font-size: 13px; font-weight: 600; color: var(--ink); }
.queue-time { font-size: 11px; color: var(--gray-3); }

/* Stats */
.stats-sidebar { width: 160px; display: flex; flex-direction: column; gap: 12px; flex-shrink: 0; }
.stat-value { font-size: 28px; font-weight: 800; color: var(--ink); line-height: 1; }
.stat-label { font-size: 12px; color: var(--gray-3); margin-top: 4px; }

/* Mobile */
@media (max-width: 767px) {
  .main-inner { padding: 20px 16px; }

  .page-header {
    flex-wrap: wrap;
    gap: 12px;
  }

  .page-title { font-size: 18px; }

  .layout { flex-direction: column; }

  .stats-sidebar {
    width: 100%;
    flex-direction: row;
  }

  .stats-sidebar > * { flex: 1; }
}
</style>
