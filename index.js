require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

let reminderInterval = null;

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
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

            const members = [...voiceChannel.members.values()];
            const memberMentions = members
                .map((member) => `<@${member.id}>`)
                .join(" ");

            await interaction.reply(
                `💧 Starting water reminders every ${intervalMinutes} minutes for: ${memberMentions}`
            );

            reminderInterval = setInterval(() => {
                interaction.channel.send(`💧 ${memberMentions} — DRINK WATER! 🥤`);
            }, intervalMinutes * 60 * 1000);
        }

        if (sub === "stop") {
            if (reminderInterval) {
                clearInterval(reminderInterval);
                reminderInterval = null;
                await interaction.reply("🛑 Stopped water reminder session.");
            } else {
                await interaction.reply("❌ No active reminder session.");
            }
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
