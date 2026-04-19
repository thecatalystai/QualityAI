export class PromptEngine {

    build(template, data) {
        let output = template;

        Object.keys(data).forEach(key => {
            output = output.replaceAll("{{" + key + "}}", data[key]);
        });

        return output;
    }
}
