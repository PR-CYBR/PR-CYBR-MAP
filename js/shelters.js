// Disaster Shelter Locations Module
// Displays emergency hurricane shelters and provides routing

class ShelterModule {
    constructor(map) {
        this.map = map;
        this.shelters = [];
        this.markers = [];
        this.routeLine = null;
    }

    // Load shelter data
    async loadShelters() {
        // Try to load from cached data first
        try {
            const cachedResponse = await fetch('data/cache/shelters.json');
            if (cachedResponse.ok) {
                const data = await cachedResponse.json();
                this.shelters = data.shelters || [];
                this.displayShelters();
                console.log('Loaded shelter data from cache');
                return this.shelters;
            }
        } catch (err) {
            console.log('No cached shelter data available');
        }

        // Fallback to hardcoded data
        this.shelters = [
            { name: 'Centro de Convenciones', lat: 18.4663, lng: -66.1057, capacity: 500, address: 'San Juan' },
            { name: 'Coliseo Roberto Clemente', lat: 18.4396, lng: -66.0644, capacity: 1000, address: 'San Juan' },
            { name: 'Escuela Superior Emilio R. Delgado', lat: 18.2208, lng: -66.5901, capacity: 300, address: 'Corozal' },
            { name: 'Centro Comunal de Ponce', lat: 18.0110, lng: -66.6140, capacity: 400, address: 'Ponce' },
            { name: 'Escuela Superior de Mayagüez', lat: 18.2013, lng: -67.1397, capacity: 350, address: 'Mayagüez' },
            { name: 'Coliseo de Arecibo', lat: 18.4728, lng: -66.7202, capacity: 800, address: 'Arecibo' },
            { name: 'Centro Gubernamental de Bayamón', lat: 18.3989, lng: -66.1608, capacity: 600, address: 'Bayamón' },
            { name: 'Escuela Inés María Mendoza', lat: 18.4248, lng: -65.8247, capacity: 250, address: 'Carolina' },
            { name: 'Centro Comunal de Caguas', lat: 18.2342, lng: -66.0356, capacity: 450, address: 'Caguas' },
            { name: 'Coliseo Manuel Iguina Reyes', lat: 18.0180, lng: -66.3706, capacity: 700, address: 'Guayama' }
        ];

        this.displayShelters();
        return this.shelters;
    }

    // Display shelters on map
    displayShelters() {
        // Remove existing markers
        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.markers = [];

        this.shelters.forEach(shelter => {
            const shelterIcon = L.divIcon({
                className: 'shelter-icon',
                html: '<div style="background-color: #0066cc; color: white; padding: 6px; border-radius: 4px; font-weight: bold; border: 2px solid white;">⛑️</div>',
                iconSize: [30, 30]
            });

            const marker = L.marker([shelter.lat, shelter.lng], { icon: shelterIcon })
                .bindPopup(`
                    <div class="shelter-popup">
                        <h4>${shelter.name}</h4>
                        <p><strong>Location:</strong> ${shelter.address}</p>
                        <p><strong>Capacity:</strong> ${shelter.capacity} people</p>
                        <button onclick="window.shelterModule.routeToShelter(${shelter.lat}, ${shelter.lng})" class="route-button">
                            Get Directions
                        </button>
                    </div>
                `)
                .addTo(this.map);

            this.markers.push(marker);
        });
    }

    // Create route from current location or address to nearest shelter
    async routeToShelter(shelterLat, shelterLng, fromLat = null, fromLng = null) {
        // Clear existing route
        if (this.routeLine) {
            this.map.removeLayer(this.routeLine);
        }

        let startLat, startLng;

        // If no start location provided, use map center
        if (fromLat === null || fromLng === null) {
            const center = this.map.getCenter();
            startLat = center.lat;
            startLng = center.lng;
        } else {
            startLat = fromLat;
            startLng = fromLng;
        }

        try {
            // Use OSRM (Open Source Routing Machine) for routing
            const response = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${shelterLng},${shelterLat}?overview=full&geometries=geojson`
            );
            const data = await response.json();

            if (data.routes && data.routes.length > 0) {
                const route = data.routes[0];
                const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);

                // Draw route on map
                this.routeLine = L.polyline(coordinates, {
                    color: '#0066cc',
                    weight: 4,
                    opacity: 0.8
                }).addTo(this.map);

                // Fit map to route bounds
                this.map.fitBounds(this.routeLine.getBounds(), { padding: [50, 50] });

                // Show route info
                const distance = (route.distance / 1000).toFixed(2); // km
                const duration = Math.round(route.duration / 60); // minutes
                
                alert(`Route created!\nDistance: ${distance} km\nEstimated time: ${duration} minutes`);
            }
        } catch (error) {
            console.error('Error creating route:', error);
            // Fallback: draw direct line
            this.routeLine = L.polyline(
                [[startLat, startLng], [shelterLat, shelterLng]],
                { color: '#0066cc', weight: 4, opacity: 0.8, dashArray: '10, 10' }
            ).addTo(this.map);
        }
    }

    // Find nearest shelter to a given location
    findNearestShelter(lat, lng) {
        let nearest = null;
        let minDistance = Infinity;

        this.shelters.forEach(shelter => {
            const distance = this.calculateDistance(lat, lng, shelter.lat, shelter.lng);
            if (distance < minDistance) {
                minDistance = distance;
                nearest = shelter;
            }
        });

        return nearest;
    }

    // Calculate distance between two points (Haversine formula)
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in km
        const dLat = this.toRad(lat2 - lat1);
        const dLng = this.toRad(lng2 - lng1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    toRad(degrees) {
        return degrees * (Math.PI / 180);
    }

    // Route to nearest shelter from address
    async routeFromAddress(address) {
        try {
            // Geocode the address using Nominatim
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)},Puerto Rico&format=json&limit=1`
            );
            const data = await response.json();

            if (data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lng = parseFloat(data[0].lon);
                
                // Find nearest shelter
                const nearest = this.findNearestShelter(lat, lng);
                if (nearest) {
                    await this.routeToShelter(nearest.lat, nearest.lng, lat, lng);
                }
            } else {
                alert('Address not found. Please try a different address.');
            }
        } catch (error) {
            console.error('Error geocoding address:', error);
            alert('Error finding address. Please try again.');
        }
    }
}

// Export for use in main map.js
window.ShelterModule = ShelterModule;
