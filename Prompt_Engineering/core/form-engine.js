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
                html += `<textarea class="form-control" id="${f.name}" placeholder="${f.label}" rows="5" style="hieght:200px;"></textarea>`;
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
                html += `<select multiple class="form-select" id="${f.name}" style="height: 150px;">`;
                html += `<option value="" selected disabled>${f.label}</option>`;
                f.options.forEach(o => {
                    html += `<option value="${o}" selected>${o}</option>`;
                    //html += `<option value="${o.value}">${o.label}</option>`;
                });
                html += `</select>`;
            }
            
            html += `<label for="${f.name}">${f.label}</label>`;

            if (f.type === "pdftext") {

                                            html += `
                                                <div class="pdf-text-extractor" id="${f.name}_wrapper">
                                        
                                                    <input type="file"
                                                           id="${f.name}_file"
                                                           accept="application/pdf"
                                                           class="form-control" />
                                        
                                                </div>
                                        
                                                <script>
                                                    (function () {
                                        
                                                        const input = document.getElementById("${f.name}_file");
                                                        const wrapper = document.getElementById("${f.name}_wrapper");
                                        
                                                        input.addEventListener("change", async (e) => {
                                        
                                                            const file = e.target.files[0];
                                                            if (!file) return;
                                        
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
                                                                        .join(" ") + "\\n";
                                                                }
                                        
                                                                wrapper.innerHTML = `
                                                                    <textarea
                                                                        class="form-control"
                                                                        id="${f.name}"
                                                                        name="${f.name}"
                                                                        rows="6">${fullText.trim()}</textarea>
                                                                `;
                                                            };
                                        
                                                            reader.readAsArrayBuffer(file);
                                                        });
                                        
                                                    })();
                                                </script>
                                            `;
                                        }

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
