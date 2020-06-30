const firebase = require('../util/firebase.js');
const storage = require('../util/storageFunctions.js');
const { MessageEmbed } = require('discord.js');

module.exports = async (bot, message) => {
    if (message.attachments.size > 0) {
        try {
            const snapshot = await firebase.readDatabaseAt(`${message.guild.id}/image/loggingChannel`);
            if (!snapshot.exists()) return;
            const loggingChannelID = snapshot.val();
            const logChannel = await bot.channels.fetch(loggingChannelID);

            //if the channel was deleted
            if (!logChannel) return;

            storage.uploadFile(message, async (message, name) => {
                try {
                    console.log("retreiving file");

                    const file = firebase.storage.file(name);
                    const data = await file.get();

                    const embed = new MessageEmbed();
                    embed.setTitle("Image Deleted!")
                        .setDescription(`Sent by ${message.author} in ${message.channel}.`)
                        .addField("Message:", message.content || "[no message]")
                        .setColor(0xEB4034)
                        .setImage(data[1].mediaLink)
                        .setThumbnail(message.author.avatarURL())
                        .setFooter(`Sent at ${message.createdAt}`)
                    await logChannel.send(embed)
                } catch (e) { console.log(e); }
            });
        } catch (e) { console.log(e) }
    }
}