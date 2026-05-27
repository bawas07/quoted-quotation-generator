<script setup lang="ts">
// Logo upload — upload and preview business logo
// Supports click-to-select and drag-drop with validation

import { ref } from 'vue'
import type { QuotationLogo } from '../../types/quotation'
import { useLogoUpload } from '../../composables/useLogoUpload'
import { useToast } from '../../composables/useToast'

const props = defineProps<{
  modelValue: QuotationLogo | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: QuotationLogo | null]
}>()

const { handleFileSelect, isDragging } = useLogoUpload()
const { showToast } = useToast()

const fileInput = ref<HTMLInputElement | null>(null)

async function processFile(file: File): Promise<void> {
  try {
    const logo = await handleFileSelect(file)
    emit('update:modelValue', logo)
  } catch (err) {
    showToast(err instanceof Error ? err.message : 'Failed to upload logo', 'error')
  }
}

function onDrop(event: DragEvent): void {
  event.preventDefault()
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) processFile(file)
}

function onFileInputChange(event: Event): void {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) processFile(file)
  input.value = ''
}

function onDragOver(event: DragEvent): void {
  event.preventDefault()
  isDragging.value = true
}

function onDragLeave(): void {
  isDragging.value = false
}

function onClick(): void {
  fileInput.value?.click()
}

function removeLogo(): void {
  emit('update:modelValue', null)
}
</script>

<template>
  <div class="logo-upload-section">
    <label class="field-label">Logo</label>

    <div
      class="drop-zone"
      :class="{ 'drag-over': isDragging, 'has-logo': !!props.modelValue }"
      @click="onClick"
      @drop="onDrop"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        style="display:none"
        @change="onFileInputChange"
      />

      <div v-if="props.modelValue" class="logo-preview">
        <img :src="props.modelValue.data" :alt="props.modelValue.name" class="logo-img" />
        <span class="logo-name">{{ props.modelValue.name }}</span>
        <button class="logo-remove" type="button" @click.stop="removeLogo">✕</button>
      </div>

      <div v-else class="drop-placeholder">
        <span class="drop-icon">↑</span>
        <span class="drop-text">Drop logo here or click to browse</span>
        <span class="drop-hint">JPEG, PNG, GIF, WebP, SVG · max 2MB</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.logo-upload-section {
  margin-bottom: 20px;
}

.field-label {
  display: block;
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-bottom: 8px;
}

.drop-zone {
  border: 1.5px dashed var(--border-dark);
  border-radius: var(--r-sm);
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drop-zone:hover {
  border-color: var(--border-dark-h);
  background: rgba(235, 243, 250, 0.04);
}

.drop-zone.drag-over {
  border-color: var(--blue);
  background: rgba(74, 144, 196, 0.08);
}

.logo-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.logo-img {
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: var(--r-sm);
  background: rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
}

.logo-name {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-on-dark);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.logo-remove {
  background: rgba(192, 57, 43, 0.15);
  border: none;
  color: var(--error);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s;
}

.logo-remove:hover {
  background: rgba(192, 57, 43, 0.3);
}

.drop-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.drop-icon {
  font-size: 18px;
  color: var(--text-dim);
  margin-bottom: 4px;
}

.drop-text {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-on-dark);
}

.drop-hint {
  font-family: var(--font-mono);
  font-size: 8px;
  color: var(--text-dim);
}
</style>
