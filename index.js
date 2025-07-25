const RonaldoBot = require('./src/bot');

// Create and start the bot
const bot = new RonaldoBot();

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('Received SIGINT. Shutting down gracefully...');
    await bot.stop();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Received SIGTERM. Shutting down gracefully...');
    await bot.stop();
    process.exit(0);
});

// Start the bot
bot.start().catch(console.error);
