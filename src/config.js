// Configuration constants for the Ronaldo Bot
module.exports = {
    // Interval limits for water reminders (in minutes)
    MIN_INTERVAL: 30,
    MAX_INTERVAL: 180,
    
    // Session timeout for pending sessions (in milliseconds)
    PENDING_SESSION_TIMEOUT: 30000, // 30 seconds
    
    // Colors for embeds
    COLORS: {
        SUCCESS: 0x00FF00,     // Green
        ERROR: 0xFF6B6B,       // Red
        WARNING: 0xFFB347,     // Orange
        INFO: 0x1E90FF,        // Dodger Blue
        PRIMARY: 0x00BFFF,     // Deep Sky Blue
        NEUTRAL: 0xFFA500      // Orange
    },
    
    // GIF and image URLs
    MEDIA: {
        RONALDO_CELEBRATION: "https://media.tenor.com/vm1WwOBQWUMAAAAM/euro2020-cristiano-ronaldo.gif",
        RONALDO_DRINKING: "https://media.tenor.com/NF6ixwAmrTMAAAAM/cristiano-ronaldo-drinking.gif",
        RONALDO_STOP: "https://i.pinimg.com/originals/28/2f/28/282f28cc7846ad1c08794852f35c787b.gif",
        RONALDO_CONFUSED: "https://i.pinimg.com/originals/b1/61/93/b161939871b60e6aee558048a2b332a2.gif",
        SAD_GOODBYE: "https://i.giphy.com/31dFkd4JqFTV8NPDac.webp",
        WATER_DROP: "https://i.giphy.com/31dFkd4JqFTV8NPDac.webp"
    }
};
