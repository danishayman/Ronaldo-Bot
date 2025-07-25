const voiceStateUpdateHandler = require('./voiceStateUpdate');
const messageReactionAddHandler = require('./messageReactionAdd');

class EventHandler {
    constructor(client, sessionManager) {
        this.client = client;
        this.sessionManager = sessionManager;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Ready event
        this.client.once("ready", () => {
            console.log(`Logged in as ${this.client.user.tag}`);
        });

        // Voice state update event
        this.client.on("voiceStateUpdate", (oldState, newState) => {
            voiceStateUpdateHandler.execute(this.sessionManager, oldState, newState);
        });

        // Message reaction add event
        this.client.on("messageReactionAdd", async (reaction, user) => {
            await messageReactionAddHandler.execute(this.sessionManager, reaction, user);
        });
    }
}

module.exports = EventHandler;
