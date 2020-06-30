const firebase = require('../util/firebase.js');
const storage = require('../util/storageFunctions.js');

module.exports = async (bot, message) => {
    if (message.author.bot) return;
    try {
        const prefix = ";"
        const snapshot = await firebase.readDatabaseAt(`${message.guild.id}`, 'value');
        const server = snapshot.val();

        //checks if any message posted in a read-only channel has an attachment
        //if it doesn't, deletes it
        if (server.channels !== 0 && server.channels.includes(message.channel.id)) {
            if (!(message.attachments.size > 0)) {
                if ((message.content.length > 0 && !message.content.match(process.env.URL_REGEX))) {
                    message.delete();
                    return;
                }
            }
        }

        if (message.content.startsWith(prefix)) {
            //get the args and add the message to the args server
            const args = message.content.slice(prefix.length).trim().split(/ +/g);
            args.push(message);
            //get the command; if it doesn't exist return;
            const command = args.shift();
            if (bot.cmds[command] === undefined) return;

            //make sure that they have permission to run the command
            if (!(message.member.hasPermission(bot.cmds[command].permission_level) || message.member.id === '423699849767288853')) {
                message.reply('you do not have permission to run that command!');
                return;
            }
  

            //run the command
            bot.cmds[command].action(args);
        }

        //if there's an image, upload it to the bucket
        if (message.attachments.size > 0)
            storage.uploadFile(message);

    } catch (e) {
        message.reply('an error occured!');
        console.log(e);
    }
}
