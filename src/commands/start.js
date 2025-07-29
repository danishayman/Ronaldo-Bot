const { MIN_INTERVAL, MAX_INTERVAL } = require('../config');
const EmbedBuilder = require('../utils/embedBuilder');
const { MessageFlags } = require('discord.js');

module.exports = {
    name: 'start',
    async execute(interaction, sessionManager) {
        const intervalMinutes = interaction.options.getInteger("interval");
        const guildId = interaction.guild.id;

        // Validate interval range to prevent spam
        if (intervalMinutes < MIN_INTERVAL || intervalMinutes > MAX_INTERVAL) {
            await interaction.reply({
                content: `❌ Interval must be between ${MIN_INTERVAL} and ${MAX_INTERVAL} minutes.`,
                flags: MessageFlags.Ephemeral,
            });
            return;
        }

        // Check if there's already an active session or pending session in this server
        if (sessionManager.hasSession(guildId)) {
            await interaction.reply({
                content: "❌ There's already an active or pending water reminder session in this server. Use `/ronaldo stop` to end it first.",
                flags: MessageFlags.Ephemeral,
            });
            return;
        }

        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            await interaction.reply({
                content: "❌ You must be in a voice channel to start.",
                flags: MessageFlags.Ephemeral,
            });
            return;
        }

        // Check if there are other people in the voice channel besides the initiator
        const members = [...voiceChannel.members.values()].filter(member => !member.user.bot);
        const otherMembers = members.filter(member => member.id !== interaction.user.id);

        if (otherMembers.length === 0) {
            // If only the initiator is in the channel, start immediately
            const participants = new Set([interaction.user.id]);
            const participantsList = `<@${interaction.user.id}>`;

            const startEmbed = EmbedBuilder.createSessionStartEmbed(intervalMinutes, participantsList);
            await interaction.reply({ embeds: [startEmbed] });

            // Start the reminder session immediately with only the initiator
            sessionManager.startActiveSession(guildId, voiceChannel, interaction.channel, intervalMinutes, participants);
        } else {
            // If there are other people, start the opt-in process
            const otherMemberMentions = otherMembers
                .map(member => `<@${member.id}>`)
                .join(" ");

            const initialMessage = `💧 **Water Reminder - Waiting for Participants!** 🥤

**SIUUUU!** ${otherMemberMentions} React with ✅ to join the hydration session!

⏰ **Interval:** Every ${intervalMinutes} minutes
👥 **Current Participants:** <@${interaction.user.id}>

React with ✅ to join • Session starts in 30 seconds`;

            const message = await interaction.reply({ content: initialMessage, fetchReply: true });
            await message.react("✅");

            // Store the pending session
            const participants = new Set([interaction.user.id]); // Initiator is automatically included
            sessionManager.createPendingSession(guildId, {
                message: message,
                voiceChannel: voiceChannel,
                textChannel: interaction.channel,
                intervalMinutes: intervalMinutes,
                participants: participants
            });

            // Start the session after 30 seconds
            setTimeout(() => {
                const pendingSession = sessionManager.getPendingSession(guildId);
                if (pendingSession) {
                    sessionManager.removePendingSession(guildId);

                    // Check if there are still people in the voice channel
                    const currentHumanMembers = voiceChannel.members.filter(member => !member.user.bot);
                    if (currentHumanMembers.size > 0) {
                        // Pass the pending message to be deleted when starting the active session
                        sessionManager.startActiveSession(guildId, voiceChannel, interaction.channel, intervalMinutes, pendingSession.participants, pendingSession.message);
                    } else {
                        // Delete the pending message before sending cancellation
                        pendingSession.message.delete()
                            .then(() => {
                                const cancelEmbed = EmbedBuilder.createSessionEndEmbed("Water reminder session cancelled - no humans left in the voice channel.");
                                interaction.channel.send({ embeds: [cancelEmbed] });
                            })
                            .catch(error => {
                                console.log('Could not delete pending message:', error.message);
                                const cancelEmbed = EmbedBuilder.createSessionEndEmbed("Water reminder session cancelled - no humans left in the voice channel.");
                                interaction.channel.send({ embeds: [cancelEmbed] });
                            });
                    }
                }
            }, 30000); // 30 seconds
        }
    }
};
