require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

// Store active sessions per guild (server)
const activeSessions = new Map(); // guildId -> { interval, voiceChannel, textChannel, participants }
const pendingSessions = new Map(); // guildId -> { message, voiceChannel, textChannel, interval }

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("voiceStateUpdate", (oldState, newState) => {
    // Check all active sessions to see if any voice channels became empty
    for (const [guildId, session] of activeSessions.entries()) {
        const { interval, voiceChannel, textChannel, participants } = session;
        
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
                            url: "https://i.giphy.com/31dFkd4JqFTV8NPDac.webp" // Sad goodbye GIF
                        }
                    };
                    textChannel.send({ embeds: [endEmbed] });
                }
            }
        }
    }
    
    // Check pending sessions to see if any voice channels became empty
    for (const [guildId, pendingSession] of pendingSessions.entries()) {
        const { voiceChannel, textChannel } = pendingSession;
        
        if (oldState.channelId === voiceChannel.id || newState.channelId === voiceChannel.id) {
            const humanMembers = voiceChannel.members.filter(member => !member.user.bot);
            
            if (humanMembers.size === 0) {
                // Cancel the pending session
                pendingSessions.delete(guildId);
                
                if (textChannel) {
                    const cancelEmbed = {
                        color: 0xFF6B6B, // Red
                        title: "🛑 Session Cancelled",
                        description: "Water reminder session cancelled - no humans left in the voice channel.",
                        thumbnail: {
                            url: "https://i.giphy.com/31dFkd4JqFTV8NPDac.webp" // Sad goodbye GIF
                        }
                    };
                    textChannel.send({ embeds: [cancelEmbed] });
                }
            }
        }
    }
});

