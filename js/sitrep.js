// SITREP Module - Live Situation Reports Feed
// Aggregates and displays RSS feeds and situation reports

class SITREPModule {
    constructor() {
        this.feeds = [];
        this.widgetElement = null;
        this.updateInterval = null;
    }

    // Initialize the SITREP widget
    initWidget(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('SITREP widget container not found');
            return;
        }

        this.widgetElement = document.createElement('div');
        this.widgetElement.className = 'sitrep-widget';
        this.widgetElement.innerHTML = `
            <div class="sitrep-header">
                <h4>📋 Live SITREP Feed</h4>
                <div class="sitrep-status">
                    <span class="status-indicator"></span>
                    <span class="status-text">Active</span>
                </div>
            </div>
            <div class="sitrep-content">
                <div class="sitrep-messages"></div>
            </div>
        `;
        container.appendChild(this.widgetElement);
    }

    // Fetch RSS feeds from multiple sources
    async fetchFeeds() {
        // RSS feed sources for Puerto Rico emergency information
        const rssSources = [
            'https://www.weather.gov/rss/pr.xml', // NWS Puerto Rico
            'https://www.fema.gov/rss/region/2/news.xml', // FEMA Region 2
            // Note: Many RSS feeds require CORS proxy in production
        ];

        // For GitHub Pages deployment, we'll simulate feed data
        // In production with a backend, use a CORS proxy or RSS to JSON service
        this.simulateFeedData();
    }

    // Simulate SITREP feed data
    simulateFeedData() {
        const simulatedReports = [
            {
                source: 'NWS San Juan',
                title: 'Weather Advisory for Puerto Rico',
                summary: 'Partly cloudy conditions expected throughout the day. No severe weather anticipated.',
                timestamp: new Date(Date.now() - 30 * 60000),
                priority: 'normal'
            },
            {
                source: 'FEMA Region 2',
                title: 'Emergency Preparedness Resources Available',
                summary: 'Updated emergency supply lists and shelter information now available online.',
                timestamp: new Date(Date.now() - 2 * 60 * 60000),
                priority: 'info'
            },
            {
                source: 'PR Emergency Management',
                title: 'Hurricane Season Preparedness Reminder',
                summary: 'Residents encouraged to review emergency plans and update supply kits.',
                timestamp: new Date(Date.now() - 5 * 60 * 60000),
                priority: 'normal'
            },
            {
                source: 'National Hurricane Center',
                title: 'Tropical Weather Outlook',
                summary: 'No active systems threatening Puerto Rico at this time. Continue monitoring.',
                timestamp: new Date(Date.now() - 8 * 60 * 60000),
                priority: 'info'
            },
            {
                source: 'LUMA Energy',
                title: 'Grid Status Update',
                summary: 'Power grid operating normally. Minor outages in mountain areas due to maintenance.',
                timestamp: new Date(Date.now() - 12 * 60 * 60000),
                priority: 'normal'
            }
        ];

        // Add new reports periodically
        if (Math.random() > 0.6) {
            const randomReport = simulatedReports[Math.floor(Math.random() * simulatedReports.length)];
            // Create new report with current timestamp
            const newReport = { ...randomReport, timestamp: new Date() };
            this.feeds.unshift(newReport);
            this.displayReport(newReport);
        }
    }

    // Display a SITREP report in the widget
    displayReport(report) {
        if (!this.widgetElement) return;

        const messagesContainer = this.widgetElement.querySelector('.sitrep-messages');
        if (!messagesContainer) return;

        const reportElement = document.createElement('div');
        reportElement.className = `sitrep-message sitrep-priority-${report.priority}`;
        
        const time = report.timestamp.toLocaleTimeString();
        const date = report.timestamp.toLocaleDateString();
        
        reportElement.innerHTML = `
            <div class="sitrep-message-header">
                <span class="sitrep-source">${report.source}</span>
                <span class="sitrep-time">${date} ${time}</span>
            </div>
            <div class="sitrep-title">${report.title}</div>
            <div class="sitrep-summary">${report.summary}</div>
        `;

        messagesContainer.insertBefore(reportElement, messagesContainer.firstChild);

        // Keep only the last 15 reports
        while (messagesContainer.children.length > 15) {
            messagesContainer.removeChild(messagesContainer.lastChild);
        }

        // Auto-scroll to show new report
        reportElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Start fetching feeds
    startUpdates() {
        // Initial fetch
        this.fetchFeeds();

        // Update every 5 minutes
        this.updateInterval = setInterval(() => {
            this.fetchFeeds();
        }, 5 * 60000);

        // Update status indicator
        if (this.widgetElement) {
            const indicator = this.widgetElement.querySelector('.status-indicator');
            if (indicator) {
                indicator.style.backgroundColor = '#00ff00';
            }
        }
    }

    // Stop updates
    stopUpdates() {
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

    // Clear all reports
    clearReports() {
        if (this.widgetElement) {
            const messagesContainer = this.widgetElement.querySelector('.sitrep-messages');
            if (messagesContainer) {
                messagesContainer.innerHTML = '';
            }
        }
        this.feeds = [];
    }

    // Load historical reports
    loadHistoricalReports() {
        const simulatedReports = [
            {
                source: 'NWS San Juan',
                title: 'Weather Advisory for Puerto Rico',
                summary: 'Partly cloudy conditions expected throughout the day.',
                timestamp: new Date(Date.now() - 30 * 60000),
                priority: 'normal'
            },
            {
                source: 'FEMA Region 2',
                title: 'Emergency Resources Available',
                summary: 'Updated emergency supply lists available online.',
                timestamp: new Date(Date.now() - 2 * 60 * 60000),
                priority: 'info'
            },
            {
                source: 'PR Emergency Management',
                title: 'Hurricane Season Reminder',
                summary: 'Review emergency plans and update supply kits.',
                timestamp: new Date(Date.now() - 5 * 60 * 60000),
                priority: 'normal'
            }
        ];

        simulatedReports.forEach(report => {
            this.feeds.push(report);
            this.displayReport(report);
        });
    }
}

// Export for use in main map.js
window.SITREPModule = SITREPModule;
