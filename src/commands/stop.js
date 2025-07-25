const EmbedBuilder = require('../utils/embedBuilder');

module.exports = {
    name: 'stop',
    async execute(interaction, sessionManager) {
        const guildId = interaction.guild.id;
        const session = sessionManager.getActiveSession(guildId);
        const pendingSession = sessionManager.getPendingSession(guildId);
        
        if (session) {
            sessionManager.stopActiveSession(guildId);
            
            const stopEmbed = EmbedBuilder.createErrorEmbed(
                "🛑 Water Reminder Stopped",
                "The water reminder session has been manually stopped."
            );
            
            await interaction.reply({ embeds: [stopEmbed] });
        } else if (pendingSession) {
            sessionManager.removePendingSession(guildId);
            
            const stopEmbed = EmbedBuilder.createErrorEmbed(
                "🛑 Water Reminder Cancelled",
                "The pending water reminder session has been cancelled."
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
