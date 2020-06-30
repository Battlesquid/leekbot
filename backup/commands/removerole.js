const { Permissions } = require('discord.js');

module.exports = {
    async action(args) {
        const message = args[args.length - 1];
        try {
            const name = args[1].replace(/_/g, ' '), role = args[2].replace(/_/g, ' ');
            
            const channel = message.mentions.channels.first();
            const messages = await channel.messages.fetch({ limit: 10 });

            const bulletin = messages.find(msg => msg.embeds.length > 0 && msg.embeds[0].title === name);
            if (!bulletin)
                return message.reply(`I couldn't find a bulletin named ${name}. Create a bulletin using ;createbulletin and try again.`);

            const embed = bulletin.embeds[0];
            const field = embed.fields.find(field => field.name === role);
            const custom = field.value.match(/\:(\d+)\>/);
            const index = embed.fields.indexOf(field);

            if (index === -1)
                return message.channel.send(`There is no role named ${role} on the ${name} bulletin.`);

            embed.fields.splice(index, 1);
            await bulletin.edit({ embed });
            const emoji = custom ? custom[1] : field.value;
            await bulletin.reactions.cache.get(emoji).remove();
            message.reply(`success, the ${role} role was removed from ${name}.`);
        } catch (e) {
            message.reply('An error occured! Make sure I have the right permissions to run this command!');
            console.log(e);
        }
    },
    permission_level: Permissions.FLAGS.MANAGE_ROLES
}