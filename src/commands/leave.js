const EmbedBuilder = require('../utils/embedBuilder');

module.exports = {
    name: 'leave',
    async execute(interaction, sessionManager) {
        const guildId = interaction.guild.id;
        const session = sessionManager.getActiveSession(guildId);
        
        // Check if there's an active session
        if (!session) {
            const noSessionEmbed = EmbedBuilder.createWarningEmbed(
                "❌ No Active Session",
                "No active water reminder session found in this server."
            );
            
            await interaction.reply({ embeds: [noSessionEmbed], ephemeral: true });
            return;
        }

        // Check if user is currently a participant
        if (!sessionManager.isParticipant(guildId, interaction.user.id)) {
            await interaction.reply({
                content: "❌ You're not currently participating in any water reminder session!",
                ephemeral: true,
            });
            return;
        }

        // Remove user from participants
        const remainingParticipants = sessionManager.removeParticipant(guildId, interaction.user.id);

        // Check if there are any participants left
        if (remainingParticipants === 0) {
            // No participants left, end the session
            sessionManager.stopActiveSession(guildId);
            
            const sessionEndedEmbed = EmbedBuilder.createSessionEndEmbed("Water reminder session ended - no participants remaining.");
            await interaction.reply({ embeds: [sessionEndedEmbed] });

            // Notify the session channel if different
            if (session.textChannel && session.textChannel.id !== interaction.channel.id) {
                session.textChannel.send({ embeds: [sessionEndedEmbed] });
            }
        } else {
            // Participants remain, just confirm the leave
            const leaveEmbed = EmbedBuilder.createLeaveEmbed(interaction.user.id);
            await interaction.reply({ embeds: [leaveEmbed] });

            // Notify the session channel about the participant leaving
            if (session.textChannel && session.textChannel.id !== interaction.channel.id) {
                const notifyEmbed = EmbedBuilder.createInfoEmbed(
                    "👋 Participant Left",
                    `<@${interaction.user.id}> has left the water reminder session.`,
                    { 
                        footer: `${remainingParticipants} participant(s) remaining`,
                        thumbnail: require('../config').MEDIA.RONALDO_STOP
                    }
                );
                
                session.textChannel.send({ embeds: [notifyEmbed] });
            }
        }
    }
};
