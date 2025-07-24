require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

// Store active sessions per guild (server)
const activeSessions = new Map(); // guildId -> { interval, voiceChannel, textChannel }

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("voiceStateUpdate", (oldState, newState) => {
    // Check all active sessions to see if any voice channels became empty
    for (const [guildId, session] of activeSessions.entries()) {
        const { interval, voiceChannel, textChannel } = session;
        
        // Check if the voice state change affects our monitored voice channel
        if (oldState.channelId === voiceChannel.id || newState.channelId === voiceChannel.id) {
            // Count only human members (exclude bots)
            const humanMembers = voiceChannel.members.filter(member => !member.user.bot);
            
            // Check if no humans are left in the voice channel
            if (humanMembers.size === 0) {
                // Stop the reminder session for this guild
                clearInterval(interval);
                activeSessions.delete(guildId);
                
                // Send a message to the text channel that the session has ended
                if (textChannel) {
                    textChannel.send("🛑 Water reminder session ended - no humans left in the voice channel.");
                }
            }
        }
    }
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "ronaldo") {
        const sub = interaction.options.getSubcommand();

        if (sub === "start") {
            const intervalMinutes = interaction.options.getInteger("interval");
            const guildId = interaction.guild.id;

            // Validate interval range to prevent spam
            const minInterval = 20; // 20 minutes
            const maxInterval = 180; // 180 minutes (3 hours)

            if (intervalMinutes < minInterval || intervalMinutes > maxInterval) {
                await interaction.reply({
                    content: `❌ Interval must be between ${minInterval} and ${maxInterval} minutes.`,
                    ephemeral: true,
                });
                return;
            }

            // Check if there's already an active session in this server
            if (activeSessions.has(guildId)) {
                await interaction.reply({
                    content: "❌ There's already an active water reminder session in this server. Use `/ronaldo stop` to end it first.",
                    ephemeral: true,
                });
                return;
            }

            const voiceChannel = interaction.member.voice.channel;
            if (!voiceChannel) {
                await interaction.reply({
                    content: "❌ You must be in a voice channel to start.",
                    ephemeral: true,
                });
                return;
            }

            const members = [...voiceChannel.members.values()].filter(member => !member.user.bot);
            const memberMentions = members
                .map((member) => `<@${member.id}>`)
                .join(" ");

            await interaction.reply(
                `💧 Starting water reminders every ${intervalMinutes} minutes for: ${memberMentions}`
            );

            const reminderInterval = setInterval(() => {
                // Get current human members in the voice channel
                const currentHumanMembers = voiceChannel.members.filter(member => !member.user.bot);
                
                if (currentHumanMembers.size > 0) {
                    // Create current member mentions
                    const currentMemberMentions = currentHumanMembers
                        .map((member) => `<@${member.id}>`)
                        .join(" ");
                    interaction.channel.send(`💧 ${currentMemberMentions} — DRINK WATER! 🥤`);
                } else {
                    // Stop the session if no humans are left in voice channel
                    clearInterval(reminderInterval);
                    activeSessions.delete(guildId);
                    interaction.channel.send("🛑 Water reminder session ended - no humans left in the voice channel.");
                }
            }, intervalMinutes * 60 * 1000);

            // Store the session data for this guild
            activeSessions.set(guildId, {
                interval: reminderInterval,
                voiceChannel: voiceChannel,
                textChannel: interaction.channel
            });
        }

        if (sub === "stop") {
            const guildId = interaction.guild.id;
            const session = activeSessions.get(guildId);
            
            if (session) {
                clearInterval(session.interval);
                activeSessions.delete(guildId);
                await interaction.reply("🛑 Stopped water reminder session.");
            } else {
                await interaction.reply("❌ No active reminder session in this server.");
            }
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
