const axios = require('axios');

module.exports = {
    name: "cassandra",
    hasPermission: "anyone",
    credits: "Jonell Magallanes", // Added to credit the API by Liane
    info: "Tagalog language only - na babae na ai hahaha ",
    usages: "cheska [your question]",
    cooldowns: 10,
  prefix: "disable",
    dependencies: { "axios": "" },
  letStart: async function({ api, event, target }) {
    const question = target.join(" ");
    api.setMessageReaction("✅", event.messageID, () => {}, true);
    if (!target[0]) return api.sendMessage("Hello", event.threadID, event.messageID);
    api.setMessageReaction("🗨️", event.messageID, () => {}, true);

    try {
      if (question) {
        const response = await axios.get(`https://school-project-lianefca.bene-edu-ph.repl.co/` + `ask/cassandra?query=${encodeURIComponent(question)}`);

        if (response.data && response.data.message) {
          const messageText = response.data.message;
          await api.sendMessage(messageText, event.threadID, event.messageID);
          api.setMessageReaction("💙", event.messageID, () => {}, true);

          console.log('Sent answer as a reply to the user');
        } else {
          throw new Error('Invalid or missing response from API');
        }
      }
    } catch (error) {
      console.error(`Failed to get an answer: ${error.message}`);
      api.sendMessage(
        `${error.message}.\n\nSubukang magtanong muli o ipadala ulit ang iyong tanong, baka may problema sa server na nagiging sanhi ng isyu.`,
        event.threadID,
        event.messageID
      );
    }
  }
};