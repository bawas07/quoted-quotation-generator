<script setup lang="ts">
import type { QuotationData } from '../../../types/quotation'
import { formatAmount, formatDate } from '../../../utils/format'

defineProps<{
  quotation: QuotationData
}>()
</script>

<template>
  <div class="template-minimal">
    <!-- Logo -->
    <div v-if="quotation.logo?.data" class="logo">
      <img :src="quotation.logo.data" :alt="quotation.logo.name" />
    </div>

    <!-- Title -->
    <h1 class="title">Quotation</h1>

    <!-- Meta row -->
    <div class="meta-row">
      <span class="meta-item">{{ quotation.meta.quotation_number }}</span>
      <span class="meta-separator">·</span>
      <span class="meta-item">{{ formatDate(quotation.meta.issue_date) }}</span>
      <span class="meta-separator">·</span>
      <span class="tpl-status" :class="quotation.status.toLowerCase()">
        <span class="dot"></span>{{ quotation.status }}
      </span>
    </div>

    <!-- Parties -->
    <div class="parties">
      <div class="party">
        <div class="party-label">From</div>
        <div class="party-name">{{ quotation.from.name }}</div>
        <div v-if="quotation.from.address" class="party-detail">{{ quotation.from.address }}</div>
        <div v-if="quotation.from.email" class="party-detail">{{ quotation.from.email }}</div>
        <div v-if="quotation.from.phone" class="party-detail">{{ quotation.from.phone }}</div>
      </div>
      <div class="party">
        <div class="party-label">To</div>
        <div class="party-name">{{ quotation.to.name }}</div>
        <div v-if="quotation.to.address" class="party-detail">{{ quotation.to.address }}</div>
        <div v-if="quotation.to.email" class="party-detail">{{ quotation.to.email }}</div>
        <div v-if="quotation.to.phone" class="party-detail">{{ quotation.to.phone }}</div>
      </div>
    </div>

    <!-- Line items -->
    <div class="items">
      <div v-for="item in quotation.line_items" :key="item.id" class="item-row">
        <div class="item-description">{{ item.description }}</div>
        <div class="item-amount">{{ quotation.meta.currency }} {{ formatAmount(item.amount, quotation.meta.currency) }}</div>
      </div>
    </div>

    <!-- Totals -->
    <div class="totals">
      <div class="total-row">
        <span class="total-label">Subtotal</span>
        <span class="total-value">{{ quotation.meta.currency }} {{ formatAmount(quotation.totals.subtotal, quotation.meta.currency) }}</span>
      </div>
      <div v-if="quotation.totals.discount_percent > 0" class="total-row">
        <span class="total-label">{{ quotation.discount_label }} ({{ quotation.totals.discount_percent }}%)</span>
        <span class="total-value">-{{ quotation.meta.currency }} {{ formatAmount(quotation.totals.discount_amount, quotation.meta.currency) }}</span>
      </div>
      <div v-if="quotation.totals.tax_percent > 0" class="total-row">
        <span class="total-label">{{ quotation.tax_label || 'Tax' }} ({{ quotation.totals.tax_percent }}%)</span>
        <span class="total-value">{{ quotation.meta.currency }} {{ formatAmount(quotation.totals.tax_amount, quotation.meta.currency) }}</span>
      </div>
      <div class="total-row total-final">
        <span class="total-label">Total</span>
        <span class="total-value">{{ quotation.meta.currency }} {{ formatAmount(quotation.totals.total, quotation.meta.currency) }}</span>
      </div>
    </div>

    <!-- Notes -->
    <div v-if="quotation.notes" class="notes">
      <div class="notes-label">Notes</div>
      <div class="notes-content">{{ quotation.notes }}</div>
    </div>

    <!-- Valid until -->
    <div class="valid-until">
      Valid until {{ formatDate(quotation.meta.valid_until) }}
    </div>
  </div>
</template>

<style scoped>
.template-minimal {
  font-family: var(--font-sans);
  color: var(--navy);
  background: var(--paper);
  padding: 64px 56px;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
}

.logo {
  margin-bottom: 48px;
}

.logo img {
  max-width: 140px;
  height: auto;
}

.title {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 44px;
  font-weight: 400;
  margin: 0 0 32px 0;
  color: var(--navy);
  letter-spacing: -0.02em;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 48px;
  font-family: var(--font-mono);
  letter-spacing: 0.5px;
}

.meta-separator {
  color: var(--border);
}

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

.parties {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  padding: 40px 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  margin-bottom: 48px;
}

.party-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--text-muted);
  margin-bottom: 12px;
  font-weight: 500;
}

.party-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--navy);
  margin-bottom: 8px;
}

.party-detail {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.items {
  margin-bottom: 48px;
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 16px 0;
  border-bottom: 1px solid var(--border);
}

.item-row:last-child {
  border-bottom: none;
}

.item-description {
  font-size: 13px;
  color: var(--navy);
  flex: 1;
}

.item-amount {
  font-size: 13px;
  color: var(--navy);
  font-family: var(--font-mono);
  text-align: right;
  min-width: 140px;
}

.totals {
  margin-left: auto;
  max-width: 320px;
  margin-bottom: 48px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 8px 0;
  font-size: 12px;
}

.total-label {
  color: var(--text-secondary);
}

.total-value {
  color: var(--navy);
  font-family: var(--font-mono);
  font-size: 12px;
}

.total-final {
  padding-top: 16px;
  margin-top: 8px;
  border-top: 1px solid var(--border);
  font-size: 14px;
  font-weight: 500;
}

.total-final .total-label {
  color: var(--navy);
  font-weight: 500;
}

.total-final .total-value {
  font-size: 14px;
  font-weight: 500;
}

.notes {
  padding: 32px 0;
  border-top: 1px solid var(--border);
  margin-bottom: 32px;
}

.notes-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--text-muted);
  margin-bottom: 12px;
  font-weight: 500;
}

.notes-content {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.6;
  white-space: pre-wrap;
}

.valid-until {
  font-size: 11px;
  color: var(--text-muted);
  text-align: center;
  padding-top: 32px;
  border-top: 1px solid var(--border);
  font-family: var(--font-mono);
  letter-spacing: 0.5px;
}

@media print {
  .template-minimal {
    padding: 40px;
    max-width: none;
    box-shadow: none;
  }

  .logo img {
    max-width: 120px;
  }

  .title {
    font-size: 36px;
  }

  .parties {
    gap: 32px;
    padding: 32px 0;
    margin-bottom: 32px;
  }

  .items {
    margin-bottom: 32px;
  }

  .totals {
    margin-bottom: 32px;
  }

  .notes {
    padding: 24px 0;
    margin-bottom: 24px;
  }

  .valid-until {
    padding-top: 24px;
  }
}
</style>
