const { Permissions } = require('discord.js');

module.exports = {
    async action(args) {
        const message = args[args.length - 1];
        try {
            const name = args[1], role = args[2].replace('_', ' ');

            const channel = message.mentions.channels.array()[0];
            const messages = await channel.messages.fetch({ limit: 10 });

            const bulletin = messages.find(msg => msg.embeds.length > 0 && msg.embeds[0].title === name);

            const embed = bulletin.embeds[0];
            const field = embed.fields.find(field => field.name === role);
            const index = embed.fields.indexOf(field);

            if (index === -1) {
                message.channel.send(`There is no role named ${role} on the ${name} bulletin.`);
                return;
            }

            embed.fields.splice(index, 1);
            await bulletin.edit({ embed });
            await bulletin.reactions.cache.get(field.value).remove();
            message.reply(`success, the ${role} role was removed from ${name}.`);
        } catch (e) {
            message.reply('An error occured! Make sure I have the right permissions to run this command!');
            console.log(e);
        }
    },
    permission_level: Permissions.FLAGS.MANAGE_ROLES
}