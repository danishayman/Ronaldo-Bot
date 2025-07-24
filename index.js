require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

let reminderInterval = null;
let activeVoiceChannel = null;
let activeTextChannel = null;

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("voiceStateUpdate", (oldState, newState) => {
    // Only monitor if there's an active reminder session
    if (!reminderInterval || !activeVoiceChannel) return;

    // Check if someone left the monitored voice channel
    if (oldState.channelId === activeVoiceChannel.id && newState.channelId !== activeVoiceChannel.id) {
        // Check if the voice channel is now empty
        if (activeVoiceChannel.members.size === 0) {
            // Stop the reminder session
            clearInterval(reminderInterval);
            reminderInterval = null;
            
            // Send a message to the text channel that the session has ended
            if (activeTextChannel) {
                activeTextChannel.send("🛑 Water reminder session ended - everyone left the voice channel.");
            }
            
            // Reset tracking variables
            activeVoiceChannel = null;
            activeTextChannel = null;
        }
    }
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "ronaldo") {
        const sub = interaction.options.getSubcommand();

        if (sub === "start") {
            const intervalMinutes = interaction.options.getInteger("interval");

            const voiceChannel = interaction.member.voice.channel;
            if (!voiceChannel) {
                await interaction.reply({
                    content: "❌ You must be in a voice channel to start.",
                    ephemeral: true,
                });
                return;
            }

            // Stop any existing session before starting a new one
            if (reminderInterval) {
                clearInterval(reminderInterval);
                reminderInterval = null;
            }

            const members = [...voiceChannel.members.values()];
            const memberMentions = members
                .map((member) => `<@${member.id}>`)
                .join(" ");

            // Store the voice channel and text channel for monitoring
            activeVoiceChannel = voiceChannel;
            activeTextChannel = interaction.channel;

            await interaction.reply(
                `💧 Starting water reminders every ${intervalMinutes} minutes for: ${memberMentions}`
            );

            reminderInterval = setInterval(() => {
                // Check if the voice channel still exists and has members before sending reminder
                if (activeVoiceChannel && activeVoiceChannel.members.size > 0) {
                    interaction.channel.send(`💧 ${memberMentions} — DRINK WATER! 🥤`);
                } else {
                    // Stop the session if voice channel is empty or doesn't exist
                    clearInterval(reminderInterval);
                    reminderInterval = null;
                    activeVoiceChannel = null;
                    activeTextChannel = null;
                }
            }, intervalMinutes * 60 * 1000);
        }

        if (sub === "stop") {
            if (reminderInterval) {
                clearInterval(reminderInterval);
                reminderInterval = null;
                activeVoiceChannel = null;
                activeTextChannel = null;
                await interaction.reply("🛑 Stopped water reminder session.");
            } else {
                await interaction.reply("❌ No active reminder session.");
            }
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
