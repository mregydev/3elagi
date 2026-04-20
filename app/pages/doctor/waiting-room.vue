<script setup lang="ts">
interface QueueEntry {
  number: number
  name: string
}

const { t, locale } = useI18n()

useHead({ title: computed(() => t('meta.waitingRoom')) })

const dateLocale = computed(() => (locale.value === 'ar' ? 'ar-EG' : 'en-GB'))
const timeLocale = computed(() => (locale.value === 'ar' ? 'ar-EG' : 'en-US'))

const serving = ref<QueueEntry>({ number: 2, name: 'Khaled Ibrahim' })

const upNext = ref<QueueEntry[]>([
  { number: 3, name: 'Nour Elsayed' },
  { number: 4, name: 'Ahmed Tawfik' },
])

const miniQueue = ref<QueueEntry[]>([
  { number: 5, name: 'Mona Farouk' },
  { number: 6, name: 'Omar Adel' },
  { number: 7, name: 'Laila Hassan' },
])

const time = ref(new Date())

onMounted(() => {
  const timer = setInterval(() => {
    time.value = new Date()
  }, 1000)
  onUnmounted(() => clearInterval(timer))
})

const timeStr = computed(() =>
  time.value.toLocaleTimeString(timeLocale.value, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
)
const dateStr = computed(() =>
  time.value.toLocaleDateString(dateLocale.value, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
)
</script>

<template>
  <div class="room">
    <!-- Header bar -->
    <header class="room-header">
      <AppLogo :height="28" dark />
      <div class="header-center">
        <span class="header-date">{{ dateStr }}</span>
      </div>
      <div class="header-time">{{ timeStr }}</div>
    </header>

    <!-- Main split -->
    <div class="room-body">
      <!-- Left: Now Serving -->
      <section class="serving-panel">
        <div class="serving-label">{{ t('waitingRoom.nowServing') }}</div>
        <div class="serving-num">#{{ serving.number }}</div>
        <div class="serving-avatar">
          <svg viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="40" r="28" fill="#BFDBFE" />
            <ellipse cx="60" cy="100" rx="40" ry="28" fill="#BFDBFE" />
          </svg>
        </div>
        <div class="serving-name">{{ serving.name }}</div>
        <div class="serving-sub">{{ t('waitingRoom.proceedMessage') }}</div>
      </section>

      <!-- Right: Up Next + mini queue -->
      <section class="right-panel">
        <!-- Up Next -->
        <div class="up-next">
          <div class="section-label">{{ t('waitingRoom.upNext') }}</div>
          <div class="up-next-cards">
            <div v-for="entry in upNext" :key="entry.number" class="up-next-card">
              <div class="up-next-num">#{{ entry.number }}</div>
              <div class="up-next-name">{{ entry.name }}</div>
            </div>
          </div>
        </div>

        <!-- Mini queue -->
        <div class="mini-queue">
          <div class="section-label">{{ t('waitingRoom.queue') }}</div>
          <div class="mini-queue-list">
            <div v-for="entry in miniQueue" :key="entry.number" class="mini-row">
              <span class="mini-num">#{{ entry.number }}</span>
              <span class="mini-name">{{ entry.name }}</span>
            </div>
          </div>
        </div>

        <!-- Footer note -->
        <div class="room-note">
          <span class="note-icon">📢</span>
          <span>{{ t('waitingRoom.listenMessage') }}</span>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.room {
  min-height: 100vh;
  background: var(--blue-m);
  display: flex;
  flex-direction: column;
  color: white;
}

/* Header */
.room-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  position: relative;
}

.header-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.header-date {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.65);
}

.header-time {
  font-size: 18px;
  font-weight: 700;
  color: white;
}

/* Body */
.room-body {
  flex: 1;
  display: flex;
}

/* Left panel — white background for contrast */
.serving-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 48px;
  background: white;
  gap: 16px;
}

.serving-label {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--gray-2);
}

.serving-num {
  font-size: 120px;
  font-weight: 900;
  color: var(--blue-m);
  line-height: 1;
  margin: -8px 0;
}

.serving-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--blue-xl);
  border: 3px solid var(--blue-l);
  overflow: hidden;
}
.serving-avatar svg {
  width: 100%;
  height: 100%;
}
.serving-avatar svg circle,
.serving-avatar svg ellipse {
  fill: var(--blue-l);
}

.serving-name {
  font-size: 32px;
  font-weight: 700;
  color: var(--ink);
}

.serving-sub {
  font-size: 14px;
  color: var(--gray-2);
  text-align: center;
}

/* Right panel — stays blue */
.right-panel {
  width: 380px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  padding: 40px 32px;
  gap: 32px;
  border-inline-start: 1px solid rgba(255, 255, 255, 0.15);
}

.section-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 12px;
}

/* Up Next */
.up-next-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.up-next-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 14px 18px;
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.up-next-num {
  font-size: 22px;
  font-weight: 800;
  color: white;
  min-width: 44px;
}

.up-next-name {
  font-size: 15px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

/* Mini queue */
.mini-queue-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mini-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.mini-row:last-child {
  border-bottom: none;
}

.mini-num {
  font-size: 13px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
  min-width: 32px;
}

.mini-name {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
}

/* Note */
.room-note {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.15);
}
.note-icon {
  font-size: 16px;
}
</style>
