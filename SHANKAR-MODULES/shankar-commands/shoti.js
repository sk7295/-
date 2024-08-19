module.exports = {
  name: "shoti",
  Programmer: "Eugene Aguilar",
  info: "Generate random tiktok girl videos",
  hasPermission: "members",
  category: "other",
  usages: "[shoti]",
  cooldowns: 40,
  dependencies: [],
  prefix: "enable",

  letStart: async function ({ api, event }) {
    const fs = require('fs');
    const path = require('path');
    const userDataFile = path.join(__dirname, 'currencies.json');
    let userData = JSON.parse(fs.readFileSync(userDataFile, { encoding: 'utf8' }));

    const userId = event.senderID;
    if (!userData[userId] || userData[userId].balance < 5) {
      api.sendMessage("You need at least $5 currencies to use this command.", event.threadID);
      return;
    }

    userData[userId].balance -= 5;
    fs.writeFileSync(userDataFile, JSON.stringify(userData, null, 2));

  api.sendMessage(`⏱️ | Sending Shoti Please Wait....`, event.threadID);
  api.setMessageReaction("⏱️", event.messageID, (err) => {}, true);
  api.sendTypingIndicator(event.threadID, true);

  try {
    const axios = require("axios");
    const request = require("request");
    const fs = require("fs");
    let response = await axios.post(
      "https://api--v1-shoti.vercel.app/api/v1/get",
      {
        apikey: "apikey",
      },
    );

    const userInfo = response.data.data.user;
    const username = userInfo.username;
    const nickname = userInfo.nickname;
    var file = fs.createWriteStream(__dirname + "/cache/shoti.mp4");

    var rqs = request(encodeURI(response.data.data.url));
    rqs.pipe(file);

    file.on("finish", () => {
      return api.sendMessage(
        {
          body: `Username: @${username}\nNickname: ${nickname}`,
          attachment: fs.createReadStream(__dirname + "/cache/shoti.mp4"),
        },
        event.threadID
      );
    });

    file.on("error", (err) => {
      api.sendMessage(`Shoti Error: ${err}`, event.threadID, event.messageID);
    });

  } catch (error) {
    api.sendMessage(
      "An error occurred while generating video: " + error,
      event.threadID,
      event.messageID,
    );
  }
  } 
};