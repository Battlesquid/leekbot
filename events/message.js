const { handleConditions } = require('../util/conditionUtil.js');
require('../util/extendedmap.js');

module.exports = async (bot, message) => {
    if (message.author.bot) return;

    try {
        handleConditions(message.guild.id, message.channel.id, "message", { message });

        if (message.content.startsWith(process.env.PREFIX)) {
            //get the args and add the message to the args server
            const args = message.content.slice(process.env.PREFIX.length).trim().split(/\s+/g);

            //get the command; if it doesn't exist return;
            const [category, command] = args.shift().split('.');
            if (!bot.commands.nestedGet(category, command)) return;

            //make sure that they have permission to run the command
            if (!(message.member.hasPermission(bot.commands.nestedGet(category, command).permission_level) || message.member.id === '423699849767288853'))
                return message.reply('you do not have permission to run that command!');

            //run the command
            bot.commands.nestedGet(category, command).action(message, args);
        }

    } catch (e) {
        console.log(e);
    }
}
