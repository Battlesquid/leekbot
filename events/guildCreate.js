const db = require('../util/db.js');
module.exports = (bot, guild) => {
    db.ref(guild.id.toString()).set({
        "channels": 0
    });
}