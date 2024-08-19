const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const bibleCronFilePath = path.resolve(__dirname, 'bibleCron.json');

function toggleBibleCron(state, api, threadID) {
  const currentState = JSON.parse(fs.readFileSync(bibleCronFilePath, 'utf8'));
  currentState.active = state;
  fs.writeFileSync(bibleCronFilePath, JSON.stringify(currentState));

  if (state) {
    api.sendMessage('Bible verse cron job has been enabled.', threadID);
  } else {
    api.sendMessage('Bible verse cron job has been disabled.', threadID);
  }
}

let bibleCronState;
if (fs.existsSync(bibleCronFilePath)) {
  bibleCronState = JSON.parse(fs.readFileSync(bibleCronFilePath, 'utf8'));
} else {
  bibleCronState = { active: false };
  fs.writeFileSync(bibleCronFilePath, JSON.stringify(bibleCronState));
}

if (bibleCronState.active) {
  cron.schedule('*/10 * * * *', async () => {
    const response = await axios.get('https://bible-api.com/?random=verse');
    if (response.data && response.data.text) {
      api.sendMessage(`Random Bible Verse: ${response.data.reference}
${response.data.text}`, threadID);
    }
  });
}

module.exports = {
  name: "biblecron",
  hasPermission: "members",
  Programmer: "Jonell Magallanes",
  info: "Automatically sends a random Bible verse to the thread every 10 minutes.",
  usages: "biblecron [on|off]",
  category: "utility",
  cooldowns: 10,
  prefix: "enable",
  letStart: async function({ api, event }) {
    const commandSegments = event.body.split(' ');
    const commandAction = commandSegments[1];
    const threadID = event.threadID;

    switch (commandAction) {
      case "on":
        toggleBibleCron(true, api, threadID);
        break;
      case "off":
        toggleBibleCron(false, api, threadID);
        break;
      default:
        api.sendMessage("Invalid action. Use on or off.", threadID);
        break;
    }
  }
};