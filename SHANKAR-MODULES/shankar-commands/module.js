const fs = require('fs');
const path = require('path');

module.exports = {
  name: "module",
  hasPermission: "adminbot",
  Programmer: "Jonell Magallanes",
  info: "Send the code of a specific command module",
  category: "utility",
  cooldowns: 3,
  prefix: "enable",

  letStart: async function({ api, event, target }) {
    const moduleName = target.join(' ');
    const modulePath = path.join(__dirname, `${moduleName}.js`);

    const code = fs.readFileSync(modulePath, 'utf8');

    api.sendMessage({
      body: `𝗠𝗢𝗗𝗨𝗟𝗘 𝗢𝗙 𝗛𝗨𝗧𝗖𝗛𝗜𝗡𝗦 𝗕𝗢𝗧\n\nName Of Cmd: ${moduleName}\n\n${code}`,
    }, event.threadID);
  }
};