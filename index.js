const RonaldoBot = require('./src/bot');
const express = require('express');

// Create Express app for keeping the service alive
const app = express();
const PORT = process.env.PORT || 3000;

// Basic route to confirm the bot is alive
app.get('/', (req, res) => {
    res.send('Ronaldo Bot is alive');
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Express server is running on port ${PORT}`);
});

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
