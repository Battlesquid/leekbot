const { Client } = require('discord.js');
const fs = require('fs');
const bot = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
bot.cmds = {};

require('dotenv').config();

async function load() {
    fs.readdir('./commands', (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
            if (!file.endsWith(".js")) return;
            const name = file.split('.js')[0];
            bot.cmds[name] = require(`./commands/${name}`);
        });
        console.log('Commands Initialized');
    });

    fs.readdir('./events', (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
            if (!file.endsWith(".js")) return;
            const event = require(`./events/${file}`);
            let eventName = file.split(".")[0];
            bot.on(eventName, event.bind(null, bot));
            delete require.cache[require.resolve(`./events/${file}`)];
        });
    });
}

bot.on('ready', () => {
    bot.user.setPresence({
        activity: {
            name: `for messages | https://bit.ly/2AHXtXs`,
            type: "WATCHING"
        },
        status: 'online'
    });
    console.log('Ready, loading commands...');
    load();
});

bot.login(process.env.TOKEN);