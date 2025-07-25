# Ronaldo Bot - Modular Structure

This Discord bot has been refactored into a modular structure for better maintainability and debugging.

## Project Structure

```
Ronaldo-Bot/
├── index.js                     # Main entry point (simplified)
├── src/
│   ├── bot.js                   # Main bot class
│   ├── config.js                # Configuration constants
│   ├── commands/
│   │   ├── commandHandler.js    # Command routing and error handling
│   │   ├── start.js            # /ronaldo start command
│   │   ├── stop.js             # /ronaldo stop command
│   │   ├── join.js             # /ronaldo join command
│   │   └── leave.js            # /ronaldo leave command
│   ├── events/
│   │   ├── eventHandler.js     # Event listener setup
│   │   ├── voiceStateUpdate.js # Voice channel monitoring
│   │   └── messageReactionAdd.js # Reaction handling for opt-in
│   └── utils/
│       ├── sessionManager.js   # Session state management
│       └── embedBuilder.js     # Discord embed utilities
├── package.json
└── register-commands.js
```

## Benefits of This Structure

### 1. **Separation of Concerns**
- Commands are isolated in individual files
- Event handlers are separated by event type
- Session management logic is centralized
- UI components (embeds) are reusable

### 2. **Easier Debugging**
- **Commands**: Each command is in its own file - if `/ronaldo start` has issues, check `src/commands/start.js`
- **Events**: Voice channel issues → `src/events/voiceStateUpdate.js`, Reaction issues → `src/events/messageReactionAdd.js`
- **Sessions**: Session state problems → `src/utils/sessionManager.js`
- **UI**: Embed formatting issues → `src/utils/embedBuilder.js`

### 3. **Better Maintainability**
- Adding new commands: Create new file in `src/commands/` and register in `commandHandler.js`
- Modifying colors/URLs: Update `src/config.js`
- Changing session logic: Modify `src/utils/sessionManager.js`
- Error handling is centralized in `commandHandler.js`

### 4. **Code Reusability**
- `EmbedBuilder` class provides consistent styling
- `SessionManager` encapsulates all session operations
- Configuration is centralized and easily changeable

## Key Classes

### `RonaldoBot` (src/bot.js)
Main application class that orchestrates all components and handles graceful shutdown.

### `SessionManager` (src/utils/sessionManager.js)
Manages active and pending sessions with methods like:
- `hasSession(guildId)`
- `startActiveSession(guildId, ...)`
- `addParticipant(guildId, userId)`
- `stopActiveSession(guildId)`

### `CommandHandler` (src/commands/commandHandler.js)
Routes commands to appropriate handlers and provides centralized error handling.

### `EmbedBuilder` (src/utils/embedBuilder.js)
Creates consistent Discord embeds with predefined styles for success, error, warning, and info messages.

## Adding New Features

### New Command
1. Create new file in `src/commands/newcommand.js`
2. Add to `commandHandler.js` commands Map
3. Register in Discord (if needed)

### New Event
1. Create new file in `src/events/newevent.js`
2. Add event listener in `src/events/eventHandler.js`

### Configuration Changes
- Update `src/config.js` for colors, URLs, intervals, etc.

This modular approach makes the codebase much more manageable and easier to debug when issues arise!
