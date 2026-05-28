<script setup lang="ts">
// Catalog search — debounced search input (300ms)
// Emits search(query) after user stops typing.

import { ref } from 'vue'

const emit = defineEmits<{
  search: [query: string]
}>()

const inputValue = ref('')
let debounceTimer: ReturnType<typeof setTimeout> | null = null

function onInput(event: Event): void {
  const value = (event.target as HTMLInputElement).value
  inputValue.value = value

  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('search', value)
  }, 300)
}
</script>

<template>
  <div class="catalog-search">
    <input
      type="text"
      class="search-input"
      placeholder="Search catalog..."
      :value="inputValue"
      @input="onInput"
    />
  </div>
</template>

<style scoped>
.catalog-search {
  padding: 4px 0 8px;
}

.search-input {
  width: 100%;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.06);
  border: 1.5px solid var(--border-dark);
  border-radius: var(--r-sm);
  color: var(--text-on-dark);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  transition: all 0.15s;
  box-sizing: border-box;
}

.search-input::placeholder {
  color: var(--text-dim);
  opacity: 0.5;
}

.search-input:focus {
  outline: none;
  border-color: var(--blue);
  background: rgba(255, 255, 255, 0.1);
}
</style>
