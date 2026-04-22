export class PromptEngine {
  /**
   * Replace all {{key}} tokens in template with data values
   * @param {string} template
   * @param {Object} data  - key → value
   * @returns {string}
   */
  build(template, data) {
    let output = template;
    Object.entries(data).forEach(([key, value]) => {
      output = output.replaceAll(`{{${key}}}`, value || `[${key}]`);
    });
    return output;
  }
}
