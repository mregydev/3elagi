<script setup lang="ts">
type NavItem = 'profile' | 'appointments' | 'queue' | 'analytics' | 'settings'

interface Props {
  active: NavItem
}

defineProps<Props>()

const { t } = useI18n()

const navItems = computed((): Array<{ key: NavItem; icon: string; label: string; to: string }> => [
  { key: 'profile', icon: '👤', label: t('doctorNav.profile'), to: '/doctor/profile' },
  { key: 'appointments', icon: '📅', label: t('doctorNav.appointments'), to: '/doctor/appointments' },
  { key: 'queue', icon: '🏥', label: t('doctorNav.queue'), to: '/doctor/queue' },
  { key: 'analytics', icon: '📊', label: t('doctorNav.analytics'), to: '/doctor/analytics' },
  { key: 'settings', icon: '⚙️', label: t('doctorNav.settings'), to: '/doctor/settings' },
])
</script>

<template>
  <nav class="sidebar-nav">
    <NuxtLink to="/" class="nav-logo">
      <AppLogo :height="28" dark />
    </NuxtLink>
    <div class="nav-items">
      <NuxtLink
        v-for="item in navItems"
        :key="item.key"
        :to="item.to"
        class="nav-item"
        :class="{ active: active === item.key }"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-label">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<style scoped>
.sidebar-nav {
  width: 220px;
  background: #1C3FAA;
  padding: 28px 18px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-shrink: 0;
  min-height: 100%;
}

.nav-logo {
  display: block;
  margin-bottom: 32px;
}

.nav-items {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-item {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px 12px;
  border-radius: 8px;
  background: transparent;
  text-decoration: none;
  transition: background 0.12s;
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.15);
}

.nav-icon { font-size: 16px; }

.nav-label {
  font-size: 13px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
}

.nav-item.active .nav-label {
  font-weight: 600;
  color: white;
}
</style>
