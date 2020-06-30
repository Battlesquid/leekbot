const { Permissions } = require('discord.js');
const firebase = require('../../util/firebase.js');
const { pushChannelsToCondition, removeCondition } = require('../../util/conditionUtil.js');

module.exports = {
    async action(message, args) {
        if (!message.mentions.channels.size > 0) return;
        const channel = message.mentions.channels.first(), channelID = channel.id;
        const regex = args[1], emoji = args[2], roles = args.slice(3, args.length);

        if (!roles.every(role => message.guild.roles.cache.find(guildRole => guildRole.name === role)))
            return console.log("an invalid role was supplied");

        const roleIDs = roles.map(role =>
            message.guild.roles.cache.find(guildRole => guildRole.name === role).id);
        
        const verifySnapshot = await firebase.readDatabaseAt(`${message.guild.id}/verifierChannel`);
        if (verifySnapshot.exists()) await firebase.ref(`${message.guild.id}/verify/verifierChannel`).remove();


        await firebase.ref(`${message.guild.id}/verify`).set({
            regex, emoji, roleIDs
        });

        pushChannelsToCondition([channelID], "verify", message.guild.id);
        removeCondition("verifier", message.guild.id);
        message.reply(`success. Reacting with ${emoji} to valid messages in ${channel} will give the \`${roles.join(", ")}\` roles to the user.`)
    },
    permission_level: Permissions.FLAGS.MANAGE_GUILD
}