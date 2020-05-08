const firebase = require('../util/firebase.js');
const { Permissions } = require("discord.js");

module.exports = {
  async action(args) {
    try {
      
      const msg = args[args.length - 1];
      const guild = msg.guild.id;
      if (!msg.mentions.channels.array().length > 0) return;
      const mentions = msg.mentions.channels.array().map(m => m.id);

      const snapshot = await firebase.readDatabaseAt(`${guild}/channels`, 'value');
      let value = snapshot.val();
      let indices = [];
      mentions.forEach(mention => value.splice(value.indexOf(mention), 1));

      if (value.length != 0) {
        firebase.database.ref(`${guild}/channels`).set(value);
      } else {
        firebase.database.ref(`${guild}/channels`).set(0);
      }

      const verb = mentions.length === 1 ? "is" : "are";
      msg.reply(`${msg.mentions.channels.array().join(', ')} ${verb} no longer read only.`);

    } catch (e) { console.log(e); }
  },
  permission_level: Permissions.FLAGS.MANAGE_GUILD
};