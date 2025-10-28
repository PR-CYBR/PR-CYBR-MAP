# GitHub Actions Workflows

This directory contains automated workflows for the PR-CYBR-MAP project.

## Workflows

### deploy.yml
Automatically deploys the application to GitHub Pages when changes are pushed to the `main` branch.

**Triggers:**
- Push to `main` branch

**Steps:**
1. Checks out the repository
2. Injects access tokens from GitHub Secrets into `data/config.json`
3. Deploys to `pages` branch using built-in GITHUB_TOKEN

**Required Secrets:**
- `MAPBOX_ACCESS_TOKEN` - Mapbox API token
- `JAWG_ACCESS_TOKEN` - Jawg Maps API token

**Note:** The workflow uses the built-in `GITHUB_TOKEN` for deployment, which is automatically provided by GitHub Actions with the required permissions (`pages: write`, `id-token: write`).

### update-data.yml
Automatically updates emergency data from public APIs every 30 minutes.

**Triggers:**
- Scheduled: Every 30 minutes (`*/30 * * * *`)
- Manual: Via workflow_dispatch

**Steps:**
1. Fetches latest hurricane data from NOAA NHC
2. Fetches active weather alerts for Puerto Rico from NOAA
3. Updates shelter location data
4. Commits and pushes changes to the repository

**No secrets required** - Uses public APIs

**Data Files Updated:**
- `data/cache/hurricanes.json`
- `data/cache/weather_alerts.json`
- `data/cache/shelters.json`

## Setup

### For Development
No additional setup needed. Workflows will run automatically when:
1. Code is pushed to `main` (deploy.yml)
2. Every 30 minutes (update-data.yml)

### For Forked Repositories
If you fork this repository, you'll need to:

1. Add the required secrets to your fork:
   - Go to Settings → Secrets and variables → Actions
   - Add `MAPBOX_ACCESS_TOKEN` with your Mapbox token
   - Add `JAWG_ACCESS_TOKEN` with your Jawg token
   
   **Note:** No personal access token is needed - the workflow uses the built-in `GITHUB_TOKEN`

2. Enable GitHub Pages:
   - Go to Settings → Pages
   - Set Source to "Deploy from a branch"
   - Select the `pages` branch (not `gh-pages`)

3. Enable GitHub Actions:
   - Go to Actions tab
   - Click "I understand my workflows, go ahead and enable them"

## Monitoring

You can monitor workflow runs:
1. Go to the Actions tab in GitHub
2. Select the workflow you want to monitor
3. View run history and logs

## Troubleshooting

### deploy.yml fails
- Check that all required secrets are set (MAPBOX_ACCESS_TOKEN, JAWG_ACCESS_TOKEN)
- Verify that GitHub Pages is enabled and set to deploy from the `pages` branch
- Check workflow permissions in the workflow file (should have `pages: write` and `id-token: write`)
- View the workflow logs in the Actions tab for detailed error messages

### update-data.yml fails
- Check the workflow logs for API errors
- NOAA APIs may be temporarily unavailable
- The workflow will retry on the next scheduled run

### Data not updating
- Check the Actions tab for failed workflow runs
- Verify the `update-data.yml` workflow is enabled
- Check rate limits on the APIs (NOAA APIs have generous limits)

## Manual Triggering

You can manually trigger the `update-data.yml` workflow:
1. Go to Actions → Update Emergency Data
2. Click "Run workflow"
3. Select the branch
4. Click "Run workflow"

This is useful for:
- Testing the workflow
- Forcing an immediate update
- Debugging data issues
