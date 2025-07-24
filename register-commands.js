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
    console.log('Registering slash commands...');
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('Success!');
  } catch (error) {
    console.error(error);
  }
})();
