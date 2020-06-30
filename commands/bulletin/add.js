const { Permissions } = require('discord.js');

module.exports = {
    async action(message, args) {
        try {
            const channel = message.mentions.channels.first();
            const name = args[1].replace(/_/g, ' '), emoji = args[2], role = args[3].replace(/_/g, ' ');
            const custom = emoji.match(/\:(\d+)\>/);

            const roleExists = message.guild.roles.cache.find(r => r.name === role);
            if (!roleExists)
                return message.channel.send(`There is no role in the server named ${role}. Double check the case or create the role, then try again.`);

            const filter = msg => msg.embeds.length > 0 && msg.embeds[0].title === name;
            const messages = await channel.messages.fetch({ limit: 10 });
            const bulletin = messages.filter(filter).first();

            if (!bulletin)
                return message.reply(`I couldn't find a bulletin named ${name}. Create a bulletin using ;createbulletin and try again.`);

            const embed = bulletin.embeds[0];
            embed.addField(role, emoji, true);

            await bulletin.edit({ embed });
            custom ? await bulletin.react(custom[1]) : await bulletin.react(emoji);

            message.reply(`success, on the ${name} bulletin, reactions to ${emoji} will give the ${role} role.`);
        } catch (e) {
            message.reply('An error occured! Make sure I have the right permissions to run this command!');
            console.log(e);
        }
    },
    permission_level: Permissions.FLAGS.MANAGE_ROLES
}