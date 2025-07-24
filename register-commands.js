require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
    new SlashCommandBuilder()
        .setName('ronaldo')
        .setDescription('Start or stop drink water reminders')
        .addSubcommand(sub =>
            sub.setName('start')
                .setDescription('Start reminder')
                .addIntegerOption(option =>
                    option.setName('interval')
                        .setDescription('Interval in minutes')
                        .setRequired(true)))
        .addSubcommand(sub =>
            sub.setName('stop')
                .setDescription('Stop reminder'))
        .toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Registering global slash commands...');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );
        console.log('Global commands registered successfully! They may take up to 1 hour to appear.');
    } catch (error) {
        console.error(error);
    }
})();
