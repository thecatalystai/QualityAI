export class BotEngine {
  constructor(options = {}) {
    this.containerId = options.containerId || "chatArea";
    this.current = 0;
    this.answers = {};
    this.schema = null;

    this.container = document.getElementById(this.containerId);

    if (!this.container) {
      throw new Error("Chat container not found");
    }
  }

  // ---------------------------
  // INIT
  // ---------------------------
  start(schema) {
    this.schema = schema;
    this.current = 0;
    this.answers = {};

    this.container.innerHTML = "";

    this.renderBotMessage("Hello 👋");
    this.next();
  }

  // ---------------------------
  // UI HELPERS
  // ---------------------------
  renderBotMessage(text) {
    const div = document.createElement("div");
    div.className = "bot-msg";
    div.innerText = text;
    this.container.appendChild(div);
    this.scroll();
  }

  renderUserMessage(text) {
    const div = document.createElement("div");
    div.className = "user-msg";
    div.innerText = text;
    this.container.appendChild(div);
    this.scroll();
  }

  scroll() {
    this.container.scrollTop = this.container.scrollHeight;
  }

  // ---------------------------
  // ENGINE CORE
  // ---------------------------
  next() {
    if (!this.schema || this.current >= this.schema.fields.length) {
      this.finish();
      return;
    }

    const field = this.schema.fields[this.current];

    // skip hidden fields
    if (field.type === "hidden") {
      this.answers[field.name] = field.value || "";
      this.current++;
      return this.next();
    }

    this.renderBotMessage(field.label);

    this.renderInput(field);
  }

  // ---------------------------
  // INPUT RENDERER
  // ---------------------------
  renderInput(field) {
    const wrapper = document.createElement("div");
    wrapper.className = "bot-input-wrapper";

    let input;

    // TEXT
    if (field.type === "text" || field.type === "email" || field.type === "number") {
      input = document.createElement("input");
      input.type = field.type;
    }

    // TEXTAREA
    else if (field.type === "textarea") {
      input = document.createElement("textarea");
    }

    // DROPDOWN
    else if (field.type === "dropdown") {
      input = document.createElement("select");

      const empty = document.createElement("option");
      empty.value = "";
      empty.textContent = "Select...";
      input.appendChild(empty);

      field.options.forEach(opt => {
        const o = document.createElement("option");
        o.value = opt;
        o.textContent = opt;
        input.appendChild(o);
      });
    }

    // MULTISELECT
    else if (field.type === "multiselect") {
      input = document.createElement("select");
      input.multiple = true;

      field.options.forEach(opt => {
        const o = document.createElement("option");
        o.value = opt;
        o.textContent = opt;
        input.appendChild(o);
      });
    }

    // FALLBACK
    else {
      input = document.createElement("input");
      input.type = "text";
    }

    input.className = "bot-input";

    // ENTER HANDLER
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.handleAnswer(field, input);
      }
    });

    wrapper.appendChild(input);
    this.container.appendChild(wrapper);

    input.focus();
  }

  // ---------------------------
  // ANSWER HANDLER
  // ---------------------------
  handleAnswer(field, input) {
    let value;

    // MULTISELECT
    if (field.type === "multiselect") {
      value = Array.from(input.selectedOptions).map(o => o.value);

      if (value.length === 0) return;
      value = value.join(", ");
    }

    // NORMAL INPUT
    else {
      value = input.value.trim();

      if (field.required && !value) return;
    }

    this.renderUserMessage(value);

    this.answers[field.name] = value;

    // cleanup input
    input.parentElement.remove();

    this.current++;
    this.next();
  }

  // ---------------------------
  // FINISH
  // ---------------------------
  finish() {
    this.renderBotMessage("Thanks! Processing your response...");

    if (this.schema.onComplete) {
      this.schema.onComplete(this.answers);
    }
  }
}
