<script setup lang="ts">
import { onClickOutside, onKeyStroke } from '@vueuse/core'

interface Props {
  dark?: boolean
}

withDefaults(defineProps<Props>(), {
  dark: false,
})

const { locale, setLocale, t } = useI18n()

const langRoot = ref<HTMLElement | null>(null)
const langOpen = ref(false)

onClickOutside(langRoot, () => {
  langOpen.value = false
})

onKeyStroke('Escape', () => {
  langOpen.value = false
})

function pickLocale(code: 'en' | 'ar') {
  setLocale(code)
  langOpen.value = false
}

function toggleLangMenu() {
  langOpen.value = !langOpen.value
}

const FLAG_GB = 'https://flagcdn.com/w40/gb.png'
const FLAG_EG = 'https://flagcdn.com/w40/eg.png'
</script>

<template>
  <header class="nav" :class="{ dark }">
    <NuxtLink to="/" class="nav-logo">
      <AppLogo :height="40" :dark="dark" />
    </NuxtLink>

    <nav class="nav-links">
      <NuxtLink to="/">{{ t('nav.findDoctors') }}</NuxtLink>
      <NuxtLink to="/specialties">{{ t('nav.specialties') }}</NuxtLink>
      <NuxtLink to="/how-it-works">{{ t('nav.howItWorks') }}</NuxtLink>
    </nav>

    <div class="nav-actions">
      <div ref="langRoot" class="lang-switcher">
        <button
          type="button"
          class="lang-trigger"
          :class="{ open: langOpen }"
          :aria-expanded="langOpen"
          aria-haspopup="listbox"
          :aria-label="t('common.chooseLanguage')"
          @click="toggleLangMenu"
        >
          <span class="flag-wrap">
            <img
              v-if="locale === 'en'"
              :src="FLAG_GB"
              alt=""
              width="40"
              height="30"
              class="flag-img"
            />
            <img
              v-else
              :src="FLAG_EG"
              alt=""
              width="40"
              height="30"
              class="flag-img"
            />
          </span>
          <span class="lang-code" aria-hidden="true">{{ locale === 'en' ? 'EN' : 'AR' }}</span>
        </button>

        <div
          v-show="langOpen"
          class="lang-menu"
          role="listbox"
          :aria-label="t('common.chooseLanguage')"
        >
          <button
            type="button"
            class="lang-option"
            role="option"
            :aria-selected="locale === 'ar'"
            :aria-label="t('common.langArabic')"
            @click="pickLocale('ar')"
          >
            <span class="flag-wrap menu-flag">
              <img :src="FLAG_EG" alt="" width="40" height="30" class="flag-img" />
            </span>
            <span class="lang-code menu-code" aria-hidden="true">AR</span>
            <span class="lang-check-slot" aria-hidden="true">
              <span v-if="locale === 'ar'" class="lang-check">✓</span>
            </span>
          </button>
          <button
            type="button"
            class="lang-option"
            role="option"
            :aria-selected="locale === 'en'"
            :aria-label="t('common.langEnglish')"
            @click="pickLocale('en')"
          >
            <span class="flag-wrap menu-flag">
              <img :src="FLAG_GB" alt="" width="40" height="30" class="flag-img" />
            </span>
            <span class="lang-code menu-code" aria-hidden="true">EN</span>
            <span class="lang-check-slot" aria-hidden="true">
              <span v-if="locale === 'en'" class="lang-check">✓</span>
            </span>
          </button>
        </div>
      </div>

      <NuxtLink to="/auth/login" class="btn-outline" :class="{ dark }">{{ t('nav.login') }}</NuxtLink>
      <NuxtLink to="/auth/signup" class="btn-filled" :class="{ dark }">{{ t('nav.signup') }}</NuxtLink>
    </div>
  </header>
</template>

