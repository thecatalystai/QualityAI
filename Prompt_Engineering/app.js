import { SchemaLoader } from "./core/schema-loader.js";
import { FormEngine } from "./core/form-engine.js";
import { PromptEngine } from "./core/prompt-engine.js";
import { Storage } from "./core/storage.js";

let currentSchema = null;

const loader = new SchemaLoader();
const formEngine = new FormEngine();
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
        document.getElementById("alertContainer").innerHTML = '<div class="alert alert-primary" role="alert">✅ Prompt copied successfully! You can now paste it into any generative AI tool to generate content.</div>';
    }).catch(() => {
        //alert("⚠️ Failed to copy prompt. Please manually copy it from the output area.");
        document.getElementById("alertContainer").innerHTML = '<div class="alert alert-danger" role="alert">⚠️ Failed to copy prompt. Please manually copy it from the output area.</div>';
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
