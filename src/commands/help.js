const { EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    name: 'help',
    async execute(interaction) {
        const helpEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('🤖 Ronaldo Bot Commands')
            .setDescription('Here are all the available commands for Ronaldo Bot:')
            .addFields(
                {
                    name: '💧 `/ronaldo start interval:<number>`',
                    value: '```\nStarts hydration reminders at specified interval\nInterval must be between 1-60 minutes\n```',
                    inline: false
                },
                {
                    name: '🛑 `/ronaldo stop`',
                    value: '```\nStops active hydration reminders\nEnds the current reminder session\n```',
                    inline: false
                },
                {
                    name: '📊 `/ronaldo botstats`',
                    value: '```\nView bot statistics and uptime information\nShows current bot performance metrics\n```',
                    inline: false
                },
                {
                    name: '🚪 `/ronaldo join`',
                    value: '```\nJoins an active reminder session\nAdds you to the current hydration reminders\n```',
                    inline: false
                },
                {
                    name: '🚶 `/ronaldo leave`',
                    value: '```\nLeaves the current reminder session\nRemoves you from hydration reminders\n```',
                    inline: false
                }
            )
            .setFooter({
                text: 'Stay hydrated! 💧 | Use these commands to manage your water reminders',
                iconURL: null
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [helpEmbed],
            flags: MessageFlags.Ephemeral
        });
    }
};
