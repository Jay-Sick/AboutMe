/**
 * Jacek Szewczyk // Professional IT Portfolio
 * Dynamic multi-category loader, featured ordering, image lightbox with PC mouse zoom + mobile pinch-zoom,
 * Matrix sequential card load animation, dynamic education, and layout re-ordering.
 */

document.addEventListener("DOMContentLoaded", () => {
  initProfileAndCerts();
  initEducation();
  initProjects();
  initModalBackdropClose();
  initLightbox();
});

let allProjects = [];
let allCertifications = [];
let allExperience = [];
let allEducation = [];
let siteProfile = null;
let searchTimeout = null;

const GITHUB_USER = "Jay-Sick";

function getRepoName() {
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  if (pathParts.length > 0 && !pathParts[0].includes(".html")) {
    return pathParts[0];
  }
  return window.location.hostname.includes("github.io") ? window.location.hostname.split(".")[0] : "portfolio";
}

/**
 * Loads dynamic certifications, experience, profile, and layouts
 * Prioritizes bundled data on file:// for instant 0ms hydration, fetches JSON on http/https
 */
async function initProfileAndCerts() {
  try {
    const isFile = window.location.protocol === "file:" || !window.location.hostname;

    // 1. Certifications
    if (window.SITE_CERTIFICATIONS) {
      allCertifications = window.SITE_CERTIFICATIONS;
      renderCertifications(allCertifications);
    }
    if (!isFile) {
      try {
        const res = await fetch("data/certifications.json", { cache: "no-store" });
        if (res.ok) {
          allCertifications = await res.json();
          renderCertifications(allCertifications);
        }
      } catch(e) {}
    }

    // 2. Experience
    if (window.SITE_EXPERIENCE) {
      allExperience = window.SITE_EXPERIENCE;
      renderExperience(allExperience);
    }
    if (!isFile) {
      try {
        const res = await fetch("data/experience.json", { cache: "no-store" });
        if (res.ok) {
          allExperience = await res.json();
          renderExperience(allExperience);
        }
      } catch(e) {}
    }

    // 3. Profile & Terminal
    if (window.SITE_PROFILE) {
      siteProfile = window.SITE_PROFILE;
      renderTerminalWhoami(siteProfile, allCertifications);
    }
    if (!isFile) {
      try {
        const res = await fetch("data/profile.json", { cache: "no-store" });
        if (res.ok) {
          siteProfile = await res.json();
          renderTerminalWhoami(siteProfile, allCertifications);
        }
      } catch(e) {}
    }

    // 4. Layout Ordering
    initLayoutOrdering();

  } catch (err) {
    console.error("Error loading site data:", err);
  }
}

/**
 * Loads dynamic education from data/education.json
 */
async function initEducation() {
  try {
    const isFile = window.location.protocol === "file:" || !window.location.hostname;

    if (window.SITE_EDUCATION && Array.isArray(window.SITE_EDUCATION)) {
      allEducation = window.SITE_EDUCATION;
      renderEducation(allEducation);
    }

    if (!isFile) {
      try {
        const res = await fetch("data/education.json", { cache: "no-store" });
        if (res.ok) {
          allEducation = await res.json();
          renderEducation(allEducation);
        }
      } catch(e) {}
    }
  } catch(e) {
    console.error("Error loading education data:", e);
  }
}

function renderEducation(eduList) {
  const eduContainer = document.getElementById("education-container");
  if (!eduContainer) return;

  eduContainer.innerHTML = eduList.map(item => {
    let degreeLinksHTML = "";
    if (item.degrees && Array.isArray(item.degrees)) {
      degreeLinksHTML = item.degrees.map(d => 
        `<a href="${d.url}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline;">${d.name}</a>`
      ).join(" &amp; ");
    } else if (item.degree) {
      degreeLinksHTML = item.degreeUrl 
        ? `<a href="${item.degreeUrl}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline;">${item.degree}</a>`
        : item.degree;
    }

    return `
      <div class="education-card" style="background: var(--bg-card); border-left: 4px solid ${item.borderAccent || 'var(--accent-cyan)'}; border-radius: var(--radius-sm); padding: 1.5rem; border-top: 1px solid var(--border-color); border-right: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color);">
        <div style="font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 4px;">${item.institution}</div>
        <div class="${item.badgeClass || 'education-badge'}">
          ${degreeLinksHTML} // ${item.period}
        </div>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 8px; line-height: 1.6;">
          ${item.description || item.highlights || ""}
        </p>
      </div>
    `;
  }).join("");
}

