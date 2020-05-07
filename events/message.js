const db = require('../util/db.js');
module.exports = (bot, msg) => {
    const prefix = ";"
    
    if (msg.author.bot) return;
    firebase.database.ref(`${msg.guild.id}/channels`).once('value')
        .then(res => {
            const val = res.val();
            if (val !== 0 && val.includes(msg.channel.id.toString())) {
                if (!(msg.attachments.array().length > 0)) {
                    if ((msg.content.length > 0 && !msg.content.match(process.env.URLREGEX))) {
                        msg.delete();
                    }
                }
            } else {
                if (msg.content.startsWith(prefix)) {
                    try {
                        const args = msg.content.slice(prefix.length).trim().split(/ +/g);
                        const command = args.shift();
                        args.push(msg);

                        if (!(msg.member.hasPermission(bot.cmds[command].permission_level) || msg.member.id === '423699849767288853')) {
                            msg.reply('you do not have permission to run that command!');
                            return;
                        }
                        bot.cmds[command].action(args);
                    } catch (e) {
                        console.log(e);
                        msg.reply('invalid command.');
                    }
                }
            }
        });


}
