# leekbot

A general purpose utility bot to help you out on your server.

**Invite Link:** https://discord.com/api/oauth2/authorize?client_id=704383965515218984&permissions=403041344&scope=bot

## Commands

### ;images
**.lock `[#channels]`**

Image locks the specified channels. Messages sent to these channels are deleted (note, channels should be mentionable!)

**.unlock `[#channels]`**

Enables messages in the selected channels.

**.logTo `[channel]`**

Implements image logging. When an image is deleted, the image will be posted to the specified channel.

### ;bulletin
**.create** `[channel] [title] [description] [color] (message_content)`

Creates a bulletin in the specified `[channel]`. Base structure for creating bulletins. Spaces in `(message_content)` must be replaced with underscores.

**.add** `[channel] [title] [role] [emoji]`

Adds a role to the specified bulletin. Users can react to the emoji to obtain the specified role.

**.remove** `[channel] [title] [role]`

Removes the role from the bulletin.

**.format** `[text]`
Helper command, replaces spaces with underscores.

### ;verify

**.batchVerify** `[channel] [regex] [update channel] [roles]`

Batch verify command, users are put on a wait list when they send a valid message (matches `[regex]`) in `[channel]` and leekbot will send the list daily for verification to `[update channel]`; reacting to this message (thumbs up) will grant them the specified `[roles]`. You can display and verify batches early using `;verify.list`.

**.reactVerify** `[channel] [regex] [emoji] [roles]`

Leekbot will react with `[emoji]` to all message in `[channel]` that match the `[regex]`. Reacting the emoji will give the user the `[roles]` you listed.

**.disable**
Disables verification completely.

**.list**
User invoked verification list, allows you to verify early if desired.

**.welcome**
Formats a welcome message using a list Embed ID (eg "Welcome @member1, @member2")

## Contributing
Have a feature you want to suggest? Open a pull request or send an issue and I'll check it out!
