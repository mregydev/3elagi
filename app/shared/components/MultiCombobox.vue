<script setup lang="ts">
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverPortal,
  PopoverContent,
} from 'reka-ui'

interface Option {
  value: string
  label: string
}

interface Props {
  options: Option[]
  modelValue: string[]
  placeholder?: string
  searchPlaceholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select...',
  searchPlaceholder: 'Search...',
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const search = ref('')

const filtered = computed(() =>
  search.value.trim()
    ? props.options.filter(o =>
        o.label.toLowerCase().includes(search.value.toLowerCase()),
      )
    : props.options,
)

function toggle(value: string) {
  const next = props.modelValue.includes(value)
    ? props.modelValue.filter(v => v !== value)
    : [...props.modelValue, value]
  emit('update:modelValue', next)
}

const triggerLabel = computed(() => {
  if (props.modelValue.length === 0) return props.placeholder
  if (props.modelValue.length === 1)
    return props.options.find(o => o.value === props.modelValue[0])?.label ?? props.placeholder
  return `${props.modelValue.length} محددة`
})
</script>

<template>
  <PopoverRoot @update:open="(open) => { if (!open) search = '' }">
    <PopoverTrigger as-child>
      <button class="mc-trigger" :class="{ 'mc-has-value': modelValue.length > 0 }">
        <span class="mc-label">{{ triggerLabel }}</span>
        <svg class="mc-chevron" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    </PopoverTrigger>

    <PopoverPortal>
      <PopoverContent align="start" :side-offset="6" :collision-padding="12">
        <!-- Inner wrapper: scoped styles on teleported Popover roots can miss the host node — keep panel opaque here -->
        <div class="mc-panel">
        <!-- Search -->
        <div class="mc-search">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2.5">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            v-model="search"
            class="mc-input"
            type="text"
            :placeholder="searchPlaceholder"
            @keydown.stop
          />
          <button v-if="search" class="mc-x" @click="search = ''">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Options -->
        <div class="mc-list">
          <p v-if="filtered.length === 0" class="mc-empty">لا توجد نتائج</p>
          <button
            v-for="option in filtered"
            :key="option.value"
            class="mc-item"
            :class="{ 'mc-selected': modelValue.includes(option.value) }"
            @click="toggle(option.value)"
          >
            <span class="mc-box" :class="{ 'mc-box-checked': modelValue.includes(option.value) }">
              <svg v-if="modelValue.includes(option.value)" width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="white" stroke-width="1.8" stroke-linecap="round" />
              </svg>
            </span>
            {{ option.label }}
          </button>
        </div>

        <!-- Footer -->
        <div v-if="modelValue.length > 0" class="mc-footer">
          <button class="mc-clear" @click="emit('update:modelValue', [])">مسح الكل</button>
          <span class="mc-count">{{ modelValue.length }} محددة</span>
        </div>
        </div>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<style scoped>
/* ── Trigger ──────────────────────────────────── */
.mc-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  height: 36px;
  padding: 0 10px 0 12px;
  border-radius: 8px;
  border: 1.5px solid var(--gray-1);
  background: var(--white);
  font-size: 13px;
  color: var(--gray-3);
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
  text-align: start;
}

.mc-trigger:hover,
.mc-trigger[data-state='open'] {
  border-color: var(--blue-m);
}

.mc-has-value {
  border-color: var(--blue-m);
  color: var(--blue-m);
  font-weight: 600;
}

.mc-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mc-chevron {
  flex-shrink: 0;
  color: var(--gray-2);
  transition: transform 0.2s;
}

.mc-trigger[data-state='open'] .mc-chevron {
  transform: rotate(180deg);
}

/* ── Dropdown panel (inner — always gets scoped attrs; fully opaque) ── */
.mc-panel {
  width: 220px;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid var(--gray-1);
  /* Solid fills — avoid transparent host + var(--white) failing in some contexts */
  background-color: #ffffff;
  background-color: var(--white, #ffffff);
  box-shadow: 0 8px 32px rgba(15, 23, 42, 0.14);
  isolation: isolate;
  animation: mc-in 0.12s ease;
}

@keyframes mc-in {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Search ───────────────────────────────────── */
.mc-search {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  border-bottom: 1px solid var(--gray-1);
  background-color: #ffffff;
  background-color: var(--white, #ffffff);
}

.mc-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 13px;
  color: var(--ink);
  background: transparent;
  min-width: 0;
}

.mc-input::placeholder { color: var(--gray-2); }

.mc-x {
  border: none;
  background: none;
  padding: 0;
  color: var(--gray-3);
  cursor: pointer;
  display: flex;
  align-items: center;
}

/* ── List ─────────────────────────────────────── */
.mc-list {
  max-height: 210px;
  overflow-y: auto;
  padding: 5px;
  background-color: #ffffff;
  background-color: var(--white, #ffffff);
}

.mc-empty {
  text-align: center;
  font-size: 12px;
  color: var(--gray-3);
  padding: 14px 0;
  margin: 0;
}

.mc-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  border-radius: 7px;
  border: none;
  background: transparent;
  font-size: 13px;
  color: var(--gray-4);
  cursor: pointer;
  text-align: start;
  transition: background 0.1s;
}

.mc-item:hover { background: var(--gray-0); }
.mc-selected   { color: var(--ink); font-weight: 500; }

.mc-box {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1.5px solid var(--gray-2);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.12s;
}

.mc-box-checked {
  background: var(--blue-m);
  border-color: var(--blue-m);
}

/* ── Footer ───────────────────────────────────── */
.mc-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-top: 1px solid var(--gray-1);
  background-color: #ffffff;
  background-color: var(--white, #ffffff);
}

.mc-clear {
  border: none;
  background: none;
  font-size: 12px;
  font-weight: 600;
  color: var(--blue-m);
  cursor: pointer;
  padding: 0;
}

.mc-count {
  font-size: 11px;
  color: var(--gray-3);
}
</style>

<!--
  Floating wrapper + dialog host from reka-ui are often transparent; force opaque shell so filters never show through.
-->
<style>
[data-reka-popper-content-wrapper] {
  z-index: 1300 !important;
}

[data-reka-popper-content-wrapper] [role='dialog'] {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
  outline: none !important;
}
</style>
