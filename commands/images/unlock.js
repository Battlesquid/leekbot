const firebase = require('../../util/firebase.js');
const { Permissions } = require("discord.js");
const { spliceChannelsFromCondition } = require('../../util/conditionUtil.js');

module.exports = {
  async action(message, args) {
    try {
      if (!message.mentions.channels.size > 0) return;

      const guildID = message.guild.id;
      const requestedChannels = message.mentions.channels.array().map(m => m.id);

      const snapshot = await firebase.readDatabaseAt(`${guildID}/image/locked`);
      if (!snapshot.exists()) return;

      const snapshotChannels = snapshot.val();
      const lockedChannels = snapshotChannels.slice();

      requestedChannels.forEach(mention => lockedChannels.splice(lockedChannels.indexOf(mention), 1));

      firebase.database.ref(`${guildID}/image/locked`).set(lockedChannels);

      spliceChannelsFromCondition(lockedChannels, "locked", guildID);

      const verb = requestedChannels.length === 1 ? "is" : "are";
      message.reply(`${message.mentions.channels.array().join(', ')} ${verb} are no longer image locked.`);

    } catch (e) { console.log(e); }
  },
  permission_level: Permissions.FLAGS.MANAGE_GUILD
};