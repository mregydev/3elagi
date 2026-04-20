<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import type { SignupInput, UserRole } from '~/modules/auth/types'

const { t } = useI18n()

useHead({ title: computed(() => t('meta.signup')) })

const role = ref<UserRole>('patient')

const form = reactive<SignupInput>({
  role: 'patient',
  fullName: '',
  email: '',
  password: '',
  phone: '',
  licenseNumber: '',
  specialization: '',
})

watch(role, (val) => { form.role = val })

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
        <NuxtLink to="/auth/login" class="tab">{{ t('auth.login') }}</NuxtLink>
        <NuxtLink to="/auth/signup" class="tab active">{{ t('auth.signup') }}</NuxtLink>
      </div>

      <div class="form-area">
        <div class="field">
          <Label>{{ t('auth.iam') }}</Label>
          <div class="role-picker">
            <button class="role-btn" :class="{ active: role === 'patient' }" @click="role = 'patient'">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="role === 'patient' ? '#2563EB' : '#94A3B8'" stroke-width="1.8">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span :style="{ color: role === 'patient' ? '#2563EB' : '#64748B' }">{{ t('auth.patient') }}</span>
            </button>
            <button class="role-btn" :class="{ active: role === 'doctor' }" @click="role = 'doctor'">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="role === 'doctor' ? '#2563EB' : '#94A3B8'" stroke-width="1.8">
                <rect x="3" y="8" width="18" height="14" rx="2" />
                <path d="M8 8V5a4 4 0 1 1 8 0v3" />
                <circle cx="12" cy="15" r="2" />
              </svg>
              <span :style="{ color: role === 'doctor' ? '#2563EB' : '#64748B' }">{{ t('auth.doctorRole') }}</span>
            </button>
          </div>
        </div>

        <div class="field">
          <Label for="mob-name">{{ t('auth.fullName') }}</Label>
          <Input id="mob-name" v-model="form.fullName" type="text" :placeholder="t('auth.placeholderName')" />
        </div>
        <div class="field">
          <Label for="mob-email">{{ t('auth.email') }}</Label>
          <Input id="mob-email" v-model="form.email" type="email" :placeholder="t('auth.placeholderEmail')" />
        </div>
        <div class="field">
          <Label for="mob-pass">{{ t('auth.password') }}</Label>
          <Input id="mob-pass" v-model="form.password" type="password" :placeholder="t('auth.placeholderPassword')" />
        </div>
        <div class="field">
          <Label for="mob-phone">{{ t('auth.phone') }}</Label>
          <Input id="mob-phone" v-model="form.phone" type="tel" :placeholder="t('auth.placeholderPhone')" />
        </div>

        <div v-if="role === 'doctor'" class="doctor-fields">
          <p class="doctor-fields-note">{{ t('auth.doctorVerifyNote') }}</p>
          <Input v-model="form.licenseNumber" type="text" :placeholder="t('auth.licensePlaceholder')" />
          <Input v-model="form.specialization" type="text" :placeholder="t('auth.specializationPlaceholder')" />
        </div>

        <div class="actions">
          <Button class="w-full">{{ t('auth.createAccount') }}</Button>
          <p class="switch-text">
            {{ t('auth.haveAccount') }}&nbsp;
            <NuxtLink to="/auth/login" class="switch-link">{{ t('auth.login') }}</NuxtLink>
          </p>
        </div>
      </div>
    </div>

    <!-- ── Desktop split layout ───────────────────────── -->
    <div class="desktop-view">
      <div class="brand-panel">
        <div>
          <AppLogo :height="56" dark />
          <h1 class="brand-title">{{ t('auth.joinTitle') }}</h1>
          <p class="brand-subtitle">{{ t('auth.joinSubtitle') }}</p>
        </div>
        <div class="feature-list">
          <div v-for="f in authFeatures" :key="f" class="feature-item">
            <span class="feature-check">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="white" stroke-width="1.8" stroke-linecap="round" />
              </svg>
            </span>
            <span class="feature-text">{{ f }}</span>
          </div>
        </div>
      </div>

      <div class="form-panel">
        <div class="desktop-tabs">
          <NuxtLink to="/auth/login" class="desktop-tab">{{ t('auth.login') }}</NuxtLink>
          <NuxtLink to="/auth/signup" class="desktop-tab active">{{ t('auth.signup') }}</NuxtLink>
        </div>

        <h2 class="form-title">{{ t('auth.createAccountTitle') }}</h2>

        <div class="field" style="margin-bottom: 18px">
          <Label>{{ t('auth.iam') }}</Label>
          <div class="desktop-role-picker">
            <button class="desktop-role-btn" :class="{ active: role === 'patient' }" @click="role = 'patient'">{{ t('auth.patient') }}</button>
            <button class="desktop-role-btn" :class="{ active: role === 'doctor' }" @click="role = 'doctor'">{{ t('auth.doctorRole') }}</button>
          </div>
        </div>

        <div class="desktop-fields">
          <div class="field">
            <Label for="desk-name">{{ t('auth.fullName') }}</Label>
            <Input id="desk-name" v-model="form.fullName" type="text" :placeholder="t('auth.placeholderName')" class="h-11" />
          </div>
          <div class="field">
            <Label for="desk-email">{{ t('auth.emailAddress') }}</Label>
            <Input id="desk-email" v-model="form.email" type="email" :placeholder="t('auth.placeholderEmail')" class="h-11" />
          </div>
          <div class="field">
            <Label for="desk-pass">{{ t('auth.password') }}</Label>
            <Input id="desk-pass" v-model="form.password" type="password" :placeholder="t('auth.placeholderPassword')" class="h-11" />
          </div>
          <div class="field">
            <Label for="desk-phone">{{ t('auth.phone') }}</Label>
            <Input id="desk-phone" v-model="form.phone" type="tel" :placeholder="t('auth.placeholderPhone')" class="h-11" />
          </div>

          <div v-if="role === 'doctor'" class="doctor-fields">
            <p class="doctor-fields-note">{{ t('auth.doctorVerifyNote') }}</p>
            <Input v-model="form.licenseNumber" type="text" :placeholder="t('auth.licensePlaceholder')" class="h-11" />
            <Input v-model="form.specialization" type="text" :placeholder="t('auth.specializationPlaceholder')" class="h-11" />
          </div>
        </div>

        <div class="desktop-actions">
          <Button class="w-full h-11 text-base">{{ t('auth.createAccount') }}</Button>
          <p class="switch-text">
            {{ t('auth.haveAccount') }}&nbsp;
            <NuxtLink to="/auth/login" class="switch-link">{{ t('auth.login') }}</NuxtLink>
          </p>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.page { min-height: 100vh; }

