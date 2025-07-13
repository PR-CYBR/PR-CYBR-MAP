# Discussion Post Update

## Project Overview
**Repository:** PR-CYBR-MAP

**Purpose:** Placeholder for an interactive map of Puerto Rico with municipal subdirectories. README describes using Jawg Matrix theme, dynamic markers, and responsive design.

**Structure:** Contains a `PR-DIV` folder with 80+ municipal directories. Each division has `DOCS`, `TAK`, and `WEB` folders, e.g., `PR-SJU` README lists docs for MDMP, ASCOPE, KOCOA, etc.

**Data:** `DIV-DB.md` enumerates the division codes for every municipality.

**Scripts:** `setup.sh` is an interactive build/deploy helper supporting local, Docker, and automation modes.

**Python:** `scripts/generate_qr.py` scans divisions for `beacons.txt` files and generates QR codes for each URL listed.

**Tailwind:** Minimal config with an empty `content` array.

**Node environment:** Only dependencies: `d3`, `autoprefixer`, `postcss`, and `tailwindcss`; no scripts defined.

## Directory Map
- **.github/workflows/**
  - `ci.yml` – Node 20 workflow running `pnpm run lint` and `pnpm run test` (no such scripts exist).
  - `deploy.yml` – Installs deps and calls `./setup.sh` for a gh-pages deploy; relies on MAPBOX and JAWG tokens.
  - `generate-qr.yml` – Auto-generates QR codes when `beacons.txt` files change and opens a pull request with the updates.
- **PR-DIV/** – 80+ municipal folders; each with placeholder docs and simple HTML portal pages (e.g., `PR-NAR` index).
- **scripts/** – Python QR code generator.
- **node_modules/** – Committed to the repository (~34 MB).

## Status Brief
### Build/Deploy Condition
- CI and deployment workflows expect `pnpm` scripts (`lint`, `test`, `build`) that don’t exist, so these jobs will fail if triggered.
- `setup.sh` references `data/config.json`, but this file isn’t present in the repo; tokens must be supplied manually.
- `node_modules` is committed, inflating repo size and slowing checkout.

### Warnings/Errors
- Missing `.gitignore` means large directories get committed.
- Tailwind config has `content: []`, so any Tailwind CSS build would produce no output.

### Stale/Red Flags
- No actual Next.js or map code exists; only placeholder HTML and docs.
- Workflows rely on secrets for tokens and gh-pages; ensure those exist in the repo settings.
