<script setup lang="ts">
import type { QuotationData } from '../../../types/quotation'
import { formatAmount, formatDate } from '../../../utils/format'

defineProps<{
  quotation: QuotationData
}>()
</script>

<template>
  <div class="template-bold">
    <!-- Navy Header Band -->
    <div class="tpl-header">
      <div class="tpl-header-left">
        <img 
          v-if="quotation.logo?.data" 
          :src="quotation.logo.data" 
          :alt="quotation.logo.name"
          class="tpl-logo"
        />
        <div v-else class="tpl-company-name">
          {{ quotation.from.name }}
        </div>
      </div>
      <div class="tpl-header-right">
        <div class="tpl-label">QUOTATION</div>
        <div class="tpl-number">{{ quotation.meta.quotation_number }}</div>
      </div>
    </div>

    <!-- Blue Info Band -->
    <div class="tpl-info-band">
      <div class="tpl-info-item">
        Issued {{ formatDate(quotation.meta.issue_date) }}
      </div>
      <div class="tpl-info-item">
        Valid until {{ formatDate(quotation.meta.valid_until) }}
      </div>
      <span class="tpl-status" :class="quotation.status.toLowerCase()">
        <span class="dot"></span>{{ quotation.status }}
      </span>
    </div>

    <!-- White Body -->
    <div class="tpl-body">
      <!-- Two-column parties -->
      <div class="tpl-parties">
        <div class="tpl-party">
          <div class="tpl-party-label">From</div>
          <div class="tpl-party-name">{{ quotation.from.name }}</div>
          <div class="tpl-party-address">{{ quotation.from.address }}</div>
          <div class="tpl-party-email">{{ quotation.from.email }}</div>
          <div v-if="quotation.from.phone" class="tpl-party-phone">
            {{ quotation.from.phone }}
          </div>
          <div v-if="quotation.from.website" class="tpl-party-website">
            {{ quotation.from.website }}
          </div>
        </div>
        <div class="tpl-party">
          <div class="tpl-party-label">Bill To</div>
          <div class="tpl-party-name">{{ quotation.to.name }}</div>
          <div class="tpl-party-address">{{ quotation.to.address }}</div>
          <div class="tpl-party-email">{{ quotation.to.email }}</div>
          <div v-if="quotation.to.phone" class="tpl-party-phone">
            {{ quotation.to.phone }}
          </div>
          <div v-if="quotation.to.website" class="tpl-party-website">
            {{ quotation.to.website }}
          </div>
        </div>
      </div>

      <!-- Line Items Table -->
      <table class="tpl-table">
        <thead>
          <tr>
            <th class="tpl-th-desc">Description</th>
            <th class="tpl-th-qty">Qty</th>
            <th class="tpl-th-price">Unit Price</th>
            <th class="tpl-th-amount">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in quotation.line_items" :key="item.id" class="tpl-row">
            <td class="tpl-td-desc">{{ item.description }}</td>
            <td class="tpl-td-qty">{{ item.quantity }}</td>
            <td class="tpl-td-price">{{ formatAmount(item.unit_price, quotation.meta.currency) }}</td>
            <td class="tpl-td-amount">{{ formatAmount(item.amount, quotation.meta.currency) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Footer with Notes and Totals -->
      <div class="tpl-footer">
        <div class="tpl-notes" v-if="quotation.notes">
          <div class="tpl-notes-label">Notes</div>
          <div class="tpl-notes-text">{{ quotation.notes }}</div>
        </div>
        <div class="tpl-totals">
          <div class="tpl-total-row">
            <span class="tpl-total-label">Subtotal</span>
            <span class="tpl-total-value">{{ formatAmount(quotation.totals.subtotal, quotation.meta.currency) }}</span>
          </div>
          <div v-if="quotation.totals.discount_percent > 0" class="tpl-total-row">
            <span class="tpl-total-label">Discount ({{ quotation.totals.discount_percent }}%)</span>
            <span class="tpl-total-value">-{{ formatAmount(quotation.totals.discount_amount, quotation.meta.currency) }}</span>
          </div>
          <div v-if="quotation.totals.tax_percent > 0" class="tpl-total-row">
            <span class="tpl-total-label">{{ quotation.tax_label || 'Tax' }} ({{ quotation.totals.tax_percent }}%)</span>
            <span class="tpl-total-value">{{ formatAmount(quotation.totals.tax_amount, quotation.meta.currency) }}</span>
          </div>
          <div class="tpl-total-row tpl-total-grand">
            <span class="tpl-total-label">Total</span>
            <span class="tpl-total-value">{{ quotation.meta.currency }} {{ formatAmount(quotation.totals.total, quotation.meta.currency) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.template-bold {
  width: 100%;
  font-family: var(--font-sans);
  color: var(--text-primary);
}

/* Navy Header Band */
.tpl-header {
  background: var(--navy);
  padding: 32px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tpl-header-left {
  flex: 1;
}

.tpl-logo {
  max-height: 60px;
  max-width: 200px;
  object-fit: contain;
}

.tpl-company-name {
  color: white;
  font-size: var(--text-xl);
  font-weight: 700;
  letter-spacing: 0.5px;
}

.tpl-header-right {
  text-align: right;
}

.tpl-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.tpl-number {
  color: white;
  font-size: var(--text-lg);
  font-weight: 700;
  font-family: var(--font-mono);
}

/* Blue Info Band */
.tpl-info-band {
  background: var(--blue);
  padding: 16px 40px;
  display: flex;
  gap: 24px;
  align-items: center;
  color: white;
}

.tpl-info-item {
  font-size: var(--text-sm);
  font-weight: 500;
}

/* Status Badge */
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
  color: rgba(255, 255, 255, 0.9);
  margin-left: auto;
}

.tpl-status .dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
}

.tpl-status.draft .dot {
  background: var(--s-draft);
}

.tpl-status.sent .dot {
  background: var(--s-sent);
}

.tpl-status.accepted .dot {
  background: var(--s-accepted);
}

.tpl-status.rejected .dot {
  background: var(--s-rejected);
}

/* White Body */
.tpl-body {
  background: white;
  padding: 40px;
}

/* Two-column parties */
.tpl-parties {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
}

.tpl-party-label {
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.tpl-party-name {
  font-size: var(--text-md);
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.tpl-party-address,
.tpl-party-email,
.tpl-party-phone,
.tpl-party-website {
  font-size: var(--text-sm);
  line-height: 1.6;
  color: var(--text-secondary);
}

/* Line Items Table */
.tpl-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 40px;
}

.tpl-th-desc,
.tpl-th-qty,
.tpl-th-price,
.tpl-th-amount {
  text-align: left;
  padding: 12px 16px;
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-muted);
  border-bottom: 2px solid var(--border);
}

.tpl-th-qty,
.tpl-th-price,
.tpl-th-amount {
  text-align: right;
}

.tpl-th-desc {
  width: 50%;
}

.tpl-th-qty {
  width: 15%;
}

.tpl-th-price {
  width: 17.5%;
}

.tpl-th-amount {
  width: 17.5%;
}

.tpl-row {
  border-bottom: 1px solid var(--border);
}

.tpl-row:last-child {
  border-bottom: 2px solid var(--border);
}

.tpl-td-desc,
.tpl-td-qty,
.tpl-td-price,
.tpl-td-amount {
  padding: 16px;
  font-size: var(--text-sm);
}

.tpl-td-desc {
  color: var(--text-primary);
}

.tpl-td-qty,
.tpl-td-price,
.tpl-td-amount {
  text-align: right;
  font-family: var(--font-mono);
  color: var(--text-secondary);
}

.tpl-td-amount {
  font-weight: 600;
  color: var(--text-primary);
}

/* Footer with Notes and Totals */
.tpl-footer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-top: 40px;
}

.tpl-notes-label {
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.tpl-notes-text {
  font-size: var(--text-sm);
  line-height: 1.6;
  color: var(--text-secondary);
  white-space: pre-wrap;
}

.tpl-totals {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tpl-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: var(--text-sm);
}

.tpl-total-label {
  color: var(--text-secondary);
}

.tpl-total-value {
  font-family: var(--font-mono);
  font-weight: 600;
  color: var(--text-primary);
}

.tpl-total-grand {
  border-top: 2px solid var(--navy);
  padding-top: 12px;
  margin-top: 4px;
}

.tpl-total-grand .tpl-total-label {
  font-size: var(--text-md);
  font-weight: 700;
  color: var(--text-primary);
}

.tpl-total-grand .tpl-total-value {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--navy);
}
</style>
