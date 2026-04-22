import { SchemaLoader } from './core/schema-loader.js';
import { FormEngine   } from './core/form-engine.js';
import { PromptEngine } from './core/prompt-engine.js';
import { Storage      } from './core/storage.js';

// ── Services ──────────────────────────────────────────────────
const loader      = new SchemaLoader();
const formEngine  = new FormEngine();
const promptEngine = new PromptEngine();
const storage     = new Storage();

// ── State ─────────────────────────────────────────────────────
let currentSchema = null;

// ── DOM Refs ───────────────────────────────────────────────────
const stepForm    = document.getElementById('step-form');
const stepOutput  = document.getElementById('step-output');
const stepHistory = document.getElementById('step-history');
const outputBox   = document.getElementById('outputBox');
const copyBtn     = document.getElementById('copyBtn');
const copyToast   = document.getElementById('copyToast');
const generateBtn = document.getElementById('generateBtn');
const schemaLoader = document.getElementById('schemaLoader');
const clearOutputBtn = document.getElementById('clearOutputBtn');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// ── Init ───────────────────────────────────────────────────────
(async function init() {
  try {
    const registry = await loader.loadRegistry();
    formEngine.renderSelector(registry, onPromptTypeSelected);
    renderHistory();
  } catch (err) {
    console.error(err);
    showError('Could not load prompt types. Please refresh the page.');
  }
})();

// ── Schema Selection ───────────────────────────────────────────
async function onPromptTypeSelected(item) {
  schemaLoader.classList.remove('hidden');
  stepForm.classList.add('hidden');
  stepOutput.classList.add('hidden');

  try {
    currentSchema = await loader.loadSchema(item.file);
    formEngine.render(currentSchema);
    stepForm.classList.remove('hidden');

    // Smooth scroll to form
    setTimeout(() => stepForm.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  } catch (err) {
    console.error(err);
    showError('Failed to load the selected prompt type. Please try again.');
  } finally {
    schemaLoader.classList.add('hidden');
  }
}

// ── Generate Prompt ────────────────────────────────────────────
generateBtn.addEventListener('click', () => {
  if (!currentSchema) return;

  const data   = formEngine.collect(currentSchema);
  const prompt = promptEngine.build(currentSchema.template, data);

  // Show output
  outputBox.textContent = prompt;
  stepOutput.classList.remove('hidden');
  setTimeout(() => stepOutput.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);

  // Save & render history
  storage.save(prompt);
  renderHistory();

  // Copy to clipboard
  copyToClipboard(prompt, false);
});

// ── Copy Button ────────────────────────────────────────────────
copyBtn.addEventListener('click', () => {
  const text = outputBox.textContent.trim();
  if (text) copyToClipboard(text, true);
});

// ── Clear Output ───────────────────────────────────────────────
clearOutputBtn.addEventListener('click', () => {
  stepOutput.classList.add('hidden');
  outputBox.textContent = '';
});

// ── Clear History ──────────────────────────────────────────────
clearHistoryBtn.addEventListener('click', () => {
  if (!confirm('Clear all saved prompt history?')) return;
  storage.clear();
  renderHistory();
});

// ── Clipboard Helper ───────────────────────────────────────────
async function copyToClipboard(text, showToast = true) {
  try {
    await navigator.clipboard.writeText(text);
    if (showToast) triggerToast();
  } catch {
    // fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    if (showToast) triggerToast();
  }
}

let toastTimer;
function triggerToast() {
  copyToast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => copyToast.classList.remove('show'), 2200);
}

// ── History Renderer ───────────────────────────────────────────
function renderHistory() {
  const list    = document.getElementById('historyList');
  const history = storage.getAll();

  if (history.length === 0) {
    stepHistory.classList.add('hidden');
    return;
  }

  stepHistory.classList.remove('hidden');
  list.innerHTML = '';

  history.forEach((prompt, idx) => {
    const preview = prompt.replace(/\s+/g, ' ').slice(0, 90);

    const item = document.createElement('div');
    item.className = 'history-item';

    const head = document.createElement('div');
    head.className = 'history-head';
    head.innerHTML = `
      <span class="history-num">#${String(idx + 1).padStart(2, '0')}</span>
      <span class="history-preview">${escapeHtml(preview)}…</span>
      <button class="history-copy" data-idx="${idx}">Copy</button>
    `;

    const body = document.createElement('div');
    body.className = 'history-body';
    body.textContent = prompt;

    // Toggle expand
    head.querySelector('.history-preview').addEventListener('click', () => {
      item.classList.toggle('open');
    });
    head.querySelector('.history-num').addEventListener('click', () => {
      item.classList.toggle('open');
    });

    // Copy button
    head.querySelector('.history-copy').addEventListener('click', (e) => {
      e.stopPropagation();
      copyToClipboard(prompt, true);
    });

    item.append(head, body);
    list.appendChild(item);
  });
}

// ── Error Helper ───────────────────────────────────────────────
function showError(msg) {
  const grid = document.getElementById('selectorGrid');
  grid.innerHTML = `<div style="grid-column:1/-1;color:#ef4444;font-size:13px;padding:12px 0;">⚠ ${msg}</div>`;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
