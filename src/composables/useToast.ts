// Toast notification system
// Reactive toast array with auto-dismiss and manual removal.

import { ref, type Ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'warning' | 'error'
}

const toasts: Ref<Toast[]> = ref([])

export function useToast() {
  function showToast(message: string, type: Toast['type'] = 'success'): void {
    const id = uuidv4()
    toasts.value.push({ id, message, type })

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      removeToast(id)
    }, 3000)
  }

  function removeToast(id: string): void {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function clearToasts(): void {
    toasts.value = []
  }

  return {
    toasts,
    showToast,
    removeToast,
    clearToasts,
  }
}
