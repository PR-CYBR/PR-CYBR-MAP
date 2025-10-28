# PR Summary: Update GitHub Pages Deployment to pages Branch

## Overview
This PR migrates the GitHub Pages deployment from the deprecated `gh-pages` branch to the active `pages` branch, ensuring the site builds from the repository root.

## Changes Made

### 1. Workflow Update
**File:** `.github/workflows/deploy.yml`
- **Line 33:** Changed `publish_branch` from `gh-pages` to `pages`
- This ensures all future deployments push to the `pages` branch

### 2. Documentation
**File:** `GITHUB_PAGES_CONFIGURATION.md` (NEW)
- Comprehensive guide for manual GitHub Pages settings update
- Step-by-step instructions for repository administrators
- Verification checklist
- Rollback procedures

**File:** `README.md`
- Updated deployment section to reference the `pages` branch
- Added reference to configuration documentation

### 3. Workflow Compatibility
**File:** `.github/workflows/update-data.yml`
- No changes required
- Verified it commits to `main` branch (source)
- Does not interfere with deployment branch

## What This PR Does

✅ Automates deployment to `pages` branch instead of `gh-pages`
✅ Maintains compatibility with existing data update workflows
✅ Provides clear documentation for manual configuration steps
✅ Ensures deployment from repository root (`/`)

## What Requires Manual Action

⚠️ **Repository Settings Update Required**

GitHub Pages deployment source settings cannot be changed via code. A repository administrator must:

1. Go to repository Settings → Pages
2. Change Source: Deploy from a branch
3. Change Branch: `gh-pages` → `pages`
4. Set Folder: `/ (root)`
5. Save changes

See `GITHUB_PAGES_CONFIGURATION.md` for detailed instructions.

## Testing & Validation

✅ YAML syntax validated for both workflows
✅ Code review passed with no issues
✅ Security scan (CodeQL) passed with no alerts
✅ Workflow logic verified for compatibility

## Deployment Verification

After merging this PR and updating GitHub Pages settings:

1. Trigger a manual workflow run from Actions tab
2. Verify deployment completes successfully
3. Check https://pr-cybr.github.io/PR-CYBR-MAP/ loads correctly
4. Confirm emergency data updates continue working

## Impact

- **Breaking Changes:** None (if manual settings updated)
- **Dependencies:** No new dependencies
- **Backward Compatibility:** The `gh-pages` branch will remain but won't receive new deployments
- **Rollback:** Simple - revert PR and update settings back to `gh-pages`

## Security Summary

No security vulnerabilities found. All changes are configuration updates to GitHub Actions workflows with no code execution changes.

## Additional Notes

- The `pages` branch is already up-to-date with recent content
- This migration aligns with GitHub's current best practices
- Future deployments will be more streamlined
- Consider deleting the `gh-pages` branch after confirming migration success
