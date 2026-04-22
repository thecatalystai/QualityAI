# The Catalyst AI — Prompt Engine (Web)

A production-ready, zero-dependency web application for generating expert QA/QC construction prompts. Deploy in under 2 minutes to any static host.

---

## 🗂 File Structure

```
catalyst-web/
├── index.html          ← Main page shell
├── styles.css          ← All styles (dark industrial theme)
├── app.js              ← App entry point & orchestration
├── manifest.json       ← PWA manifest
├── netlify.toml        ← Netlify config (ready)
├── vercel.json         ← Vercel config (ready)
├── favicon.svg         ← App icon
├── .nojekyll           ← GitHub Pages fix
├── core/
│   ├── schema-loader.js   ← Fetches JSON schemas
│   ├── form-engine.js     ← Renders form fields from schema
│   ├── prompt-engine.js   ← {{variable}} template substitution
│   └── storage.js         ← localStorage history (20 items)
└── prompts/
    ├── registry.json   ← List of all prompt types
    ├── itp.json        ← Inspection & Testing Plan
    ├── mos.json        ← Method of Statement
    └── chk.json        ← Inspection Checklists
```

---

## 🚀 Deploy in 60 Seconds

### Option A — Netlify (Recommended, Free)
1. Go to [app.netlify.com](https://app.netlify.com)
2. Drag and drop the entire `catalyst-web/` folder onto the deploy zone
3. ✅ Done — your site is live instantly

Or via CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir catalyst-web
```

### Option B — Vercel (Free)
```bash
npm install -g vercel
cd catalyst-web
vercel --prod
```

### Option C — GitHub Pages (Free)
1. Push this folder to a GitHub repo
2. Go to **Settings → Pages → Source: main branch / root**
3. Your site is live at `https://username.github.io/repo-name`

> ⚠️ GitHub Pages requires HTTP not `file://`. The `.nojekyll` file is already included.

### Option D — Run Locally
You need a local HTTP server (not `file://` — ES modules require HTTP):
```bash
# Python 3
cd catalyst-web && python3 -m http.server 3000

# Node.js
npx serve catalyst-web

# VS Code: use the "Live Server" extension
```
Open `http://localhost:3000`

---

## ➕ Adding New Prompt Types

1. Create `prompts/my-new-type.json`:
```json
{
  "id": "rfi",
  "version": "1.0",
  "fields": [
    { "name": "title",    "label": "RFI Title",  "type": "text" },
    { "name": "category", "label": "Category",   "type": "dropdown",    "options": ["Design","Material","HSE"] },
    { "name": "tags",     "label": "Tags",        "type": "multiselect", "options": ["Urgent","Critical","Review"] },
    { "name": "details",  "label": "Details",     "type": "textarea" }
  ],
  "template": "Generate an RFI for {{title}} ({{category}}), tagged as {{tags}}. Context: {{details}}"
}
```

2. Register it in `prompts/registry.json`:
```json
{ "name": "Request for Information - RFI", "file": "rfi.json" }
```

3. Redeploy (drag-and-drop again) — it appears automatically.

---

## 🎨 Customisation

| What | Where | How |
|---|---|---|
| Brand name | `index.html` | Edit `.brand-name` text |
| Colours | `styles.css :root` | CSS variables at the top |
| Tile icons | `core/form-engine.js` | `FormEngine.ICONS` map |
| History size | `core/storage.js` | `Storage.MAX` (default 20) |
| Fonts | `index.html` Google Fonts `<link>` | Change family names & update `--sans`, `--mono`, `--display` variables |

---

## 🔧 Browser Support

Works in all modern browsers that support ES Modules (Chrome 61+, Firefox 60+, Safari 11+, Edge 79+). No build step, no bundler, no Node.js required in production.

---

## 👤 Author

**Waqar Ahmad Malik**  
[linkedin.com/in/waqarahmadmalik](https://www.linkedin.com/in/waqarahmadmalik/)

© 2025 The Catalyst AI · All rights reserved
