const { Permissions } = require('discord.js');
const firebase = require('../../util/firebase.js');
const { pushChannelsToCondition } = require('../../util/conditionUtil.js');

module.exports = {
    async action(message, args) {
        try {
            const verify = args[0],
                regex = args[1], verifier = args[2], roles = args.slice(3, args.length);
            const verifierChannel = verifier.match(/\d+/g)[0], channel = verify.match(/\d+/g)[0];

            if (!roles.every(role => message.guild.roles.cache.find(guildRole => guildRole.name === role)))
                return console.log("an invalid role was supplied");

            const roleIDs = roles.map(role =>
                message.guild.roles.cache.find(guildRole => guildRole.name === role).id);

            firebase.ref(`${message.guild.id}/verify`).set({
                regex, verifierChannel, roleIDs
            })

            pushChannelsToCondition([channel], "verify", message.guild.id);
            pushChannelsToCondition([verifierChannel], "verifier", message.guild.id);

            message.reply(`success. Users who send a valid message in ${verify} will be added to the verification list and be given the roles \`${roles.join(", ")}\` on approval. Verification lists will be sent daily in the ${verifier} channel, but you can display the list at any time using \`;verify.list\`.`);
        } catch (e) { console.log(e); }
    },
    permission_level: Permissions.FLAGS.MANAGE_ROLES
}