require("dotenv").config();

const { Client, Collection } = require("discord.js");
const bot = new Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });
bot.commands = new Collection();

const { initBatchVerifyScheduler } = require('./util/scheduler.js');
const fs = require("fs");

function loadCommands(paths, root, includeRoot = false) {
    paths.forEach(path => {
        const folders = path.match(/\w+/g).filter(p => includeRoot || p !== "commands");

        if (folders.length)
            bot.commands.set(folders[0], new Map());

        const contents = fs.readdirSync(path);
        const jsFiles = [], subDirs = [];

        for (const file of contents)
            file.endsWith(".js") ? jsFiles.push(file) : subDirs.push(`${path}/${file}`);

        if (jsFiles) {
            jsFiles.forEach(file => {
                if (folders.length)
                    bot.commands.get(folders[0]).set(file.split(".js")[0], require(`${path}/${file}`));
                else
                    bot.commands.set(file.split(".js")[0], require(`${path}/${file}`));
            });
        }

        if (subDirs) loadCommands(subDirs, root)
    })
}

function loadEvents(path) {
    const items = fs.readdirSync(path);
    for (const file of items) {
        if (file.endsWith(".js")) {
            const event = require(`./events/${file}`);
            let eventName = file.split(".js")[0];
            bot.on(eventName, event.bind(null, bot));
            delete require.cache[require.resolve(`./events/${file}`)];
        }
    }
}

bot.on("ready", () => {
    bot.user.setPresence({
        activity: {
            name: `for messages | https://bit.ly/2AHXtXs`,
            type: "WATCHING"
        },
        status: "idle"
    });
    console.log("Loading commands...");
    loadCommands(["./commands"], "commands", false);
    console.log(bot.commands);

    console.log("Loading events...");
    loadEvents("./events");
    initBatchVerifyScheduler(bot);
    console.log("Ready");
});

bot.login(process.env.TOKEN);