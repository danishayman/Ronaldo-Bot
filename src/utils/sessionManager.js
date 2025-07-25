const { COLORS, MEDIA } = require('../config');
const waterReminders = require('../data/waterReminders.json');

class SessionManager {
    constructor() {
        // Store active sessions per guild (server)
        this.activeSessions = new Map(); // guildId -> { interval, voiceChannel, textChannel, participants }
        this.pendingSessions = new Map(); // guildId -> { message, voiceChannel, textChannel, interval }
    }

    // Get active session for a guild
    getActiveSession(guildId) {
        return this.activeSessions.get(guildId);
    }

    // Get pending session for a guild
    getPendingSession(guildId) {
        return this.pendingSessions.get(guildId);
    }

    // Check if guild has any session (active or pending)
    hasSession(guildId) {
        return this.activeSessions.has(guildId) || this.pendingSessions.has(guildId);
    }

    // Create a pending session
    createPendingSession(guildId, sessionData) {
        this.pendingSessions.set(guildId, sessionData);
    }

    // Remove pending session
    removePendingSession(guildId) {
        return this.pendingSessions.delete(guildId);
    }

    // Start an active session
    startActiveSession(guildId, voiceChannel, textChannel, intervalMinutes, participants, pendingMessage = null) {
        const participantsList = Array.from(participants)
            .map(userId => `<@${userId}>`)
            .join(" ");

        const startEmbed = {
            color: COLORS.SUCCESS,
            title: "🚀 Water Reminder Session Started! 🥤",
            description: `**SIUUUU!** Time to stay hydrated like a champion!\n\n⏰ **Interval:** Every ${intervalMinutes} minutes\n👥 **Participants:** ${participantsList}`,
            thumbnail: {
                url: MEDIA.RONALDO_CELEBRATION
            },
            footer: {
                text: "Stay hydrated, stay legendary! 🏆"
            },
            timestamp: new Date().toISOString()
        };

        // Delete the pending session message if provided
        if (pendingMessage) {
            pendingMessage.delete()
                .then(() => {
                    console.log('Deleted pending session message');
                })
                .catch(error => {
                    console.log('Could not delete pending session message:', error.message);
                });
        }

        textChannel.send({ embeds: [startEmbed] });

        const reminderInterval = setInterval(() => {
            this._sendReminder(voiceChannel, textChannel, participants, intervalMinutes, guildId);
        }, intervalMinutes * 60 * 1000);

        // Store the session data for this guild
        this.activeSessions.set(guildId, {
            interval: reminderInterval,
            voiceChannel: voiceChannel,
            textChannel: textChannel,
            participants: participants,
            lastReminderMessageId: null // Track the last reminder message for auto-deletion
        });
    }

    // Stop an active session
    stopActiveSession(guildId) {
        const session = this.activeSessions.get(guildId);
        if (session) {
            clearInterval(session.interval);
            
            // Delete the last reminder message when stopping the session
            if (session.lastReminderMessageId && session.textChannel) {
                this._deleteLastReminder(guildId, session.textChannel);
            }
            
            this.activeSessions.delete(guildId);
            return true;
        }
        return false;
    }

    // Add participant to active session
    addParticipant(guildId, userId) {
        const session = this.activeSessions.get(guildId);
        if (session) {
            session.participants.add(userId);
            return true;
        }
        return false;
    }

    // Remove participant from active session
    removeParticipant(guildId, userId) {
        const session = this.activeSessions.get(guildId);
        if (session) {
            session.participants.delete(userId);
            return session.participants.size;
        }
        return -1;
    }

    // Check if user is participant in active session
    isParticipant(guildId, userId) {
        const session = this.activeSessions.get(guildId);
        return session ? session.participants.has(userId) : false;
    }

    // Get a random water reminder message and GIF
    _getRandomReminder() {
        const randomIndex = Math.floor(Math.random() * waterReminders.messages.length);
        return waterReminders.messages[randomIndex];
    }

    // Private method to delete the last reminder message
    _deleteLastReminder(guildId, textChannel) {
        const session = this.activeSessions.get(guildId);
        if (session && session.lastReminderMessageId) {
            textChannel.messages.fetch(session.lastReminderMessageId)
                .then(message => {
                    message.delete()
                        .then(() => {
                            console.log(`Deleted old reminder message: ${session.lastReminderMessageId}`);
                        })
                        .catch(error => {
                            // Message might already be deleted or bot lacks permissions
                            console.log(`Could not delete old reminder message: ${error.message}`);
                        });
                })
                .catch(error => {
                    // Message not found (might have been manually deleted)
                    console.log(`Old reminder message not found: ${error.message}`);
                });
            
            // Clear the stored message ID since we attempted to delete it
            session.lastReminderMessageId = null;
        }
    }

    // Private method to send reminder
    _sendReminder(voiceChannel, textChannel, participants, intervalMinutes, guildId) {
        // Get current human members in the voice channel
        const currentHumanMembers = voiceChannel.members.filter(member => !member.user.bot);
        
        if (currentHumanMembers.size > 0) {
            // Only mention participants who are still in the voice channel
            const activeParticipants = Array.from(participants).filter(userId => {
                return currentHumanMembers.has(userId);
            });
            
            if (activeParticipants.length > 0) {
                // Delete the previous reminder message if it exists
                this._deleteLastReminder(guildId, textChannel);
                
                const activeMentions = activeParticipants
                    .map(userId => `<@${userId}>`)
                    .join(" ");
                
                // Get a random reminder message and GIF
                const randomReminder = this._getRandomReminder();
                
                // Send as plain text message instead of embed
                const reminderMessage = `💧 **HYDRATION REMINDER!** 💧

${activeMentions}

${randomReminder.text}

${randomReminder.gif}

⏰ Next reminder in ${intervalMinutes} minute${intervalMinutes !== 1 ? 's' : ''} • Today at ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
                
                // Send the new reminder and store its message ID
                textChannel.send(reminderMessage)
                    .then(sentMessage => {
                        // Store the message ID for future deletion
                        const session = this.activeSessions.get(guildId);
                        if (session) {
                            session.lastReminderMessageId = sentMessage.id;
                        }
                    })
                    .catch(error => {
                        console.error('Error sending reminder message:', error);
                    });
            }
        } else {
            // Stop the session if no humans are left in voice channel
            this.stopActiveSession(guildId);
            
            const endEmbed = {
                color: COLORS.ERROR,
                title: "🛑 Session Ended",
                description: "Water reminder session ended - no humans left in the voice channel.",
                thumbnail: {
                    url: MEDIA.SAD_GOODBYE
                }
            };
            
            textChannel.send({ embeds: [endEmbed] });
        }
    }

    // Get all active sessions (for iteration)
    getAllActiveSessions() {
        return this.activeSessions.entries();
    }

    // Get all pending sessions (for iteration)
    getAllPendingSessions() {
        return this.pendingSessions.entries();
    }
}

module.exports = SessionManager;
