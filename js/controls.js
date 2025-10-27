// Control Panel JavaScript
// Handles UI controls for all map features

document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit to ensure modules are initialized
    setTimeout(() => {
        initializeControls();
    }, 1000);
});

function initializeControls() {
    // Toggle Weather Radar
    const weatherToggle = document.getElementById('toggle-weather');
    if (weatherToggle && window.weatherModule) {
        weatherToggle.addEventListener('click', () => {
            const enabled = window.weatherModule.toggleRadar();
            weatherToggle.textContent = enabled ? 'Hide Weather Radar' : 'Show Weather Radar';
            weatherToggle.classList.toggle('active', enabled);
        });
    }

    // Toggle Utilities Grid
    const utilitiesToggle = document.getElementById('toggle-utilities');
    if (utilitiesToggle && window.utilityModule) {
        utilitiesToggle.addEventListener('click', () => {
            const enabled = window.utilityModule.toggleGrid('night');
            utilitiesToggle.textContent = enabled ? 'Hide Utilities Grid' : 'Show Utilities Grid';
            utilitiesToggle.classList.toggle('active', enabled);
        });
    }

    // Refresh Hurricanes
    const hurricaneRefresh = document.getElementById('refresh-hurricanes');
    if (hurricaneRefresh && window.hurricaneTracker) {
        hurricaneRefresh.addEventListener('click', async () => {
            hurricaneRefresh.disabled = true;
            hurricaneRefresh.textContent = 'Refreshing...';
            
            await window.hurricaneTracker.fetchHurricanes();
            
            const count = window.hurricaneTracker.getHurricaneCount();
            hurricaneRefresh.textContent = `Refresh Hurricane Data (${count} active)`;
            hurricaneRefresh.disabled = false;
        });
        // Set initial count
        setTimeout(() => {
            const count = window.hurricaneTracker.getHurricaneCount();
            hurricaneRefresh.textContent = `Refresh Hurricane Data (${count} active)`;
        }, 2000);
    }

    // Refresh Weather Alerts
    const alertsRefresh = document.getElementById('refresh-alerts');
    if (alertsRefresh && window.weatherModule) {
        alertsRefresh.addEventListener('click', async () => {
            alertsRefresh.disabled = true;
            alertsRefresh.textContent = 'Refreshing...';
            
            await window.weatherModule.fetchAlerts();
            
            const count = window.weatherModule.getAlertCount();
            alertsRefresh.textContent = `Refresh Weather Alerts (${count} active)`;
            alertsRefresh.disabled = false;
        });
        // Initial fetch
        setTimeout(async () => {
            await window.weatherModule.fetchAlerts();
            const count = window.weatherModule.getAlertCount();
            alertsRefresh.textContent = `Refresh Weather Alerts (${count} active)`;
        }, 1000);
    }

    // Route to Shelter from Address
    const routeButton = document.getElementById('route-to-shelter');
    const addressInput = document.getElementById('address-input');
    if (routeButton && addressInput && window.shelterModule) {
        routeButton.addEventListener('click', async () => {
            const address = addressInput.value.trim();
            if (!address) {
                alert('Please enter an address');
                return;
            }
            
            routeButton.disabled = true;
            routeButton.textContent = 'Finding route...';
            
            await window.shelterModule.routeFromAddress(address);
            
            routeButton.textContent = 'Find Nearest Shelter';
            routeButton.disabled = false;
        });

        // Allow Enter key to trigger routing
        addressInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                routeButton.click();
            }
        });
    }
}

// Make modules available globally
document.addEventListener('DOMContentLoaded', function() {
    // Check if modules are loaded
    const checkInterval = setInterval(() => {
        if (typeof WeatherModule !== 'undefined' && 
            typeof HurricaneTracker !== 'undefined' && 
            typeof UtilityModule !== 'undefined' && 
            typeof ShelterModule !== 'undefined') {
            
            console.log('All modules loaded and ready');
            clearInterval(checkInterval);
        }
    }, 100);
});
