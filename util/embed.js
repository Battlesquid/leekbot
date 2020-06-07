const { MessageEmbed } = require('discord.js');

module.exports = {
    createEmbed({ title, color, fields, description }) {
        const embed = new MessageEmbed();
        embed.setTitle(title)
            .setColor(color);
        if (fields) embed.addFields(...fields);
        if (description) embed.setDescription(description);
        return embed;
    }
}