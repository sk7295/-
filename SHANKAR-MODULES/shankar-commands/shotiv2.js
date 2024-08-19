const axios = require('axios');
const fs = require("fs");

module.exports = {
  name: "shotiv2",
  hasPermission: "members",
  Programmer: "Jonell Magallanes",
  info: "Random edit from TikTok",
  Category: "media",
  cooldowns: 20,
  prefix: "enable",
  letStart: async function({ api, event }) {
    api.sendMessage("⏱️ | Sending Random shoti Just Please wait...", event.threadID, event.messageID);
    api.setMessageReaction("⏱️", event.messageID, () => {}, true);
    const response = await axios.get('https://solid-doodle-pvvgrwgg6w62w4r-9090.app.github.dev/shoti', {
      responseType: 'arraybuffer'
    }).catch(error => {
      api.sendMessage("Error fetching video.", event.threadID, event.messageID);
      console.error(error);
      return;
    });

    if (response && response.status === 200) {
      const filePath = __dirname + "/cache/shotiv2.mp4";
      fs.writeFileSync(filePath, Buffer.from(response.data, 'binary'), "binary");
      api.setMessageReaction("✅", event.messageID, () => {}, true);
      const tid = event.threadID;
      api.sendMessage({
        body: `Here's your Random Shoti Video from TikTok\n\nID:${tid}`,
        attachment: fs.createReadStream(filePath)
      }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
    } else {
      api.sendMessage("Failed to retrieve a video.", event.threadID, event.messageID);
      api.setMessageReaction("🔭", event.messageID, () => {}, true);
    }
  }
};