<style scoped>
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 52px;
  background: var(--white);
  border-bottom: 1px solid var(--gray-1);
  flex-shrink: 0;
  position: relative;
  z-index: 10;
}

.nav.dark {
  background: var(--blue);
  border-bottom-color: rgba(255, 255, 255, 0.12);
}

.nav-logo {
  display: flex;
  align-items: center;
}

.nav-links {
  display: none;
  gap: 24px;
  align-items: center;
}

.nav-links a {
  font-size: 14px;
  color: var(--gray-3);
  transition: color 0.15s;
  text-decoration: none;
}

.nav-links a:hover { color: var(--blue-m); }

.nav-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* ── Language dropdown ──────────────────────────── */
.lang-switcher {
  position: relative;
}

.lang-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 30px;
  padding-inline: 6px 10px;
  border-radius: 8px;
  border: 1.5px solid var(--gray-1);
  background: var(--white);
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.lang-code {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.02em;
  color: var(--gray-4);
  line-height: 1;
}

.lang-code.menu-code {
  font-size: 13px;
  min-width: 1.75rem;
}

.lang-trigger:hover,
.lang-trigger.open {
  border-color: var(--blue-m);
}

.flag-wrap {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid var(--gray-1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.flag-wrap.menu-flag {
  width: 26px;
  height: 26px;
}

.flag-img {
  width: 34px;
  height: 24px;
  max-width: none;
  object-fit: cover;
  object-position: center;
}

.lang-menu {
  position: absolute;
  top: calc(100% + 6px);
  inset-inline-end: 0;
  min-width: auto;
  padding: 6px;
  background: var(--white);
  border: 1px solid var(--gray-1);
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(15, 23, 42, 0.12);
  z-index: 50;
}

.lang-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
  text-align: start;
  transition: background 0.12s;
}

.lang-option:hover {
  background: var(--gray-0);
}

.lang-check-slot {
  width: 1.25rem;
  margin-inline-start: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.lang-check {
  font-size: 14px;
  font-weight: 800;
  color: var(--blue-m);
}

.nav.dark .lang-trigger {
  border-color: rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.08);
}

.nav.dark .lang-code {
  color: rgba(255, 255, 255, 0.95);
}

.nav.dark .lang-menu {
  background: var(--white);
  border-color: var(--gray-1);
}

.nav.dark .lang-option {
  color: var(--ink);
}

.nav.dark .lang-option:hover {
  background: var(--gray-0);
}

/* ── Auth buttons ───────────────────────────────── */
.btn-outline {
  height: 30px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1.5px solid var(--gray-1);
  background: var(--white);
  font-size: 12px;
  font-weight: 600;
  color: var(--gray-4);
  display: flex;
  align-items: center;
  transition: all 0.15s;
  text-decoration: none;
}

.btn-outline.dark {
  border-color: rgba(255, 255, 255, 0.4);
  background: transparent;
  color: var(--white);
}

.btn-filled {
  height: 30px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1.5px solid var(--blue-m);
  background: var(--blue-m);
  font-size: 12px;
  font-weight: 600;
  color: var(--white);
  display: flex;
  align-items: center;
  transition: all 0.15s;
  text-decoration: none;
}

.btn-filled:hover { background: var(--blue); border-color: var(--blue); }

@media (min-width: 768px) {
  .nav { height: 60px; padding: 0 40px; }
  .nav-links { display: flex; }

  .lang-trigger {
    height: 36px;
    padding-inline: 8px 12px;
    gap: 7px;
  }

  .lang-code {
    font-size: 12px;
  }

  .lang-code.menu-code {
    font-size: 14px;
  }

  .flag-wrap {
    width: 24px;
    height: 24px;
  }

  .flag-wrap.menu-flag {
    width: 28px;
    height: 28px;
  }

  .flag-img {
    width: 36px;
    height: 26px;
  }

  .btn-outline, .btn-filled { height: 36px; padding: 0 18px; font-size: 14px; }
}
</style>
