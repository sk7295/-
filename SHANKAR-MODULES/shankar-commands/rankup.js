const fs = require('fs');
const path = require('path');
const userDataPath = path.join(__dirname, 'userData.json');
const currenciesPath = path.join(__dirname, 'currencies.json');

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
  name: "rankup",
  hasPermission: "members",
  prefix: "disable",
  Programmer: "Jonell Magallanes",
  info: "no prefix",
  category: "No command marks needed",
  usages: "?",
  cooldowns: 5,

  noPrefix: async function({ api, event }) {
    let userData = JSON.parse(fs.readFileSync(userDataPath, 'utf8'));
    let currencies = JSON.parse(fs.readFileSync(currenciesPath, 'utf8'));
    const userId = event.senderID;

    if (userData[userId]) {
      userData[userId].exp = (userData[userId].exp || 0) + 10;
      const expNeeded = Math.floor(5 * Math.pow(userData[userId].level || 1, 2));
      if (userData[userId].exp >= expNeeded) {
        userData[userId].level = (userData[userId].level || 1) + 10;
        userData[userId].exp -= expNeeded;
        currencies[userId] = currencies[userId] || { balance: 0, lastDaily: new Date().toISOString() };
        currencies[userId].balance += 5;
        const rankLevel = userData[userId].level;
        const announcement = `${await getUserName(api, userId)} has leveled up to level ${rankLevel}! and Earn 5$ for Hutchins Bank Currencies`;
        api.sendMessage(announcement, event.threadID);
      }
    } else {
      userData[userId] = { exp: 1, level: 1 };
      currencies[userId] = { balance: 5, lastDaily: new Date().toISOString() };
    }

    fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
    fs.writeFileSync(currenciesPath, JSON.stringify(currencies, null, 2));
  },

  letStart: ({}) => {}
}