/**
 * Re-orders page sections dynamically based on home-layout.json and dossier-layout.json
 */
async function initLayoutOrdering() {
  const homeWrapper = document.getElementById("home-sections-wrapper");
  if (homeWrapper) {
    let layout = null;
    try {
      const res = await fetch("data/home-layout.json", { cache: "no-store" });
      if (res.ok) layout = await res.json();
    } catch(e) {}
    if (!layout && window.SITE_HOME_LAYOUT) layout = window.SITE_HOME_LAYOUT;
    if (layout && Array.isArray(layout)) {
      reorderSections(homeWrapper, layout);
    }
  }

  const dossierWrapper = document.getElementById("dossier-sections-wrapper");
  if (dossierWrapper) {
    let layout = null;
    try {
      const res = await fetch("data/dossier-layout.json", { cache: "no-store" });
      if (res.ok) layout = await res.json();
    } catch(e) {}
    if (!layout && window.SITE_DOSSIER_LAYOUT) layout = window.SITE_DOSSIER_LAYOUT;
    if (layout && Array.isArray(layout)) {
      reorderSections(dossierWrapper, layout);
    }
  }
}

function reorderSections(container, layoutOrder) {
  layoutOrder.forEach(sectionKey => {
    const el = container.querySelector(`[data-section="${sectionKey}"]`);
    if (el) {
      container.appendChild(el);
    }
  });
}

function renderCertifications(certs) {
  const certsContainer = document.getElementById("certs-container");
  if (certsContainer) {
    certsContainer.innerHTML = certs.map(c => `
      <a href="${c.verifyUrl}" target="_blank" rel="noopener noreferrer" class="cert-card" style="text-decoration: none;">
        <div class="cert-icon" style="color: ${c.accentColor}; border-color: ${c.accentColor}66;">${c.code}</div>
        <div class="cert-info">
          <h4>${c.name}</h4>
          <p>${c.issuer} // ${c.exam} <span style="color: ${c.accentColor}; font-weight: bold; margin-left: 4px;">${c.verifyLabel || 'Verify ↗'}</span></p>
        </div>
      </a>
    `).join("");
  }

  const heroBadges = document.getElementById("hero-cert-pills");
  if (heroBadges) {
    heroBadges.innerHTML = certs.map(c => `
      <div class="stat-pill"><strong>${c.code}</strong> Certified</div>
    `).join("");
  }
}

function renderExperience(expList) {
  const expContainer = document.getElementById("experience-container");
  if (!expContainer) return;

  expContainer.innerHTML = expList.map(item => `
    <div class="experience-card">
      <div style="display: flex; justify-content: space-between; flex-wrap: wrap; margin-bottom: 4px;">
        <h3 style="color: #fff; font-size: 1.25rem; font-weight: 700;">${item.organization}</h3>
        <span style="font-family: var(--font-mono); color: var(--accent-amber); font-size: 0.85rem;">${item.period}</span>
      </div>
      <div class="experience-role-badge">
        ${item.role} // ${item.location}
      </div>
      <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-top: 6px;">
        ${item.description}
      </p>
      ${item.skills ? `
        <div class="project-tags" style="margin-top: 10px; margin-bottom: 0;">
          ${item.skills.map(s => `<span class="tag-chip">#${s}</span>`).join("")}
        </div>
      ` : ""}
    </div>
  `).join("");
}

function renderTerminalWhoami(profile, certs) {
  const certString = certs && certs.length ? certs.map(c => c.code).join(", ") : "CCNA, Security+, Network+, Linux+, A+, AZ-900";
  const whoamiOutput = document.getElementById("term-whoami-output");
  if (whoamiOutput) {
    whoamiOutput.innerHTML = `
      ${profile.name} // ${profile.title}<br>
      <span class="term-highlight">Education:</span> ${profile.educationSummary}<br>
      <span class="term-highlight">Certifications:</span> ${certString}<br>
      <span class="term-highlight">Focus:</span> ${profile.focus}
    `;
  }

  const servicesOutput = document.getElementById("term-services-output");
  if (servicesOutput && profile.runningServices) {
    servicesOutput.innerHTML = profile.runningServices.join("<br>");
  }

  initTerminal(profile, certString);
}

