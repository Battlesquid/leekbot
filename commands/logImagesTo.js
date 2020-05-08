const firebase = require('../util/firebase.js');
const { Permissions } = require("discord.js");

module.exports = {
  async action(args) {
    try {
      const msg = args[args.length - 1];
      if (!msg.mentions.channels.array().length > 0) return;

      const channel = msg.mentions.channels.array()[0];
      const log_channel = msg.mentions.channels.array()[0];

      const snapshot = await firebase.readDatabaseAt(`${msg.guild.id}/log_channel`, 'value');
      const value = snapshot.val();

      const active_channel = await msg.client.channels.fetch(value);

      //if there is an active log
      if (value !== "0") {
        if (value === channel.id) {
          //if it is the same channel id, disable logging
          firebase.database.ref(`${msg.guild.id}/log_channel`).set('0')
            .then(() => msg.reply(`deleted images will no longer be logged in ${log_channel}.`))
            .catch(e => console.log(e));
        } else {
          //if it is a different channel, let the user know of the transition
          firebase.database.ref(`${msg.guild.id}/log_channel`).set(channel.id)
            .then(() => msg.reply(`deleted images will now log in ${log_channel} instead of ${active_channel}`))
            .catch(e => console.log(e));
        }
      } else {
        //if the location is empty ("0")
        firebase.database.ref(`${msg.guild.id}/log_channel`).set(channel.id)
          .then(() => msg.reply(`deleted images will now be logged in ${log_channel}.`))
          .catch(e => console.log(e));

      }
    } catch (e) { console.log(e); }
  },
  permission_level: Permissions.FLAGS.MANAGE_GUILD
}