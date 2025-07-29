const EmbedBuilder = require('../utils/embedBuilder');
const { MessageFlags } = require('discord.js');

module.exports = {
    name: 'join',
    async execute(interaction, sessionManager) {
        const guildId = interaction.guild.id;
        const session = sessionManager.getActiveSession(guildId);

        // Check if there's an active session
        if (!session) {
            const noSessionEmbed = EmbedBuilder.createWarningEmbed(
                "❌ No Active Session",
                "No active water reminder session found in this server. Use `/ronaldo start` to create one!"
            );

            await interaction.reply({ embeds: [noSessionEmbed], flags: MessageFlags.Ephemeral });
            return;
        }

        // Check if user is in a voice channel
        const userVoiceChannel = interaction.member.voice.channel;
        if (!userVoiceChannel) {
            await interaction.reply({
                content: "❌ You must be in a voice channel to join the session.",
                flags: MessageFlags.Ephemeral,
            });
            return;
        }

        // Check if user is in the same voice channel as the session
        if (userVoiceChannel.id !== session.voiceChannel.id) {
            await interaction.reply({
                content: `❌ You must be in the same voice channel as the active session: ${session.voiceChannel.name}`,
                flags: MessageFlags.Ephemeral,
            });
            return;
        }

        // Check if user is already a participant
        if (sessionManager.isParticipant(guildId, interaction.user.id)) {
            await interaction.reply({
                content: "✅ You're already participating in this water reminder session!",
                flags: MessageFlags.Ephemeral,
            });
            return;
        }

        // Add user to participants
        sessionManager.addParticipant(guildId, interaction.user.id);

        // Send success message
        const joinEmbed = EmbedBuilder.createJoinEmbed(interaction.user.id);
        await interaction.reply({ embeds: [joinEmbed] });

        // Notify the session channel about the new participant
        if (session.textChannel && session.textChannel.id !== interaction.channel.id) {
            const notifyEmbed = EmbedBuilder.createInfoEmbed(
                "👋 New Participant Joined!",
                `<@${interaction.user.id}> has joined the water reminder session!`,
                { footer: "The hydration squad grows stronger! 💪" }
            );

            session.textChannel.send({ embeds: [notifyEmbed] });
        }
    }
};
