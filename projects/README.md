# Projects Folder Directory Guide

This directory holds all individual project specifications for your portfolio site.

## 🚀 Newly Added Features & Options

### 1. Multiple Images & Click-to-Zoom Lightbox
You can add a single image or an array of multiple images:
```json
"images": [
  "projects/images/amv-converter-preview.svg",
  "projects/images/amv-converter-preview.svg"
]
```
- Images are displayed in a responsive grid below all project details in the inspection modal.
- Clicking on any image opens a full-screen **cyber image lightbox** to view it larger! Clicking the backdrop or pressing `Escape` closes it.

### 2. Pinned Emoji (`📌`) & Home Page Ordering
- Set `"featured": true` to pin a project. It now displays a clean **📌** emoji.
- To set the exact display order on the home page, add `"featuredOrder"`:
```json
"featured": true,
"featuredOrder": 1
```
- **Ordering Rule:**
  1. Featured projects appear first.
  2. Ordered by `featuredOrder` ascending (1, 2, 3...).
  3. If projects share the same order, they tie-break **alphabetically by `id`**.
  4. Unpinned projects follow, sorted from newest to oldest started.

### 3. Multiple Categories
Assign multiple categories using an array:
```json
"categories": ["AI", "Virtualization"]
```
Both categories appear as compact badges. If more than 5 categories exist across your site, the filter bar automatically displays a `+ More Categories (X) ▾` toggle to keep the view clean.

### 4. Technical Search Scanner (0.25s Latency)
When visitors search for a project, a 0.25-second (quarter-second) cyber scanning animation displays before presenting matching records.

---

## 📁 Centralized Data Files (`data/`)
- **`data/education.json`**: Edit degrees, institutions, GPA, and program URLs.
- **`data/certifications.json`**: Add or modify CCNA, Security+, Network+, Linux+, A+, AZ-900 credentials and verification links.
- **`data/experience.json`**: Add or update work experience.
- **`data/home-layout.json`**: Change the section order on the Home page (e.g. `["projects", "certifications", "education", "experience"]`).
- **`data/dossier-layout.json`**: Change the section order on the Dossier page (e.g. `["profile", "education", "experience", "certifications"]`).

---

## 🛠 Local Sync
If you test locally offline, run:
```bash
python3 projects/sync.py
```
