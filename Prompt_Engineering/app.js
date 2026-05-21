import { SchemaLoader } from "./core/schema-loader.js";
import { FormEngine } from "./core/form-engine.js";
import { BotEngine } from "./core/bot-engine.js";
import { PromptEngine } from "./core/prompt-engine.js";
import { Storage } from "./core/storage.js";

/* =========================
   STATE
========================= */
let currentSchema = null;

/* =========================
   INSTANCES
========================= */
const loader = new SchemaLoader();
const formEngine = new FormEngine();
const botEngine = new BotEngine();
const promptEngine = new PromptEngine();
const storage = new Storage();

/* =========================
   INIT APP
========================= */
document.addEventListener("DOMContentLoaded", async () => {
    await initRegistry();
    initModeToggle();
    renderHistory();
});

/* =========================
   REGISTRY LOADING
========================= */
async function initRegistry() {
    try {
        const registry = await loader.loadRegistry();
        const selector = document.getElementById("promptSelector");

        if (!selector) {
            console.error("promptSelector not found");
            return;
        }

        selector.innerHTML = '<option value="">-- Select Prompt --</option>';

        registry.forEach(item => {
            const opt = document.createElement("option");
            opt.value = item.file;
            opt.textContent = item.name;
            selector.appendChild(opt);
        });

    } catch (err) {
        console.error("Failed to load registry:", err);
    }
}

/* =========================
   LOAD SCHEMA
========================= */
async function loadSchema() {
    const selector = document.getElementById("promptSelector");
    if (!selector || !selector.value) {
        console.warn("No schema selected");
        return;
    }

    try {
        currentSchema = await loader.loadSchema(selector.value);

        const isChatMode = document.getElementById("chatMode")?.checked;
        const isFormMode = document.getElementById("formMode")?.checked;

        if (isChatMode) {
            botEngine.render(currentSchema);
        } else if (isFormMode) {
            formEngine.render(currentSchema);
        }

        document.getElementById("prompt-body")?.classList.remove("d-none");

    } catch (err) {
        console.error("Failed to load schema:", err);
    }
}

/* =========================
   PROMPT HANDLER (DRY)
========================= */
function handlePrompt(prompt) {
    const output = document.getElementById("output");
    if (output) {
        output.innerText = prompt;
    }

    storage.save(prompt);
    renderHistory();
    copyToClipboard(prompt);
}

/* =========================
   GENERATE PROMPTS
========================= */
function generatePrompt() {
    if (!currentSchema) {
        console.error("Schema not loaded");
        return;
    }

    const data = formEngine.collect(currentSchema);
    const prompt = promptEngine.build(currentSchema.template, data);

    handlePrompt(prompt);
}

function generateBotPrompt(data) {
    if (!currentSchema) {
        console.error("Schema not loaded");
        return;
    }

    const prompt = promptEngine.build(currentSchema.template, data);
    handlePrompt(prompt);
}

/* =========================
   CLIPBOARD
========================= */
function copyToClipboard(text) {
    if (!navigator.clipboard) {
        showAlert("Clipboard not supported", "danger");
        return;
    }

    navigator.clipboard.writeText(text)
        .then(() => showAlert("✅ Prompt copied successfully!", "primary"))
        .catch(() => showAlert("⚠️ Failed to copy prompt", "danger"));
}

/* =========================
   ALERT SYSTEM
========================= */
function showAlert(message, type = "primary") {
    const container = document.getElementById("alertContainer");
    if (!container) return;

    const div = document.createElement("div");
    div.className = `alert alert-${type} alert-dismissible fade show`;
    div.setAttribute("role", "alert");
    div.textContent = message;

    container.innerHTML = "";
    container.appendChild(div);
}

/* =========================
   HISTORY (SAFE RENDER)
========================= */
function renderHistory() {
    const history = storage.getAll();
    const container = document.getElementById("history");

    if (!container) return;

    container.innerHTML = history.map(h => `
        <div class="border rounded p-2 mb-2 bg-light">
            <pre class="mb-0">${escapeHTML(h)}</pre>
        </div>
    `).join("");
}

/* =========================
   SECURITY: ESCAPE HTML
========================= */
function escapeHTML(str) {
    return str.replace(/[&<>"']/g, m => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[m]));
}

/* =========================
   MODE TOGGLE
========================= */
function initModeToggle() {
    const formMode = document.getElementById("formMode");
    const chatMode = document.getElementById("chatMode");

    const formView = document.getElementById("formView");
    const chatView = document.getElementById("chatView");

    if (!formMode || !chatMode || !formView || !chatView) {
        console.error("Toggle elements missing");
        return;
    }

    function showForm() {
        formView.classList.remove("d-none");
        chatView.classList.add("d-none");
    }

    function showChat() {
        chatView.classList.remove("d-none");
        formView.classList.add("d-none");
    }

    formMode.addEventListener("change", () => {
        if (formMode.checked) showForm();
    });

    chatMode.addEventListener("change", () => {
        if (chatMode.checked) showChat();
    });

    // Default mode
    if (formMode.checked) {
        showForm();
    } else {
        showChat();
    }
}

/* =========================
   GLOBAL API (SAFE)
========================= */
window.app = {
    loadSchema,
    generatePrompt,
    generateBotPrompt
};
