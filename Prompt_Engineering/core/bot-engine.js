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
          
          
          const dataanswers = this.collect(answers);
          console.log("Form submitted:", dataanswers);
          
          generateBotPrompt(dataanswers);
        }
      });
    }  

    collect(answers) {
    return Object.fromEntries(
        answers
            .filter(a => a && a.name)
            .map(a => [a.name, a.file || a.value || ""])
    );
  }
}
