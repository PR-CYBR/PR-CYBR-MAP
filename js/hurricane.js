// Hurricane Tracker Module
// Tracks active hurricanes and tropical storms

class HurricaneTracker {
    constructor(map) {
        this.map = map;
        this.hurricanes = [];
        this.markers = [];
        this.updateInterval = null;
    }

    // Fetch active hurricanes from NOAA National Hurricane Center
    async fetchHurricanes() {
        try {
            // Try to load cached data first
            try {
                const cachedResponse = await fetch('data/cache/hurricanes.json');
                if (cachedResponse.ok) {
                    const data = await cachedResponse.json();
                    this.hurricanes = data.features || [];
                    this.displayHurricanes();
                    console.log('Loaded hurricane data from cache');
                    return this.hurricanes;
                }
            } catch (err) {
                console.log('No cached hurricane data available');
            }

            // Fallback to live API
            const response = await fetch('https://www.nhc.noaa.gov/gis/storm_walw.json');
            const data = await response.json();
            
            this.hurricanes = data.features || [];
            this.displayHurricanes();
            return this.hurricanes;
        } catch (error) {
            console.error('Error fetching hurricane data:', error);
            // Fallback: try alternate endpoint
            try {
                const response = await fetch('https://www.nhc.noaa.gov/CurrentStorms.json');
                const data = await response.json();
                this.processAlternateFormat(data);
            } catch (err) {
                console.error('Error with alternate hurricane data source:', err);
            }
            return [];
        }
    }

    // Process alternate data format
    processAlternateFormat(data) {
        if (data.activeStorms && Array.isArray(data.activeStorms)) {
            this.hurricanes = data.activeStorms.map(storm => ({
                properties: {
                    STORMNAME: storm.name || 'Unknown',
                    STORMTYPE: storm.classification || 'Unknown',
                    INTENSITY: storm.intensity || 0,
                    MAXWIND: storm.maxWind || 0,
                    BASIN: storm.basin || ''
                },
                geometry: storm.location || null
            }));
            this.displayHurricanes();
        }
    }

    // Display hurricanes on map
    displayHurricanes() {
        // Remove existing markers
        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.markers = [];

        this.hurricanes.forEach(hurricane => {
            const props = hurricane.properties;
            const geom = hurricane.geometry;

            if (geom && geom.coordinates) {
                let lat, lng;
                
                // Handle different geometry types
                if (geom.type === 'Point') {
                    lng = geom.coordinates[0];
                    lat = geom.coordinates[1];
                } else if (geom.type === 'LineString' && geom.coordinates.length > 0) {
                    // Use the most recent position (last point)
                    const lastPoint = geom.coordinates[geom.coordinates.length - 1];
                    lng = lastPoint[0];
                    lat = lastPoint[1];
                } else {
                    return; // Skip if we can't determine position
                }

                // Create hurricane icon
                const hurricaneIcon = L.divIcon({
                    className: 'hurricane-icon',
                    html: `<div style="background-color: #ff4444; color: white; padding: 8px; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid #cc0000;">🌀</div>`,
                    iconSize: [40, 40]
                });

                const marker = L.marker([lat, lng], { icon: hurricaneIcon })
                    .bindPopup(`
                        <div class="hurricane-popup">
                            <h4>${props.STORMNAME || 'Unnamed Storm'}</h4>
                            <p><strong>Type:</strong> ${props.STORMTYPE || 'Unknown'}</p>
                            <p><strong>Max Wind:</strong> ${props.MAXWIND || 'N/A'} mph</p>
                            <p><strong>Intensity:</strong> ${props.INTENSITY || 'N/A'}</p>
                            <p><strong>Basin:</strong> ${props.BASIN || 'N/A'}</p>
                            <p><small>Data from NOAA National Hurricane Center</small></p>
                        </div>
                    `)
                    .addTo(this.map);

                this.markers.push(marker);

                // Draw forecast track if available
                if (geom.type === 'LineString') {
                    const trackLine = L.polyline(
                        geom.coordinates.map(coord => [coord[1], coord[0]]),
                        {
                            color: '#ff4444',
                            weight: 3,
                            opacity: 0.7,
                            dashArray: '10, 5'
                        }
                    ).addTo(this.map);
                    this.markers.push(trackLine);
                }
            }
        });
    }

    // Start automatic updates (every 30 minutes)
    startAutoUpdate() {
        this.fetchHurricanes();
        this.updateInterval = setInterval(() => {
            this.fetchHurricanes();
        }, 30 * 60 * 1000); // 30 minutes
    }

    // Stop automatic updates
    stopAutoUpdate() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    // Get active hurricane count
    getHurricaneCount() {
        return this.hurricanes.length;
    }
}

// Export for use in main map.js
window.HurricaneTracker = HurricaneTracker;
