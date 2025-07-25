// Test script for the new water reminder system
const waterReminders = require('./src/data/waterReminders.json');
const ReminderManager = require('./src/utils/reminderManager');

console.log('🧪 Testing Water Reminder System...\n');

// Test 1: Check JSON structure
console.log('📋 Test 1: JSON Structure');
console.log(`Total reminders loaded: ${waterReminders.messages.length}`);
console.log(`First reminder text preview: ${waterReminders.messages[0].text.substring(0, 50)}...`);
console.log(`First reminder GIF: ${waterReminders.messages[0].gif}\n`);

// Test 2: Test random selection
console.log('🎲 Test 2: Random Selection');
for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * waterReminders.messages.length);
    const reminder = waterReminders.messages[randomIndex];
    console.log(`Random ${i + 1}:`);
    console.log(`  Text: ${reminder.text.substring(0, 80)}...`);
    console.log(`  GIF: ${reminder.gif}\n`);
}

// Test 3: ReminderManager functionality
console.log('⚙️ Test 3: ReminderManager');
const manager = new ReminderManager();
const randomReminder = manager.getRandomReminder();
if (randomReminder) {
    console.log('✅ ReminderManager working correctly');
    console.log(`Random reminder: ${randomReminder.text.substring(0, 60)}...`);
} else {
    console.log('❌ ReminderManager failed');
}

console.log('\n🎉 All tests completed!');
console.log('\n💡 To manage reminders, run: node manage-reminders.js');
console.log('💡 The bot will now send random reminders with GIFs during sessions!');
