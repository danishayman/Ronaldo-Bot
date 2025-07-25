const fs = require('fs');
const path = require('path');

// Helper script to add new water reminder messages
class ReminderManager {
    constructor() {
        this.filePath = path.join(__dirname, '../data/waterReminders.json');
        this.data = this.loadData();
    }

    loadData() {
        try {
            const rawData = fs.readFileSync(this.filePath, 'utf8');
            return JSON.parse(rawData);
        } catch (error) {
            console.error('Error loading reminders data:', error);
            return { messages: [] };
        }
    }

    saveData() {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf8');
            console.log('✅ Reminders saved successfully!');
            return true;
        } catch (error) {
            console.error('❌ Error saving reminders:', error);
            return false;
        }
    }

    addReminder(text, gif) {
        const newReminder = {
            text: text,
            gif: gif
        };

        this.data.messages.push(newReminder);
        
        if (this.saveData()) {
            console.log(`✅ Added new reminder: "${text.substring(0, 50)}..."`);
            return true;
        }
        return false;
    }

    removeReminder(index) {
        if (index >= 0 && index < this.data.messages.length) {
            const removed = this.data.messages.splice(index, 1)[0];
            
            if (this.saveData()) {
                console.log(`✅ Removed reminder: "${removed.text.substring(0, 50)}..."`);
                return true;
            }
        } else {
            console.log('❌ Invalid index provided');
        }
        return false;
    }

    listReminders() {
        console.log(`📋 Total reminders: ${this.data.messages.length}\n`);
        this.data.messages.forEach((reminder, index) => {
            console.log(`${index + 1}. ${reminder.text.substring(0, 100)}...`);
            console.log(`   GIF: ${reminder.gif}\n`);
        });
    }

    getRandomReminder() {
        if (this.data.messages.length === 0) {
            return null;
        }
        const randomIndex = Math.floor(Math.random() * this.data.messages.length);
        return this.data.messages[randomIndex];
    }
}

// Example usage functions
function addNewReminder() {
    const manager = new ReminderManager();
    
    // Example of adding a new reminder
    const newText = `🌊 **CHAMPIONSHIP HYDRATION!** 🏆\n\n*"I don't have to show anything to anyone. There is nothing to prove."* - Cristiano Ronaldo\n\n💧 **PROVE YOUR HYDRATION SKILLS!** 💧`;
    const newGif = "https://media.tenor.com/example-new-gif.gif";
    
    manager.addReminder(newText, newGif);
}

function listAllReminders() {
    const manager = new ReminderManager();
    manager.listReminders();
}

// Export the manager for use in other files
module.exports = ReminderManager;

// Uncomment these lines to test the functions
// addNewReminder();
// listAllReminders();
