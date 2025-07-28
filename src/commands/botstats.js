const { MessageFlags } = require('discord.js');

module.exports = {
    name: 'botstats',
    async execute(interaction, sessionManager, client) {
        try {
            // Calculate uptime in human-readable format
            const uptime = client.uptime;
            const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
            const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((uptime % (1000 * 60)) / 1000);

            let uptimeString = '';
            if (days > 0) uptimeString += `${days} day${days !== 1 ? 's' : ''}, `;
            if (hours > 0) uptimeString += `${hours} hour${hours !== 1 ? 's' : ''}, `;
            if (minutes > 0) uptimeString += `${minutes} minute${minutes !== 1 ? 's' : ''}, `;
            uptimeString += `${seconds} second${seconds !== 1 ? 's' : ''}`;

            // Get bot statistics
            const serverCount = client.guilds.cache.size;
            const userCount = client.users.cache.size;

            // Create formatted response
            const statsMessage = `## 🤖 **Ronaldo Bot Statistics**

**📊 Server Information:**
- **Servers:** ${serverCount.toLocaleString()}
- **Total Users:** ${userCount.toLocaleString()}

**⏱️ Uptime:**
- **Current Uptime:** ${uptimeString}

**🔧 Bot Information:**
- **Status:** Online and Ready
- **Discord.js Version:** v14
- **Node.js Version:** ${process.version}`;

            await interaction.reply({
                content: statsMessage,
                flags: MessageFlags.Ephemeral
            });

        } catch (error) {
            console.error('Error executing botstats command:', error);
            await interaction.reply({
                content: '❌ An error occurred while fetching bot statistics. Please try again.',
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
