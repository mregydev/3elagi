<script setup lang="ts">
interface Props {
  value?: number
  size?: number
}

withDefaults(defineProps<Props>(), {
  value: 4,
  size: 11,
})
</script>

<template>
  <span class="stars">
    <svg
      v-for="i in 5"
      :key="i"
      :width="size"
      :height="size"
      viewBox="0 0 24 24"
      :fill="i <= value ? '#F59E0B' : 'none'"
      stroke="#F59E0B"
      stroke-width="2"
    >
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  </span>
</template>

<style scoped>
.stars {
  display: flex;
  gap: 1px;
  align-items: center;
}
</style>
