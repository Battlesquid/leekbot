# leekbot

A bot to keep selected channels clean of messages (attachment only channels). This is something not implemented in discord so this bot handles it. The prefix is `;` (semicolon).

**Invite Link:** https://discordapp.com/oauth2/authorize?client_id=704383965515218984&permissions=11264&scope=bot

# Commands

### Moderation
**;readOnlyOn `[channels]`**
Takes one or more channels as parameters and disables messages in them. Please note that channels must be mentionable (starts with "#" and is highlighted on hover) and cannot be just plain text!

**;readOnlyOff `[channels]`**
Enables messages in the selected channels.

**;logImagesTo `[channel]`**
Implements image logging. When an image is deleted, the image will be posted to the specified channel.

## Contributing
Have a feature you want to suggest? Open a pull request or send an issue and I'll check it out!
