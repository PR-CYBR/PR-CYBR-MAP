# PR-CYBR Map

## Description
An interactive emergency response and situational awareness map of Puerto Rico styled with the Jawg Matrix theme, showcasing key locations with dynamic markers and real-time emergency data.

## Features

### Core Features
- **Interactive Map**: Explore Puerto Rico with dynamic markers for municipalities and divisions
- **Popups**: Informational popups for marked locations
- **Responsive Design**: Works on both desktop and mobile devices

### Emergency Response Features (New)
- **NOAA Weather Radar Overlay**: Real-time weather radar data that can be toggled on/off
- **Weather Alerts**: Automatic display of active NOAA weather alerts for Puerto Rico
- **Hurricane Tracker**: Live tracking of active hurricanes and tropical storms with forecast paths
- **Utility Statistics Grid**: Infrastructure overlay showing water and electricity access (available in night mode)
- **Disaster Shelter Locations**: 
  - Emergency hurricane shelter locations with capacity information
  - Route planning from any address to the nearest shelter
  - Turn-by-turn directions using OSRM routing
- **Online SDR Radio Monitor**: 
  - Real-time speech-to-text from Puerto Rico radio frequencies
  - Scrolling widget displaying radio chatter on open-use frequencies
  - Categorized messages (emergency, weather, shelter, etc.)
- **Live SITREP Feed**: 
  - Aggregated situation reports from multiple sources
  - RSS feed integration for NWS, FEMA, and local emergency management
  - Scrolling widget with timestamped updates

## How to View
Visit the live site: [PR-CYBR Map](https://cywf.github.io/PR-CYBR-MAP/)

## Using the Map

### Control Panel
The control panel in the top-left provides quick access to:
- Toggle Weather Radar overlay
- Toggle Utilities Grid (night mode only)
- Refresh Hurricane data
- Refresh Weather Alerts
- Route to nearest shelter from any address

### Dashboard Widgets
Two widgets in the bottom-right provide live updates:
- **Radio Chatter Widget**: Displays transcribed radio communications
- **SITREP Widget**: Shows situation reports and emergency feeds

### Interactive Elements
- Click on markers to view location details
- Click "See More" in popups for detailed information
- Use shelter popups to get directions to emergency locations
- View real-time weather and hurricane data overlays

## Development

### Local Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/PR-CYBR/PR-CYBR-MAP.git
   cd PR-CYBR-MAP
   ```

2. Add the required access tokens to `data/config.json`:
   ```json
   {
     "MAPBOX_ACCESS_TOKEN": "your_token_here",
     "JAWG_ACCESS_TOKEN": "your_token_here"
   }
   ```

3. Serve locally (use any static file server):
   ```bash
   python -m http.server 8000
   ```
   Then open http://localhost:8000

### Deployment
Changes pushed to the `main` branch automatically deploy via GitHub Pages through the deploy workflow.

### Automated Data Updates
The system uses GitHub Actions to automatically update emergency data every 30 minutes:
- Hurricane tracking data from NOAA NHC
- Weather alerts from NOAA Weather Service
- Shelter status and availability

No manual intervention required - the system is fully autonomous.

## Architecture

### Client-Side Only
The entire application runs in the browser with no server-side dependencies:
- Pure HTML5, CSS3, and JavaScript
- Leaflet.js for mapping
- Direct API calls to public emergency data sources
- Local caching for performance and reliability

### Data Sources
- **Weather Radar**: NOAA RIDGE WMS Service
- **Weather Alerts**: NOAA Weather Service API
- **Hurricane Data**: NOAA National Hurricane Center GeoJSON feeds
- **Routing**: OSRM (Open Source Routing Machine)
- **Geocoding**: Nominatim (OpenStreetMap)

### Lightweight Design
- Minimal dependencies (only Leaflet.js)
- Efficient caching strategy
- Optimized for GitHub Pages hosting
- No build process required

## File Structure
```
PR-CYBR-MAP/
├── index.html              # Main page
├── css/
│   ├── styles.css          # Core styles
│   ├── widgets.css         # Widget styles
│   └── ascope_sidebar.css  # ASCOPE report styles
├── js/
│   ├── map.js              # Main map initialization
│   ├── weather.js          # Weather radar & alerts
│   ├── hurricane.js        # Hurricane tracking
│   ├── utilities.js        # Utility grid overlay
│   ├── shelters.js         # Shelter locations & routing
│   ├── sdr.js              # Radio monitoring widget
│   ├── sitrep.js           # SITREP feed widget
│   ├── controls.js         # UI control handlers
│   └── ascope_report.js    # ASCOPE reporting
├── data/
│   ├── PR-CYBR-MAP.json    # Location data
│   ├── ascope_template.json
│   └── cache/              # Auto-updated emergency data
│       ├── hurricanes.json
│       ├── weather_alerts.json
│       └── shelters.json
├── .github/workflows/
│   ├── deploy.yml          # Deployment automation
│   └── update-data.yml     # Data update automation
└── README.md               # This file
```

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License
See LICENSE file for details.

## Credits
- Map tiles: [Jawg Maps](https://jawg.io)
- Weather data: [NOAA](https://www.noaa.gov)
- Hurricane data: [National Hurricane Center](https://www.nhc.noaa.gov)
- Routing: [OSRM Project](http://project-osrm.org/)
- Base mapping: [OpenStreetMap](https://www.openstreetmap.org)

