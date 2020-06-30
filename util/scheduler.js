const { CronJob } = require('cron');
const { MessageEmbed } = require('discord.js');
const firebase = require('./firebase.js');

module.exports = {
    async initBatchVerifyScheduler(client) {
        new CronJob("0 59 23 * * *", () => {
            client.guilds.cache.forEach(async guild => {
                const verifierSnapshot = await firebase.readDatabaseAt(`${guild.id}/verify`);
                if (!verifierSnapshot.exists()) return;
                const verifySettings = verifierSnapshot.val();
                const verifierChannelID = verifySettings.verifierChannel;

                if (!verifierChannelID) return;

                const verifierChannel = await client.channels.fetch(verifierChannelID);
                if (!verifierChannel) return;

                const embed = new MessageEmbed();
                embed.setTitle("Batch Verify List")
                    .setDescription("Here is the daily verification list");

                for (member in verifySettings.batch) {
                    const guildMember = await guild.members.fetch(member);
                    embed.addField(verifySettings.batch[member], `${guildMember.user}`);
                }

                const message = await verifierChannel.send(embed);
                embed.setFooter(`Embed ID: ${message.id}`)
                message.react("👍");
                message.edit(embed);

            })
        }, null, true, "America/Phoenix");
    }
}

