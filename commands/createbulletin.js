const { Permissions } = require('discord.js');
const { createEmbed } = require('../util/embed.js');

module.exports = {
    async action(args) {
        try {
            const message = args[args.length - 1];
            const title = args[1].replace(/_/g, ' '), description = args[2].replace(/_/g, ' '), color = args[3];
            let additionalContent;
            if(args.length === 6) additionalContent = args[4].replace(/_/g, ' ');
            console.log(args.length);
            const channel = message.mentions.channels.first();
            if(!channel)
                return message.reply('please specify a channel to send this bulletin to!');

            const embed = createEmbed({ title, color, description });
            additionalContent ? await channel.send(additionalContent, {embed}) : await channel.send(embed);
            message.reply(`the **${title}** bulletin has been added in ${channel}.`);
        } catch (e) { console.log(e); }
    },
    permission_level: Permissions.FLAGS.MANAGE_ROLES
}