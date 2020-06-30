const firebase = require('../util/firebase.js');
module.exports = (bot, guild) => {
    firebase.database.ref(guild.id.toString()).set({
        "channels": 0,
        "log_channel": 0
    });
} 