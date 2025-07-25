#!/usr/bin/env node

const readline = require('readline');
const ReminderManager = require('./src/utils/reminderManager');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const manager = new ReminderManager();

function showMenu() {
    console.log('\n🤖 Ronaldo Bot - Water Reminder Manager');
    console.log('=====================================');
    console.log('1. List all reminders');
    console.log('2. Add new reminder');
    console.log('3. Remove reminder');
    console.log('4. Test random reminder');
    console.log('5. Exit');
    console.log('=====================================');
}

function handleChoice(choice) {
    switch(choice) {
        case '1':
            manager.listReminders();
            showMenuAndPrompt();
            break;
        case '2':
            addNewReminder();
            break;
        case '3':
            removeReminder();
            break;
        case '4':
            testRandomReminder();
            break;
        case '5':
            console.log('👋 Goodbye! SIUUUU!');
            rl.close();
            break;
        default:
            console.log('❌ Invalid choice. Please try again.');
            showMenuAndPrompt();
    }
}

function addNewReminder() {
    console.log('\n➕ Adding new reminder...');
    rl.question('Enter the reminder text: ', (text) => {
        rl.question('Enter the GIF URL: ', (gif) => {
            manager.addReminder(text, gif);
            showMenuAndPrompt();
        });
    });
}

function removeReminder() {
    console.log('\n🗑️ Remove reminder...');
    manager.listReminders();
    rl.question('Enter the number of the reminder to remove (or 0 to cancel): ', (input) => {
        const index = parseInt(input) - 1;
        if (input === '0') {
            console.log('❌ Cancelled.');
        } else {
            manager.removeReminder(index);
        }
        showMenuAndPrompt();
    });
}

function testRandomReminder() {
    console.log('\n🎲 Random reminder test:');
    const reminder = manager.getRandomReminder();
    if (reminder) {
        console.log('Text:', reminder.text);
        console.log('GIF:', reminder.gif);
    } else {
        console.log('❌ No reminders available.');
    }
    showMenuAndPrompt();
}

function showMenuAndPrompt() {
    showMenu();
    rl.question('\nEnter your choice (1-5): ', handleChoice);
}

// Start the CLI
console.log('🚀 Starting Ronaldo Bot Reminder Manager...');
showMenuAndPrompt();
