<script setup lang="ts">
/**
 * AppModal — reusable modal dialog shell
 *
 * Teleports to <body>, handles backdrop overlay, Escape key close,
 * and scale-in animation. Matches docs/example-v2.html CSS classes.
 *
 * Props:
 *   open      - whether the modal is visible
 *   title     - header title text
 *   subtitle  - optional header subtitle text
 *   closable  - whether backdrop click emits close (default true)
 *
 * Emits:
 *   close     - when modal should be closed
 */

import { onMounted, onUnmounted } from 'vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    title?: string
    subtitle?: string
    closable?: boolean
  }>(),
  {
    closable: true,
  },
)

const emit = defineEmits<{
  close: []
}>()

function onKeydown(e: KeyboardEvent): void {
  if (props.open && e.key === 'Escape') {
    emit('close')
  }
}

function onBackdropClick(e: MouseEvent): void {
  if (!props.closable) return
  // Only emit close if the click is on the overlay itself, not the card
  if ((e.target as HTMLElement).classList.contains('modal-ov')) {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="modal-ov open"
      @click.self="onBackdropClick"
    >
      <div class="modal" role="dialog" aria-modal="true">
        <div v-if="title || subtitle" class="modal-hdr">
          <div v-if="title" class="modal-title">{{ title }}</div>
          <div v-if="subtitle" class="modal-sub">{{ subtitle }}</div>
        </div>

        <div class="modal-body">
          <slot />
        </div>

        <div v-if="$slots.footer" class="modal-ftr">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-ov {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(26, 44, 61, 0.65);
  z-index: 400;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(6px);
}

.modal-ov.open {
  display: flex;
}

.modal {
  background: var(--cloud);
  border-radius: var(--r-lg);
  padding: 0;
  max-width: 440px;
  width: 94%;
  box-shadow: var(--shadow-float);
  animation: mIn 0.22s ease;
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

@keyframes mIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-hdr {
  padding: 22px 24px 16px;
  border-bottom: 1px solid var(--border);
}

.modal-title {
  font-family: var(--font-serif);
  font-size: 21px;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.modal-sub {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-muted);
  letter-spacing: 0.3px;
}

.modal-body {
  padding: 0 24px;
  overflow-y: auto;
  flex: 1;
}

.modal-ftr {
  padding: 16px 24px;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
