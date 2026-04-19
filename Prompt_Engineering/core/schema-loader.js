export class SchemaLoader {

    async loadRegistry() {
        const res = await fetch("prompts/registry.json");
        return await res.json();
    }

    async loadSchema(file) {
        const res = await fetch("prompts/" + file);
        return await res.json();
    }
}
