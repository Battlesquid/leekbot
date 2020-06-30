const { handleConditions } = require('../util/conditionUtil.js');

module.exports = async (bot, reaction, user) => {
    try {
        if (user.bot) return;
        if (reaction.partial)
            await reaction.fetch();

        handleConditions(reaction.message.guild.id, reaction.message.channel.id, "reactionAdd", { bot, reaction, user });

    } catch (e) { console.log(e) }
}