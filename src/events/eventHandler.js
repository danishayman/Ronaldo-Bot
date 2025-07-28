const { ActivityType } = require('discord.js');
const voiceStateUpdateHandler = require('./voiceStateUpdate');
const messageReactionAddHandler = require('./messageReactionAdd');

class EventHandler {
    constructor(client, sessionManager) {
        this.client = client;
        this.sessionManager = sessionManager;
        this.presenceIndex = 0;
        this.presenceInterval = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Ready event
        this.client.once("ready", () => {
            console.log(`Logged in as ${this.client.user.tag}`);
            this.startPresenceRotation();
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

    startPresenceRotation() {
        const presences = [
            {
                activities: [{
                    name: '/ronaldo help',
                    type: ActivityType.Playing
                }],
                status: 'online'
            },
            {
                activities: [{
                    name: 'you skip water',
                    type: ActivityType.Watching
                }],
                status: 'online'
            },
            {
                activities: [{
                    name: 'Cristiano yelling DRINK WATER',
                    type: ActivityType.Listening
                }],
                status: 'online'
            }
        ];

        // Set initial presence
        this.client.user.setPresence(presences[0]);
        
        // Rotate presence every 5 minutes (300000 ms)
        this.presenceInterval = setInterval(() => {
            this.presenceIndex = (this.presenceIndex + 1) % presences.length;
            this.client.user.setPresence(presences[this.presenceIndex]);
        }, 300000);
    }

    stopPresenceRotation() {
        if (this.presenceInterval) {
            clearInterval(this.presenceInterval);
            this.presenceInterval = null;
        }
    }
}

module.exports = EventHandler;
