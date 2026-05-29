<script setup lang="ts">
import type { QuotationData } from '../../../types/quotation'
import { formatAmount, formatDate } from '../../../utils/format'

defineProps<{
  quotation: QuotationData
}>()
</script>

<template>
  <div class="template-friendly">
    <!-- Top section: Logo + Quotation badge -->
    <header class="header">
      <div class="header-left">
        <img v-if="quotation.logo?.data" :src="quotation.logo.data" :alt="quotation.logo.name" class="logo" />
      </div>
      <div class="header-right">
        <div class="quotation-badge">
          <span class="badge-title">Quotation</span>
          <span class="badge-number">{{ quotation.meta.quotation_number }}</span>
        </div>
      </div>
    </header>

    <!-- Party cards -->
    <section class="parties">
      <div class="party-card">
        <h3 class="party-label">From</h3>
        <p class="party-name">{{ quotation.from.name }}</p>
        <p v-if="quotation.from.address" class="party-detail">{{ quotation.from.address }}</p>
        <p v-if="quotation.from.email" class="party-detail">{{ quotation.from.email }}</p>
        <p v-if="quotation.from.phone" class="party-detail">{{ quotation.from.phone }}</p>
        <p v-if="quotation.from.website" class="party-detail">{{ quotation.from.website }}</p>
      </div>
      <div class="party-card">
        <h3 class="party-label">Bill To</h3>
        <p class="party-name">{{ quotation.to.name }}</p>
        <p v-if="quotation.to.address" class="party-detail">{{ quotation.to.address }}</p>
        <p v-if="quotation.to.email" class="party-detail">{{ quotation.to.email }}</p>
        <p v-if="quotation.to.phone" class="party-detail">{{ quotation.to.phone }}</p>
        <p v-if="quotation.to.website" class="party-detail">{{ quotation.to.website }}</p>
      </div>
    </section>

    <!-- Striped info bar -->
    <section class="info-bar">
      <div class="info-item">
        <span class="info-label">Issue Date</span>
        <span class="info-value">{{ formatDate(quotation.meta.issue_date) }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Valid Until</span>
        <span class="info-value">{{ formatDate(quotation.meta.valid_until) }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Currency</span>
        <span class="info-value">{{ quotation.meta.currency }}</span>
      </div>
      <div class="info-item">
        <span class="tpl-status" :class="quotation.status.toLowerCase()">
          <span class="dot"></span>{{ quotation.status }}
        </span>
      </div>
    </section>

    <!-- Card-style table -->
    <section class="table-card">
      <table>
        <thead>
          <tr>
            <th class="col-desc">Description</th>
            <th class="col-qty">Qty</th>
            <th class="col-price">Unit Price</th>
            <th class="col-amount">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in quotation.line_items" :key="item.id">
            <td class="col-desc">{{ item.description }}</td>
            <td class="col-qty">{{ item.quantity }}</td>
            <td class="col-price">{{ formatAmount(item.unit_price, quotation.meta.currency) }}</td>
            <td class="col-amount">{{ formatAmount(item.amount, quotation.meta.currency) }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Totals -->
    <section class="totals-section">
      <div class="totals">
        <div class="total-row">
          <span>Subtotal</span>
          <span>{{ formatAmount(quotation.totals.subtotal, quotation.meta.currency) }}</span>
        </div>
        <div v-if="quotation.totals.discount_percent > 0" class="total-row">
          <span>Discount ({{ quotation.totals.discount_percent }}%)</span>
          <span>-{{ formatAmount(quotation.totals.discount_amount, quotation.meta.currency) }}</span>
        </div>
        <div v-if="quotation.totals.tax_percent > 0" class="total-row">
          <span>{{ quotation.tax_label }} ({{ quotation.totals.tax_percent }}%)</span>
          <span>{{ formatAmount(quotation.totals.tax_amount, quotation.meta.currency) }}</span>
        </div>
        <div class="total-row total-final">
          <span>Total</span>
          <span>{{ formatAmount(quotation.totals.total, quotation.meta.currency) }}</span>
        </div>
      </div>
    </section>

    <!-- Notes card -->
    <section v-if="quotation.notes" class="notes-card">
      <h3 class="notes-label">Notes</h3>
      <p class="notes-content">{{ quotation.notes }}</p>
    </section>
  </div>
</template>

<style scoped>
.template-friendly {
  font-family: var(--font-sans);
  color: var(--navy);
  background: var(--paper);
  padding: 2.5rem;
  line-height: 1.6;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
}

.header-left {
  flex: 0 0 auto;
}

.logo {
  max-width: 140px;
  max-height: 80px;
  object-fit: contain;
}

.header-right {
  flex: 0 0 auto;
}

.quotation-badge {
  background: var(--navy);
  color: var(--paper);
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.badge-title {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
}

.badge-number {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  font-weight: 500;
}

/* Party cards */
.parties {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.party-card {
  background: white;
  padding: 1.5rem;
  border-radius: var(--r-lg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.party-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--blue-dark);
  margin: 0 0 0.75rem 0;
  font-weight: 600;
}

.party-name {
  font-weight: 600;
  font-size: 1rem;
  margin: 0 0 0.5rem 0;
  color: var(--navy);
}

.party-detail {
  font-size: 0.85rem;
  margin: 0.2rem 0;
  color: var(--navy);
  opacity: 0.85;
}

/* Info bar */
.info-bar {
  background: var(--sky);
  padding: 1.25rem 1.5rem;
  border-radius: var(--r-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--blue-dark);
  font-weight: 600;
}

.info-value {
  font-size: 0.9rem;
  color: var(--navy);
  font-weight: 500;
}

/* Status badge */
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

/* Table card */
.table-card {
  background: white;
  border-radius: var(--r-lg);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 2rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

thead {
  background: var(--blue);
  color: white;
}

th {
  padding: 1rem 1.25rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

th.col-qty,
th.col-price,
th.col-amount {
  text-align: right;
}

tbody tr {
  border-bottom: 1px solid var(--border);
}

tbody tr:last-child {
  border-bottom: none;
}

td {
  padding: 1rem 1.25rem;
  vertical-align: top;
}

.col-qty,
.col-price,
.col-amount {
  text-align: right;
  font-family: var(--font-mono);
}

.col-desc {
  width: 50%;
}

.col-qty {
  width: 10%;
}

.col-price,
.col-amount {
  width: 20%;
}

/* Totals */
.totals-section {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem;
}

.totals {
  min-width: 280px;
  font-size: 0.875rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 0.625rem 0;
  border-bottom: 1px solid var(--border);
}

.total-row:last-child {
  border-bottom: none;
}

.total-final {
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--navy);
  margin-top: 0.5rem;
  padding-top: 0.875rem;
  border-top: 2px solid var(--navy);
  border-bottom: none;
}

/* Notes card */
.notes-card {
  background: white;
  padding: 1.5rem;
  border-radius: var(--r-lg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.notes-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--blue-dark);
  margin: 0 0 0.75rem 0;
  font-weight: 600;
}

.notes-content {
  font-size: 0.85rem;
  line-height: 1.6;
  margin: 0;
  color: var(--navy);
  opacity: 0.85;
  white-space: pre-wrap;
}

/* Print styles */
@media print {
  .template-friendly {
    padding: 1.5rem;
  }

  .party-card,
  .table-card,
  .notes-card {
    box-shadow: none;
    border: 1px solid var(--border);
  }

  .info-bar {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  thead {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .quotation-badge {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .tpl-status {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}
</style>
