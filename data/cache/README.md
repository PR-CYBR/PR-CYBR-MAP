# Cache Directory

This directory contains automatically updated emergency data fetched by GitHub Actions.

Files in this directory are updated every 30 minutes by the automated workflow and should not be manually edited.

## Files
- `hurricanes.json` - Active hurricane and tropical storm data from NOAA NHC
- `weather_alerts.json` - Active weather alerts for Puerto Rico from NWS
- `shelters.json` - Emergency shelter locations and status

These files are used as fallback cache when the live APIs are unavailable or for faster initial page load.
