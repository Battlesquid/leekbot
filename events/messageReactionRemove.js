module.exports = async (bot, reaction, user) => {
    try {
        if (user.bot) return;
        if (reaction.partial) {
            await reaction.fetch();
        }
        if (reaction.message.author.id === '704383965515218984' && reaction.message.embeds.length > 0) {
            const embed = reaction.message.embeds[0];
            const field = embed.fields.find(field => field.value === reaction.emoji.toString());

            const role = reaction.message.guild.roles.cache.find(role => role.name === field.name);
            const member = await reaction.message.guild.members.fetch(user.id);
            member.roles.remove(role);
        }
    } catch (e) { console.log(e); }
}