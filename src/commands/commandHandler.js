const startCommand = require('./start');
const stopCommand = require('./stop');
const joinCommand = require('./join');
const leaveCommand = require('./leave');
const { MessageFlags } = require('discord.js');

class CommandHandler {
    constructor(sessionManager) {
        this.sessionManager = sessionManager;
        this.commands = new Map([
            ['start', startCommand],
            ['stop', stopCommand],
            ['join', joinCommand],
            ['leave', leaveCommand]
        ]);
    }

    async handleCommand(interaction) {
        if (!interaction.isChatInputCommand()) return;

        if (interaction.commandName === "ronaldo") {
            const subcommand = interaction.options.getSubcommand();
            const command = this.commands.get(subcommand);

            if (command) {
                try {
                    await command.execute(interaction, this.sessionManager);
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
