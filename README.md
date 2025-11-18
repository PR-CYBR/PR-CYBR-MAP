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
Visit the live site: [PR-CYBR Map](https://pr-cybr.github.io/PR-CYBR-MAP/)

The site is a multi-page Astro application with the following sections:
- **Home**: Project overview and quick links
- **Map**: Interactive Leaflet map with emergency data layers
- **Mesh Networks**: Community mesh network browser (M3SH-BROWSER)
- **Training Hub**: Mesh networking training and learning resources (M3SH-EDU)
- **Statistics**: Repository metrics and activity charts
- **Discussions**: Community conversations from GitHub Discussions
- **Development Board**: Project tasks and progress tracking
- **Create Issue**: Quick issue creation with templates
- **Docs**: Project documentation (README, FEATURES, TESTING, PR_SUMMARY)
- **Visualizer**: Mermaid diagrams and visualizations

## Architecture

### Multi-Page Astro Site
The project has been migrated to a modern Astro-based site located in the `site/` directory:
- **Framework**: Astro + React + TailwindCSS + daisyUI
- **Themes**: 10 user-selectable dark themes with localStorage persistence
- **Data Snapshots**: GitHub API data cached as JSON during build
- **Map Assets**: Legacy CSS/JS copied to build for backward compatibility
- **Automated Data**: CI workflow syncs emergency data and builds site
- **Mesh Tools**: M3SH suite for Meshtastic mesh network planning and deployment

### Data Flow
1. **Emergency Data** (`data/cache/`): Updated by `.github/workflows/update-data.yml` every 30 minutes
2. **Map Assets** (`css/`, `js/`): Copied to `site/public/` during build
3. **GitHub Data**: Snapshotted via scripts in `site/scripts/` during CI build
4. **Deployment**: Built site deployed to GitHub Pages via `.github/workflows/pages.yml`

## Live Codebase Mindmap
Auto-generated on each push: **repo-map.html** (via GitHub Pages and CI artifact).
When Pages is enabled, it will be served at: `https://pr-cybr.github.io/PR-CYBR-MAP/repo-map.html`

## Using the Map

### Control Panel
The control panel in the top-left provides quick access to:
- Toggle Weather Radar overlay
- Toggle Utilities Grid (night mode only)
- Refresh Hurricane data
- Refresh Weather Alerts
- Route to nearest shelter from any address
- **Toggle Mesh Builder** (M3SH-BLDR)

### Dashboard Widgets
Two widgets in the bottom-right provide live updates:
- **Radio Chatter Widget**: Displays transcribed radio communications
- **SITREP Widget**: Shows situation reports and emergency feeds

### Interactive Elements
- Click on markers to view location details
- Click "See More" in popups for detailed information
- Use shelter popups to get directions to emergency locations
- View real-time weather and hurricane data overlays

## M3SH Mesh Network Tools

PR-CYBR-MAP includes the **M3SH** (mesh-network) suite for planning and deploying Meshtastic mesh networks:

### M3SH-BLDR - Virtual Mesh Builder
- **Interactive network builder** directly on the map
- Place nodes, draw links, configure devices
- **Deploy-M3SH analysis** provides:
  - Network reliability scoring
  - Coverage estimation
  - Isolation and over-range detection
  - Per-node configuration recommendations
- Environment-aware analysis (urban/suburban/rural/open)
- 10+ device templates (Spec5, RAKWireless, LILYGO, MorosX, etc.)

### M3SH-L0S - Line-of-Sight Helper
- Calculate distance between nodes
- LOS probability estimation
- Suggests relay/uplink positions for extended range
- Visual markers on map for suggested uplink locations

### M3SH-BROWSER - Community Network Browser
- Browse all known Puerto Rico mesh networks
- Filter by PR division and search by name
- View network profiles with:
  - Node counts and status
  - Coverage and reliability metrics
  - Configuration summaries
  - Contact information

### M3SH-EDU - Training Hub
- **50+ training guides** across 5 categories:
  - Hardware setup (devices and radios)
  - Software configuration (apps and tools)
  - Network concepts (protocols and routing)
  - System administration (OS configs)
  - Platform guides (collaboration tools)
- Searchable guide library
- Difficulty levels and tags
- External documentation links

### Design Notes
The M3SH tools use **heuristic analysis** for deployment planning. The architecture is designed to support future integration with:
- **Meshtastic Site Planner** for RF coverage analysis
- **Meshtastic Simulator** for throughput modeling
- **SPLAT!** for terrain-aware RF propagation

All analysis interfaces are designed as drop-in replacements that won't require UI changes.

## Development

### Local Site Development
To work on the Astro site locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/PR-CYBR/PR-CYBR-MAP.git
   cd PR-CYBR-MAP
   ```

2. Install site dependencies:
   ```bash
   cd site
   npm install --legacy-peer-deps
   ```

3. Copy data for local development:
   ```bash
   # From repository root
   mkdir -p site/public/data/cache
   cp -r data/cache/* site/public/data/cache/
   cp data/PR-CYBR-MAP.json site/public/data/cache/
   ```

4. Add API tokens (optional - will fallback to OSM if missing):
   ```bash
   # Create site/public/data/config.json
   {
     "MAPBOX_ACCESS_TOKEN": "your_token_here",
     "JAWG_ACCESS_TOKEN": "your_token_here"
   }
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```
   Open http://localhost:4321

6. Build for production:
   ```bash
   npm run build
   npm run preview
   ```

### Adding Documentation
Place Markdown files in the repository root. They will be automatically linked in the Docs page.

### Adding Mermaid Diagrams
1. Create `.mmd` files in the `mermaid/` directory
2. They will be automatically copied to the site during build
3. Access them via the Visualizer page

### Theme Customization
Edit `site/tailwind.config.cjs` to add or modify daisyUI themes.

### Local Setup (Legacy Map)
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
The site is automatically deployed when changes are pushed to the `main` branch:

1. **Update Data Workflow** (`.github/workflows/update-data.yml`):
   - Runs every 30 minutes
   - Fetches hurricane, weather alert, and shelter data
   - Commits updates to `data/cache/`

2. **Pages Deployment Workflow** (`.github/workflows/pages.yml`):
   - Triggers on push to `main`
   - Copies legacy map assets to site
   - Runs GitHub API snapshot scripts
   - Builds Astro site
   - Deploys to GitHub Pages

The site updates automatically within 2-5 minutes of pushing to `main`.

### CI/CD Data Snapshots
The following data is snapshotted during CI builds:

- **stats.json**: Repository stars, forks, watchers, languages, commit activity
- **discussions.json**: Latest 25 GitHub Discussions
- **projects.json**: GitHub Projects v2 board or issues grouped by status

These snapshots are generated by TypeScript scripts in `site/scripts/` and consumed by the Statistics, Discussions, and Development Board pages.

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

