// SDR Module - Speech-to-Text from Radio Frequencies
// Displays real-time radio chatter from PR frequencies

class SDRModule {
    constructor() {
        this.radioData = [];
        this.updateInterval = null;
        this.widgetElement = null;
    }

    // Initialize the SDR widget
    initWidget(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('SDR widget container not found');
            return;
        }

        this.widgetElement = document.createElement('div');
        this.widgetElement.className = 'sdr-widget';
        this.widgetElement.innerHTML = `
            <div class="sdr-header">
                <h4>📻 Radio Chatter (PR SDR)</h4>
                <div class="sdr-status">
                    <span class="status-indicator"></span>
                    <span class="status-text">Monitoring</span>
                </div>
            </div>
            <div class="sdr-content">
                <div class="sdr-messages"></div>
            </div>
        `;
        container.appendChild(this.widgetElement);
    }

    // Simulate receiving radio transmissions
    // In production, this would connect to an actual SDR + speech-to-text service
    async fetchRadioData() {
        // Placeholder for actual SDR integration
        // In production, this would:
        // 1. Connect to online SDR(s) in Puerto Rico
        // 2. Monitor open-use frequencies
        // 3. Use speech-to-text API to convert audio to text
        // 4. Return the transcribed messages
        
        // For now, simulate emergency radio traffic
        const simulatedMessages = [
            { frequency: '146.520 MHz', timestamp: new Date(), text: 'Emergency services standing by', type: 'info' },
            { frequency: '146.820 MHz', timestamp: new Date(), text: 'Weather update: Conditions improving in San Juan area', type: 'weather' },
            { frequency: '147.000 MHz', timestamp: new Date(), text: 'Shelter at Centro de Convenciones at 60% capacity', type: 'shelter' },
            { frequency: '145.150 MHz', timestamp: new Date(), text: 'Road closure reported on Route 52 near Cayey', type: 'alert' },
            { frequency: '146.520 MHz', timestamp: new Date(), text: 'Medical supplies needed at Ponce shelter', type: 'urgent' }
        ];

        // Return a random message for simulation
        if (Math.random() > 0.7) {
            const randomMessage = simulatedMessages[Math.floor(Math.random() * simulatedMessages.length)];
            this.radioData.push(randomMessage);
            this.displayMessage(randomMessage);
        }
    }

    // Display a radio message in the widget
    displayMessage(message) {
        if (!this.widgetElement) return;

        const messagesContainer = this.widgetElement.querySelector('.sdr-messages');
        if (!messagesContainer) return;

        const messageElement = document.createElement('div');
        messageElement.className = `sdr-message sdr-message-${message.type}`;
        
        const time = message.timestamp.toLocaleTimeString();
        messageElement.innerHTML = `
            <div class="message-header">
                <span class="message-frequency">${message.frequency}</span>
                <span class="message-time">${time}</span>
            </div>
            <div class="message-text">${message.text}</div>
        `;

        messagesContainer.insertBefore(messageElement, messagesContainer.firstChild);

        // Keep only the last 10 messages
        while (messagesContainer.children.length > 10) {
            messagesContainer.removeChild(messagesContainer.lastChild);
        }

        // Auto-scroll to show new message
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Start monitoring radio frequencies
    startMonitoring() {
        // Initial fetch
        this.fetchRadioData();

        // Update every 15 seconds
        this.updateInterval = setInterval(() => {
            this.fetchRadioData();
        }, 15000);

        // Update status indicator
        if (this.widgetElement) {
            const indicator = this.widgetElement.querySelector('.status-indicator');
            if (indicator) {
                indicator.style.backgroundColor = '#00ff00';
            }
        }
    }

    // Stop monitoring
    stopMonitoring() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }

        // Update status indicator
        if (this.widgetElement) {
            const indicator = this.widgetElement.querySelector('.status-indicator');
            if (indicator) {
                indicator.style.backgroundColor = '#ff0000';
            }
            const statusText = this.widgetElement.querySelector('.status-text');
            if (statusText) {
                statusText.textContent = 'Stopped';
            }
        }
    }

    // Clear all messages
    clearMessages() {
        if (this.widgetElement) {
            const messagesContainer = this.widgetElement.querySelector('.sdr-messages');
            if (messagesContainer) {
                messagesContainer.innerHTML = '';
            }
        }
        this.radioData = [];
    }
}

// Export for use in main map.js
window.SDRModule = SDRModule;
