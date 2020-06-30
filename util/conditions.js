const firebase = require('./firebase.js');
const { Permissions } = require('discord.js');

module.exports = {
	reactionAdd: {
		async verify({ reaction, user }) {
			try {
				const verifySnapshot = await firebase.readDatabaseAt(`${reaction.message.guild.id}/verify`);
				const verifySettings = verifySnapshot.val();
				const roles = verifySettings.roleIDs;
				const memberThatReacted = await reaction.message.guild.members.fetch(user.id);

				if (memberThatReacted.hasPermission(Permissions.FLAGS.MANAGE_ROLES)) {
					const userToVerify = await reaction.message.guild.members.fetch(reaction.message.author.id);
					await userToVerify.setNickname(reaction.message.content);
					await userToVerify.roles.add(roles);
					reaction.message.reactions.removeAll();
				}
			} catch (e) { console.log(e); }
		},
		async verifier({ reaction, user }) {
			try {
				const embed = reaction.message.embeds[0];
				if (!embed) return;

				const rolesSnapshot = await firebase.readDatabaseAt(`${reaction.message.guild.id}/verify/roleIDs`);
				const roleIDs = rolesSnapshot.val();

				embed.fields.forEach(async field => {
					try {
						const guildMember = await reaction.message.guild.members.fetch(field.value.match(/\d+/g)[0]);
						await guildMember.roles.add(...roleIDs, `User verified by ${user.tag}.`);
						await guildMember.setNickname(field.name, `User verified by ${user.tag}.`);
					} catch (e) { console.log(e); }
				})

				await firebase.ref(`${reaction.message.guild.id}/verify/batch`).remove();
				await reaction.message.reactions.removeAll();
				reaction.message.channel.send(`Successfully verified ${embed.fields.length} users.`);
			} catch (e) { console.log(e); }
		},
		async bulletin({ bot, reaction, user }) {
			try {
				if (reaction.message.author.id === bot.user.id && reaction.message.embeds.length > 0) {

					const embed = reaction.message.embeds[0];
					const field = embed.fields.find(field => field.value === reaction.emoji.toString());

					const role = reaction.message.guild.roles.cache.find(role => role.name === field.name);
					const member = await reaction.message.guild.members.fetch(user.id);
					member.roles.add(role);
				}
			} catch (e) { console.log(e); }
		}
	},
	reactionRemove: {
		async bulletin({ bot, reaction, user }) {
			try {
				if (reaction.message.author.id === bot.user.id && reaction.message.embeds.length > 0) {
					const embed = reaction.message.embeds[0];
					const field = embed.fields.find(field => field.value === reaction.emoji.toString());

					const role = reaction.message.guild.roles.cache.find(role => role.name === field.name);
					const member = await reaction.message.guild.members.fetch(user.id);
					member.roles.remove(role);
				}
			} catch (e) { console.log(e); }
		},
		verify() { return; }
	},
	message: {
		async verify({ message }) {
			try {
				const verifySnapshot = await firebase.readDatabaseAt(`${message.guild.id}/verify`);
				const verifySettings = verifySnapshot.val();

				if (!verifySettings.verifierChannel) {
					if (message.content.match(verifySettings.regex))
						await message.react(verifySettings.emoji);
				} else {
					await firebase.ref(`${message.guild.id}/verify/batch/${message.author.id}`).set(message.content);
				}


			} catch (e) { console.log(e); }
		},
		verifier() { return; },
		async locked({ message }) {
			try {
				const snapshot = await firebase.readDatabaseAt(`${message.guild.id}/image/locked`);
				const lockedChannels = snapshot.val();

				//checks if any message posted in a read-only channel has an attachment
				//if it doesn't, deletes it
				if (lockedChannels.includes(message.channel.id) &&
					!(message.attachments.size > 0) &&
					(message.content.length > 0 && !message.content.match(process.env.URL_REGEX))) {
					message.delete();
				}
			} catch (e) { console.log(e); }
		}
	}
}