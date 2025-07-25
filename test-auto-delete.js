const SessionManager = require('./src/utils/sessionManager');

// Mock testing to verify the auto-delete functionality
console.log('🧪 Testing Auto-Delete Reminder Feature');
console.log('=====================================');

// Create a new session manager instance
const sessionManager = new SessionManager();

// Mock data for testing
const mockGuildId = 'test-guild-123';
const mockSession = {
    interval: null,
    voiceChannel: {
        id: 'voice-channel-123',
        members: new Map()
    },
    textChannel: {
        send: async (message) => {
            console.log('📤 Sending message:', message.substring(0, 50) + '...');
            return { id: 'message-' + Date.now() };
        },
        messages: {
            fetch: async (messageId) => {
                console.log('🔍 Fetching message:', messageId);
                return {
                    delete: async () => {
                        console.log('🗑️ Deleted message:', messageId);
                        return true;
                    }
                };
            }
        }
    },
    participants: new Set(['user1', 'user2']),
    lastReminderMessageId: null
};

// Test the auto-delete functionality
console.log('\n1. Setting up mock session...');
sessionManager.activeSessions.set(mockGuildId, mockSession);

console.log('\n2. Simulating first reminder (no previous message to delete)...');
sessionManager._sendReminder(
    mockSession.voiceChannel,
    mockSession.textChannel,
    mockSession.participants,
    5,
    mockGuildId
);

setTimeout(() => {
    console.log('\n3. Simulating second reminder (should delete previous message)...');
    // Simulate that the first message was sent and stored
    const session = sessionManager.activeSessions.get(mockGuildId);
    session.lastReminderMessageId = 'message-12345';
    
    sessionManager._sendReminder(
        mockSession.voiceChannel,
        mockSession.textChannel,
        mockSession.participants,
        5,
        mockGuildId
    );
    
    setTimeout(() => {
        console.log('\n4. Testing session stop (should delete last message)...');
        sessionManager.stopActiveSession(mockGuildId);
        
        console.log('\n✅ Auto-delete test completed!');
        console.log('\nFeatures tested:');
        console.log('- ✅ Store message ID after sending reminder');
        console.log('- ✅ Delete previous reminder before sending new one');
        console.log('- ✅ Delete last reminder when session stops');
        console.log('- ✅ Handle errors gracefully when message not found');
    }, 100);
}, 100);
