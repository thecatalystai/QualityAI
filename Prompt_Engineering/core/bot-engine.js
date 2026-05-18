import { Storage } from "./plugins/FormBot/formbot.js";

export class BotEngine {
  
render(schema) {
  FormBot.init({
  chat_containerId: "chat-form",
  chat_form_title: "Contact Us",
  questions: [
    {
      label: "What's your name?",
      name: "name",
      type: "text",
      attrs: { required: true, placeholder: "John Doe" }
    },
    {
      label: "What's your email address?",
      name: "email",
      type: "email",
      attrs: { required: true, placeholder: "john@example.com" }
    },
    {
      label: "Thanks! We'll be in touch soon.",
      name: "end_message",
      type: "message"
    }
  ],
  onComplete: (answers) => {
    console.log("Form submitted:", answers);
  }
})
    }  
}
