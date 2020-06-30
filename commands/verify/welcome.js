const { Permissions } = require('discord.js');

module.exports = {
    async action(message, args) {
        try {
            const embedID = args[0];
            const batchEmbedMessage = await message.channel.messages.fetch(embedID);
            const batchEmbed = batchEmbedMessage.embeds[0];
            const users = [];
            batchEmbed.fields.forEach(field => {
                users.push(`\`<@${field.value.match(/\d+/g)[0]}>\``);
                console.log(field.value.match(/\d+/g));
            });

            message.channel.send(`Welcome ${users.join(", ")}!`);
        } catch (e) { console.log(e); }
    },
    permission_level: Permissions.FLAGS.MANAGE_GUILD
}