/**
 * Project sorting helper:
 * 1. Pinned projects first (featured === true)
 *    - If featuredOrder is provided (< 90), sort by featuredOrder ascending (1, 2, 3...)
 *    - Otherwise, sort by date descending, tie-breaker by id
 * 2. Unpinned projects (featured !== true)
 *    - Strictly sorted by date descending (newest to oldest started)!
 *    - Tie-breaker: alphabetical by id
 */
function sortProjects(list) {
  return [...list].sort((a, b) => {
    const aFeat = !!a.featured;
    const bFeat = !!b.featured;
    if (aFeat !== bFeat) {
      return aFeat ? -1 : 1;
    }

    if (aFeat && bFeat) {
      const hasOrderA = typeof a.featuredOrder === "number" && a.featuredOrder < 90;
      const hasOrderB = typeof b.featuredOrder === "number" && b.featuredOrder < 90;
      if (hasOrderA && hasOrderB && a.featuredOrder !== b.featuredOrder) {
        return a.featuredOrder - b.featuredOrder;
      }
      if (hasOrderA) return -1;
      if (hasOrderB) return 1;

      const dateA = a.startDate || a.date || "";
      const dateB = b.startDate || b.date || "";
      if (dateA !== dateB) return dateB.localeCompare(dateA);
      return a.id.localeCompare(b.id);
    }

    const dateA = a.startDate || a.date || "";
    const dateB = b.startDate || b.date || "";
    if (dateA !== dateB) {
      return dateB.localeCompare(dateA);
    }
    return a.id.localeCompare(b.id);
  });
}

function getProjectCategories(project) {
  if (Array.isArray(project.categories) && project.categories.length) {
    return project.categories;
  }
  if (Array.isArray(project.category) && project.category.length) {
    return project.category;
  }
  if (typeof project.category === "string" && project.category) {
    return [project.category];
  }
  return ["General"];
}

async function initProjects() {
  const container = document.getElementById("projects-container");
  const featuredContainer = document.getElementById("featured-projects-container");
  if (!container && !featuredContainer) return;

  try {
    const isFile = window.location.protocol === "file:" || !window.location.hostname;

    // Immediately render bundled data if present (0ms delay)
    if (window.PROJECTS_DATA && Array.isArray(window.PROJECTS_DATA)) {
      allProjects = sortProjects(window.PROJECTS_DATA.filter(p => p && p.title && !p.disabled));
      if (container) {
        setupDynamicCategories(allProjects);
        renderProjectsList(allProjects);
        setupProjectSearch();
      }
      if (featuredContainer) {
        const top3 = allProjects.filter(p => p.featured).slice(0, 3);
        renderFeaturedProjects(top3, featuredContainer);
      }
    }

    // If online on web server or GitHub Pages, fetch latest dynamically
    if (!isFile) {
      let loadedData = null;

      if (window.location.hostname.includes("github.io")) {
        const repo = getRepoName();
        const apiUrl = `https://api.github.com/repos/${GITHUB_USER}/${repo}/contents/projects`;
        try {
          const apiRes = await fetch(apiUrl);
          if (apiRes.ok) {
            const files = await apiRes.json();
            const projectFiles = files.filter(f => 
              f.name.endsWith(".json") && 
              f.name !== "projects.json" && 
              f.name !== "manifest.json" &&
              !f.name.startsWith("writeup-homelab-vlan") &&
              f.type === "file"
            );
            if (projectFiles.length > 0) {
              const fetchPromises = projectFiles.map(async (file) => {
                const res = await fetch(file.download_url || `projects/${file.name}`);
                return res.ok ? await res.json() : null;
              });
              const fetched = await Promise.all(fetchPromises);
              loadedData = fetched.filter(p => p && p.title && !p.disabled);
            }
          }
        } catch (e) {}
      }

      if (!loadedData || loadedData.length === 0) {
        try {
          const response = await fetch("projects/projects.json?t=" + Date.now(), { cache: "no-store" });
          if (response.ok) {
            const jsonArr = await response.json();
            loadedData = jsonArr.filter(p => p && p.title && !p.disabled);
          }
        } catch (e) {}
      }

      if (loadedData && Array.isArray(loadedData) && loadedData.length > 0) {
        allProjects = sortProjects(loadedData);
        if (container) {
          setupDynamicCategories(allProjects);
          renderProjectsList(allProjects);
          setupProjectSearch();
        }
        if (featuredContainer) {
          const top3 = allProjects.filter(p => p.featured).slice(0, 3);
          renderFeaturedProjects(top3, featuredContainer);
        }
      }
    }
  } catch (err) {
    console.error("Error loading projects:", err);
  }
}

