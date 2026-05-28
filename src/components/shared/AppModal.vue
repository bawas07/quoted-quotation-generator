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

import { watch, onUnmounted, nextTick } from 'vue'

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

// ── Focus management ─────────────────────────────────────────

let previousActiveElement: HTMLElement | null = null
let previousOverflow = ''

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ]
  return Array.from(
    container.querySelectorAll<HTMLElement>(selectors.join(', ')),
  ).filter((el) => el.offsetParent !== null)
}

function clampFocus(e: KeyboardEvent): void {
  if (e.key !== 'Tab') return

  const modalEl = document.querySelector('.modal') as HTMLElement | null
  if (!modalEl) return

  const focusable = getFocusableElements(modalEl)
  if (focusable.length === 0) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

function onKeydown(e: KeyboardEvent): void {
  if (!props.open) return
  if (e.key === 'Escape' && props.closable) {
    emit('close')
    return
  }
  clampFocus(e)
}

function onBackdropClick(): void {
  if (!props.closable) return
  emit('close')
}

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      document.addEventListener('keydown', onKeydown)
      previousActiveElement = document.activeElement as HTMLElement
      previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'

      await nextTick()
      const modalEl = document.querySelector('.modal') as HTMLElement | null
      if (modalEl) {
        const focusable = getFocusableElements(modalEl)
        if (focusable.length > 0) {
          focusable[0].focus()
        }
      }
    } else {
      document.removeEventListener('keydown', onKeydown)
      document.body.style.overflow = previousOverflow
      if (previousActiveElement) {
        previousActiveElement.focus()
        previousActiveElement = null
      }
    }
  },
)

// Clean up on unmount in case component is destroyed while open
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = previousOverflow
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
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
    </Transition>
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
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: mIn 0.22s ease;
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

<!-- Transition animations — must be non-scoped for Vue's Transition classes -->
<style>
.modal-enter-active {
  animation: modalFadeIn 0.22s ease;
}
.modal-leave-active {
  animation: modalFadeOut 0.22s ease;
}

@keyframes modalFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modalFadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}
</style>
