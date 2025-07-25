# 🤖 Ronaldo Bot - Discord Water Reminder Bot ⚽

<div align="center">

![Ronaldo Bot](https://media.tenor.com/vm1WwOBQWUMAAAAM/euro2020-cristiano-ronaldo.gif)

**SIUUUU! Stay hydrated like a champion! 🏆💧**

[![Discord.js](https://img.shields.io/badge/Discord.js-v14.21.0-blue?style=for-the-badge&logo=discord)](https://discord.js.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v16+-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

</div>

## 📋 Table of Contents

- [🎯 About](#-about)
- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Installation](#️-installation)
- [🎮 Commands](#-commands)
- [🔧 Configuration](#-configuration)
- [📁 Project Structure](#-project-structure)
- [🎨 Customization](#-customization)
- [🐛 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🎯 About

**Ronaldo Bot** is a Discord bot inspired by Cristiano Ronaldo that helps you and your friends stay hydrated during voice chat sessions! 💧⚽

The bot creates interactive water reminder sessions in voice channels, sending motivational hydration reminders with Ronaldo-themed messages and GIFs. Perfect for gaming sessions, study groups, or any long voice chat where staying hydrated is important!

## ✨ Features

### 🌟 Core Features
- 🎮 **Voice Channel Integration** - Monitors voice channels automatically
- ⏰ **Customizable Intervals** - Set reminders from 30 to 180 minutes
- 👥 **Multi-User Sessions** - Join/leave system for group hydration
- 🤖 **Auto-Management** - Sessions end when channels are empty
- 🗑️ **Smart Cleanup** - Auto-deletes old reminders to keep channels clean

### 💬 Interactive System
- ✅ **React to Join** - React with checkmark to join pending sessions
- 🕐 **30-Second Wait** - Gives others time to join before starting
- 📢 **Real-time Updates** - Live participant count in messages
- 🚫 **Participant Control** - Only participants can stop sessions

### 🎨 Rich Content
- 🖼️ **Custom Embeds** - Beautiful Discord embeds with colors and thumbnails
- 🎬 **Random GIFs** - 12+ different Ronaldo GIFs and motivational messages
- 💬 **Ronaldo Quotes** - Inspirational quotes from the GOAT himself
- 🏆 **Championship Theme** - Stay motivated with winner's mindset

## 🚀 Quick Start

### Prerequisites
- Node.js 16.0 or higher
- A Discord Application/Bot Token
- Basic command line knowledge

### Quick Setup
1. **Clone & Install**
   ```bash
   git clone https://github.com/danishayman/Ronaldo-Bot.git
   cd Ronaldo-Bot
   npm install
   ```

2. **Configure Bot**
   ```bash
   # Copy example environment file
   copy .env.example .env
   
   # Edit .env with your bot credentials
   notepad .env
   ```

3. **Register Commands & Start**
   ```bash
   # Register slash commands (one-time setup)
   node register-commands.js
   
   # Start the bot
   node index.js
   ```

## ⚙️ Installation

### Step 1: Create Discord Application 🔧

1. **Go to Discord Developer Portal**
   - Visit [Discord Developer Portal](https://discord.com/developers/applications)
   - Click "New Application" and give it a name (e.g., "Ronaldo Bot")

2. **Create Bot User**
   - Go to "Bot" section in left sidebar
   - Click "Add Bot"
   - Copy the bot token (keep this secret! 🔐)

3. **Get Application ID**
   - Go to "General Information" section
   - Copy the "Application ID" (this is your CLIENT_ID)

4. **Bot Permissions**
   - In "Bot" section, enable these permissions:
     - ✅ Send Messages
     - ✅ Use Slash Commands
     - ✅ Add Reactions
     - ✅ Read Message History
     - ✅ Connect to Voice Channels
     - ✅ Embed Links

### Step 2: Invite Bot to Server 🎉

1. **Generate Invite Link**
   - Go to "OAuth2" → "URL Generator"
   - **Scopes:** Select `bot` and `applications.commands`
   - **Permissions:** Select the permissions listed above
   - Copy the generated URL

2. **Add to Server**
   - Open the invite URL in your browser
   - Select your Discord server
   - Click "Authorize"

### Step 3: Setup Environment 📝

1. **Clone Repository**
   ```bash
   git clone https://github.com/danishayman/Ronaldo-Bot.git
   cd Ronaldo-Bot
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   ```bash
   # Copy the example file
   copy .env.example .env
   ```
   
   Edit `.env` file with your credentials:
   ```env
   DISCORD_TOKEN=your_bot_token_here
   CLIENT_ID=your_bot_client_id_here
   ```

### Step 4: Register Commands & Launch 🚀

1. **Register Slash Commands**
   ```bash
   node register-commands.js
   ```
   > ⏳ Global commands may take up to 1 hour to appear everywhere

2. **Start the Bot**
   ```bash
   node index.js
   ```
   
   You should see:
   ```
   Logged in as YourBotName#1234
   Ronaldo Bot started successfully!
   ```

## 🎮 Commands

### Primary Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `/ronaldo start <interval>` | Start water reminder session | `/ronaldo start interval:60` |
| `/ronaldo stop` | Stop current session | `/ronaldo stop` |
| `/ronaldo join` | Join active session | `/ronaldo join` |
| `/ronaldo leave` | Leave current session | `/ronaldo leave` |

### Command Details

#### 🚀 `/ronaldo start`
- **Purpose:** Creates a new hydration reminder session
- **Parameters:** 
  - `interval` (required): Minutes between reminders (30-180)
- **Behavior:**
  - If you're alone: Starts immediately
  - If others present: 30-second join period with reactions
- **Requirements:** Must be in a voice channel

#### 🛑 `/ronaldo stop`
- **Purpose:** Ends the current reminder session
- **Restrictions:** Only participants can stop sessions
- **Effect:** Cleans up reminders and notifies channel

#### ✅ `/ronaldo join`
- **Purpose:** Join an ongoing reminder session
- **Requirements:** 
  - Must be in same voice channel as session
  - Session must be active
- **Effect:** You'll receive future water reminders

#### 👋 `/ronaldo leave`
- **Purpose:** Leave current reminder session
- **Effect:** You'll stop receiving reminders
- **Auto-stop:** Session ends if all participants leave

### Usage Examples

```bash
# Start a session with reminders every hour
/ronaldo start interval:60

# Start quick reminders for gaming session
/ronaldo start interval:30

# Join your friends' hydration session
/ronaldo join

# Take a break from reminders
/ronaldo leave

# End the session for everyone
/ronaldo stop
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DISCORD_TOKEN` | Your bot's secret token | ✅ Yes |
| `CLIENT_ID` | Your application's client ID | ✅ Yes |

### Configurable Settings

Edit `src/config.js` to customize:

```javascript
module.exports = {
    // Reminder interval limits (minutes)
    MIN_INTERVAL: 30,    // Minimum: 30 minutes
    MAX_INTERVAL: 180,   // Maximum: 3 hours
    
    // Session join timeout
    PENDING_SESSION_TIMEOUT: 30000, // 30 seconds
    
    // Embed colors (hex)
    COLORS: {
        SUCCESS: 0x00FF00,  // Green
        ERROR: 0xFF6B6B,    // Red
        WARNING: 0xFFB347,  // Orange
        // ... more colors
    },
    
    // GIF URLs for different moods
    MEDIA: {
        RONALDO_CELEBRATION: "https://...",
        RONALDO_DRINKING: "https://...",
        // ... more GIFs
    }
};
```

### Water Reminder Messages

The bot includes 12+ unique reminder messages in `src/data/waterReminders.json`. Each contains:
- 💬 Motivational text with Ronaldo quotes
- 🎬 Themed GIF URL
- 🎨 Rich formatting with emojis

#### Managing Reminders

Use the built-in reminder manager:

```bash
# Interactive reminder management
node manage-reminders.js

# Test the reminder system
node test-reminders.js
```

**Reminder Manager Features:**
- 📋 List all reminders
- ➕ Add new reminders
- 🗑️ Remove reminders
- 🎲 Test random selection

## 📁 Project Structure

```
Ronaldo-Bot/
├── 📁 src/
│   ├── 🤖 bot.js                 # Main bot class
│   ├── ⚙️ config.js              # Configuration constants
│   ├── 📁 commands/
│   │   ├── 🎮 commandHandler.js  # Command router
│   │   ├── 🚀 start.js           # Start session command
│   │   ├── 🛑 stop.js            # Stop session command
│   │   ├── ✅ join.js            # Join session command
│   │   └── 👋 leave.js           # Leave session command
│   ├── 📁 events/
│   │   ├── 🎧 eventHandler.js    # Event router
│   │   ├── 🔊 voiceStateUpdate.js # Voice channel monitoring
│   │   └── 👆 messageReactionAdd.js # Reaction handling
│   ├── 📁 services/
│   │   └── 📊 sessionManager.js  # Session state management
│   ├── 📁 utils/
│   │   ├── 🎨 embedBuilder.js    # Discord embed creator
│   │   ├── 💧 reminderManager.js # Reminder message system
│   │   ├── 📊 sessionManager.js  # Session utilities
│   │   └── 📦 index.js           # Utility exports
│   └── 📁 data/
│       └── 💬 waterReminders.json # Reminder messages & GIFs
├── 🔧 index.js                   # Bot entry point
├── 📝 register-commands.js       # Slash command registration
├── 🛠️ manage-reminders.js        # Reminder management CLI
├── 🧪 test-reminders.js          # Test reminder system
├── 🧪 test-auto-delete.js        # Test auto-cleanup
├── 🧪 test-pending-delete.js     # Test pending message cleanup
├── 📦 package.json               # Dependencies & scripts
├── 🔐 .env                       # Environment variables (private)
├── 📄 .env.example               # Environment template
└── 📋 README.md                  # This documentation
```

### Key Components

#### 🤖 **Bot Core** (`src/bot.js`)
- Main Discord client setup
- Integration of all components
- Graceful startup/shutdown handling

#### 📊 **Session Manager** (`src/utils/sessionManager.js`)
- Manages active and pending sessions
- Handles participant tracking
- Auto-cleanup of old messages
- Voice channel monitoring

#### 🎮 **Command System** (`src/commands/`)
- Modular command structure
- Error handling and validation
- Permission checks
- Rich response formatting

#### 🎧 **Event System** (`src/events/`)
- Voice state change monitoring
- Reaction-based joining
- Automatic session cleanup

## 🎨 Customization

### Adding New Reminder Messages

1. **Using the CLI Tool** (Recommended)
   ```bash
   node manage-reminders.js
   # Choose option 2: "Add new reminder"
   ```

2. **Manual Editing**
   ```json
   {
     "text": "💧 **YOUR CUSTOM MESSAGE!** 🥤\n\n*\"Your custom quote\"*\n\n🌊 **CUSTOM CALL TO ACTION!** 🌊",
     "gif": "https://your-gif-url.gif"
   }
   ```

### Customizing Appearance

#### Colors
```javascript
// src/config.js
COLORS: {
    SUCCESS: 0x00FF00,    // Bright green
    ERROR: 0xFF6B6B,      // Soft red
    PRIMARY: 0x00BFFF,    // Sky blue
    // Add your own colors!
}
```

#### GIFs and Media
```javascript
// src/config.js
MEDIA: {
    RONALDO_CELEBRATION: "your-celebration-gif.gif",
    RONALDO_DRINKING: "your-drinking-gif.gif",
    // Add custom GIFs!
}
```

### Extending Commands

Create new commands in `src/commands/`:

```javascript
// src/commands/mycustomcommand.js
module.exports = {
    name: 'mycustomcommand',
    async execute(interaction, sessionManager) {
        // Your command logic here
        await interaction.reply("Hello world!");
    }
};
```

Register in `commandHandler.js`:
```javascript
this.commands = new Map([
    // ... existing commands
    ['mycustomcommand', require('./mycustomcommand')]
]);
```

## 🐛 Troubleshooting

### Common Issues

#### ❌ **Bot doesn't respond to commands**
- ✅ Check if commands are registered: `node register-commands.js`
- ✅ Verify bot has proper permissions in your server
- ✅ Ensure bot is online (should show green status)
- ✅ Global commands take up to 1 hour to appear

#### ❌ **"Missing Permissions" error**
- ✅ Bot needs these permissions:
  - Send Messages
  - Use Slash Commands
  - Add Reactions
  - Read Message History
  - Connect (for voice channel detection)
  - Embed Links

#### ❌ **Sessions don't start**
- ✅ Make sure you're in a voice channel
- ✅ Check interval is between 30-180 minutes
- ✅ Verify no other session is running

#### ❌ **Environment Issues**
```bash
# Check your .env file exists and has correct format
type .env

# Verify Node.js version
node --version
# Should be 16.0 or higher

# Reinstall dependencies if needed
rmdir /s node_modules
npm install
```

### Debug Mode

Enable detailed logging by adding to your bot startup:

```javascript
// Add to src/bot.js
this.client.on('debug', console.log);
```

### Getting Help

1. **Check Logs** - Look at console output for error messages
2. **Test Components** - Use included test scripts:
   ```bash
   node test-reminders.js
   node test-auto-delete.js
   ```
3. **Discord Support** - Check Discord.js documentation
4. **GitHub Issues** - Report bugs on the repository

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Setup

1. **Fork & Clone**
   ```bash
   git clone https://github.com/yourusername/Ronaldo-Bot.git
   cd Ronaldo-Bot
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Contributing Guidelines

- 🧪 **Test your changes** using the included test scripts
- 📝 **Document new features** in both code comments and README
- 🎨 **Follow existing code style** and structure
- 💬 **Use descriptive commit messages**
- 🐛 **Include error handling** for new features

### Pull Request Process

1. Update documentation for any new features
2. Test with the included test scripts
3. Update version in `package.json` if needed
4. Create pull request with detailed description

### Ideas for Contributions

- 🌍 **Internationalization** - Add support for other languages
- 🎵 **Sound Effects** - Add audio cues for reminders
- 📊 **Statistics** - Track hydration stats per user
- 🎯 **Goals** - Set daily hydration goals
- 🏆 **Achievements** - Unlock badges for consistent hydration
- 🎨 **Themes** - Different themes (sports, study, gaming)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ and lots of 💧**

**SIUUUU! 🐐⚽**

*Remember: Champions stay hydrated! 🏆💧*

</div>
