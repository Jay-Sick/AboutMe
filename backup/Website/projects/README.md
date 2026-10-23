# Projects Folder Directory Guide

This directory holds all individual project specifications for your portfolio site.

## 🚀 Projects Included
1. **`cisco-networking-gear.json`**: Enterprise Level Cisco Network Infrastructure (Routers, switches, console server, OSPF, VLANs, Packet Tracer simulations).
2. **`openclaw-proxmox-ai.json`**: OpenClaw AI Assistant Deployment on Proxmox VE (Self-hosted AI, Linux virtualization).
3. **`amv-converter.json`**: AMV Converter (SourceForge downloads badge, multi-image preview).
4. **`homelab-infrastructure.json`**: Physical Cisco IOS switches, 802.1Q VLANs, Windows Server AD DS.
5. **`diy-nas.json`**: TrueNAS SCALE, ZFS RAID-Z storage, APC UPS NUT automation.
6. **`writeup-truenas-ups.json`**: Field documentation on TrueNAS power management.

---

## 🛠 Project Options & Features

### 1. Date Sorting & Optional Featured Order
- **Unpinned projects** are **strictly sorted by date descending** (newest to oldest started).
- **Featured projects** appear at the top with a **📌** emoji.
- `"featuredOrder"` is **optional**:
  - If specified (e.g. `"featuredOrder": 1`), it pins the project in that exact position on the home page.
  - If omitted, featured projects will sort by date descending and tie-break alphabetically by `id`.

### 2. Multiple Images & Mobile Touch Pinch-to-Zoom
- Add multiple screenshots or hardware photos using an array:
```json
"images": [
  "projects/images/ciscogear2025-2.jpg",
  "projects/images/ciscogear2025-1.jpg"
]
```
- Clicking any image in the project modal opens a full-screen image lightbox.
- **On Mobile:** Visitors can **pinch with two fingers to zoom in/out** and drag to pan across high-resolution diagrams. Double-tapping also toggles zoom!

### 3. Glitch Entrance Animation
- Search results and project cards enter the page with a cyber scanline glitch entrance animation, providing high-tech responsiveness without unnecessary delays.

---

## 🔄 Local Sync
If testing locally offline, simply run:
```bash
python3 projects/sync.py
```
