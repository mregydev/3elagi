<script setup lang="ts">
interface Props {
  size?: number
}

withDefaults(defineProps<Props>(), {
  size: 44,
})
</script>

<template>
  <div class="avatar" :style="{ width: `${size}px`, height: `${size}px` }">
    <svg
      :width="size * 0.45"
      :height="size * 0.45"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2563EB"
      stroke-width="1.8"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  </div>
</template>

<style scoped>
.avatar {
  border-radius: 50%;
  background: var(--blue-l);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
