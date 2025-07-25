const EmbedBuilder = require('../utils/embedBuilder');
const { MessageFlags } = require('discord.js');

module.exports = {
    name: 'stop',
    async execute(interaction, sessionManager) {
        const guildId = interaction.guild.id;
        const userId = interaction.user.id;
        const session = sessionManager.getActiveSession(guildId);
        const pendingSession = sessionManager.getPendingSession(guildId);
        
        if (session) {
            // Check if the user is a participant in the active session
            if (!sessionManager.isParticipant(guildId, userId)) {
                const notParticipantEmbed = EmbedBuilder.createErrorEmbed(
                    "🚫 Access Denied",
                    "Only participants who have joined the water reminder session can stop it. Use `/ronaldo join` to join the session first!"
                );
                
                await interaction.reply({ embeds: [notParticipantEmbed], flags: MessageFlags.Ephemeral });
                return;
            }
            
            sessionManager.stopActiveSession(guildId);
            
            const stopEmbed = EmbedBuilder.createErrorEmbed(
                "🛑 Water Reminder Stopped",
                `The water reminder session has been manually stopped by <@${userId}>.`
            );
            
            await interaction.reply({ embeds: [stopEmbed] });
        } else if (pendingSession) {
            // Check if the user is a participant in the pending session
            if (!pendingSession.participants || !pendingSession.participants.has(userId)) {
                const notParticipantEmbed = EmbedBuilder.createErrorEmbed(
                    "🚫 Access Denied",
                    "Only participants who have joined the water reminder session can stop it. React with ✅ on the session message or use `/ronaldo join` to join first!"
                );
                
                await interaction.reply({ embeds: [notParticipantEmbed], flags: MessageFlags.Ephemeral });
                return;
            }
            
            sessionManager.removePendingSession(guildId);
            
            const stopEmbed = EmbedBuilder.createErrorEmbed(
                "🛑 Water Reminder Cancelled",
                `The pending water reminder session has been cancelled by <@${userId}>.`
            );
            
            await interaction.reply({ embeds: [stopEmbed] });
        } else {
            const noSessionEmbed = EmbedBuilder.createWarningEmbed(
                "❌ No Active Session",
                "No active or pending reminder session found in this server."
            );
            
            await interaction.reply({ embeds: [noSessionEmbed] });
        }
    }
};
