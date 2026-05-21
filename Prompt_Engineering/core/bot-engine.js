import "../plugins/FormBot/formbot.js";  

  export class BotEngine {
    
      render(schema) {

        const questions = [];
        
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
        chat_form_title: "Tailor Your Prompt",
        questions: questions,
        onComplete: (answers) => {
          //console.log("Form submitted:", answers);       
          const dataanswers = this.collect(answers);
          //console.log("Form submitted:", dataanswers);
          FormBot.showMessage("Thanks for your input, your prompt has been created and copied. You can now open any generative AI tool and paste it into the prompt field to get your result....");          
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
