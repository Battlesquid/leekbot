const { Permissions } = require('discord.js');
module.exports = {
    action(message, args) {
        message.channel.send(args.join('_'));
    },
    permission_level: Permissions.FLAGS.MANAGE_GUILD
}