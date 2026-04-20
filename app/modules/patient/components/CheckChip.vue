<script setup lang="ts">
interface Props {
  label: string
  selected?: boolean
  icon?: string
  wide?: boolean
}

withDefaults(defineProps<Props>(), {
  selected: false,
  wide: false,
})

const emit = defineEmits<{ toggle: [] }>()
</script>

<template>
  <button
    class="chip"
    :class="{ selected, wide }"
    @click="emit('toggle')"
  >
    <span class="indicator" :class="{ selected }">
      <svg v-if="selected" width="10" height="10" viewBox="0 0 12 12" fill="none">
        <path d="M2 6l3 3 5-5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>
    <span v-if="icon" class="icon">{{ icon }}</span>
    <span class="label" :class="{ selected }">{{ label }}</span>
  </button>
</template>

<style scoped>
.chip {
  padding: 11px 14px;
  border-radius: 10px;
  border: 2px solid var(--gray-1);
  background: var(--white);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
  transition: border-color 0.12s, background 0.12s;
  width: 100%;
}

.chip.selected {
  border-color: #3057F2;
  background: var(--blue-xl);
}

.chip.wide { padding: 13px 18px; }

.indicator {
  width: 20px;
  height: 20px;
  border-radius: 5px;
  flex-shrink: 0;
  border: 2px solid var(--gray-2);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.12s;
}

.indicator.selected {
  border-color: #3057F2;
  background: #3057F2;
}

.icon { font-size: 18px; }

.label {
  font-size: 14px;
  font-weight: 400;
  color: var(--ink);
}

.label.selected {
  font-weight: 600;
  color: #3057F2;
}
</style>
