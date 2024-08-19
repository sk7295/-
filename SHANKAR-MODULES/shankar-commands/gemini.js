const axios = require('axios');

module.exports = {
  name: "gemini",
  hasPermission: "members",
  programmer: "Jonell Magallanes",
  info: "Ask questions with Gemini AI",
  category: "AI",
  cooldowns: 5,
  prefix: "enable",

  async letStart({ target, event, pushMessage }) {
    const content = target.join(" ");
    if (!content) {
      return pushMessage.reply("Please provide your questions!");
    }
pushMessage.reply("⏱️ | Gemini Searching Your Answer! Please wait..");
    try {
      const response = await axios.get(`https://bnw.samirzyx.repl.co/api/Gemini?text=${content}`);
      const candidates = response.data.candidates;
      if (candidates.length > 0) {
        const geminiResponse = candidates[0].content.parts.map(part => part.text).join(" ");
        return pushMessage.reply(geminiResponse);
      } else {
        return pushMessage.reply("Gemini didn't provide a valid response.");
      }
    } catch (error) {
      console.error("Error making Gemini API request:", error.message);
      return pushMessage.reply("An error occurred while processing your request.");
    }
  },
};
