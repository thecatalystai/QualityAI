import "../plugins/FormBot/formbot.js";

  const questions = [];

  export class BotEngine {
    
      render(schema) {

        schema.fields.forEach(f => {
        questions.push({
          label: f.label,
          name: f.name,
          type: f.type,
          attrs: f.attrs || {},
          options: f.options || []
        });
      });
        
        FormBot.init({
        chat_containerId: "chat-form",
        chat_form_title: "Contact Us",
        questions: questions,
        onComplete: (answers) => {
          console.log("Form submitted:", answers);
          window.generatePrompt = function () 
          {
            const data = answers;
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
        }
      });
    }  
}
