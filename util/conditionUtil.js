const firebase = require('./firebase.js');
const conditionFunctions = require('./conditions.js');

module.exports = {
    async handleConditions(guildID, channel, event, params) {
        try {
            const snapshot = await firebase.readDatabaseAt(`${guildID}/conditions`);
            if (!snapshot.exists()) return;

            const guildConditions = snapshot.val(), validConditions = [];

            for (const condition in guildConditions) {
                guildConditions[condition].includes(channel) &&
                    conditionFunctions[event][condition] ? validConditions.push(condition) : "";
            }
            validConditions.forEach(condition =>
                conditionFunctions[event][condition](params))
        } catch (e) {
            console.log(e);
        }
    },
    async pushChannelsToCondition(channels, condition, guildID) {
        try {
            const conditionSnapshot = await firebase.readDatabaseAt(`${guildID}/conditions/${condition}`);
            let storedChannels = conditionSnapshot.exists() ? conditionSnapshot.val() : [];

            storedChannels.push(...channels);
            storedChannels = storedChannels.filter((item, index) => storedChannels.indexOf(item) === index);

            await firebase.ref(`${guildID}/conditions/${condition}`).set(storedChannels);
        } catch (e) { console.log(e); }
    },
    async spliceChannelsFromCondition(channels, condition, guildID) {
        try {
            const conditionSnapshot = await firebase.readDatabaseAt(`${guildID}/conditions/${condition}`);
            const storedChannels = conditionSnapshot.exists() ? conditionSnapshot.val() : [];
            const filteredChannels = storedChannels.filter(channel => channels.includes(channel));

            await firebase.ref(`${guildID}/conditions/${condition}`).set(filteredChannels);
        } catch (e) { console.log(e); }
    },
    async removeCondition(condition, guildID) {
        try {
            const conditionSnapshot = await firebase.readDatabaseAt(`${guildID}/conditions/${condition}`);
            if (!conditionSnapshot.exists()) return;
            firebase.ref(`${guildID}/conditions/${condition}`).remove();
        } catch (e) { console.log(e) }
    }
}