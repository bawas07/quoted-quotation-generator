<script setup lang="ts">
// App button — reusable button component with variants and sizes

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md'
  disabled?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
})
</script>

<template>
  <button
    class="btn"
    :class="[
      `btn-${props.variant}`,
      { 'btn-sm': props.size === 'sm' },
    ]"
    :disabled="props.disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border-radius: var(--r-sm);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  padding: 11px 20px;
  transition: all 0.2s;
  white-space: nowrap;
  cursor: pointer;
  border: none;
  font-weight: 500;
}

.btn-sm {
  padding: 8px 14px;
  font-size: 10px;
  letter-spacing: 1px;
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none !important;
}

.btn-primary {
  background: var(--blue);
  color: white;
  box-shadow: 0 2px 14px rgba(74, 144, 196, 0.38);
}

.btn-primary:hover:not(:disabled) {
  background: var(--blue-dark);
  box-shadow: 0 5px 20px rgba(74, 144, 196, 0.48);
  transform: translateY(-1px);
}

.btn-secondary {
  background: transparent;
  color: var(--blue);
  border: 1.5px solid var(--blue);
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(74, 144, 196, 0.1);
}

.btn-ghost {
  background: transparent;
  color: var(--text-dim);
  border: 1.5px solid var(--border-dark);
}

.btn-ghost:hover:not(:disabled) {
  color: var(--text-on-dark);
  border-color: var(--border-dark-h);
}
</style>
