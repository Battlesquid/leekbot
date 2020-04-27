const db = require('../util/db.js');
const { Permissions } = require("discord.js");

module.exports = {
  action(args) {
    const msg = args[args.length - 1];
    const guild = msg.guild.id;
    if (!msg.mentions.channels.array().length > 0) return;
    const mentions = msg.mentions.channels.array().map(m => m.id);
    db.ref(`${guild}/channels`).once('value')
      .then(res => {
        let value = res.val();
        if (value === 0) {
          value = [];
        }
        value.push(...mentions);
        value = value.filter((item, index) => value.indexOf(item) == index);
        db.ref(`${guild}/channels`).set(value);
        const verb = msg.mentions.channels.array().length === 1 ? "is" : "are";
        msg.reply(`${msg.mentions.channels.array().join(', ')} ${verb} now read only.`);
      })
  },
  permission_level: Permissions.FLAGS.MANAGE_GUILD
};