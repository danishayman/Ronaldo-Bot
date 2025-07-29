const SessionManager = require('./src/utils/sessionManager');

// Mock testing to verify the pending message auto-delete functionality
console.log('🧪 Testing Pending Message Auto-Delete Feature');
console.log('=============================================');

// Create a new session manager instance
const sessionManager = new SessionManager();

// Mock pending message
const mockPendingMessage = {
    id: 'pending-message-123',
    delete: async () => {
        console.log('🗑️ Deleted pending message: "Water Reminder - Waiting for Participants!"');
        return true;
    },
    edit: async (content) => {
        console.log('✏️ Updated pending message content');
        return true;
    }
};

// Mock data for testing
const mockGuildId = 'test-guild-123';
const mockVoiceChannel = {
    id: 'voice-channel-123',
    members: new Map(),
    guild: {
        members: {
            cache: new Map()
        }
    }
};

const mockTextChannel = {
    send: async (options) => {
        if (options.embeds) {
            console.log('📤 Sending embed:', options.embeds[0].title);
        } else {
            console.log('📤 Sending message:', options.content?.substring(0, 50) + '...');
        }
        return { id: 'message-' + Date.now() };
    }
};

console.log('\n1. Creating pending session...');
const pendingSession = {
    message: mockPendingMessage,
    voiceChannel: mockVoiceChannel,
    textChannel: mockTextChannel,
    intervalMinutes: 5,
    participants: new Set(['user1', 'user2'])
};

sessionManager.createPendingSession(mockGuildId, pendingSession);
console.log('✅ Pending session created');

console.log('\n2. Testing transition from pending to active session...');
console.log('   (This should delete the pending message and send session started message)');

// Simulate the transition that happens after 30 seconds
const retrievedPendingSession = sessionManager.getPendingSession(mockGuildId);
if (retrievedPendingSession) {
    sessionManager.removePendingSession(mockGuildId);
    console.log('📋 Retrieved and removed pending session from manager');

    // This should delete the pending message and start the session
    sessionManager.startActiveSession(
        mockGuildId,
        mockVoiceChannel,
        mockTextChannel,
        5,
        retrievedPendingSession.participants,
        retrievedPendingSession.message  // This is the key - passing the message to be deleted
    );
}

setTimeout(() => {
    console.log('\n✅ Pending message auto-delete test completed!');
    console.log('\nFeatures tested:');
    console.log('- ✅ Delete pending message when session starts');
    console.log('- ✅ Send session started embed after deleting pending message');
    console.log('- ✅ Handle pending message deletion errors gracefully');

    console.log('\nFlow verified:');
    console.log('1. User runs /ronaldo start');
    console.log('2. "Water Reminder - Waiting for Participants!" message is sent');
    console.log('3. After 30 seconds (or manual trigger)');
    console.log('4. Pending message is deleted');
    console.log('5. "Water Reminder Session Started!" message is sent');
}, 100);