function setupDynamicCategories(projects) {
  const filterContainer = document.getElementById("filter-buttons-container");
  if (!filterContainer) return;

  const catSet = new Set();
  projects.forEach(p => {
    getProjectCategories(p).forEach(c => catSet.add(c));
  });
  const allCategories = Array.from(catSet);

  const initialLimit = 5;
  const hasMore = allCategories.length > initialLimit;
  const primaryCats = allCategories.slice(0, initialLimit);
  const secondaryCats = allCategories.slice(initialLimit);

  function countFor(cat) {
    return projects.filter(p => getProjectCategories(p).includes(cat)).length;
  }

  let html = `<button class="filter-btn active" data-filter="all">All (${projects.length})</button>`;

  primaryCats.forEach(cat => {
    html += `<button class="filter-btn" data-filter="${cat}">${cat} (${countFor(cat)})</button>`;
  });

  if (hasMore) {
    html += `<div id="more-categories-wrapper" class="more-cats-collapsed" style="display: contents;">`;
    secondaryCats.forEach(cat => {
      html += `<button class="filter-btn extra-cat" data-filter="${cat}" style="display: none;">${cat} (${countFor(cat)})</button>`;
    });
    html += `</div>`;
    html += `<button id="btn-toggle-categories" class="filter-btn toggle-more-btn">+ More Categories (${secondaryCats.length}) ▾</button>`;
  }

  filterContainer.innerHTML = html;

  const toggleBtn = document.getElementById("btn-toggle-categories");
  if (toggleBtn) {
    let expanded = false;
    toggleBtn.addEventListener("click", () => {
      expanded = !expanded;
      const extraButtons = filterContainer.querySelectorAll(".extra-cat");
      extraButtons.forEach(btn => {
        btn.style.display = expanded ? "inline-block" : "none";
      });
      toggleBtn.textContent = expanded ? "Show Less ▴" : `+ More Categories (${secondaryCats.length}) ▾`;
      toggleBtn.classList.toggle("active-toggle", expanded);
    });
  }

  filterContainer.querySelectorAll(".filter-btn:not(.toggle-more-btn)").forEach(btn => {
    btn.addEventListener("click", () => {
      filterContainer.querySelectorAll(".filter-btn:not(.toggle-more-btn)").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const category = btn.dataset.filter;
      const searchInput = document.getElementById("project-search");
      const query = (searchInput?.value || "").toLowerCase().trim();
      filterProjects(category, query);
    });
  });
}

function renderFeaturedProjects(projects, targetEl) {
  targetEl.innerHTML = projects.map((p, idx) => createProjectCardHTML(p, true, idx)).join("");
  attachProjectInspectEvents();
}

