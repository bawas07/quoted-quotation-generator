<script setup lang="ts">
import type { QuotationData } from '../../../types/quotation'
import { formatAmount, formatDate } from '../../../utils/format'

defineProps<{
  quotation: QuotationData
}>()
</script>

<template>
  <div class="tpl-sidebar-layout">
    <!-- Left Sidebar -->
    <aside class="tpl-sidebar">
      <!-- Logo -->
      <div v-if="quotation.logo?.data" class="logo-section">
        <img :src="quotation.logo.data" :alt="quotation.logo.name" />
      </div>

      <!-- From -->
      <section class="sidebar-section">
        <h3 class="section-label">From</h3>
        <div class="party-info">
          <div class="party-name">{{ quotation.from.name }}</div>
          <div v-if="quotation.from.address" class="party-detail">{{ quotation.from.address }}</div>
          <div v-if="quotation.from.email" class="party-detail">{{ quotation.from.email }}</div>
          <div v-if="quotation.from.phone" class="party-detail">{{ quotation.from.phone }}</div>
        </div>
      </section>

      <!-- Currency -->
      <section class="sidebar-section">
        <h3 class="section-label">Currency</h3>
        <div class="currency-code">{{ quotation.meta.currency }}</div>
      </section>

      <!-- Status -->
      <section class="sidebar-section">
        <span class="tpl-status" :class="quotation.status.toLowerCase()">
          <span class="dot"></span>{{ quotation.status }}
        </span>
      </section>
    </aside>

    <!-- Right Main Column -->
    <main class="main-content">
      <!-- Title & Meta -->
      <div class="header-section">
        <h1 class="doc-title">Quotation</h1>
        <div class="meta-block">
          <div class="meta-item">
            <span class="meta-label">Number:</span>
            <span class="meta-value">{{ quotation.meta.quotation_number }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Issued:</span>
            <span class="meta-value">{{ formatDate(quotation.meta.issue_date) }}</span>
          </div>
          <div v-if="quotation.meta.valid_until" class="meta-item">
            <span class="meta-label">Valid Until:</span>
            <span class="meta-value">{{ formatDate(quotation.meta.valid_until) }}</span>
          </div>
        </div>
      </div>

      <!-- Billed To -->
      <section class="billed-to-section">
        <h2 class="section-title">Billed To</h2>
        <div class="party-name">{{ quotation.to.name }}</div>
        <div v-if="quotation.to.address" class="party-detail">{{ quotation.to.address }}</div>
        <div v-if="quotation.to.email" class="party-detail">{{ quotation.to.email }}</div>
      </section>

      <!-- Line Items Table -->
      <section class="items-section">
        <table class="items-table">
          <thead>
            <tr>
              <th class="col-desc">Description</th>
              <th class="col-amount">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in quotation.line_items" :key="item.id">
              <td class="col-desc">
                <div class="item-name">{{ item.description }}</div>
                <div class="item-breakdown">
                  {{ item.quantity }} × {{ formatAmount(item.unit_price, quotation.meta.currency) }}
                </div>
              </td>
              <td class="col-amount">{{ formatAmount(item.amount, quotation.meta.currency) }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Totals -->
      <section class="totals-section">
        <div class="total-row">
          <span class="total-label">Subtotal</span>
          <span class="total-value">{{ formatAmount(quotation.totals.subtotal, quotation.meta.currency) }}</span>
        </div>
        <div v-if="quotation.totals.discount_percent > 0" class="total-row">
          <span class="total-label">{{ quotation.discount_label }} ({{ quotation.totals.discount_percent }}%)</span>
          <span class="total-value">-{{ formatAmount(quotation.totals.discount_amount, quotation.meta.currency) }}</span>
        </div>
        <div v-if="quotation.totals.tax_percent > 0" class="total-row">
          <span class="total-label">{{ quotation.tax_label || 'Tax' }} ({{ quotation.totals.tax_percent }}%)</span>
          <span class="total-value">{{ formatAmount(quotation.totals.tax_amount, quotation.meta.currency) }}</span>
        </div>
        <div class="total-row total-final">
          <span class="total-label">Total</span>
          <span class="total-value">{{ formatAmount(quotation.totals.total, quotation.meta.currency) }}</span>
        </div>
      </section>

      <!-- Notes -->
      <section v-if="quotation.notes" class="notes-section">
        <h3 class="notes-title">Notes</h3>
        <div class="notes-content">{{ quotation.notes }}</div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.tpl-sidebar-layout {
  display: grid;
  grid-template-columns: 198px 1fr;
  gap: 0;
  min-height: 100%;
}

/* ── Sidebar ─────────────────────────────── */
.tpl-sidebar {
  background: var(--sky);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.logo-section {
  margin-bottom: var(--space-4);
}

.logo-section img {
  max-width: 100%;
  height: auto;
  display: block;
}

.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.section-label {
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-muted);
  margin: 0 0 var(--space-2) 0;
}

.party-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.party-name {
  font-weight: 600;
  font-size: var(--text-base);
  color: var(--text-primary);
}

.party-detail {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: 1.4;
}

.currency-code {
  font-family: var(--font-mono);
  font-size: var(--text-md);
  font-weight: 600;
  color: var(--text-primary);
}

/* ── Status Badge ────────────────────────── */
.tpl-status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  border-radius: 99px;
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  border: 1px solid currentColor;
}

.tpl-status .dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
}

