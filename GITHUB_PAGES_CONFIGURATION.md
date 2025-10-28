# GitHub Pages Configuration Update

## Automated Changes Completed

The GitHub Actions workflow (`deploy.yml`) has been updated to deploy to the `pages` branch instead of the deprecated `gh-pages` branch.

## Manual Configuration Required

**Important:** GitHub Pages deployment source settings cannot be changed via repository code. The following manual steps are required to complete the migration:

### Steps to Update GitHub Pages Settings

1. Navigate to the repository settings:
   - Go to https://github.com/PR-CYBR/PR-CYBR-MAP
   - Click on "Settings" tab

2. Access GitHub Pages configuration:
   - Scroll down to the "Pages" section in the left sidebar
   - Click on "Pages"

3. Update the deployment source:
   - Under "Build and deployment"
   - Source: Select "Deploy from a branch"
   - Branch: Change from `gh-pages` to `pages`
   - Folder: Select `/ (root)`
   - Click "Save"

4. Trigger a deployment:
   - After saving, GitHub will automatically trigger a new deployment
   - Alternatively, you can manually trigger the deploy workflow:
     - Go to "Actions" tab
     - Select "Deploy to GitHub Pages" workflow
     - Click "Run workflow" and select the `main` branch

5. Verify the deployment:
   - Wait for the deployment to complete (check Actions tab)
   - Visit https://pr-cybr.github.io/PR-CYBR-MAP/
   - Verify the site loads correctly
   - Check that content reflects latest commits from the `pages` branch

## Workflow Compatibility

### deploy.yml
- ✅ Updated to deploy to `pages` branch
- Triggers on push to `main` branch
- Deploys entire repository root to `pages` branch

### update-data.yml
- ✅ No changes needed
- Commits emergency data updates to `main` branch
- Does not interfere with Pages deployment branch

## Verification Checklist

After completing the manual configuration:

- [ ] GitHub Pages settings show: Source = Deploy from a branch
- [ ] GitHub Pages settings show: Branch = `pages`, Folder = `/ (root)`
- [ ] Site is accessible at https://pr-cybr.github.io/PR-CYBR-MAP/
- [ ] Latest deployment reflects recent commits
- [ ] Emergency data updates continue to work (check after 30 minutes)
- [ ] Manual workflow trigger works correctly

## Rollback Instructions

If issues occur, you can rollback by:

1. Change GitHub Pages settings back to `gh-pages` branch
2. Revert the workflow change in this PR
3. The old `gh-pages` branch will still exist with previous deployments

## Notes

- The `gh-pages` branch will remain in the repository but won't receive new deployments
- Consider deleting the `gh-pages` branch after confirming the migration is successful
- All future deployments will go to the `pages` branch automatically
