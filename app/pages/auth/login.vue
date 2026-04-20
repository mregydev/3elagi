<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import type { LoginInput } from '~/modules/auth/types'

const { t } = useI18n()

useHead({ title: computed(() => t('meta.login')) })

const form = reactive<LoginInput>({
  email: '',
  password: '',
})

const authFeatures = computed(() => [t('auth.feature1'), t('auth.feature2'), t('auth.feature3')])
</script>

<template>
  <div class="page">
    <!-- ── Mobile layout ─────────────────────────────── -->
    <div class="mobile-view">
      <div class="auth-header">
        <AppLogo :height="52" dark />
      </div>

      <div class="tabs">
        <NuxtLink to="/auth/login" class="tab active">{{ t('auth.login') }}</NuxtLink>
        <NuxtLink to="/auth/signup" class="tab">{{ t('auth.signup') }}</NuxtLink>
      </div>

      <div class="form-area">
        <div class="field">
          <Label for="mob-email">{{ t('auth.email') }}</Label>
          <Input
            id="mob-email"
            v-model="form.email"
            type="email"
            :placeholder="t('auth.placeholderEmail')"
          />
        </div>

        <div class="field">
          <div class="field-header">
            <Label for="mob-password">{{ t('auth.password') }}</Label>
            <a href="#" class="forgot-link">{{ t('auth.forgotPassword') }}</a>
          </div>
          <Input
            id="mob-password"
            v-model="form.password"
            type="password"
            :placeholder="t('auth.placeholderPassword')"
          />
        </div>

        <div class="actions">
          <Button class="w-full">{{ t('auth.login') }}</Button>
          <p class="switch-text">
            {{ t('auth.noAccount') }}&nbsp;
            <NuxtLink to="/auth/signup" class="switch-link">{{ t('auth.signup') }}</NuxtLink>
          </p>
        </div>
      </div>
    </div>

    <!-- ── Desktop split layout ───────────────────────── -->
    <div class="desktop-view">
      <div class="brand-panel">
        <div>
          <AppLogo :height="56" dark />
          <h1 class="brand-title">{{ t('auth.welcomeBack') }}</h1>
          <p class="brand-subtitle">{{ t('auth.welcomeSubtitle') }}</p>
        </div>
        <div class="feature-list">
          <div
            v-for="f in authFeatures"
            :key="f"
            class="feature-item"
          >
            <span class="feature-check">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 6l3 3 5-5"
                  stroke="white"
                  stroke-width="1.8"
                  stroke-linecap="round"
                />
              </svg>
            </span>
            <span class="feature-text">{{ f }}</span>
          </div>
        </div>
      </div>

      <div class="form-panel">
        <div class="desktop-tabs">
          <NuxtLink to="/auth/login" class="desktop-tab active">{{ t('auth.login') }}</NuxtLink>
          <NuxtLink to="/auth/signup" class="desktop-tab">{{ t('auth.signup') }}</NuxtLink>
        </div>

        <h2 class="form-title">{{ t('auth.signInTitle') }}</h2>

        <div class="desktop-fields">
          <div class="field">
            <Label for="desk-email">{{ t('auth.emailAddress') }}</Label>
            <Input
              id="desk-email"
              v-model="form.email"
              type="email"
              :placeholder="t('auth.placeholderEmail')"
              class="h-11"
            />
          </div>
          <div class="field">
            <div class="field-header">
              <Label for="desk-password">{{ t('auth.password') }}</Label>
              <a href="#" class="forgot-link">{{ t('auth.forgotPassword') }}</a>
            </div>
            <Input
              id="desk-password"
              v-model="form.password"
              type="password"
              :placeholder="t('auth.placeholderPassword')"
              class="h-11"
            />
          </div>
        </div>

        <div class="desktop-actions">
          <Button class="w-full h-11 text-base">{{ t('auth.login') }}</Button>
          <p class="switch-text">
            {{ t('auth.noAccount') }}&nbsp;
            <NuxtLink to="/auth/signup" class="switch-link">{{ t('auth.signup') }}</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
}

/* ── Mobile ─────────────────────────────────────── */
.mobile-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--white);
}

.desktop-view {
  display: none;
}

.auth-header {
  background: var(--blue-m);
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tabs {
  display: flex;
  border-bottom: 1px solid var(--gray-1);
}

.tab {
  flex: 1;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 400;
  color: var(--gray-2);
  border-bottom: 2.5px solid transparent;
  text-decoration: none;
  transition: all 0.15s;
}

.tab.active {
  color: var(--blue-m);
  font-weight: 600;
  border-bottom-color: var(--blue-m);
}

.form-area {
  flex: 1;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;

  input {
    padding: 10px 12px;
  }
}

.field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-link {
  font-size: 12px;
  color: var(--blue-m);
  text-decoration: none;
}

.actions {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.switch-text {
  text-align: center;
  font-size: 13px;
  color: var(--gray-3);
}

.switch-link {
  font-weight: 600;
  color: var(--blue-m);
  text-decoration: none;
}

/* ── Desktop ─────────────────────────────────────── */
@media (min-width: 768px) {
  .mobile-view {
    display: none;
  }

  .desktop-view {
    display: flex;
    min-height: 100vh;
  }

  .brand-panel {
    width: 50%;
    background: var(--blue-m);
    padding: 52px 48px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-shrink: 0;
  }

  .brand-title {
    font-size: 28px;
    font-weight: 700;
    color: var(--white);
    line-height: 1.2;
    margin-top: 40px;
  }

  .brand-subtitle {
    font-size: 15px;
    color: rgba(255, 255, 255, 0.7);
    margin-top: 12px;
    line-height: 1.6;
  }

  .feature-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .feature-item {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .feature-check {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .feature-text {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.8);
  }

  .form-panel {
    flex: 1;
    background: var(--white);
    padding: 48px 52px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .desktop-tabs {
    display: flex;
    border: 1px solid var(--gray-1);
    border-radius: 8px;
    overflow: hidden;
    width: fit-content;
    margin-bottom: 28px;
  }

  .desktop-tab {
    padding: 8px 24px;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-3);
    background: var(--white);
    text-decoration: none;
    transition: all 0.15s;
  }

  .desktop-tab.active {
    background: var(--blue-m);
    color: var(--white);
  }

  .form-title {
    font-size: 22px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 24px;
  }

  .desktop-fields {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .forgot-link {
    font-size: 13px;
  }

  .desktop-actions {
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}
</style>
