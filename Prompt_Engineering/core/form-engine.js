export class FormEngine {

    render(schema) {
        const container = document.getElementById("formArea");
        container.innerHTML = "";

        schema.fields.forEach(f => {

            const div = document.createElement("div");
            div.className = "form-floating mb-3";

            let html = ``;

            if (f.type === "text") {
                html += `<input class="form-control" id="${f.name}" placeholder="${f.label}" type="text">`;
            }

            if (f.type === "textarea") {
                html += `<textarea class="form-control" id="${f.name}" placeholder="${f.label}" rows="5"></textarea>`;
            }

            if (f.type === "dropdown") {
                html += `<select class="form-select" id="${f.name}">`;
                html += `<option value="" selected disabled>${f.label}</option>`;
                f.options.forEach(o => {
                    html += `<option value="${o}">${o}</option>`;
                });
                html += `</select>`;
            }

            if (f.type === "multiselect") {
                html += `<select multiple class="form-select" id="${f.name}" style="height:150px;">`;
                f.options.forEach(o => {
                    html += `<option value="${o}">${o}</option>`;
                });
                html += `</select>`;
            }

            // PDF FIELD (ONLY UI)
            if (f.type === "pdftext") {
                html += `
                    <div id="${f.name}_wrapper">
                        <input type="file"
                               id="${f.name}_file"
                               accept="application/pdf"
                               class="form-control" />
                    </div>
                `;
            }

            html += `<label for="${f.name}">${f.label}</label>`;

            div.innerHTML = html;
            container.appendChild(div);
        });

        // AFTER RENDER → bind PDF handlers
        this.bindPdfFields(schema);
    }

    bindPdfFields(schema) {

        schema.fields.forEach(f => {

            if (f.type !== "pdftext") return;

            const input = document.getElementById(f.name + "_file");
            const wrapper = document.getElementById(f.name + "_wrapper");

            if (!input || !wrapper) return;

            input.addEventListener("change", async (e) => {

                const file = e.target.files[0];
                if (!file) return;

                wrapper.innerHTML = "<div class='text-muted'>Processing PDF...</div>";

                const reader = new FileReader();

                reader.onload = async function () {

                    const typedarray = new Uint8Array(this.result);

                    const pdf = await pdfjsLib.getDocument(typedarray).promise;

                    let fullText = "";

                    for (let i = 1; i <= pdf.numPages; i++) {

                        const page = await pdf.getPage(i);
                        const content = await page.getTextContent();

                        fullText += content.items
                            .map(item => item.str)
                            .join(" ") + "\n";
                    }

                    // Replace file input with textarea (FINAL OUTPUT)
                    wrapper.innerHTML =
                        '<textarea class="form-control" ' +
                        'id="' + f.name + '" ' +
                        'name="' + f.name + '" rows="6">' +
                        fullText.replace(/</g, "&lt;").replace(/>/g, "&gt;") +
                        '</textarea>';
                };

                reader.readAsArrayBuffer(file);
            });
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
