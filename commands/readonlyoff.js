const db = require('../util/db.js');
const { Permissions } = require("discord.js");

module.exports = {
  action(args) {
    const msg = args[args.length - 1];
    const guild = msg.guild.id;
    if(!msg.mentions.channels.array().length > 0) return;
    const mentions = msg.mentions.channels.array().map(m => m.id);
    

    db.ref(`${guild}/channels`).once('value')
    .then(res => {
        let val = res.val();
        let indices = [];
        mentions.forEach(mention => {
            val.splice(val.indexOf(mention), 1);
        })
        if(val.length != 0) {
            db.ref(`${guild}/channels`).set(val);
        } else {
            db.ref(`${guild}/channels`).set(0);
        }
        const verb = mentions.length === 1 ? "is" : "are";
        msg.reply(`${msg.mentions.channels.array().join(', ')} ${verb} no longer read only.`);
    })
  },
  permission_level: Permissions.FLAGS.MANAGE_GUILD
};