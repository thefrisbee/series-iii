# Land Rover Series III — Restoration Tracker

Personal restoration tracking app for a Series III Land Rover single-cab pickup.

**Live site:** https://thefrisbee.github.io/series-iii/

---

## Features

| Section | What it does |
|---|---|
| **Parts** / Repuestos | 28 parts with status (Pending → Ordered → Installed), USD price per part, running cost total, copy-to-clipboard for website searches |
| **Expenses** / Gastos | Log USD expenses by category, filter, total |
| **Checklist** | 20 seeded restoration tasks + add your own |
| **Need** / Necesito | Source list for parts still to find, with priority and notes |
| **Photos** / Fotos | Progress photo gallery with date and tags; 6 initial photos committed to repo |

- **Bilingual:** EN / ES toggle in the header
- **Google Drive sync:** data saved to a Google Sheet via Apps Script (except photos)
- **Offline fallback:** localStorage used when Drive is unreachable
- **Sync indicator:** dot in the header shows current sync status

---

## Stack

- Vite + React
- react-router-dom (HashRouter for GitHub Pages)
- Google Apps Script (backend for Drive sync)
- CSS custom properties (light/dark theme)
- No UI library

---

## Setup

### Local development

```bash
npm install
npm run dev
```

### Google Drive sync

1. Create a Google Sheet and add a tab named `data`
2. Open Extensions → Apps Script → paste the contents of `scripts/Code.gs`
3. Deploy as web app: **Execute as: Me** / **Access: Anyone**
4. Copy the web app URL
5. Create `.env.local` with:
   ```
   VITE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_URL/exec
   ```

### GitHub Pages deployment

Runs automatically on push to `main` via GitHub Actions.

To enable Drive sync in production:

1. Go to `thefrisbee/series-iii` → Settings → Secrets and variables → Actions
2. Add secret: `VITE_SCRIPT_URL` = your Apps Script URL
3. Push any change to trigger a re-deploy

---

## Adding photos to the repo

1. Convert to JPEG and copy to `public/photos/`
2. Add an entry to `src/data/photos.js` with filename, date, title, and tags
3. Commit and push — photo appears on all devices immediately

Photos uploaded through the app are stored in `localStorage` on that device only.

---

## Data storage

| Data | Storage |
|---|---|
| Parts status, notes, prices | Google Drive (Sheet) + localStorage fallback |
| Expenses | Google Drive (Sheet) + localStorage fallback |
| Checklist | Google Drive (Sheet) + localStorage fallback |
| Need-to-get list | Google Drive (Sheet) + localStorage fallback |
| Photos (uploaded) | localStorage only (this device) |
| Photos (repo) | `public/photos/` — visible on all devices |
