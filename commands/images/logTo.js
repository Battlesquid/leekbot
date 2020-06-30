const firebase = require('../../util/firebase.js');
const { Permissions } = require("discord.js");

module.exports = {
  async action(message, args) {
    try {
      if (!message.mentions.channels.size > 0) return;

      const requestedChannel = message.mentions.channels.first();
      const snapshot = await firebase.readDatabaseAt(`${message.guild.id}/image/logChannel`);


      //if there is an active log
      if (snapshot.exists()) {
        const currentChannelID = snapshot.val();
        const currentChannel = await message.client.channels.fetch(currentChannelID);
        if (currentChannelID === requestedChannel.id) {

          //if it is the same channel id, disable logging
          await firebase.database.ref(`${message.guild.id}/image/loggingChannel`).remove();
          message.reply(`deleted images will no longer be logged in ${requestedChannel}.`);

        } else {

          //if it is a different channel, let the user know of the transition
          await firebase.database.ref(`${message.guild.id}/image/loggingChannel`).set(requestedChannel.id);
          message.reply(`deleted images will now log in ${requestedChannel} instead of ${currentChannel}`);

        }
      } else {

        //if the location is empty ("0")
        await firebase.database.ref(`${message.guild.id}/image/loggingChannel`).set(requestedChannel.id)
        message.reply(`deleted images will now be logged in ${requestedChannel}.`);

      }
    } catch (e) { console.log(e); }
  },
  permission_level: Permissions.FLAGS.MANAGE_GUILD
}