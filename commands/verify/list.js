const { MessageEmbed, Permissions } = require('discord.js');
const firebase = require('../../util/firebase.js');

module.exports = {
    async action(message, args) {
        try {
            const verifierSnapshot = await firebase.readDatabaseAt(`${message.guild.id}/verify`);
            if (!verifierSnapshot.exists()) return;
            const verifySettings = verifierSnapshot.val();
            const verifierChannelID = verifySettings.verifierChannel;

            if (!verifierChannelID) return;

            const verifierChannel = await message.guild.channels.resolve(verifierChannelID);
            if (!verifierChannel) return;

            const embed = new MessageEmbed();
            embed.setTitle("Verification List")
                .setDescription("Here is the daily verification list");

            for (member in verifySettings.batch) {
                const guildMember = await message.guild.members.fetch(member);
                embed.addField(verifySettings.batch[member], `${guildMember.user}`);
            }

            const newMessage = await verifierChannel.send(embed);
            embed.setFooter(`Embed ID: ${newMessage.id}`)
            newMessage.react("👍");
            newMessage.edit(embed);
        } catch (e) { console.log(e); }

    },
    permission_level: Permissions.FLAGS.MANAGE_GUILD
}