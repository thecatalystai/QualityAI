import { SchemaLoader } from "./core/schema-loader.js";
import { FormEngine } from "./core/form-engine.js";
import { BotEngine } from "./core/bot-engine.js";
import { PromptEngine } from "./core/prompt-engine.js";
import { Storage } from "./core/storage.js";

let currentSchema = null;

const loader = new SchemaLoader();
const formEngine = new FormEngine();
const botEngine = new BotEngine();
const promptEngine = new PromptEngine();
const storage = new Storage();

/* INIT */
window.onload = async function () {
    const registry = await loader.loadRegistry();

    const selector = document.getElementById("promptSelector");

    registry.forEach(item => {
        const opt = document.createElement("option");
        opt.value = item.file;
        opt.textContent = item.name;
        selector.appendChild(opt);
    });
};

/* LOAD SCHEMA */
window.loadSchema = async function () {
    const file = document.getElementById("promptSelector").value;
    currentSchema = await loader.loadSchema(file);
    formEngine.render(currentSchema);
    botEngine.render(currentSchema);
    
    document.getElementById("prompt-body").classList.remove("d-none");
};

/* GENERATE PROMPT */
window.generatePrompt = function () {
    const data = formEngine.collect(currentSchema);
    const prompt = promptEngine.build(currentSchema.template, data);

    document.getElementById("output").innerText = prompt;

    storage.save(prompt);
    renderHistory();

    // Copy to clipboard
    navigator.clipboard.writeText(prompt).then(() => {
        //alert("✅ Prompt copied successfully! You can now paste it into any generative AI tool to generate content.");
        document.getElementById("alertContainer").innerHTML = '<div class="alert alert-primary alert-dismissible fade show" role="alert">✅ Prompt copied successfully! You can now paste it into any generative AI tool to generate content.</div>';
    }).catch(() => {
        //alert("⚠️ Failed to copy prompt. Please manually copy it from the output area.");
        document.getElementById("alertContainer").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert">⚠️ Failed to copy prompt. Please manually copy it from the output area.</div>';
    });
};

/* GENERATE BOT PROMPT */
window.generateBotPrompt = function (data) {
    const prompt = promptEngine.build(currentSchema.template, data);    
    document.getElementById("output").innerText = prompt;
    
    storage.save(prompt);
    renderHistory();
    
    // Copy to clipboard
    navigator.clipboard.writeText(prompt).then(() => {
        //alert("✅ Prompt copied successfully! You can now paste it into any generative AI tool to generate content.");
        document.getElementById("alertContainer").innerHTML = '<div class="alert alert-primary alert-dismissible fade show" role="alert">✅ Prompt copied successfully! You can now paste it into any generative AI tool to generate content.</div>';
    }).catch(() => {
        //alert("⚠️ Failed to copy prompt. Please manually copy it from the output area.");
        document.getElementById("alertContainer").innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert">⚠️ Failed to copy prompt. Please manually copy it from the output area.</div>';
    });
};

/* HISTORY */
function renderHistory() {
    const history = storage.getAll();

    document.getElementById("history").innerHTML =
        history.map(h => `
            <div class="border rounded p-2 mb-2 bg-light">
                <pre class="mb-0">${h}</pre>
            </div>
        `).join("");
}

/* Mode Toggle */
function initModeToggle() {
  const formMode = document.getElementById("formMode");
  const chatMode = document.getElementById("chatMode");

  const formView = document.getElementById("formView");
  const chatView = document.getElementById("chatView");

  if (!formMode || !chatMode || !formView || !chatView) {
    console.error("Toggle elements not found");
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

  formMode.addEventListener("change", function () {
    if (this.checked) showForm();
  });

  chatMode.addEventListener("change", function () {
    if (this.checked) showChat();
  });

  // default state
  showForm();
}

// initialize after DOM ready
document.addEventListener("DOMContentLoaded", initModeToggle);
