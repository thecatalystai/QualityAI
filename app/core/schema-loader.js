export class SchemaLoader {
  async loadRegistry() {
    const res = await fetch('prompts/registry.json');
    if (!res.ok) throw new Error('Failed to load registry');
    return res.json();
  }

  async loadSchema(file) {
    const res = await fetch(`prompts/${file}`);
    if (!res.ok) throw new Error(`Failed to load schema: ${file}`);
    return res.json();
  }
}
