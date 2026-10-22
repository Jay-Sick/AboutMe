# Jacek Szewczyk // Professional IT Portfolio & Documentation

A modern, high-performance static website engineered for **Jacek Szewczyk** (IT Professional, Chicago, Illinois). Designed specifically for hosting on **GitHub Pages**, this site runs entirely on client-side vanilla web standards (HTML5, CSS3, ES6+ JavaScript, and JSON) with **zero external framework dependencies, zero build steps, and zero backend servers**.

---

## 🏗 High-Level Architecture

The website operates on a **decoupled data-driven architecture**:

```text
                          [ Visitor's Browser ]
                                    │
           ┌────────────────────────┼────────────────────────┐
           ▼                        ▼                        ▼
     HTML Structure          CSS Design System       JavaScript Engine
  (Semantic Skeleton)     (Windows Terminal HUD,      (State, Router,
                          Matrix Glitch, Scrollers)    Data Hydration)
                                    │
                                    ▼
                          [ Data Layer (JSON) ]
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
  data/*.json               projects/*.json              data/site-data.js
(Profile, Certs,          (Individual Project          (Offline file://
 Layouts, Education)           Blueprints)                 Fallback)
```

---

## 📂 Detailed Directory & File Breakdown

```text
aboutsite/
├── .nojekyll                   # Disables GitHub's Jekyll engine; ensures raw JSON & assets load directly
├── index.html                  # [01] Home Page: Windows Terminal HUD, Bio, Featured Projects, Certs, Education, Experience
├── projects.html               # [02] Projects Hub: Search bar, category filters, Matrix card load, modal inspector
├── about.html                  # [03] Dossier: Background narrative, hyperlinked education, work history, verified credentials
├── contact.html                # [04] Contact: Interactive copy email button, LinkedIn, GitHub, Chicago, IL metadata
├── blog.html                   # Clean redirect to projects.html (preserves legacy links without 404s)
├── README.md                   # Complete architectural guide (this document)
│
├── css/
│   └── style.css               # Comprehensive stylesheet:
│                               # - Dark engineering HUD theme (#090c10, #0f141c)
│                               # - Authentic Windows Terminal / PowerShell window styling (not Mac/Linux)
│                               # - Dark navy scrollbars (#112840 thumb, #080d14 track)
│                               # - Matrix-style sequential card entrance animation (@keyframes matrixCardLoad)
│                               # - Responsive typography via clamp(), modal clearance, touch targets >= 44px
│
├── js/
│   └── main.js                 # Unified JavaScript engine:
│                               # - GitHub API auto-discovery of projects/
│                               # - Dynamic category generator with "+ More Categories" toggle (> 5 categories)
│                               # - Pinned project sorting (featuredOrder -> date descending -> alphabetical ID)
│                               # - Desktop mouse click-to-zoom (focused on click point) + drag-to-pan
│                               # - Mobile touch 2-finger pinch-to-zoom + 1-finger pan
│                               # - Modal background scroll locking (body.modal-open)
│                               # - Dynamic section layout reordering from home-layout.json & dossier-layout.json
│                               # - Interactive Windows PowerShell terminal widget (whoami, Get-Service)
│
├── data/                       # Centralized, easily editable site data:
│   ├── profile.json            # Name, title ("IT Professional"), location ("Chicago, Illinois"), terminal services
│   ├── certifications.json     # CCNA, Security+, Network+, Linux+, A+, AZ-900 with Credly/MS Learn verification links
│   ├── education.json          # Governors State Univ & Moraine Valley with catalog URLs, GPA, dates
│   ├── experience.json         # Work experience entries (Arbor Park School District 145)
│   ├── experience.template.json# Template with commented-out second role ready to activate
│   ├── home-layout.json        # Section order array for index.html (projects, certifications, education, experience)
│   ├── dossier-layout.json     # Section order array for about.html (profile, education, experience, certifications)
│   └── site-data.js            # Offline companion bundle mirroring the JSON files for double-click file:// preview
│
└── projects/                   # Folder-driven projects catalog:
    ├── README.md               # Detailed guide for adding/editing project JSON files
    ├── projects.json           # Centralized registry of all projects (read by projects.html)
    ├── projects.js             # Companion JavaScript fallback registry for offline file:// preview
    ├── sync.py                 # Python sync utility for offline development
    │
    ├── cisco-networking-gear.json # Enterprise Cisco Network Infrastructure (Routers, switches, OSPF, VLANs)
    ├── openclaw-proxmox-ai.json   # OpenClaw AI Assistant on Proxmox VE (Self-hosted AI, Virtualization)
    ├── amv-converter.json         # AMV Converter (SourceForge live badge, multi-image preview)
    ├── homelab-infrastructure.json# Physical Cisco IOS switches, 802.1Q VLANs, Windows Server AD DS
    ├── diy-nas.json               # TrueNAS SCALE, ZFS RAID-Z storage, APC UPS NUT automation
    ├── writeup-truenas-ups.json   # Technical documentation on TrueNAS power management
    └── images/
        └── amv-converter-preview.svg # Cyber-green terminal & Tkinter GUI preview mockup
```

