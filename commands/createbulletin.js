const { Permissions } = require('discord.js');
const { createEmbed } = require('../util/embed.js');

module.exports = {
    async action(args) {
        const message = args[args.length - 1];
        console.log(args);

        const title = args[1], color = args[2], description = message.content.match(/"(.+)"/)[1];
        const channel = message.mentions.channels.array()[0];

        const embed = createEmbed({ title, color, description });
        channel.send(embed);
    },
    permission_level: Permissions.FLAGS.MANAGE_ROLES
}