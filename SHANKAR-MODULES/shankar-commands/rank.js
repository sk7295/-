const fs = require('fs');
const { join } = require('path');
async function getUserName(api, senderID) {
  try {
    const userInfo = await api.getUserInfo(senderID);
    return userInfo[senderID]?.name || "User";
  } catch (error) {
    console.log(error);
    return "User";
  }
}

module.exports = {
  name: "rank",
  hasPermission: "members",
  Programmer: "Jonell Magallanes", 
  info: "View your rank based on experience.",
  category: "utility",
  cooldowns: 5,
  prefix: "enable",

  letStart: async function ({ api, event }) {
    const fs = require('fs');
    const path = require('path');
    const userDataPath = path.join(__dirname, 'userData.json');

    let userData = JSON.parse(fs.readFileSync(userDataPath, 'utf8'));
    const userId = event.senderID;

    if (!userData[userId]) {
      return api.sendMessage("You have not started ranking yet.", event.threadID);
    }

    const rankLevel = userData[userId].level;
    const rankEXP = userData[userId].exp;
    api.sendMessage(`𝗥𝗔𝗡𝗞 𝗟𝗘𝗩𝗘𝗟 📑\n━━━━━━━━━━━━━━━━━━\n\n${await getUserName(api, event.senderID)} HUTCHINS RANK VIEW\n\n𝗥𝗔𝗡𝗞:『 ${rankLevel} 』\n\n𝗘𝗫𝗣:『 ${rankEXP} 』`, event.threadID);
  }
};