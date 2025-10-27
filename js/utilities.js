// Utility Statistics Module
// Displays infrastructure grid overlay showing water and electricity access

class UtilityModule {
    constructor(map) {
        this.map = map;
        this.gridLayer = null;
        this.enabled = false;
        this.nightModeOnly = true;
        this.currentTheme = 'day';
    }

    // Initialize utility grid overlay
    initGrid() {
        if (this.gridLayer) {
            this.map.removeLayer(this.gridLayer);
        }

        // Create a canvas overlay for the grid
        this.gridLayer = L.layerGroup();

        // In a real implementation, this would fetch actual utility data
        // For now, we'll create a representative grid visualization
        this.createGridVisualization();
    }

    // Create grid visualization based on utility access data
    createGridVisualization() {
        // Puerto Rico bounds
        const bounds = [
            [17.9, -67.3],  // Southwest
            [18.5, -65.6]   // Northeast
        ];

        // Create grid cells (simplified representation)
        const gridResolution = 0.1; // degrees
        const layers = [];

        for (let lat = bounds[0][0]; lat < bounds[1][0]; lat += gridResolution) {
            for (let lng = bounds[0][1]; lng < bounds[1][1]; lng += gridResolution) {
                // Simulate utility access data (in production, fetch from real data source)
                const hasElectricity = Math.random() > 0.15; // 85% coverage
                const hasWater = Math.random() > 0.10; // 90% coverage

                let color;
                if (hasElectricity && hasWater) {
                    color = '#00ff00'; // Green - full service
                } else if (hasElectricity || hasWater) {
                    color = '#ffff00'; // Yellow - partial service
                } else {
                    color = '#ff0000'; // Red - no service
                }

                const gridCell = L.rectangle(
                    [[lat, lng], [lat + gridResolution, lng + gridResolution]],
                    {
                        color: color,
                        weight: 1,
                        fillColor: color,
                        fillOpacity: 0.3,
                        opacity: 0.5
                    }
                ).bindPopup(`
                    <div class="utility-popup">
                        <h4>Utility Status</h4>
                        <p>⚡ Electricity: ${hasElectricity ? '✓ Available' : '✗ Unavailable'}</p>
                        <p>💧 Water: ${hasWater ? '✓ Available' : '✗ Unavailable'}</p>
                    </div>
                `);

                layers.push(gridCell);
            }
        }

        layers.forEach(layer => this.gridLayer.addLayer(layer));
    }

    // Toggle grid overlay (only works in night mode)
    toggleGrid(currentTheme) {
        this.currentTheme = currentTheme;

        if (this.nightModeOnly && currentTheme !== 'night') {
            console.log('Utility grid only available in night mode');
            return false;
        }

        if (!this.gridLayer) {
            this.initGrid();
        }

        if (this.enabled) {
            this.map.removeLayer(this.gridLayer);
            this.enabled = false;
        } else {
            this.gridLayer.addTo(this.map);
            this.enabled = true;
        }
        return this.enabled;
    }

    // Switch theme
    setTheme(theme) {
        this.currentTheme = theme;
        
        // Auto-disable grid if switching away from night mode
        if (this.nightModeOnly && theme !== 'night' && this.enabled) {
            this.toggleGrid(theme);
        }
    }

    // Fetch real utility data (placeholder for future implementation)
    async fetchUtilityData() {
        // In production, this would fetch from a real data source
        // For example: LUMA Energy API, PRASA water data, etc.
        console.log('Utility data fetch would be implemented here');
        return [];
    }
}

// Export for use in main map.js
window.UtilityModule = UtilityModule;
