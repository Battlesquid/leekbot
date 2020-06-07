const { Permissions } = require('discord.js');

module.exports = {
    async action(args) {
        const message = args[args.length - 1];
        try {
            const channel = message.mentions.channels.array()[0];
            const name = args[1], emoji = args[2], role = args[3].replace('_', ' ');



            const role_validate = message.guild.roles.cache.array().map(role => role.name).includes(role);
            if (!role_validate) {
                message.channel.send(`There is no role in the server named ${role}. Double check the case or create the role, then try again.`);
                return;
            }

            const filter = msg => msg.embeds.length > 0 && msg.embeds[0].title === name;
            const messages = await channel.messages.fetch({ limit: 10 });
            const bulletin = messages.filter(filter).array()[0];

            if (!bulletin) {
                message.reply(`I couldn't find a bulletin named ${name}. Create a bulletin using ;createbulletin and try again.`);
                return;
            }

            const embed = bulletin.embeds[0];
            embed.addField(role, emoji, true);

            await bulletin.edit({ embed });
            // await bulletin.react(emoji);

            console.log(emoji);
            emoji.length === 1 ? await bulletin.react(emoji) : await bulletin.react(emoji.match(/[^=:](\d+)[^=>]/gi)[0]);
            message.reply(`success, on the ${name} bulletin, reactions to ${emoji} will give the ${role} role.`);
        } catch (e) {
            message.reply('An error occured! Make sure I have the right permissions to run this command!');
            console.log(e);
        }
    },
    permission_level: Permissions.FLAGS.MANAGE_ROLES
}