const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');
const { exec } = require('child_process');

const commandUpdateEmitter = new EventEmitter(); // Creating an event emitter for command updates

module.exports = {
  name: "cmd",
  hasPermission: "adminbot",
  credits: "Jonell Magallanes",
  info: "Command loader for command modules in the commands folder.",
  usages: "cmd [deployed|undeployed|deployedall]",
  category: "system",
  cooldowns: 5,
  prefix: "enable",
  dependencies: {},
  letStart: async function ({ api, event, commandsFolder = '' }) {
    const commandSegments = event.body.split(' ');
    const commandAction = commandSegments[1];
    const commandName = commandSegments[2];
    const commandsDir = path.resolve(__dirname, commandsFolder);
    let commandsChanged = false;

    const deployCommand = (cmd) => {
      const filePath = path.join(commandsDir, `${cmd}.js`);

      // Check the cache to see if the command is already loaded
      const isCached = require.cache[require.resolve(filePath)];
      delete require.cache[require.resolve(filePath)];
      const command = require(filePath);
      if (typeof command.letStart === 'function') {
        exec(`node ${filePath}`, (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error.message}`);
            return;
          }
          if (isCached) {
            commandsChanged = true;
          }
          const statusMessage = isCached ? "updated and deployed" : "deployed";
          api.sendMessage(`『 𝖢𝖮𝖬𝖬𝖠𝖭𝖣 𝖣𝖤𝖯𝖫𝖮𝖸𝖬𝖤𝖭𝖳 』\n\n📤 | ${cmd} Has Been Deployed`, event.threadID, event.messageID);

          // Emit an event when a command is updated or deployed
          commandUpdateEmitter.emit('commandUpdated', { commandName: cmd, statusMessage, stdout });
        });
      } else {
        api.sendMessage(`『 𝖢𝖮𝖬𝖬𝖠𝖭𝖣 𝖣𝖤𝖯𝖫𝖮𝖸𝖬𝖤𝖭𝖳 』\n\nError:\n${cmd} does not export a 'letStart' function.`, event.threadID, event.messageID);
      }
    };

    const undeployCommand = (cmd) => {
      const filePath = path.join(commandsDir, `${cmd}.js`);
      exec(`node ${filePath} --undeploy`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error.message}`);
          return;
        }
        if (require.cache[require.resolve(filePath)]) {
          delete require.cache[require.resolve(filePath)];
        }
        api.sendMessage(`${cmd} command undeployed. Output: ${stdout}`, event.threadID, event.messageID);

        // Emit an event when a command is undeployed
        commandsChanged = true;
        commandUpdateEmitter.emit('commandUndeployed', { commandName: cmd, stdout });
      });
    };

    const deployAllCommands = () => {
      fs.readdir(commandsDir, (err, files) => {
        if (err) {
          console.error(`Failed to read the directory at ${commandsDir}: `, err);
          return;
        }
        files.forEach(file => {
          if (file.endsWith('.js')) {
            deployCommand(file.slice(0, -3));
          }
        });
      });
    };

    switch (commandAction) {
      case "deployed":
        deployCommand(commandName);
        break;
      case "undeployed":
        undeployCommand(commandName);
        break;
      case "deployedall":
        deployAllCommands();
        break;
      default:
        api.sendMessage("Invalid action. Use deployed, undeployed, or deployedall.", event.threadID, event.messageID);
        break;
    }

    if (commandsChanged) {
      api.sendMessage("Commands have been updated.", event.threadID, event.messageID);
    }
  }
};

// Example listener for the 'commandUpdated' event
commandUpdateEmitter.on('commandUpdated', ({ commandName, statusMessage, stdout }) => {
  // Handle the event appropriately
  // For example, log the update to the console
  console.log(`${commandName} command ${statusMessage}. Output: ${stdout}`);
});

// Example listener for the 'commandUndeployed' event
commandUpdateEmitter.on('commandUndeployed', ({ commandName, stdout }) => {
  // Handle the event appropriately
  // For example, log the undeployment to the console
  console.log(`${commandName} command undeployed. Output: ${stdout}`);
});