/* ── Mobile ─────────────────────────────────────── */
.mobile-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--white);
}
.desktop-view { display: none; }

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
.tab.active { color: var(--blue-m); font-weight: 600; border-bottom-color: var(--blue-m); }

.form-area {
  flex: 1;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.field { display: flex; flex-direction: column; gap: 6px; }

.role-picker { display: flex; gap: 10px; }
.role-btn {
  flex: 1;
  height: 68px;
  border-radius: 10px;
  background: var(--white);
  border: 2px solid var(--gray-1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.15s;
}
.role-btn.active { border-color: var(--blue-m); background: var(--blue-xl); }

.doctor-fields {
  background: var(--gray-0);
  border: 1px solid var(--gray-1);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.doctor-fields-note { font-size: 11px; color: var(--gray-2); }

.actions {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.switch-text { text-align: center; font-size: 13px; color: var(--gray-3); }
.switch-link { font-weight: 600; color: var(--blue-m); text-decoration: none; }

/* ── Desktop ─────────────────────────────────────── */
@media (min-width: 768px) {
  .mobile-view { display: none; }
  .desktop-view { display: flex; min-height: 100vh; }

  .brand-panel {
    width: 50%;
    background: var(--blue-m);
    padding: 52px 48px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-shrink: 0;
  }

  .brand-title { font-size: 28px; font-weight: 700; color: var(--white); line-height: 1.2; margin-top: 40px; }
  .brand-subtitle { font-size: 15px; color: rgba(255,255,255,0.7); margin-top: 12px; line-height: 1.6; }
  .feature-list { display: flex; flex-direction: column; gap: 14px; }
  .feature-item { display: flex; gap: 12px; align-items: center; }
  .feature-check {
    width: 22px; height: 22px; border-radius: 50%;
    background: rgba(255,255,255,0.2);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .feature-text { font-size: 13px; color: rgba(255,255,255,0.8); }

  .form-panel {
    flex: 1; background: var(--white);
    padding: 48px 52px;
    display: flex; flex-direction: column; overflow-y: auto;
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
    padding: 8px 24px; font-size: 14px; font-weight: 600;
    color: var(--gray-3); background: var(--white);
    text-decoration: none; transition: all 0.15s; border: none;
  }
  .desktop-tab.active { background: var(--blue-m); color: var(--white); }

  .form-title { font-size: 22px; font-weight: 700; color: var(--ink); margin-bottom: 24px; }

  .desktop-role-picker { display: flex; gap: 12px; }
  .desktop-role-btn {
    flex: 1; height: 56px; border-radius: 10px;
    background: var(--white); border: 2px solid var(--gray-1);
    font-size: 14px; font-weight: 600; color: var(--gray-3);
    transition: all 0.15s;
  }
  .desktop-role-btn.active { border-color: var(--blue-m); background: var(--blue-xl); color: var(--blue-m); }

  .desktop-fields { display: flex; flex-direction: column; gap: 14px; }
  .desktop-actions { margin-top: 24px; display: flex; flex-direction: column; gap: 16px; }
}
</style>
