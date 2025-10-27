// Weather Radar and Alerts Module
// Integrates NOAA Weather Radar and Alert data

class WeatherModule {
    constructor(map) {
        this.map = map;
        this.radarLayer = null;
        this.alertsData = [];
        this.enabled = false;
    }

    // Initialize weather radar overlay using NOAA's WMS service
    initRadar() {
        if (this.radarLayer) {
            this.map.removeLayer(this.radarLayer);
        }

        // NOAA's RIDGE radar WMS service
        this.radarLayer = L.tileLayer.wms('https://opengeo.ncep.noaa.gov/geoserver/conus/conus_bref_qcd/ows', {
            layers: 'conus_bref_qcd',
            format: 'image/png',
            transparent: true,
            opacity: 0.6,
            attribution: 'Weather data © NOAA'
        });
    }

    // Toggle radar layer visibility
    toggleRadar() {
        if (!this.radarLayer) {
            this.initRadar();
        }

        if (this.enabled) {
            this.map.removeLayer(this.radarLayer);
            this.enabled = false;
        } else {
            this.radarLayer.addTo(this.map);
            this.enabled = true;
        }
        return this.enabled;
    }

    // Fetch weather alerts for Puerto Rico from NOAA API
    async fetchAlerts() {
        try {
            // Try to load cached data first
            try {
                const cachedResponse = await fetch('data/cache/weather_alerts.json');
                if (cachedResponse.ok) {
                    const data = await cachedResponse.json();
                    this.alertsData = data.features || [];
                    this.displayAlerts();
                    console.log('Loaded weather alerts from cache');
                    return this.alertsData;
                }
            } catch (err) {
                console.log('No cached weather alerts available');
            }

            // Fallback to live API
            const response = await fetch('https://api.weather.gov/alerts/active?area=PR');
            const data = await response.json();
            
            this.alertsData = data.features || [];
            this.displayAlerts();
            return this.alertsData;
        } catch (error) {
            console.error('Error fetching weather alerts:', error);
            return [];
        }
    }

    // Display weather alerts on the map
    displayAlerts() {
        // Remove existing alert markers
        if (this.alertMarkers) {
            this.alertMarkers.forEach(marker => this.map.removeLayer(marker));
        }
        this.alertMarkers = [];

        this.alertsData.forEach(alert => {
            const props = alert.properties;
            if (props.geometry && alert.geometry) {
                // Create marker for alert
                const alertIcon = L.divIcon({
                    className: 'weather-alert-icon',
                    html: '<div style="background-color: #ff0000; color: white; padding: 5px; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold;">!</div>',
                    iconSize: [30, 30]
                });

                // Get centroid of alert area (simplified)
                const coords = alert.geometry.coordinates;
                let lat, lng;
                if (alert.geometry.type === 'Polygon' && coords.length > 0) {
                    // Calculate centroid of polygon (simplified - just use first point)
                    lng = coords[0][0][0];
                    lat = coords[0][0][1];
                } else if (Array.isArray(coords) && coords.length === 2) {
                    lng = coords[0];
                    lat = coords[1];
                } else {
                    // Default to center of Puerto Rico if geometry parsing fails
                    lat = 18.2208;
                    lng = -66.5901;
                }

                const marker = L.marker([lat, lng], { icon: alertIcon })
                    .bindPopup(`
                        <div class="weather-alert-popup">
                            <h4>${props.event || 'Weather Alert'}</h4>
                            <p><strong>Severity:</strong> ${props.severity || 'Unknown'}</p>
                            <p><strong>Certainty:</strong> ${props.certainty || 'Unknown'}</p>
                            <p>${props.headline || ''}</p>
                            <p><small>${props.description ? props.description.substring(0, 200) + '...' : ''}</small></p>
                        </div>
                    `)
                    .addTo(this.map);
                
                this.alertMarkers.push(marker);
            }
        });
    }

    // Get current alert count
    getAlertCount() {
        return this.alertsData.length;
    }
}

// Export for use in main map.js
window.WeatherModule = WeatherModule;
