# Testing Guide

This document describes how to test the PR-CYBR-MAP features.

## Automated Tests

### JavaScript Syntax Validation
```bash
# Check all JavaScript files for syntax errors
node --check js/*.js
```

### JSON Validation
```bash
# Validate all JSON files
python3 -c "
import json
import glob

for file in glob.glob('data/**/*.json', recursive=True):
    try:
        with open(file) as f:
            json.load(f)
        print(f'{file}: Valid')
    except Exception as e:
        print(f'{file}: ERROR - {e}')
"
```

### YAML Workflow Validation
```bash
# Validate GitHub Actions workflows
python3 -c "
import yaml
import glob

for file in glob.glob('.github/workflows/*.yml'):
    with open(file) as f:
        yaml.safe_load(f)
    print(f'{file}: Valid')
"
```

## Manual Testing

### 1. Basic Map Functionality
- [ ] Open the map in a browser
- [ ] Verify the map loads and centers on Puerto Rico
- [ ] Verify municipality markers appear
- [ ] Click on a marker and verify popup appears
- [ ] Click "See More" and verify sidebar opens with details

### 2. Control Panel
- [ ] Verify control panel appears in top-left corner
- [ ] Test "Toggle Weather Radar" button
  - Click to enable → verify radar overlay appears
  - Click to disable → verify radar overlay disappears
- [ ] Test "Toggle Utilities Grid" button
  - Click to enable → verify grid overlay appears
  - Click to disable → verify grid overlay disappears
- [ ] Test "Refresh Hurricane Data" button
  - Click button → verify button shows "Refreshing..."
  - Verify button updates with hurricane count
- [ ] Test "Refresh Weather Alerts" button
  - Click button → verify button shows "Refreshing..."
  - Verify button updates with alert count

### 3. Shelter Routing
- [ ] Enter an address in the address input field
- [ ] Click "Find Nearest Shelter"
- [ ] Verify route appears on map
- [ ] Verify distance and time estimate shown
- [ ] Click on shelter markers
- [ ] Click "Get Directions" in shelter popup
- [ ] Verify route is drawn from current map center to shelter

### 4. Weather Features
#### Weather Radar
- [ ] Toggle weather radar on
- [ ] Verify radar imagery appears over Puerto Rico
- [ ] Verify radar has appropriate transparency
- [ ] Verify radar attribution is visible

#### Weather Alerts
- [ ] Refresh weather alerts
- [ ] If alerts exist, verify they appear on map
- [ ] Click on alert marker
- [ ] Verify alert details appear in popup
  - Event type
  - Severity
  - Description

### 5. Hurricane Tracker
- [ ] Wait for automatic hurricane data fetch (or refresh manually)
- [ ] If active hurricanes exist:
  - [ ] Verify hurricane markers appear
  - [ ] Verify forecast tracks are drawn
  - [ ] Click on hurricane marker
  - [ ] Verify hurricane details in popup
- [ ] If no active hurricanes:
  - [ ] Verify no error messages
  - [ ] Verify count shows "0 active"

### 6. Dashboard Widgets

#### SDR Radio Widget
- [ ] Verify SDR widget appears in bottom-right
- [ ] Verify widget shows "Monitoring" status with green indicator
- [ ] Wait for messages to appear (simulated every ~15 seconds)
- [ ] Verify messages display with:
  - Frequency
  - Timestamp
  - Message text
  - Appropriate color coding
- [ ] Verify widget scrolls to show new messages
- [ ] Verify widget keeps only last 10 messages

#### SITREP Widget
- [ ] Verify SITREP widget appears below SDR widget
- [ ] Verify widget shows "Active" status with green indicator
- [ ] Verify historical reports load initially
- [ ] Wait for new reports (simulated every ~5 minutes)
- [ ] Verify reports display with:
  - Source
  - Date and time
  - Title
  - Summary
- [ ] Verify widget scrolls to show new reports
- [ ] Verify widget keeps only last 15 reports

### 7. Responsive Design
- [ ] Test on desktop (>1024px width)
  - Verify control panel doesn't overlap map
  - Verify widgets are properly positioned
  - Verify sidebar works correctly
- [ ] Test on tablet (768px-1024px width)
  - Verify layout adapts
  - Verify all controls remain accessible
- [ ] Test on mobile (<768px width)
  - Verify control panel adjusts width
  - Verify widgets stack properly
  - Verify map remains usable

### 8. Performance
- [ ] Check initial page load time (<5 seconds)
- [ ] Verify no console errors
- [ ] Verify smooth map panning and zooming
- [ ] Verify widget animations are smooth
- [ ] Check network tab for reasonable request sizes

### 9. GitHub Pages Deployment
- [ ] Verify site loads at GitHub Pages URL
- [ ] Verify all resources load (no 404s)
- [ ] Verify config.json is properly injected
- [ ] Verify all features work on deployed site

### 10. Automated Data Updates
- [ ] Check Actions tab for update-data workflow runs
- [ ] Verify workflow runs every 30 minutes
- [ ] Verify workflow successfully updates cache files
- [ ] Check data/cache/ files for recent timestamps
- [ ] Verify no failed workflow runs

## Browser Compatibility

Test in the following browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## API Testing

### Weather API
```bash
curl -s "https://api.weather.gov/alerts/active?area=PR" | python3 -m json.tool
```

### Hurricane API
```bash
curl -s "https://www.nhc.noaa.gov/gis/storm_walw.json" | python3 -m json.tool
```

### Routing API
```bash
# Test routing between two points in Puerto Rico
curl -s "https://router.project-osrm.org/route/v1/driving/-66.5901,18.2208;-66.1057,18.4663?overview=false"
```

## Debugging

### Enable Console Logging
Open browser developer tools (F12) and check console for:
- Module initialization messages
- API fetch results
- Error messages

### Check Network Requests
Use browser Network tab to verify:
- All API requests succeed
- Response data is valid JSON
- Request timing is reasonable
- No CORS errors

### Common Issues

**Map doesn't load:**
- Check config.json has valid tokens
- Check browser console for errors
- Verify Leaflet.js loads successfully

**Modules don't initialize:**
- Check all JS files load in correct order
- Verify no syntax errors
- Check console for error messages

**Widgets don't appear:**
- Verify dashboard-widgets div exists in HTML
- Check CSS loads correctly
- Verify module initialization completes

**APIs fail:**
- Check network connectivity
- Verify API endpoints are accessible
- Check for rate limiting
- Try cached data fallback

**Routes don't draw:**
- Verify OSRM service is accessible
- Check coordinates are valid
- Verify route data is returned

## Reporting Issues

When reporting issues, include:
1. Browser and version
2. Console error messages
3. Network tab showing failed requests
4. Steps to reproduce
5. Expected vs actual behavior
6. Screenshots if applicable