// Handle reaction collection for opt-in
client.on("messageReactionAdd", async (reaction, user) => {
    // Check if the reaction is on a pending session message
    for (const [guildId, pendingSession] of pendingSessions.entries()) {
        if (pendingSession.message && pendingSession.message.id === reaction.message.id) {
            if (reaction.emoji.name === "✅" && !user.bot) {
                // Check if user is still in the voice channel
                const voiceChannel = pendingSession.voiceChannel;
                const member = voiceChannel.guild.members.cache.get(user.id);
                
                if (member && member.voice.channel && member.voice.channel.id === voiceChannel.id) {
                    // Add user to participants if not already added
                    if (!pendingSession.participants) {
                        pendingSession.participants = new Set();
                    }
                    
                    if (!pendingSession.participants.has(user.id)) {
                        pendingSession.participants.add(user.id);
                        
                        // Update the embed to show current participants
                        const participantsList = Array.from(pendingSession.participants)
                            .map(userId => `<@${userId}>`)
                            .join(" ");
                        
                        const updatedEmbed = {
                            color: 0x00BFFF, // Deep Sky Blue
                            title: "💧 Water Reminder - Waiting for Participants! 🥤",
                            description: `**SIUUUU!** React with ✅ to join the hydration session!\n\n⏰ **Interval:** Every ${pendingSession.intervalMinutes} minutes\n👥 **Current Participants:** ${participantsList || "None yet"}`,
                            thumbnail: {
                                url: "https://media.tenor.com/vm1WwOBQWUMAAAAM/euro2020-cristiano-ronaldo.gif"
                            },
                            footer: {
                                text: "React with ✅ to join • Session starts in 30 seconds"
                            },
                            timestamp: new Date().toISOString()
                        };
                        
                        await pendingSession.message.edit({ embeds: [updatedEmbed] });
                    }
                }
            }
            break;
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
            const minInterval = 1; // 20 minutes
            const maxInterval = 180; // 180 minutes (3 hours)

            if (intervalMinutes < minInterval || intervalMinutes > maxInterval) {
                await interaction.reply({
                    content: `❌ Interval must be between ${minInterval} and ${maxInterval} minutes.`,
                    ephemeral: true,
                });
                return;
            }

            // Check if there's already an active session or pending session in this server
            if (activeSessions.has(guildId) || pendingSessions.has(guildId)) {
                await interaction.reply({
                    content: "❌ There's already an active or pending water reminder session in this server. Use `/ronaldo stop` to end it first.",
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

            // Check if there are other people in the voice channel besides the initiator
            const members = [...voiceChannel.members.values()].filter(member => !member.user.bot);
            const otherMembers = members.filter(member => member.id !== interaction.user.id);
            
            if (otherMembers.length === 0) {
                // If only the initiator is in the channel, start immediately
                const startEmbed = {
                    color: 0x00BFFF, // Deep Sky Blue
                    title: "💧 Water Reminder Session Started! 🥤",
                    description: `**SIUUUU!** Time to stay hydrated like a champion!\n\n⏰ **Interval:** Every ${intervalMinutes} minutes\n👥 **Participants:** <@${interaction.user.id}>`,
                    thumbnail: {
                        url: "https://media.tenor.com/vm1WwOBQWUMAAAAM/euro2020-cristiano-ronaldo.gif"
                    },
                    footer: {
                        text: "Stay hydrated, stay legendary! 🏆"
                    },
                    timestamp: new Date().toISOString()
                };

                await interaction.reply({ embeds: [startEmbed] });
                
                // Start the reminder session immediately with only the initiator
                const participants = new Set([interaction.user.id]);
                startReminderSession(guildId, voiceChannel, interaction.channel, intervalMinutes, participants);
            } else {
                // If there are other people, start the opt-in process
                const otherMemberMentions = otherMembers
                    .map(member => `<@${member.id}>`)
                    .join(" ");
                
                const initialEmbed = {
                    color: 0x00BFFF, // Deep Sky Blue
                    title: "💧 Water Reminder - Waiting for Participants! 🥤",
                    description: `**SIUUUU!** ${otherMemberMentions} React with ✅ to join the hydration session!\n\n⏰ **Interval:** Every ${intervalMinutes} minutes\n👥 **Current Participants:** <@${interaction.user.id}>`,
                    thumbnail: {
                        url: "https://media.tenor.com/vm1WwOBQWUMAAAAM/euro2020-cristiano-ronaldo.gif"
                    },
                    footer: {
                        text: "React with ✅ to join • Session starts in 30 seconds"
                    },
                    timestamp: new Date().toISOString()
                };

                const message = await interaction.reply({ embeds: [initialEmbed], fetchReply: true });
                await message.react("✅");

                // Store the pending session
                const participants = new Set([interaction.user.id]); // Initiator is automatically included
                pendingSessions.set(guildId, {
                    message: message,
                    voiceChannel: voiceChannel,
                    textChannel: interaction.channel,
                    intervalMinutes: intervalMinutes,
                    participants: participants
                });

                // Start the session after 30 seconds
                setTimeout(() => {
                    const pendingSession = pendingSessions.get(guildId);
                    if (pendingSession) {
                        pendingSessions.delete(guildId);
                        
                        // Check if there are still people in the voice channel
                        const currentHumanMembers = voiceChannel.members.filter(member => !member.user.bot);
                        if (currentHumanMembers.size > 0) {
                            startReminderSession(guildId, voiceChannel, interaction.channel, intervalMinutes, pendingSession.participants);
                        } else {
                            const cancelEmbed = {
                                color: 0xFF6B6B, // Red
                                title: "🛑 Session Cancelled",
                                description: "Water reminder session cancelled - no humans left in the voice channel.",
                                thumbnail: {
                                    url: "https://i.giphy.com/31dFkd4JqFTV8NPDac.webp"
                                }
                            };
                            interaction.channel.send({ embeds: [cancelEmbed] });
                        }
                    }
                }, 30000); // 30 seconds
            }
        }

        if (sub === "stop") {
            const guildId = interaction.guild.id;
            const session = activeSessions.get(guildId);
            const pendingSession = pendingSessions.get(guildId);
            
            if (session) {
                clearInterval(session.interval);
                activeSessions.delete(guildId);
                
                const stopEmbed = {
                    color: 0xFF6B6B, // Red
                    title: "🛑 Water Reminder Stopped",
                    description: "The water reminder session has been manually stopped.",
                    thumbnail: {
                        url: "https://i.pinimg.com/originals/28/2f/28/282f28cc7846ad1c08794852f35c787b.gif"
                    },
                    footer: {
                        text: "Remember to stay hydrated! 💧"
                    }
                };
                
                await interaction.reply({ embeds: [stopEmbed] });
            } else if (pendingSession) {
                pendingSessions.delete(guildId);
                
                const stopEmbed = {
                    color: 0xFF6B6B, // Red
                    title: "🛑 Water Reminder Cancelled",
                    description: "The pending water reminder session has been cancelled.",
                    thumbnail: {
                        url: "https://i.pinimg.com/originals/28/2f/28/282f28cc7846ad1c08794852f35c787b.gif"
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
                    description: "No active or pending reminder session found in this server.",
                    thumbnail: {
                        url: "https://i.pinimg.com/originals/b1/61/93/b161939871b60e6aee558048a2b332a2.gif"
                    }
                };
                
                await interaction.reply({ embeds: [noSessionEmbed] });
            }
        }

        if (sub === "join") {
            const guildId = interaction.guild.id;
            const session = activeSessions.get(guildId);
            
            // Check if there's an active session
            if (!session) {
                const noSessionEmbed = {
                    color: 0xFFB347, // Orange
                    title: "❌ No Active Session",
                    description: "No active water reminder session found in this server. Use `/ronaldo start` to create one!",
                    thumbnail: {
                        url: "https://i.pinimg.com/originals/b1/61/93/b161939871b60e6aee558048a2b332a2.gif"
                    }
                };
                
                await interaction.reply({ embeds: [noSessionEmbed], ephemeral: true });
                return;
            }

            // Check if user is in a voice channel
            const userVoiceChannel = interaction.member.voice.channel;
            if (!userVoiceChannel) {
                await interaction.reply({
                    content: "❌ You must be in a voice channel to join the session.",
                    ephemeral: true,
                });
                return;
            }

            // Check if user is in the same voice channel as the session
            if (userVoiceChannel.id !== session.voiceChannel.id) {
                await interaction.reply({
                    content: `❌ You must be in the same voice channel as the active session: ${session.voiceChannel.name}`,
                    ephemeral: true,
                });
                return;
            }

            // Check if user is already a participant
            if (session.participants.has(interaction.user.id)) {
                await interaction.reply({
                    content: "✅ You're already participating in this water reminder session!",
                    ephemeral: true,
                });
                return;
            }

            // Add user to participants
            session.participants.add(interaction.user.id);

            // Send success message
            const joinEmbed = {
                color: 0x00FF00, // Green
                title: "🎉 Successfully Joined! 🥤",
                description: `**SIUUUU!** <@${interaction.user.id}> has joined the hydration session!\n\nYou will now receive water reminders with the group. Stay legendary! 🏆`,
                thumbnail: {
                    url: "https://media.tenor.com/vm1WwOBQWUMAAAAM/euro2020-cristiano-ronaldo.gif"
                },
                footer: {
                    text: "Welcome to the hydration squad! 💧"
                },
                timestamp: new Date().toISOString()
            };

            await interaction.reply({ embeds: [joinEmbed] });

            // Notify the session channel about the new participant
            if (session.textChannel && session.textChannel.id !== interaction.channel.id) {
                const notifyEmbed = {
                    color: 0x32CD32, // Lime Green
                    title: "👋 New Participant Joined!",
                    description: `<@${interaction.user.id}> has joined the water reminder session!`,
                    thumbnail: {
                        url: "https://media.tenor.com/vm1WwOBQWUMAAAAM/euro2020-cristiano-ronaldo.gif"
                    },
                    footer: {
                        text: "The hydration squad grows stronger! 💪"
                    }
                };
                
                session.textChannel.send({ embeds: [notifyEmbed] });
            }
        }

        if (sub === "leave") {
            const guildId = interaction.guild.id;
            const session = activeSessions.get(guildId);
            
            // Check if there's an active session
            if (!session) {
                const noSessionEmbed = {
                    color: 0xFFB347, // Orange
                    title: "❌ No Active Session",
                    description: "No active water reminder session found in this server.",
                    thumbnail: {
                        url: "https://i.pinimg.com/originals/b1/61/93/b161939871b60e6aee558048a2b332a2.gif"
                    }
                };
                
                await interaction.reply({ embeds: [noSessionEmbed], ephemeral: true });
                return;
            }

            // Check if user is currently a participant
            if (!session.participants.has(interaction.user.id)) {
                await interaction.reply({
                    content: "❌ You're not currently participating in any water reminder session!",
                    ephemeral: true,
                });
                return;
            }

            // Remove user from participants
            session.participants.delete(interaction.user.id);

            // Check if there are any participants left
            if (session.participants.size === 0) {
                // No participants left, end the session
                clearInterval(session.interval);
                activeSessions.delete(guildId);
                
                const sessionEndedEmbed = {
                    color: 0xFF6B6B, // Red
                    title: "🛑 Session Ended",
                    description: "Water reminder session ended - no participants remaining.",
                    thumbnail: {
                        url: "https://i.giphy.com/31dFkd4JqFTV8NPDac.webp"
                    },
                    footer: {
                        text: "Thanks for staying hydrated! 💧"
                    }
                };

                await interaction.reply({ embeds: [sessionEndedEmbed] });

                // Notify the session channel if different
                if (session.textChannel && session.textChannel.id !== interaction.channel.id) {
                    session.textChannel.send({ embeds: [sessionEndedEmbed] });
                }
            } else {
                // Participants remain, just confirm the leave
                const leaveEmbed = {
                    color: 0xFFA500, // Orange
                    title: "👋 Successfully Left! 🥤",
                    description: `**Goodbye!** <@${interaction.user.id}> has left the hydration session.\n\nYou will no longer receive water reminders. Remember to stay hydrated on your own! 💧`,
                    thumbnail: {
                        url: "https://i.pinimg.com/originals/28/2f/28/282f28cc7846ad1c08794852f35c787b.gif"
                    },
                    footer: {
                        text: "Take care and stay hydrated! 🏆"
                    },
                    timestamp: new Date().toISOString()
                };

                await interaction.reply({ embeds: [leaveEmbed] });

                // Notify the session channel about the participant leaving
                if (session.textChannel && session.textChannel.id !== interaction.channel.id) {
                    const notifyEmbed = {
                        color: 0xFFA500, // Orange
                        title: "👋 Participant Left",
                        description: `<@${interaction.user.id}> has left the water reminder session.`,
                        thumbnail: {
                            url: "https://i.pinimg.com/originals/28/2f/28/282f28cc7846ad1c08794852f35c787b.gif"
                        },
                        footer: {
                            text: `${session.participants.size} participant(s) remaining`
                        }
                    };
                    
                    session.textChannel.send({ embeds: [notifyEmbed] });
                }
            }
        }
    }
});

// Helper function to start the reminder session
function startReminderSession(guildId, voiceChannel, textChannel, intervalMinutes, participants) {
    const participantsList = Array.from(participants)
        .map(userId => `<@${userId}>`)
        .join(" ");

    const startEmbed = {
        color: 0x00FF00, // Green
        title: "🚀 Water Reminder Session Started! 🥤",
        description: `**SIUUUU!** Time to stay hydrated like a champion!\n\n⏰ **Interval:** Every ${intervalMinutes} minutes\n👥 **Participants:** ${participantsList}`,
        thumbnail: {
            url: "https://media.tenor.com/vm1WwOBQWUMAAAAM/euro2020-cristiano-ronaldo.gif"
        },
        footer: {
            text: "Stay hydrated, stay legendary! 🏆"
        },
        timestamp: new Date().toISOString()
    };

    textChannel.send({ embeds: [startEmbed] });

    const reminderInterval = setInterval(() => {
        // Get current human members in the voice channel
        const currentHumanMembers = voiceChannel.members.filter(member => !member.user.bot);
        
        if (currentHumanMembers.size > 0) {
            // Only mention participants who are still in the voice channel
            const activeParticipants = Array.from(participants).filter(userId => {
                return currentHumanMembers.has(userId);
            });
            
            if (activeParticipants.length > 0) {
                const activeMentions = activeParticipants
                    .map(userId => `<@${userId}>`)
                    .join(" ");
                
                const reminderEmbed = {
                    color: 0x1E90FF, // Dodger Blue
                    title: "💧 HYDRATION TIME! 🥤",
                    description: `**${activeMentions}**\n\n🌊 **DRINK WATER NOW!** 🌊\n\n*"Water is the driving force of all nature." - Leonardo da Vinci*`,
                    image: {
                        url: "https://media.tenor.com/NF6ixwAmrTMAAAAM/cristiano-ronaldo-drinking.gif"
                    },
                    footer: {
                        text: "Ronaldo Bot • Stay hydrated! 💪"
                    },
                    timestamp: new Date().toISOString()
                };
                
                textChannel.send({ embeds: [reminderEmbed] });
            }
        } else {
            // Stop the session if no humans are left in voice channel
            clearInterval(reminderInterval);
            activeSessions.delete(guildId);
            
            const endEmbed = {
                color: 0xFF6B6B, // Red
                title: "🛑 Session Ended",
                description: "Water reminder session ended - no humans left in the voice channel.",
                thumbnail: {
                    url: "https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif"
                }
            };
            
            textChannel.send({ embeds: [endEmbed] });
        }
    }, intervalMinutes * 60 * 1000);

    // Store the session data for this guild
    activeSessions.set(guildId, {
        interval: reminderInterval,
        voiceChannel: voiceChannel,
        textChannel: textChannel,
        participants: participants
    });
}

client.login(process.env.DISCORD_TOKEN);
