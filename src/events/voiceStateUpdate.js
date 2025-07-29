const EmbedBuilder = require('../utils/embedBuilder');

module.exports = {
    name: 'voiceStateUpdate',
    execute(sessionManager, oldState, newState) {
        // Check all active sessions to see if any voice channels became empty
        for (const [guildId, session] of sessionManager.getAllActiveSessions()) {
            const { voiceChannel, textChannel } = session;

            // Check if the voice state change affects our monitored voice channel
            if (oldState.channelId === voiceChannel.id || newState.channelId === voiceChannel.id) {
                // Count only human members (exclude bots)
                const humanMembers = voiceChannel.members.filter(member => !member.user.bot);

                // Check if no humans are left in the voice channel
                if (humanMembers.size === 0) {
                    // Stop the reminder session for this guild
                    sessionManager.stopActiveSession(guildId);

                    // Send a message to the text channel that the session has ended
                    if (textChannel) {
                        const endEmbed = EmbedBuilder.createSessionEndEmbed(
                            "Water reminder session ended - no humans left in the voice channel."
                        );
                        textChannel.send({ embeds: [endEmbed] });
                    }
                }
            }
        }

        // Check pending sessions to see if any voice channels became empty
        for (const [guildId, pendingSession] of sessionManager.getAllPendingSessions()) {
            const { voiceChannel, textChannel, message } = pendingSession;

            if (oldState.channelId === voiceChannel.id || newState.channelId === voiceChannel.id) {
                const humanMembers = voiceChannel.members.filter(member => !member.user.bot);

                if (humanMembers.size === 0) {
                    // Cancel the pending session
                    sessionManager.removePendingSession(guildId);

                    // Delete the pending message if it exists
                    if (message) {
                        message.delete()
                            .then(() => {
                                console.log('Deleted pending session message due to empty voice channel');
                            })
                            .catch(error => {
                                console.log('Could not delete pending session message:', error.message);
                            });
                    }

                    if (textChannel) {
                        const cancelEmbed = EmbedBuilder.createSessionEndEmbed(
                            "Water reminder session cancelled - no humans left in the voice channel."
                        );
                        textChannel.send({ embeds: [cancelEmbed] });
                    }
                }
            }
        }
    }
};
