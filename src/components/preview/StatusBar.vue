<script setup lang="ts">
// Status bar — live quotation number and client name

defineProps<{
  quotationNumber: string
  clientName: string
}>()
</script>

<template>
  <div class="status-bar">
    <div class="sb-left">
      <span class="sb-num">{{ quotationNumber }}</span>
      <span>·</span>
      <span>{{ clientName || '—' }}</span>
    </div>
  </div>
</template>
