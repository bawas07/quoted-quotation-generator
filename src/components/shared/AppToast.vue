<script setup lang="ts">
// App toast — notification toast container
// Renders fixed-position stack of toasts bottom-right

import { useToast } from '../../composables/useToast'

const { toasts, removeToast } = useToast()
</script>

<template>
  <div class="toast-container">
    <transition-group name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast-card"
        :class="'toast-' + toast.type"
      >
        <span class="toast-message">{{ toast.message }}</span>
        <button class="toast-close" type="button" @click="removeToast(toast.id)">✕</button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}

.toast-card {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--r-sm);
  background: var(--navy);
  border-left: 3px solid;
  box-shadow: var(--shadow-float);
  min-width: 260px;
  max-width: 400px;
}

.toast-success {
  border-left-color: var(--success);
}

.toast-warning {
  border-left-color: var(--warning);
}

.toast-error {
  border-left-color: var(--error);
}

.toast-message {
  flex: 1;
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--text-on-dark);
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  color: var(--text-dim);
  font-size: 12px;
  cursor: pointer;
  padding: 2px;
  flex-shrink: 0;
  transition: color 0.12s;
}

.toast-close:hover {
  color: var(--text-on-dark);
}

/* Transition */
.toast-enter-active {
  transition: all 0.25s ease;
}

.toast-leave-active {
  transition: all 0.2s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(40px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
