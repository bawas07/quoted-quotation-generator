<script setup lang="ts">
// App shell — two-column layout matching docs/example-v2.html
// Composes SidebarShell and PreviewShell components.
// Layout CSS is in styles/layout.css (imported by global.css)
import SidebarShell from './components/sidebar/SidebarShell.vue'
import PreviewPanel from './components/preview/PreviewPanel.vue'
</script>

<template>
  <div class="app">
    <!-- ════ SIDEBAR ════ -->
    <SidebarShell>
      <div class="sidebar-header">
        <div class="brand">
          <div class="brand-icon">✦</div>
          Quoted
        </div>
        <div class="brand-sub">by Bawas · Quotation Generator</div>
      </div>

      <div class="tabs">
        <button class="tab-btn active">Editor</button>
        <button class="tab-btn">History</button>
        <button class="tab-btn">Catalog</button>
      </div>

      <div class="sidebar-body">
        <!-- Editor tab -->
        <div class="tab-pane active" id="tab-editor">
          <p style="padding:20px 0;font-family:var(--font-mono);font-size:10px;color:var(--text-dim);text-align:center">
            Editor stub — form fields coming in M1
          </p>
        </div>

        <!-- History tab -->
        <div class="tab-pane" id="tab-history">
          <div class="hist-empty">No quotations yet.<br>Create or upload one.</div>
        </div>

        <!-- Catalog tab -->
        <div class="tab-pane" id="tab-catalog">
          <p style="padding:20px 0;font-family:var(--font-mono);font-size:10px;color:var(--text-dim);text-align:center">
            Catalog stub — CRUD interface coming in M2
          </p>
        </div>
      </div>

      <div class="sidebar-actions">
        <label class="btn btn-ghost" style="cursor:pointer">
          ↑ Upload
          <input type="file" accept=".json" style="display:none">
        </label>
        <button class="btn btn-primary">↓ JSON</button>
        <button class="btn btn-secondary">⎙ PDF</button>
        <button class="btn btn-ghost">+ New</button>
      </div>
    </SidebarShell>

    <!-- ════ PREVIEW PANEL ════ -->
    <PreviewPanel>
      <div class="preview-topbar">
        <div class="tpl-switcher">
          <button class="tpl-btn active">Classic</button>
          <button class="tpl-btn">Minimal</button>
          <button class="tpl-btn">Bold</button>
          <button class="tpl-btn">Sidebar</button>
          <button class="tpl-btn">Friendly</button>
        </div>
        <div class="preview-actions">
          <div class="status-wrap">
            <button class="status-badge draft">
              <span class="status-dot"></span>
              <span>DRAFT</span> ▾
            </button>
          </div>
          <label class="btn btn-ghost" style="cursor:pointer;font-size:9px">
            ↑ Upload
            <input type="file" accept=".json" style="display:none">
          </label>
        </div>
      </div>

      <div class="status-bar">
        <div class="sb-left">
          <span class="sb-num">QUO-001</span>
          <span>·</span>
          <span>—</span>
        </div>
      </div>

      <div class="preview-scroll">
        <div class="invoice-paper">
          <!-- Template render target — M4 -->
        </div>
      </div>
    </PreviewPanel>
  </div>
</template>
