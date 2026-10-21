window.PROJECTS_DATA = [
  {
    "id": "openclaw-proxmox-ai",
    "title": "OpenClaw AI Assistant Deployment on Proxmox",
    "subtitle": "Self-hosted AI assistant running in a virtualized Proxmox environment",
    "categories": [
      "AI",
      "Virtualization"
    ],
    "date": "January 2026 - Present",
    "startDate": "2026-01",
    "status": "Live Production",
    "featured": true,
    "stats": "Proxmox VE • OpenClaw • Self-Hosted AI",
    "primaryLink": null,
    "tags": [
      "Proxmox VE",
      "OpenClaw",
      "Virtualization",
      "Linux",
      "Self-Hosted AI",
      "Networking",
      "System Administration",
      "Infrastructure"
    ],
    "summary": "Deployed OpenClaw, a self-hosted AI assistant, using Proxmox VE to create and manage a dedicated virtualized environment. Demonstrates hands-on experience with hypervisor management, Linux system administration, service deployment, and hosting AI infrastructure on privately managed hardware.",
    "highlights": [
      "Provisioned a dedicated virtual machine in Proxmox VE to host the OpenClaw AI assistant.",
      "Configured the virtualized Linux environment and installed the dependencies required to run OpenClaw.",
      "Deployed and configured OpenClaw as a self-hosted service, establishing the foundation for a privately managed AI assistant.",
      "Leveraged Proxmox virtualization to isolate the AI workload from other homelab services and simplify resource management.",
      "Integrated the deployment into a broader homelab environment, applying networking and infrastructure management practices to self-hosted AI."
    ],
    "techSpecs": {
      "Hypervisor": "Proxmox VE",
      "Application": "OpenClaw Self-Hosted AI Assistant",
      "Operating System": "Linux Virtual Machine",
      "Virtualization": "KVM/QEMU Virtual Machine Management",
      "Infrastructure": "Self-Hosted Homelab Hardware",
      "Core Skills": "Linux Administration, Service Deployment, Virtualization, Network Configuration"
    },
    "featuredOrder": 1
  },
  {
    "id": "amv-converter",
    "title": "AMV Converter",
    "subtitle": "Desktop media conversion utility for portable MP4 hardware",
    "categories": [
      "Tools & Utilities",
      "Software"
    ],
    "date": "January 2024 - Present",
    "startDate": "2024-01",
    "status": "Active / Maintained",
    "featured": true,
    "badgeHtml": "<a href=\"https://sourceforge.net/projects/amv-converter/files/latest/download\" target=\"_blank\" rel=\"noopener noreferrer\"><img alt=\"Download AMV-Converter\" src=\"https://img.shields.io/sourceforge/dt/amv-converter.svg\"></a>",
    "primaryLink": {
      "label": "View on SourceForge ↗",
      "url": "https://sourceforge.net/projects/amv-converter/"
    },
    "tags": [
      "Python",
      "Tkinter",
      "FFmpeg",
      "Windows",
      "Utility"
    ],
    "summary": "Creator and maintainer of AMV Converter, providing an intuitive Windows desktop graphical interface for FFmpeg to re-encode and transcode modern media files into AMV format for legacy and portable hardware.",
    "highlights": [
      "Engineered an intuitive Tkinter GUI wrapping complex FFmpeg command-line conversion parameters.",
      "Integrated automated resolution downscaling, aspect ratio preservation, and audio channel remapping.",
      "Handled error tolerance for non-standard framerates and legacy hardware playback constraints."
    ],
    "techSpecs": {
      "Environment": "Windows / Cross-Platform",
      "Framework": "Python / Tkinter",
      "Media Engine": "FFmpeg API / CLI Wrapper",
      "Distribution": "SourceForge Installer"
    },
    "featuredOrder": 2,
    "images": [
      "projects/images/amv-converter-preview.svg",
      "projects/images/amv-converter-preview.svg"
    ]
  },
  {
    "id": "homelab-infrastructure",
    "title": "Enterprise Home Lab & Network Infrastructure",
    "subtitle": "Multi-tier physical Cisco network, Active Directory domain, and virtualization host",
    "categories": [
      "Networking",
      "Systems"
    ],
    "date": "January 2024 - Present",
    "startDate": "2024-01",
    "status": "Live Production",
    "featured": true,
    "stats": "Cisco IOS • 802.1Q VLANs • Active Directory",
    "primaryLink": null,
    "tags": [
      "Cisco IOS",
      "CCNA",
      "VLANs",
      "Windows Server",
      "Active Directory",
      "Proxmox",
      "DNS/DHCP",
      "VPN"
    ],
    "summary": "Designed, wired, and actively administer an enterprise home lab featuring physical Cisco switches and routers, Windows Server Active Directory domain services, and hypervisor virtualization.",
    "highlights": [
      "Segmented network using 802.1Q VLANs separating Management, Corporate LAN, Lab, and Guest/IoT environments.",
      "Configured Cisco IOS routing, inter-VLAN routing (Router-on-a-Stick), access control lists (ACLs), NAT, and port security.",
      "Deployed Windows Server with Active Directory Domain Services (AD DS), Group Policy Objects (GPOs), and local DNS/DHCP failover.",
      "Configured secure remote access with WireGuard and hardened firewall boundaries."
    ],
    "techSpecs": {
      "Network Hardware": "Cisco Switches & Routers, Custom x86 Servers",
      "Operating Systems": "Windows Server, Windows 11 Pro, Cisco IOS, Linux",
      "Core Services": "Active Directory, Group Policy, DNS, DHCP, VLANs, ACLs",
      "Virtualization": "Proxmox VE Hypervisor"
    },
    "featuredOrder": 3
  },
  {
    "id": "diy-nas",
    "title": "DIY Network Attached Storage & UPS Automation",
    "subtitle": "Resilient ZFS central storage pool with APC UPS failover and containerized services",
    "categories": [
      "Storage",
      "Infrastructure"
    ],
    "date": "January 2025 - Present",
    "startDate": "2025-01",
    "status": "Live Production",
    "featured": true,
    "stats": "ZFS RAID-Z • TrueNAS • UPS Automation",
    "primaryLink": null,
    "tags": [
      "TrueNAS",
      "ZFS",
      "Storage",
      "UPS Integration",
      "SMB/NFS",
      "Data Protection"
    ],
    "summary": "Engineered a custom high-availability Network Attached Storage (NAS) appliance running TrueNAS. Delivers centralized network shares (SMB/NFS) for Windows clients with automated ZFS snapshot schedules and APC UPS integration.",
    "highlights": [
      "Configured redundant ZFS storage pool with automated snapshot schedules and scrub tasks for data integrity.",
      "Integrated APC Smart-UPS via Network UPS Tools (NUT) to trigger automated graceful shutdowns and prevent filesystem corruption.",
      "Configured secure SMB shares with Windows ACL permissions and Active Directory integration.",
      "Administered automated local and offsite replication routines."
    ],
    "techSpecs": {
      "Storage OS": "TrueNAS SCALE (ZFS)",
      "Storage Pool": "Redundant ZFS RAID-Z",
      "Protocols": "SMB / CIFS, NFS, SSH",
      "Power Protection": "APC Smart-UPS with NUT Daemon"
    },
    "featuredOrder": 4
  },
  {
    "id": "writeup-homelab-vlan",
    "title": "Technical Note: Enterprise VLAN Segmentation & Cisco IOS Routing",
    "subtitle": "Layer 2/3 boundary routing, 802.1Q trunking, and subnet security policies",
    "categories": [
      "Technical Notes",
      "Networking"
    ],
    "date": "October 2026",
    "startDate": "2026-10",
    "status": "Field Documentation",
    "featured": false,
    "tags": [
      "Cisco IOS",
      "VLANs",
      "Routing",
      "Network Security",
      "Documentation"
    ],
    "summary": "Architectural breakdown of implementing 802.1Q VLAN trunking and sub-interfaces on Cisco Catalyst switches and routers to isolate server workloads from administrative endpoints.",
    "highlights": [
      "Defined discrete broadcast domains for Management (VLAN 10), Workstations (VLAN 20), and Services (VLAN 30).",
      "Implemented Router-on-a-Stick sub-interface routing with strict inbound and outbound extended ACLs.",
      "Enforced DHCP snooping and port security against rogue DHCP servers and MAC flooding."
    ],
    "techSpecs": {
      "Protocols": "802.1Q, Inter-VLAN Routing, Extended ACLs",
      "Hardware": "Cisco Catalyst 3750 / 2960 Series",
      "Documentation Type": "Network Engineering Architecture"
    },
    "featuredOrder": 99
  },
  {
    "id": "writeup-truenas-ups",
    "title": "Technical Note: TrueNAS SCALE & Automated UPS Power Protection",
    "subtitle": "Network UPS Tools (NUT) daemon configuration for graceful unattended shutdown",
    "categories": [
      "Technical Notes",
      "Storage"
    ],
    "date": "September 2026",
    "startDate": "2026-09",
    "status": "Field Documentation",
    "featured": false,
    "tags": [
      "TrueNAS",
      "ZFS",
      "NUT",
      "Power Management",
      "Documentation"
    ],
    "summary": "Engineering walkthrough on configuring Network UPS Tools to broadcast power event triggers across local network hosts and initiate orderly ZFS pool exports during extended utility outages.",
    "highlights": [
      "Configured NUT master daemon on TrueNAS host with USB APC Smart-UPS telemetry monitoring.",
      "Automated shutdown threshold rules when battery capacity drops below critical levels.",
      "Ensured atomic flushing of transaction groups prior to system halt."
    ],
    "techSpecs": {
      "Daemon": "Network UPS Tools (NUT)",
      "Storage": "ZFS File System",
      "Hardware": "APC Smart-UPS 1500VA"
    },
    "featuredOrder": 99
  }
];