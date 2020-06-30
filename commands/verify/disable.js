const { removeCondition } = require("../../util/conditionUtil");
const firebase = require("../../util/firebase");

module.exports = {
    async action(message) {
        removeCondition("verify", message.guild.id);
        removeCondition("verifier", message.guild.id);
        const verifySnapshot = await firebase.readDatabaseAt(`${message.guild.id}/verify`);
        if (!verifySnapshot.exists()) return;
        await firebase.ref(`${message.guild.id}/verify`).remove();

        message.reply("successfully disabled verification.");
    }
}