function renderProjectsList(projects) {
  const container = document.getElementById("projects-container");
  if (!container) return;

  const countBadge = document.getElementById("project-count");
  if (countBadge) countBadge.textContent = projects.length;

  if (projects.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted); font-family: var(--font-mono);">
        No records found matching current criteria.
      </div>
    `;
    return;
  }

  // Render cards with Matrix digital sequential load
  container.innerHTML = projects.map((p, idx) => createProjectCardHTML(p, false, idx)).join("");
  attachProjectInspectEvents();
}

/**
 * Creates Project Card HTML with Matrix Entrance & Compact Badges
 */
function createProjectCardHTML(project, isHomeFeatured, index = 0) {
  const cats = getProjectCategories(project);
  const categoriesHTML = cats.map(c => `<span class="project-badge badge-compact">${c}</span>`).join(" ");

  const pinnedBadge = project.featured ? `<span class="pinned-badge" title="Pinned Project">📌</span>` : "";

  const tagsHTML = (project.tags || []).slice(0, 5).map(t => `<span class="tag-chip">#${t}</span>`).join("");
  
  let statsOrBadge = "";
  if (project.badgeHtml) {
    statsOrBadge = `<div style="margin-bottom: 0.75rem;">${project.badgeHtml}</div>`;
  } else if (project.stats) {
    statsOrBadge = `<div class="project-stats-pill">★ ${project.stats}</div>`;
  }

  return `
    <div class="project-card matrix-card-enter ${project.featured ? 'card-pinned' : ''}" data-id="${project.id}" style="--card-index: ${index};">
      <div class="project-card-header">
        <div class="categories-cluster">
          ${pinnedBadge}
          ${categoriesHTML}
        </div>
        <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-dim); white-space: nowrap;">${project.date || ""}</span>
      </div>
      
      <h3 class="project-title">${project.title}</h3>
      ${statsOrBadge}
      
      <p class="project-desc">${project.summary}</p>
      
      <div class="project-tags">
        ${tagsHTML}
      </div>

      <div class="project-footer">
        <button class="btn-cyber-outline btn-inspect" data-project-id="${project.id}" style="font-size: 0.8rem; padding: 6px 14px; cursor: pointer;">
          View Details →
        </button>
        ${project.primaryLink ? `
          <a href="${project.primaryLink.url}" target="_blank" rel="noopener noreferrer" class="btn-cyber-primary" style="padding: 6px 12px; font-size: 0.75rem; text-decoration: none;">
            ${project.primaryLink.label || "Link ↗"}
          </a>
        ` : ""}
        ${project.github ? `
          <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn-embed-social btn-github" style="padding: 5px 10px; font-size: 0.75rem;">
            <svg viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            GitHub
          </a>
        ` : ""}
      </div>
    </div>
  `;
}

function setupProjectSearch() {
  const searchInput = document.getElementById("project-search");
  const container = document.getElementById("projects-container");
  if (!searchInput || !container) return;

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    const activeCategory = document.querySelector("#filter-buttons-container .filter-btn.active")?.dataset.filter || "all";

    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      filterProjects(activeCategory, query);
    }, 50);
  });
}

function filterProjects(category, query) {
  let filtered = allProjects;

  if (category && category !== "all") {
    filtered = filtered.filter(p => getProjectCategories(p).includes(category));
  }

  if (query) {
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(query) ||
      p.summary.toLowerCase().includes(query) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(query)))
    );
  }

  renderProjectsList(filtered);
}

function attachProjectInspectEvents() {
  document.querySelectorAll(".btn-inspect").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.projectId;
      const project = allProjects.find(p => p.id === id);
      if (project) openProjectModal(project);
    });
  });
}

