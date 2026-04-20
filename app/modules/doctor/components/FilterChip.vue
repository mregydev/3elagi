<script setup lang="ts">
interface Props {
  label: string
  active?: boolean
}

withDefaults(defineProps<Props>(), {
  active: false,
})

const emit = defineEmits<{ click: [] }>()
</script>

<template>
  <button class="chip" :class="{ active }" @click="emit('click')">
    {{ label }}
  </button>
</template>

<style scoped>
.chip {
  height: 28px;
  padding: 0 12px;
  border-radius: 99px;
  flex-shrink: 0;
  background: var(--white);
  border: 1.5px solid var(--gray-1);
  color: var(--gray-4);
  font-size: 12px;
  font-weight: 400;
  white-space: nowrap;
  transition: all 0.15s;
}

.chip.active {
  background: var(--blue-m);
  border-color: var(--blue-m);
  color: var(--white);
  font-weight: 600;
}
</style>
