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
                    const endEmbed = {
                        color: 0xFF6B6B, // Red
                        title: "🛑 Session Ended",
                        description: "Water reminder session ended - no humans left in the voice channel.",
                        thumbnail: {
                            url: "https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif" // Sad goodbye GIF
                        }
                    };
                    textChannel.send({ embeds: [endEmbed] });
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

            const startEmbed = {
                color: 0x00BFFF, // Deep Sky Blue
                title: "💧 Water Reminder Session Started! 🥤",
                description: `**SIUUUU!** Time to stay hydrated like a champion!\n\n⏰ **Interval:** Every ${intervalMinutes} minutes\n👥 **Participants:** ${memberMentions}`,
                thumbnail: {
                    url: "https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif" // Cristiano Ronaldo drinking water GIF
                },
                footer: {
                    text: "Stay hydrated, stay legendary! 🏆"
                },
                timestamp: new Date().toISOString()
            };

            await interaction.reply({ embeds: [startEmbed] });

            const reminderInterval = setInterval(() => {
                // Get current human members in the voice channel
                const currentHumanMembers = voiceChannel.members.filter(member => !member.user.bot);
                
                if (currentHumanMembers.size > 0) {
                    // Create current member mentions
                    const currentMemberMentions = currentHumanMembers
                        .map((member) => `<@${member.id}>`)
                        .join(" ");
                    
                    const reminderEmbed = {
                        color: 0x1E90FF, // Dodger Blue
                        title: "💧 HYDRATION TIME! 🥤",
                        description: `**${currentMemberMentions}**\n\n🌊 **DRINK WATER NOW!** 🌊\n\n*"Water is the driving force of all nature." - Leonardo da Vinci*`,
                        image: {
                            url: "https://media.giphy.com/media/26BRuo6sLetdllPAQ/giphy.gif" // Water drinking GIF
                        },
                        footer: {
                            text: "Ronaldo Bot • Stay hydrated! 💪"
                        },
                        timestamp: new Date().toISOString()
                    };
                    
                    interaction.channel.send({ embeds: [reminderEmbed] });
                } else {
                    // Stop the session if no humans are left in voice channel
                    clearInterval(reminderInterval);
                    activeSessions.delete(guildId);
                    
                    const endEmbed = {
                        color: 0xFF6B6B, // Red
                        title: "🛑 Session Ended",
                        description: "Water reminder session ended - no humans left in the voice channel.",
                        thumbnail: {
                            url: "https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif" // Sad goodbye GIF
                        }
                    };
                    
                    interaction.channel.send({ embeds: [endEmbed] });
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
                
                const stopEmbed = {
                    color: 0xFF6B6B, // Red
                    title: "🛑 Water Reminder Stopped",
                    description: "The water reminder session has been manually stopped.",
                    thumbnail: {
                        url: "https://media.giphy.com/media/l1J9EdzfOSgfyueLm/giphy.gif" // Stop hand GIF
                    },
                    footer: {
                        text: "Remember to stay hydrated! 💧"
                    }
                };
                
                await interaction.reply({ embeds: [stopEmbed] });
            } else {
                const noSessionEmbed = {
                    color: 0xFFB347, // Orange
                    title: "❌ No Active Session",
                    description: "No active reminder session found in this server.",
                    thumbnail: {
                        url: "https://media.giphy.com/media/26AHPxxnSw1L9T1rW/giphy.gif" // Confused GIF
                    }
                };
                
                await interaction.reply({ embeds: [noSessionEmbed] });
            }
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
