const axios = require('axios');

module.exports = {
  name: "chesca",
  hasPermission: "members",
  credits: "Jonell Magallanes",
  info: "Tagalog language only - na babae na ai hahaha ",
  usages: "cheska [your question]",
  category: "ai",
  cooldowns: 10,
  prefix: "disable",
  dependencies: { "axios": "" },
  letStart: async function({ api, event, target, pushMessage}) {
    const question = target.join(" ");
    pushMessage.reaction("✅", event.messageID, () => {}, true);
    if (!target[0]) return box.send("Maglagay ng iyong mensahe kay chesca", event.threadID, event.messageID);
    pushMessage.reaction("🗨️", event.messageID, () => {}, true);

    try {
      if (question) {
        const response = await axios.get(`https://lianeapi.onrender.com/ask/chescaV2?query=${encodeURIComponent(question)}`);
        if (response.data && response.data.message) {
          const messageText = response.data.message;
          await pushMessage.reply(messageText, event.threadID, event.messageID);
        pushMessage.reaction("💙", event.messageID, () => {}, true);

          console.log('Sent answer as a reply to the user');
        } else {
          throw new Error('Invalid or missing response from API');
        }
      }
    } catch (error) {
      console.error(`Failed to get an answer: ${error.message}`);
      pushMessage.send(
        `${error.message}.\n\nSubukang magtanong muli o ipadala ulit ang iyong tanong, baka may problema sa server na nagiging sanhi ng isyu.`,
        event.threadID,
        event.messageID
      );
    }
  }
};