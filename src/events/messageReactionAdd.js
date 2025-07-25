module.exports = {
    name: 'messageReactionAdd',
    async execute(sessionManager, reaction, user) {
        // When a reaction is received, check if it's partial and fetch if necessary
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.log('Something went wrong when fetching the message: ', error);
                return;
            }
        }

        // Check if the reaction is on a pending session message
        for (const [guildId, pendingSession] of sessionManager.getAllPendingSessions()) {
            if (pendingSession.message && pendingSession.message.id === reaction.message.id) {
                if (reaction.emoji.name === "✅" && !user.bot) {
                    // Check if user is still in the voice channel
                    const voiceChannel = pendingSession.voiceChannel;
                    const member = voiceChannel.guild.members.cache.get(user.id);
                    
                    if (member && member.voice.channel && member.voice.channel.id === voiceChannel.id) {
                        // Add user to participants if not already added
                        if (!pendingSession.participants) {
                            pendingSession.participants = new Set();
                        }
                        
                        if (!pendingSession.participants.has(user.id)) {
                            pendingSession.participants.add(user.id);
                            
                            // Update the message to show current participants
                            const participantsList = Array.from(pendingSession.participants)
                                .map(userId => `<@${userId}>`)
                                .join(" ");
                            
                            const updatedMessage = `💧 **Water Reminder - Waiting for Participants!** 🥤

**SIUUUU!** React with ✅ to join the hydration session!

⏰ **Interval:** Every ${pendingSession.intervalMinutes} minutes
👥 **Current Participants:** ${participantsList}

React with ✅ to join • Session starts in 30 seconds`;
                            
                            try {
                                await pendingSession.message.edit({ content: updatedMessage });
                                console.log(`Added user ${user.tag} to pending session in guild ${guildId}`);
                            } catch (error) {
                                console.log('Error updating message: ', error);
                            }
                        }
                    }
                }
                break;
            }
        }
    }
};
