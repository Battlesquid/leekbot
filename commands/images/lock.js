const firebase = require('../../util/firebase.js');
const { Permissions } = require("discord.js");
const { pushChannelsToCondition } = require('../../util/conditionUtil.js');

module.exports = {
	async action(message, args) {
		try {
			const guildID = message.guild.id;
			if (!message.mentions.channels.size > 0) return;
			const mentions = message.mentions.channels.array().map(m => m.id);

			const channels = await firebase.readDatabaseAt(`${guildID}/image/locked`);
			let lockedChannels = channels.exists() ? channels.val() : [];

			lockedChannels.push(...mentions);
			lockedChannels = lockedChannels.filter((item, index) => lockedChannels.indexOf(item) == index);

			await firebase.ref(`${guildID}/image/locked`).set(lockedChannels);

			pushChannelsToCondition(lockedChannels, "locked", guildID);

			const verb = message.mentions.channels.size === 1 ? "is" : "are";
			message.reply(`${message.mentions.channels.array().join(', ')} ${verb} now image locked.`);
		} catch (e) { console.log(e); }
	},
	permission_level: Permissions.FLAGS.MANAGE_GUILD
};