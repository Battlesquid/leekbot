const firebase = require('../util/firebase.js');
const { Permissions } = require("discord.js");

module.exports = {
  async action(args) {
    const msg = args[args.length - 1];
    const guild = msg.guild.id;
    if (!msg.mentions.channels.size > 0) return;
    const mentions = msg.mentions.channels.array().map(m => m.id);

    const snapshot = await firebase.readDatabaseAt(`${guild}/channels`, 'value');
    let value = snapshot.val();

    if (value === 0) value = [];
    value.push(...mentions);
    value = value.filter((item, index) => value.indexOf(item) == index);

    firebase.database.ref(`${guild}/channels`).set(value);
    const verb = msg.mentions.channels.size === 1 ? "is" : "are";
    msg.reply(`${msg.mentions.channels.array().join(', ')} ${verb} now read only.`);
  },
  permission_level: Permissions.FLAGS.MANAGE_GUILD
};