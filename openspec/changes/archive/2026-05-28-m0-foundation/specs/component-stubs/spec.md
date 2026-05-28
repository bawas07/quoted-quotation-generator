## ADDED Requirements

### Requirement: Vue SFC stubs created
All 26 component stubs MUST be valid `.vue` files with `<template>`, `<script setup lang="ts">`, and `<style scoped>` blocks.

#### Scenario: SFC compiles
- **WHEN** a Vue compiler processes `SidebarShell.vue`
- **THEN** no compilation errors occur

### Requirement: Composable stubs created
All 11 composable stubs MUST export at least one function to satisfy TypeScript module export requirements.

#### Scenario: Composable importable
- **WHEN** `useQuotation.ts` is imported
- **THEN** the `useQuotation` function is available