---

## ⚙️ How the Code Works (Deep Dive)

### 1. Automatic Project Discovery (Zero-Backend Serverless)
On static hosts like GitHub Pages, browsers cannot run `fs.readdir` or execute server scripts. `js/main.js` solves this automatically using **GitHub's Public REST API**:

```javascript
// When hosted on GitHub Pages (detected via window.location.hostname.includes("github.io")):
const apiUrl = `https://api.github.com/repos/${GITHUB_USER}/${repo}/contents/projects`;
const apiRes = await fetch(apiUrl);
const files = await apiRes.json();
// Filters all individual *.json files, downloads them in parallel via Promise.all,
// parses each project, and renders them automatically!
```
- **Result:** You never need to touch an index file. Dropping any new JSON file into `projects/` on GitHub automatically displays it on the live site.
- **Offline / Local Fallback:** If opened locally via `file://` or if GitHub API rate limits apply, the script gracefully falls back to `projects/projects.json` and `projects/projects.js`.

### 2. Pinned & Chronological Sorting Engine
Sorting follows this exact hierarchy:
1. **Featured / Pinned First:** Projects with `"featured": true` always appear at the top with a **📌** emoji.
2. **Optional `featuredOrder`:** If a pinned project specifies an integer (e.g. `"featuredOrder": 1`), it sorts into that exact slot.
3. **Tie-Breaker for Pinned:** If two pinned projects have the same order or omit `featuredOrder`, they sort by start date descending, then alphabetically by `id`.
4. **Unpinned Projects:** Non-pinned projects are **strictly sorted by date descending** (newest started to oldest started, using `startDate` or `date`).

### 3. Matrix Digital Card Entrance Animation
When project cards are populated (on initial load, category selection, or search):
- Each card begins invisible (`opacity: 0`, `clip-path: inset(0 0 100% 0)`).
- Cards decode sequentially with digital cyber scanlines and neon green/cyan drop-shadow flares (`@keyframes matrixCardLoad`).
- A staggered delay (`animation-delay: calc(var(--card-index, 0) * 0.08s)`) ensures cards load in an orderly, wave-like Matrix cascade.

### 4. Interactive Image Lightbox (PC Mouse Zoom + Mobile Pinch)
When viewing project details in the modal, clicking any image opens a full-screen lightbox (`#image-lightbox-modal`):
- **On PC / Desktop:**
  - Clicking on the image zooms in (2.4x) **focused on the exact (X, Y) coordinate where you clicked**.
  - When zoomed in, you can **click and drag with the mouse** to pan smoothly across the image (cursor dynamically toggles between `zoom-in`, `grab`, and `grabbing`).
  - Clicking again zooms back out to 1x.
- **On Mobile:**
  - **2-Finger Touch Pinch-to-Zoom:** Calculates touch distance dynamically via `Math.hypot()` to scale smoothly between 1x and 4x.
  - **1-Finger Drag to Pan:** Pans across the zoomed diagram when zoomed in.
  - **Double-Tap:** Toggles between 1x and 2.4x zoom.
- **Background Scroll Locking:** While either the project modal or the image lightbox is active, `document.body.classList.add("modal-open")` completely locks page background scrolling.

### 5. Dynamic Section Reordering (`home-layout.json` & `dossier-layout.json`)
Both `index.html` and `about.html` wrap their core sections inside wrapper containers with `data-section="..."` attributes.
`main.js` reads the layout array:
```json
[
  "projects",
  "certifications",
  "education",
  "experience"
]
```
The engine iterates through the keys and appends the corresponding DOM nodes in that exact sequence. You can completely change the visual structure of your home page simply by reordering the strings in `data/home-layout.json`.

### 6. Authentic Windows Terminal PowerShell Widget
Unlike generic AI templates that render macOS red/yellow/green circles, the home page console renders an authentic **Windows 10/11 Terminal** window:
- Left tab: Windows PowerShell vector icon (`>_`) and tab label `Administrator: Windows PowerShell`.
- Right controls: Native Windows **Minimize (`─`)**, **Maximize (`□`)**, and **Close (`✕` with Microsoft #e81123 red hover)**.
- Dark navy custom scrollbars styled to match enterprise Windows terminal colors (`#112840` thumb, `#080d14` track).
- Data dynamically hydrated from `data/profile.json` and `data/certifications.json`.

---

## 🚀 How to Deploy to GitHub Pages (2 Steps)

1. Push this folder to your GitHub repository:
   ```bash
   cd aboutsite
   git init
   git add .
   git commit -m "Deploy IT portfolio"
   git branch -M main
   git remote add origin https://github.com/Jay-Sick/<your-repo-name>.git
   git push -u origin main
   ```

2. In your GitHub repository:
   - Navigate to **Settings** > **Pages**.
   - Under **Build and deployment**, set **Source: Deploy from a branch**.
   - Select Branch: **`main`** and Folder: **`/(root)`**, then click **Save**.
   - Your site will be live at `https://Jay-Sick.github.io/<your-repo-name>/`.
