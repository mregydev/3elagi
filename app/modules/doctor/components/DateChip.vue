<script setup lang="ts">
interface Props {
  day: string
  date: string | number
  month?: string
  active?: boolean
  large?: boolean
}

withDefaults(defineProps<Props>(), {
  active: false,
  large: false,
})

const emit = defineEmits<{ click: [] }>()
</script>

<template>
  <button
    class="date-chip"
    :class="{ active, large }"
    @click="emit('click')"
  >
    <span class="day">{{ day }}</span>
    <span class="date">{{ date }}</span>
    <span v-if="month" class="month">{{ month }}</span>
  </button>
</template>

<style scoped>
.date-chip {
  width: 52px;
  padding: 7px 0;
  border-radius: 10px;
  text-align: center;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  background: var(--white);
  border: 1.5px solid var(--gray-1);
  transition: all 0.15s;
}

.date-chip.large {
  width: 64px;
  padding: 10px 0;
}

.date-chip.active {
  background: var(--blue-m);
  border-color: var(--blue-m);
}

.day {
  font-size: 10px;
  font-weight: 500;
  color: var(--gray-2);
  display: block;
}

.date-chip.active .day {
  color: rgba(255, 255, 255, 0.7);
}

.date {
  font-size: 15px;
  font-weight: 700;
  color: var(--ink);
  display: block;
}

.date-chip.large .date {
  font-size: 17px;
}

.date-chip.active .date {
  color: var(--white);
}

.month {
  font-size: 10px;
  color: var(--gray-2);
  display: block;
}

.date-chip.active .month {
  color: rgba(255, 255, 255, 0.6);
}
</style>