.tpl-status.draft {
  color: var(--s-draft);
}

.tpl-status.sent {
  color: var(--s-sent);
}

.tpl-status.accepted {
  color: var(--s-accepted);
}

.tpl-status.rejected {
  color: var(--s-rejected);
}

/* ── Main Content ────────────────────────── */
.main-content {
  background: var(--paper);
  padding: var(--space-8);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

/* ── Header Section ──────────────────────── */
.header-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.doc-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.meta-block {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.meta-item {
  display: flex;
  gap: var(--space-2);
  font-size: var(--text-sm);
}

.meta-label {
  color: var(--text-muted);
  font-weight: 500;
}

.meta-value {
  color: var(--text-primary);
  font-weight: 500;
}

/* ── Billed To Section ───────────────────── */
.billed-to-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.section-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--space-2) 0;
}

/* ── Items Table ─────────────────────────── */
.items-section {
  margin: var(--space-4) 0;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
}

.items-table thead {
  border-bottom: 2px solid var(--border);
}

.items-table th {
  text-align: left;
  padding: var(--space-3) var(--space-2);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-muted);
}

.items-table tbody tr {
  border-bottom: 1px solid var(--border);
}

.items-table td {
  padding: var(--space-3) var(--space-2);
  vertical-align: top;
}

.col-desc {
  width: 70%;
}

.col-amount {
  width: 30%;
  text-align: right;
}

.items-table th.col-amount {
  text-align: right;
}

.item-name {
  font-weight: 500;
  color: var(--text-primary);
  font-size: var(--text-base);
  margin-bottom: var(--space-1);
}

.item-breakdown {
  font-size: var(--text-sm);
  color: var(--text-muted);
}

/* ── Totals Section ──────────────────────── */
.totals-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding-top: var(--space-4);
  border-top: 2px solid var(--border);
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) 0;
}

.total-label {
  font-size: var(--text-base);
  color: var(--text-secondary);
}

.total-value {
  font-size: var(--text-base);
  font-weight: 500;
  color: var(--text-primary);
  font-family: var(--font-mono);
}

.total-final {
  margin-top: var(--space-2);
  padding-top: var(--space-3);
  border-top: 2px solid var(--border);
}

.total-final .total-label {
  font-size: var(--text-md);
  font-weight: 600;
  color: var(--text-primary);
}

.total-final .total-value {
  font-size: var(--text-md);
  font-weight: 700;
  color: var(--text-primary);
}

/* ── Notes Section ───────────────────────── */
.notes-section {
  margin-top: var(--space-6);
  padding: var(--space-4);
  background: var(--sky);
  border-radius: var(--r-sm);
}

.notes-title {
  font-size: var(--text-sm);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-muted);
  margin: 0 0 var(--space-2) 0;
}

.notes-content {
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: 1.6;
  white-space: pre-wrap;
}

@media print {
  .tpl-sidebar-layout {
    display: block;
    padding: 52px 56px;
    box-shadow: none;
  }

  .tpl-sidebar {
    padding: 0;
    margin-bottom: 28px;
    background: none;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .logo-section {
    float: right;
    margin: 0 0 12px 20px;
  }

  .logo-section img {
    max-width: 100px;
    max-height: 50px;
  }

  .sidebar-section {
    margin: 0;
  }

  thead {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .tpl-status {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .notes-section {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}
</style>
