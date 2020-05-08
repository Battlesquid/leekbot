const firebase = require('../util/firebase.js');
const { MessageEmbed } = require('discord.js');

module.exports = async (bot, msg) => {
    if (msg.attachments.array().length > 0) {
        try {
            const attachment = msg.attachments.array()[0];
            const type = attachment.url.match(/.*\.(png|jpeg|jpg|mp4|webp|gif)/)[1];

            const snapshot = await firebase.readDatabaseAt(msg.guild.id, 'value');
            const channels = snapshot.val();

            const log_channel = await bot.channels.fetch(channels.log_channel);

            const file = firebase.storage.file(`${msg.guild.id}${msg.id}.${type}`);
            const data = await file.get().then(res => res).catch(e => console.log(e));

            log_channel.send({ files: [data[1].mediaLink] });
        } catch (e) {
            console.log(e);
        }
    }
}
