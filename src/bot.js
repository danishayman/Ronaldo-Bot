require("dotenv").config();
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const SessionManager = require('./utils/sessionManager');
const CommandHandler = require('./commands/commandHandler');
const EventHandler = require('./events/eventHandler');

class RonaldoBot {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds, 
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMessages
            ],
            partials: [Partials.Message, Partials.Channel, Partials.Reaction]
        });

        this.sessionManager = new SessionManager();
        this.commandHandler = new CommandHandler(this.sessionManager, this.client);
        this.eventHandler = new EventHandler(this.client, this.sessionManager);

        this.setupInteractionHandler();
    }

    setupInteractionHandler() {
        this.client.on("interactionCreate", async (interaction) => {
            await this.commandHandler.handleCommand(interaction);
        });
    }

    async start() {
        try {
            await this.client.login(process.env.DISCORD_TOKEN);
            console.log("Ronaldo Bot started successfully!");
        } catch (error) {
            console.error("Failed to start Ronaldo Bot:", error);
            process.exit(1);
        }
    }

    async stop() {
        // Stop presence rotation
        this.eventHandler.stopPresenceRotation();
        
        // Clean up any active sessions
        for (const [guildId] of this.sessionManager.getAllActiveSessions()) {
            this.sessionManager.stopActiveSession(guildId);
        }
        
        // Clear pending sessions
        for (const [guildId] of this.sessionManager.getAllPendingSessions()) {
            this.sessionManager.removePendingSession(guildId);
        }

        await this.client.destroy();
        console.log("Ronaldo Bot stopped successfully!");
    }
}

module.exports = RonaldoBot;
