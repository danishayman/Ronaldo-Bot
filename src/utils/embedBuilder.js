const { COLORS, MEDIA } = require('../config');

class EmbedBuilder {
    static createSuccessEmbed(title, description, options = {}) {
        return {
            color: COLORS.SUCCESS,
            title,
            description,
            thumbnail: { url: options.thumbnail || MEDIA.RONALDO_CELEBRATION },
            footer: { text: options.footer || "Stay hydrated, stay legendary! 🏆" },
            timestamp: new Date().toISOString(),
            ...options.extra
        };
    }

    static createErrorEmbed(title, description, options = {}) {
        return {
            color: COLORS.ERROR,
            title,
            description,
            thumbnail: { url: options.thumbnail || MEDIA.RONALDO_STOP },
            footer: { text: options.footer || "Remember to stay hydrated! 💧" },
            ...options.extra
        };
    }

    static createWarningEmbed(title, description, options = {}) {
        return {
            color: COLORS.WARNING,
            title,
            description,
            thumbnail: { url: options.thumbnail || MEDIA.RONALDO_CONFUSED },
            ...options.extra
        };
    }

    static createInfoEmbed(title, description, options = {}) {
        return {
            color: COLORS.INFO,
            title,
            description,
            thumbnail: { url: options.thumbnail || MEDIA.RONALDO_CELEBRATION },
            ...options.extra
        };
    }

    static createReminderEmbed(participants) {
        return {
            color: COLORS.INFO,
            title: "💧 HYDRATION TIME! 🥤",
            description: `**${participants}**\n\n🌊 **DRINK WATER NOW!** 🌊\n\n*"Water is the driving force of all nature." - Leonardo da Vinci*`,
            image: { url: MEDIA.RONALDO_DRINKING },
            footer: { text: "Ronaldo Bot • Stay hydrated! 💪" },
            timestamp: new Date().toISOString()
        };
    }

    static createSessionStartEmbed(intervalMinutes, participants) {
        return {
            color: COLORS.PRIMARY,
            title: "💧 Water Reminder Session Started! 🥤",
            description: `**SIUUUU!** Time to stay hydrated like a champion!\n\n⏰ **Interval:** Every ${intervalMinutes} minutes\n👥 **Participants:** ${participants}`,
            thumbnail: { url: MEDIA.RONALDO_CELEBRATION },
            footer: { text: "Stay hydrated, stay legendary! 🏆" },
            timestamp: new Date().toISOString()
        };
    }

    static createSessionEndEmbed(reason = "Session ended") {
        return {
            color: COLORS.ERROR,
            title: "🛑 Session Ended",
            description: reason,
            thumbnail: { url: MEDIA.SAD_GOODBYE }
        };
    }

    static createJoinEmbed(userId) {
        return {
            color: COLORS.SUCCESS,
            title: "🎉 Successfully Joined! 🥤",
            description: `**SIUUUU!** <@${userId}> has joined the hydration session!\n\nYou will now receive water reminders with the group. Stay legendary! 🏆`,
            thumbnail: { url: MEDIA.RONALDO_CELEBRATION },
            footer: { text: "Welcome to the hydration squad! 💧" },
            timestamp: new Date().toISOString()
        };
    }

    static createLeaveEmbed(userId) {
        return {
            color: COLORS.NEUTRAL,
            title: "👋 Successfully Left! 🥤",
            description: `**Goodbye!** <@${userId}> has left the hydration session.\n\nYou will no longer receive water reminders. Remember to stay hydrated on your own! 💧`,
            thumbnail: { url: MEDIA.RONALDO_STOP },
            footer: { text: "Take care and stay hydrated! 🏆" },
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = EmbedBuilder;
