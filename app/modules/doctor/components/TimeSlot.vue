<script setup lang="ts">
interface Props {
  time: string
  active?: boolean
}

withDefaults(defineProps<Props>(), {
  active: false,
})

const emit = defineEmits<{ click: [] }>()
</script>

<template>
  <button class="slot" :class="{ active }" @click="emit('click')">
    {{ time }}
  </button>
</template>

<style scoped>
.slot {
  padding: 7px 14px;
  border-radius: 8px;
  background: var(--white);
  border: 1.5px solid var(--gray-1);
  font-size: 12px;
  font-weight: 400;
  color: var(--gray-4);
  transition: all 0.15s;
  white-space: nowrap;
}

.slot.active {
  background: var(--blue-xl);
  border-color: var(--blue-m);
  color: var(--blue-m);
  font-weight: 600;
}

@media (min-width: 768px) {
  .slot {
    padding: 9px 18px;
    font-size: 13px;
  }
}
</style>