function openProjectModal(project) {
  const modal = document.getElementById("project-modal");
  const modalBody = document.getElementById("modal-project-details");
  if (!modal || !modalBody) return;

  document.body.classList.add("modal-open");

  const cats = getProjectCategories(project);
  const categoriesHTML = cats.map(c => `<span class="project-badge badge-compact">${c}</span>`).join(" ");

  let specsHTML = "";
  if (project.techSpecs) {
    specsHTML = `
      <div style="background: #090c12; border: 1px solid var(--border-color); border-radius: 6px; padding: 1.25rem; margin: 1.25rem 0; font-family: var(--font-mono); font-size: 0.82rem;">
        <div style="color: var(--accent-green); font-weight: 700; margin-bottom: 8px;">// TECHNICAL SPECIFICATIONS</div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px;">
          ${Object.entries(project.techSpecs).map(([key, val]) => `
            <div><span style="color: var(--text-dim);">${key}:</span> <span style="color: var(--accent-cyan);">${val}</span></div>
          `).join("")}
        </div>
      </div>
    `;
  }

  let highlightsHTML = "";
  if (project.highlights && project.highlights.length) {
    highlightsHTML = `
      <div style="margin: 1.25rem 0;">
        <h4 style="color: #fff; font-size: 1rem; margin-bottom: 0.5rem;">Key Technical Highlights:</h4>
        <ul style="padding-left: 1.25rem; color: var(--text-muted); font-size: 0.95rem; line-height: 1.7;">
          ${project.highlights.map(h => `<li>${h}</li>`).join("")}
        </ul>
      </div>
    `;
  }

  let badgeOrStats = "";
  if (project.badgeHtml) {
    badgeOrStats = `<div style="margin: 0.5rem 0 1rem 0;">${project.badgeHtml}</div>`;
  } else if (project.stats) {
    badgeOrStats = `<div class="project-stats-pill" style="margin-bottom: 1rem;">★ ${project.stats}</div>`;
  }

  let imagesList = [];
  if (Array.isArray(project.images) && project.images.length) {
    imagesList = project.images;
  } else if (project.image) {
    imagesList = [project.image];
  }

  let imageHTML = "";
  if (imagesList.length > 0) {
    imageHTML = `
      <div class="project-modal-image-wrapper">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="color: var(--accent-green); font-family: var(--font-mono); font-size: 0.78rem;">// PROJECT INTERFACE &amp; DIAGRAMS</span>
          <span style="color: var(--text-dim); font-family: var(--font-mono); font-size: 0.72rem;">(Click to zoom)</span>
        </div>
        <div class="modal-images-grid">
          ${imagesList.map((imgSrc, idx) => `
            <img src="${imgSrc}" alt="${project.title} Preview ${idx + 1}" class="project-detail-img" onerror="this.style.opacity='0.4'" onclick="openImageLightbox('${imgSrc}')">
          `).join("")}
        </div>
      </div>
    `;
  }

  modalBody.innerHTML = `
    <div class="modal-top-bar">
      ${project.featured ? '<span class="pinned-badge" title="Pinned Project">📌</span>' : ''}
      ${categoriesHTML}
      ${project.status ? `<span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-amber);">${project.status}</span>` : ''}
    </div>
    <h2 style="font-size: 1.8rem; color: #fff; margin-bottom: 0.5rem; word-break: break-word;">${project.title}</h2>
    <p style="color: var(--text-muted); font-size: 1.05rem; margin-bottom: 0.5rem;">${project.subtitle || project.summary}</p>
    
    ${badgeOrStats}
    ${specsHTML}
    ${highlightsHTML}
    ${imageHTML}

    <div style="display: flex; gap: 12px; margin-top: 2rem; flex-wrap: wrap;">
      ${project.primaryLink ? `
        <a href="${project.primaryLink.url}" target="_blank" rel="noopener noreferrer" class="btn-cyber-primary" style="text-decoration: none; padding: 8px 16px;">
          ${project.primaryLink.label || "Visit Link ↗"}
        </a>
      ` : ""}
      ${project.github ? `
        <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn-embed-social btn-github">
          <svg viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          GitHub Repository
        </a>
      ` : ""}
    </div>
  `;

  modal.classList.add("active");
}

window.closeProjectModal = function() {
  const modal = document.getElementById("project-modal");
  if (modal) modal.classList.remove("active");
  document.body.classList.remove("modal-open");
};

function initModalBackdropClose() {
  const modal = document.getElementById("project-modal");
  if (!modal) return;

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeProjectModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeProjectModal();
      closeImageLightbox();
    }
  });
}

/**
 * Image Lightbox with:
 * 1. PC: Click-to-zoom centered on clicked point + Mouse dragging to pan
 * 2. Mobile: 2-finger pinch-to-zoom + 1-finger touch pan
 * 3. Bulletproof Close Button with high z-index and click/touch listeners
 */
let lightboxScale = 1;
let lightboxPanX = 0;
let lightboxPanY = 0;
let isMouseDragging = false;
let mouseStartX = 0;
let mouseStartY = 0;

let startTouchDist = 0;
let startTouchScale = 1;
let isTouchPanning = false;
let lastTapTime = 0;

window.openImageLightbox = function(src) {
  let lightbox = document.getElementById("image-lightbox-modal");
  if (!lightbox) {
    lightbox = document.createElement("div");
    lightbox.id = "image-lightbox-modal";
    lightbox.className = "lightbox-overlay";
    lightbox.innerHTML = `
      <div class="lightbox-img-wrapper" id="lightbox-wrapper">
        <img id="lightbox-zoomed-img" class="lightbox-img" src="" alt="Zoomed Preview">
        <div class="lightbox-zoom-hint">Click point to zoom • Drag to pan</div>
      </div>
      <button id="btn-lightbox-close" class="lightbox-close" aria-label="Close Lightbox" type="button">&times;</button>
    `;
    document.body.appendChild(lightbox);
    setupLightboxGestures(lightbox);
  }

  const zoomedImg = document.getElementById("lightbox-zoomed-img");
  if (zoomedImg) {
    zoomedImg.src = src;
    resetLightboxZoom(zoomedImg);
  }

  lightbox.classList.add("active");
  document.body.classList.add("modal-open");
};

function resetLightboxZoom(imgEl) {
  lightboxScale = 1;
  lightboxPanX = 0;
  lightboxPanY = 0;
  const wrapper = document.getElementById("lightbox-wrapper");
  if (wrapper) {
    wrapper.classList.remove("is-zoomed", "is-dragging");
  }
  if (imgEl) {
    imgEl.style.transform = "scale(1) translate(0px, 0px)";
  }
}

function updateLightboxTransform(imgEl) {
  if (!imgEl) return;
  imgEl.style.transform = `scale(${lightboxScale}) translate(${lightboxPanX}px, ${lightboxPanY}px)`;
  const wrapper = document.getElementById("lightbox-wrapper");
  if (wrapper) {
    wrapper.classList.toggle("is-zoomed", lightboxScale > 1.05);
  }
}

function setupLightboxGestures(lightbox) {
  const wrapper = document.getElementById("lightbox-wrapper");
  const img = document.getElementById("lightbox-zoomed-img");
  const closeBtn = document.getElementById("btn-lightbox-close");
  if (!wrapper || !img) return;

  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeImageLightbox();
    });
    closeBtn.addEventListener("touchend", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeImageLightbox();
    });
  }

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target === wrapper) {
      closeImageLightbox();
    }
  });

  // --- PC / DESKTOP MOUSE ZOOM ON CLICKED POINT & MOUSE DRAG ---
  let isDragMove = false;

  img.addEventListener("mousedown", (e) => {
    if (lightboxScale > 1) {
      isMouseDragging = true;
      isDragMove = false;
      mouseStartX = e.clientX - lightboxPanX * lightboxScale;
      mouseStartY = e.clientY - lightboxPanY * lightboxScale;
      wrapper.classList.add("is-dragging");
      e.preventDefault();
    }
  });

  window.addEventListener("mousemove", (e) => {
    if (isMouseDragging && lightboxScale > 1) {
      isDragMove = true;
      lightboxPanX = (e.clientX - mouseStartX) / lightboxScale;
      lightboxPanY = (e.clientY - mouseStartY) / lightboxScale;
      updateLightboxTransform(img);
    }
  });

  window.addEventListener("mouseup", () => {
    if (isMouseDragging) {
      isMouseDragging = false;
      wrapper.classList.remove("is-dragging");
    }
  });

  img.addEventListener("click", (e) => {
    e.stopPropagation();
    if (isDragMove) {
      isDragMove = false;
      return;
    }

    if (lightboxScale <= 1.05) {
      const rect = img.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const originX = (clickX / rect.width) - 0.5;
      const originY = (clickY / rect.height) - 0.5;

      lightboxScale = 2.4;
      lightboxPanX = -originX * (rect.width * 0.7);
      lightboxPanY = -originY * (rect.height * 0.7);
      updateLightboxTransform(img);
    } else {
      resetLightboxZoom(img);
    }
  });

  // --- MOBILE TOUCH PINCH-TO-ZOOM & PAN ---
  wrapper.addEventListener("touchstart", (e) => {
    if (e.touches.length === 2) {
      startTouchDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      startTouchScale = lightboxScale;
    } else if (e.touches.length === 1) {
      const now = Date.now();
      if (now - lastTapTime < 300) {
        lightboxScale = lightboxScale > 1.2 ? 1 : 2.4;
        lightboxPanX = 0;
        lightboxPanY = 0;
        updateLightboxTransform(img);
        lastTapTime = 0;
        e.preventDefault();
        return;
      }
      lastTapTime = now;

      if (lightboxScale > 1) {
        isTouchPanning = true;
        startPanX = e.touches[0].clientX - lightboxPanX * lightboxScale;
        startPanY = e.touches[0].clientY - lightboxPanY * lightboxScale;
      }
    }
  }, { passive: false });

  wrapper.addEventListener("touchmove", (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (startTouchDist > 0) {
        const factor = currentDist / startTouchDist;
        lightboxScale = Math.min(Math.max(startTouchScale * factor, 1), 4);
        updateLightboxTransform(img);
      }
    } else if (e.touches.length === 1 && isTouchPanning && lightboxScale > 1) {
      e.preventDefault();
      lightboxPanX = (e.touches[0].clientX - startPanX) / lightboxScale;
      lightboxPanY = (e.touches[0].clientY - startPanY) / lightboxScale;
      updateLightboxTransform(img);
    }
  }, { passive: false });

  wrapper.addEventListener("touchend", (e) => {
    if (e.touches.length < 2) {
      startTouchDist = 0;
    }
    if (e.touches.length === 0) {
      isTouchPanning = false;
      if (lightboxScale <= 1.05) {
        resetLightboxZoom(img);
      }
    }
  });
}

function initLightbox() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeImageLightbox();
  });
}

window.copyEmailToClipboard = function() {
  const email = "jacek@notatestlol.com";
  navigator.clipboard.writeText(email).then(() => {
    const btn = document.getElementById("copy-email-btn");
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = "✔ Copied!";
      btn.style.borderColor = "var(--accent-green)";
      btn.style.color = "var(--accent-green)";
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.borderColor = "";
        btn.style.color = "";
      }, 2000);
    }
  }).catch(() => {
    alert("Email: jacek@notatestlol.com");
  });
};

window.toggleMobileNav = function() {
  const navList = document.getElementById("nav-links-list");
  if (navList) {
    navList.classList.toggle("mobile-open");
  }
};

function initTerminal(profile, certString) {
  const input = document.getElementById("term-input");
  const output = document.getElementById("term-output-area");
  if (!input || !output) return;

  const profName = profile ? profile.name : "Jacek Szewczyk";
  const profTitle = profile ? profile.title : "IT Professional";
  const profLoc = profile ? profile.location : "Chicago, Illinois";

  const commands = {
    help: "Available commands: [whoami, certs, projects, contact, clear]",
    whoami: `${profName} // ${profTitle}. Location: ${profLoc}.`,
    certs: certString || "CCNA, Security+, Network+, Linux+, A+, AZ-900. Click any badge to verify directly.",
    projects: "OpenClaw AI Proxmox, AMV Converter, Enterprise Cisco Home Lab, DIY TrueNAS Cloud. See Projects tab.",
    contact: `Email: jacek@notatestlol.com | Location: ${profLoc}`,
    clear: "CLEAR"
  };

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const val = input.value.trim().toLowerCase();
      input.value = "";
      if (!val) return;

      if (val === "clear") {
        output.innerHTML = "";
        return;
      }

      const line = document.createElement("div");
      line.className = "term-line";
      line.innerHTML = `<span class="term-prompt">C:\\Users\\Jacek&gt;</span> <span class="term-cmd">${val}</span>`;
      output.appendChild(line);

      const respLine = document.createElement("div");
      respLine.className = "term-output";

      if (commands[val]) {
        respLine.innerHTML = commands[val].replace(/\n/g, "<br>");
      } else {
        respLine.innerHTML = `Command not recognized. Type <span class="term-highlight">help</span> for a list of commands.`;
      }

      output.appendChild(respLine);
      output.scrollTop = output.scrollHeight;
    }
  });

  document.querySelectorAll(".term-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const cmd = chip.dataset.cmd;
      input.value = cmd;
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    });
  });
}
