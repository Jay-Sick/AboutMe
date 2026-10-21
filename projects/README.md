# Projects Folder Directory Guide

This directory holds all individual project specifications for your portfolio site.

## 🚀 Newly Added Features & Options

### 1. Multiple Categories
You can now assign multiple categories to a single project using an array of strings:
```json
"categories": ["AI", "Virtualization"]
```
Both categories will appear as compact badges on the card and detail modal. When visitors click either category in the filter bar, this project will appear!

### 2. Images in Project Details
To display an image (screenshot, architecture diagram, or UI preview) below the technical text in the detail modal, add:
```json
"image": "projects/images/amv-converter-preview.svg"
```
Or for multiple images:
```json
"images": [
  "projects/images/screenshot1.png",
  "projects/images/screenshot2.png"
]
```

### 3. Featured Projects & Automatic Pinned Sorting
To feature a project on the home page and pin it to the top of the Projects page:
```json
"featured": true
```
- Pinned projects automatically display a **📌 PINNED** badge.
- Projects are automatically sorted with **Featured projects first**, ordered from **newest to oldest started** by month and year.

### 4. Dates with Months
Include the month in `date` and an optional standard `startDate` (YYYY-MM) for exact chronological sorting:
```json
"date": "January 2026 - Present",
"startDate": "2026-01"
```

### 5. Links & Source Badges
- If code is not on GitHub, set `"github": null` and use `primaryLink` instead:
```json
"primaryLink": {
  "label": "View on SourceForge ↗",
  "url": "https://sourceforge.net/projects/amv-converter/"
}
```
- To include live shields or download buttons:
```json
"badgeHtml": "<a href=\"...\"><img src=\"https://img.shields.io/...\"></a>"
```

---

## 🛠 Adding a New Project
1. Create a new `.json` file (e.g. `projects/firewall-defense.json`).
2. Fill in the fields.
3. If hosting on GitHub, just push it! The site auto-discovers it. If testing locally offline, run:
```bash
python3 projects/sync.py
```
