// Template switching animation state
// Provides isSwitching ref and triggerSwitch() for 150ms cross-fade
// between template components in the preview panel.

import { ref, type Ref } from 'vue'

export interface UseTemplateReturn {
  isSwitching: Ref<boolean>
  triggerSwitch: () => void
}

const SWITCH_DURATION_MS = 150

export function useTemplate(): UseTemplateReturn {
  const isSwitching: Ref<boolean> = ref(false)
  let switchTimer: ReturnType<typeof setTimeout> | null = null

  function triggerSwitch(): void {
    // Clear any in-progress timer to prevent stale state
    if (switchTimer !== null) {
      clearTimeout(switchTimer)
    }

    isSwitching.value = true

    switchTimer = setTimeout(() => {
      isSwitching.value = false
      switchTimer = null
    }, SWITCH_DURATION_MS)
  }

  return {
    isSwitching,
    triggerSwitch,
  }
}
