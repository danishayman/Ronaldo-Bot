const startCommand = require('./start');
const stopCommand = require('./stop');
const joinCommand = require('./join');
const leaveCommand = require('./leave');
const botstatsCommand = require('./botstats');
const helpCommand = require('./help');
const { MessageFlags } = require('discord.js');

class CommandHandler {
    constructor(sessionManager, client) {
        this.sessionManager = sessionManager;
        this.client = client;
        this.commands = new Map([
            ['start', startCommand],
            ['stop', stopCommand],
            ['join', joinCommand],
            ['leave', leaveCommand],
            ['botstats', botstatsCommand],
            ['help', helpCommand]
        ]);
    }

    async handleCommand(interaction) {
        if (!interaction.isChatInputCommand()) return;

        if (interaction.commandName === "ronaldo") {
            const subcommand = interaction.options.getSubcommand();
            const command = this.commands.get(subcommand);

            if (command) {
                try {
                    await command.execute(interaction, this.sessionManager, this.client);
                } catch (error) {
                    console.error(`Error executing command ${subcommand}:`, error);
                    
                    const errorResponse = {
                        content: "❌ An error occurred while executing this command. Please try again.",
                        flags: MessageFlags.Ephemeral
                    };

                    if (interaction.replied || interaction.deferred) {
                        await interaction.followUp(errorResponse);
                    } else {
                        await interaction.reply(errorResponse);
                    }
                }
            }
        }
    }
}

module.exports = CommandHandler;
