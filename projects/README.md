# Projects Folder Directory Guide

This folder contains all project definitions for your portfolio website.
The website's Projects tab (`projects.html`) reads dynamically from this directory!

## Current Sample Projects:
1. `amv-converter.json` — Tkinter Python & FFmpeg GUI (16,200+ downloads)
2. `homelab-infrastructure.json` — Physical Cisco IOS & Proxmox network architecture
3. `diy-nas.json` — TrueNAS SCALE with Docker AI containers & UPS shutdown

## How to Add a New Project:
Simply create a new JSON file in this folder (e.g. `my-firewall.json`) with this format:

```json
{
  "id": "my-firewall",
  "title": "OPNsense Perimeter Defense Appliance",
  "subtitle": "Hardware firewall running Suricata IDS/IPS and WireGuard",
  "category": "networking",
  "categoryLabel": "Networking & Security",
  "date": "2026",
  "status": "Production",
  "featured": true,
  "stats": "Gigabit Line-Rate • Suricata IDS",
  "github": "https://github.com/Jay-Sick",
  "tags": ["OPNsense", "Firewall", "IDS/IPS", "WireGuard"],
  "summary": "Engineered a dedicated hardware security gateway...",
  "highlights": [
    "Configured geo-blocking IP rules and deep packet inspection",
    "Isolated untrusted VLAN traffic"
  ],
  "techSpecs": {
    "Hardware": "Intel 4x 2.5GbE Appliance",
    "OS": "FreeBSD / OPNsense",
    "Security": "Suricata IDS, CrowdSec"
  }
}
```

Then run either:
```bash
python3 projects/sync.py
# or
node projects/sync.js
```
Your new project will immediately appear on the site with filtering, search, and detailed inspection!
