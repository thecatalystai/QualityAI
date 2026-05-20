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
          generateBotPrompt();
        }
      });
    }  
}
