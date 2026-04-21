export class FormEngine {

    render(schema) {
        const container = document.getElementById("formArea");
        container.innerHTML = "";

        schema.fields.forEach(f => {

            const div = document.createElement("div");
            div.className = "form-floating mb-3";

            let html = ``;

            if (f.type === "text") {
                html += `<input class="form-control" id="${f.name}" type="text">`;
            }

            if (f.type === "textarea") {
                html += `<textarea class="form-control" id="${f.name}" rows="3"></textarea>`;
            }

            if (f.type === "dropdown") {
                html += `<select class="form-select" id="${f.name}">`;
                f.options.forEach(o => {
                    html += `<option value="${o}">${o}</option>`;
                });
                html += `</select>`;
            }

            if (f.type === "multiselect") {
                html += `<select multiple class="form-select" id="${f.name}">`;
                f.options.forEach(o => {
                    html += `<option value="${o}" selected>${o}</option>`;
                    //html += `<option value="${o.value}">${o.label}</option>`;
                });
                html += `</select>`;
            }
            
            html += `<label for="${f.name}" class="form-label">${f.label}</label>`;
            
            div.innerHTML = html;
            container.appendChild(div);
        });
    }

    collect(schema) {
        const data = {};

        schema.fields.forEach(f => {
            const el = document.getElementById(f.name);
            if (!el) return;

            if (el.multiple) {
                data[f.name] = Array.from(el.selectedOptions)
                    .map(o => o.value)
                    .join(", ");
            } else {
                data[f.name] = el.value;
            }
        });

        return data;
    }
}
