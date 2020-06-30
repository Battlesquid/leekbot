const { Permissions } = require('discord.js');
module.exports = {
    action(args) {
        const message = args[args.length - 1];
        message.channel.send(message.content.replace(/ /g, '_'));
    },
    permission_level: Permissions.FLAGS.MANAGE_GUILD
}