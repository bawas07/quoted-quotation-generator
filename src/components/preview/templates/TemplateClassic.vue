<script setup lang="ts">
import type { QuotationData } from '../../../types/quotation'
import { formatAmount, formatDate } from '../../../utils/format'

defineProps<{
  quotation: QuotationData
}>()
</script>

<template>
  <div class="template-classic">
    <!-- Top gradient bar -->
    <div class="top-bar"></div>

    <!-- Status badge -->
    <span class="tpl-status" :class="quotation.status.toLowerCase()">
      <span class="dot"></span>{{ quotation.status }}
    </span>

    <!-- Header: Logo + Title -->
    <header class="header">
      <div class="header-left">
        <img v-if="quotation.logo?.data" :src="quotation.logo.data" :alt="quotation.logo.name" class="logo" />
      </div>
      <div class="header-right">
        <h1 class="title">Quotation</h1>
        <p class="quotation-number">{{ quotation.meta.quotation_number }}</p>
        <div class="dates">
          <p>Issued: {{ formatDate(quotation.meta.issue_date) }}</p>
          <p>Valid until: {{ formatDate(quotation.meta.valid_until) }}</p>
        </div>
      </div>
    </header>

    <!-- Parties section -->
    <section class="parties">
      <div class="party">
        <h3>From</h3>
        <p class="party-name">{{ quotation.from.name }}</p>
        <p class="party-address">{{ quotation.from.address }}</p>
        <p class="party-email">{{ quotation.from.email }}</p>
        <p v-if="quotation.from.phone" class="party-phone">{{ quotation.from.phone }}</p>
        <p v-if="quotation.from.website" class="party-website">{{ quotation.from.website }}</p>
      </div>
      <div class="party">
        <h3>Bill To</h3>
        <p class="party-name">{{ quotation.to.name }}</p>
        <p class="party-address">{{ quotation.to.address }}</p>
        <p class="party-email">{{ quotation.to.email }}</p>
        <p v-if="quotation.to.phone" class="party-phone">{{ quotation.to.phone }}</p>
        <p v-if="quotation.to.website" class="party-website">{{ quotation.to.website }}</p>
      </div>
    </section>

    <!-- Line items table -->
    <section class="items">
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

    <!-- Footer: Notes + Totals -->
    <footer class="footer">
      <div class="footer-left">
        <div v-if="quotation.notes" class="notes">
          <h3>Notes</h3>
          <p>{{ quotation.notes }}</p>
        </div>
      </div>
      <div class="footer-right">
        <div class="totals">
          <div class="total-row">
            <span>Subtotal</span>
            <span>{{ formatAmount(quotation.totals.subtotal, quotation.meta.currency) }}</span>
          </div>
          <div v-if="quotation.totals.discount_percent > 0" class="total-row">
            <span>{{ quotation.discount_label }} ({{ quotation.totals.discount_percent }}%)</span>
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
      </div>
    </footer>
  </div>
</template>

<style scoped>
.template-classic {
  font-family: var(--font-sans);
  color: var(--navy);
  background: var(--paper);
  padding: 52px 56px;
  position: relative;
}

.top-bar {
  height: 4px;
  background: linear-gradient(90deg, var(--blue) 0%, var(--blue-dark) 100%);
  margin-bottom: 2rem;
}

.tpl-status {
  position: absolute;
  top: 1.5rem;
  right: 2rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tpl-status .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}

.tpl-status.draft {
  background: color-mix(in srgb, var(--s-draft) 15%, transparent);
  color: var(--s-draft);
}

.tpl-status.draft .dot {
  background: var(--s-draft);
}

.tpl-status.sent {
  background: color-mix(in srgb, var(--s-sent) 15%, transparent);
  color: var(--s-sent);
}

.tpl-status.sent .dot {
  background: var(--s-sent);
}

.tpl-status.accepted {
  background: color-mix(in srgb, var(--s-accepted) 15%, transparent);
  color: var(--s-accepted);
}

.tpl-status.accepted .dot {
  background: var(--s-accepted);
}

.tpl-status.rejected {
  background: color-mix(in srgb, var(--s-rejected) 15%, transparent);
  color: var(--s-rejected);
}

.tpl-status.rejected .dot {
  background: var(--s-rejected);
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2.5rem;
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
  text-align: right;
  flex: 1;
}

.title {
  font-family: var(--font-serif);
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--navy);
  margin: 0 0 0.5rem 0;
  line-height: 1;
}

.quotation-number {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  color: var(--blue-dark);
  margin: 0 0 0.75rem 0;
  font-weight: 500;
}

.dates {
  font-size: 0.85rem;
  color: var(--navy);
  opacity: 0.75;
}

.dates p {
  margin: 0.15rem 0;
}

/* Parties */
.parties {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2.5rem;
  padding: 1.5rem;
  background: var(--sky);
  border-radius: 6px;
}

.party h3 {
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

.party-address,
.party-email,
.party-phone,
.party-website {
  font-size: 0.85rem;
  margin: 0.2rem 0;
  color: var(--navy);
  opacity: 0.85;
}

/* Line items table */
.items {
  margin-bottom: 2.5rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

thead {
  background: var(--navy);
  color: var(--paper);
}

th {
  padding: 0.75rem 1rem;
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
  border-bottom: 2px solid var(--navy);
}

td {
  padding: 0.85rem 1rem;
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

/* Footer */
.footer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

.footer-left {
  padding-right: 1rem;
}

.notes h3 {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--blue-dark);
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.notes p {
  font-size: 0.85rem;
  line-height: 1.6;
  margin: 0;
  color: var(--navy);
  opacity: 0.85;
}

.footer-right {
  display: flex;
  justify-content: flex-end;
}

.totals {
  min-width: 240px;
  font-size: 0.875rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
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
  padding-top: 0.75rem;
  border-top: 2px solid var(--navy);
  border-bottom: none;
}

/* Print styles */
@media print {
  .template-classic {
    padding: 52px 56px;
  }

  .top-bar {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  thead {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .parties {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .tpl-status {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}
</style>
