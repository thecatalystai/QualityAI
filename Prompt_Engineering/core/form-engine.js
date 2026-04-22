export class FormEngine {
  render(schema) {
    const container = document.getElementById("formArea");
    container.innerHTML = "";

    schema.fields.forEach((f) => {
      const div = document.createElement("div");
      div.className = "form-floating mb-3";

      let html = ``;

      if (f.type === "text") {
        html += `<input class="form-control" id="${f.name}" placeholder="${f.label}" type="text">`;
      }

      if (f.type === "textarea") {
        html += `<textarea class="form-control" id="${f.name}" placeholder="${f.label}" rows="5" style="height:200px;"></textarea>`;
      }

      if (f.type === "dropdown") {
        html += `<select class="form-select" id="${f.name}">
          <option value="" selected disabled>${f.label}</option>`;

        f.options.forEach((o) => {
          html += `<option value="${o}">${o}</option>`;
        });

        html += `</select>`;
      }

      if (f.type === "multiselect") {
        html += `<select multiple class="form-select" id="${f.name}" style="height:150px;">
          <option value="" disabled>${f.label}</option>`;

        f.options.forEach((o) => {
          html += `<option value="${o}" selected>${o}</option>`;
        });

        html += `</select>`;
      }

      if (f.type === "pdftext") {
        html += `
          <div class="pdf-text-extractor" id="${f.name}_wrapper">
            <input type="file" id="${f.name}_file" accept="application/pdf" class="form-control" />
          </div>
        `;
      }

      html += `<label for="${f.name}">${f.label}</label>`;

      div.innerHTML = html;
      container.appendChild(div);
   
    });
  }

  collect(schema) {
    const data = {};

    schema.fields.forEach((f) => {
      const el = document.getElementById(f.name);
      if (!el) return;

      if (el.multiple) {
        data[f.name] = Array.from(el.selectedOptions)
          .map((o) => o.value)
          .join(", ");
      } else {
        data[f.name] = el.value;
      }
    });

    return data;
  }
}
