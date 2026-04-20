<script setup lang="ts">
const { locale } = useI18n()

/** Keep document direction in sync with locale (RTL for Arabic, LTR for English). */
useHead(() => {
  const code = locale.value
  const isRtl = code === 'ar'
  const dir = isRtl ? 'rtl' : 'ltr'
  const lang = code === 'ar' ? 'ar-EG' : 'en-US'
  return {
    htmlAttrs: { dir, lang },
    bodyAttrs: { dir },
  }
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>
