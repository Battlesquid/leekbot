const { Permissions } = require('discord.js');
const { createEmbed } = require('../util/embed.js');

module.exports = {
    async action(args) {
        try {
            const message = args[args.length - 1];
            const title = args[1], description = args[2].replace(/_/g, ' '), color = args[3];
            const channel = message.mentions.channels.first();

            const embed = createEmbed({ title, color, description });
            await channel.send(embed);
            message.reply(`the **${title}** bulletin has been added in ${channel}.`);
        } catch (e) { console.log(e); }
    },
    permission_level: Permissions.FLAGS.MANAGE_ROLES
}