const firebase = require('../util/firebase.js');
const { MessageEmbed } = require('discord.js');

module.exports = async(bot, msg) => {
    if (msg.attachments.size > 0) {
        try {
            const attachment = msg.attachments.first();
            const type = attachment.url.match(/.*\.(png|jpeg|jpg|mp4|webp|gif)/)[1];

            const snapshot = await firebase.readDatabaseAt(msg.guild.id, 'value');
            const channels = snapshot.val();

            const log_channel = await bot.channels.fetch(channels.log_channel);

            const file = firebase.storage.file(`${msg.guild.id}/${msg.id}.${type}`);
            const data = await file.get();

            const embed = new MessageEmbed();
            embed.setTitle('Image Deleted!')
                .setDescription(`Sent by ${msg.author} in ${msg.channel}.`)
                .setColor(0xEB4034)
                .setImage(data[1].mediaLink)
                .setThumbnail(msg.author.avatarURL())
                .setFooter(`Sent at ${msg.createdAt}`)
            await log_channel.send(embed)
        } catch (e) {
            console.log(e);
        }
    }
}