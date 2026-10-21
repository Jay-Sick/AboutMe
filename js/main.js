/**
 * Jacek Szewczyk // Professional IT Portfolio & Projects
 * Dynamic category populator, project inspector & modal interactions
 */

document.addEventListener("DOMContentLoaded", () => {
  initTerminal();
  initProjects();
  initModalBackdropClose();
});

let allProjects = [];

async function initProjects() {
  const container = document.getElementById("projects-container");
  const featuredContainer = document.getElementById("featured-projects-container");
  
  if (!container && !featuredContainer) return;

  try {
    let loadedData = null;
    try {
      const response = await fetch("projects/projects.json", { cache: "no-store" });
      if (response.ok) {
        loadedData = await response.json();
      }
    } catch (e) {
      // Local file:// protocol fallback
    }

    if (!loadedData && window.PROJECTS_DATA) {
      loadedData = window.PROJECTS_DATA;
    }

    if (loadedData && Array.isArray(loadedData)) {
      allProjects = loadedData;

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
  } catch (err) {
    console.error("Error loading projects:", err);
  }
}

/**
 * Dynamically populates category filter buttons based on what exists in the project data!
 */
function setupDynamicCategories(projects) {
  const filterContainer = document.getElementById("filter-buttons-container");
  if (!filterContainer) return;

  // Extract unique categories
  const categories = ["All", ...new Set(projects.map(p => p.category).filter(Boolean))];

  filterContainer.innerHTML = categories.map((cat, idx) => {
    const isAll = cat === "All";
    const activeClass = idx === 0 ? "filter-btn active" : "filter-btn";
    const dataFilter = isAll ? "all" : cat;
    const count = isAll ? projects.length : projects.filter(p => p.category === cat).length;
    return `<button class="${activeClass}" data-filter="${dataFilter}">${cat} (${count})</button>`;
  }).join("");

  // Attach click listener
  filterContainer.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      filterContainer.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const category = btn.dataset.filter;
      const searchInput = document.getElementById("project-search");
      const query = (searchInput?.value || "").toLowerCase().trim();
      filterProjects(category, query);
    });
  });
}

function renderFeaturedProjects(projects, targetEl) {
  targetEl.innerHTML = projects.map(p => createProjectCardHTML(p)).join("");
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

  container.innerHTML = projects.map(p => createProjectCardHTML(p)).join("");
  attachProjectInspectEvents();
}

function createProjectCardHTML(project) {
  const tagsHTML = (project.tags || []).slice(0, 5).map(t => `<span class="tag-chip">#${t}</span>`).join("");
  
  let statsOrBadge = "";
  if (project.badgeHtml) {
    statsOrBadge = `<div style="margin-bottom: 0.75rem;">${project.badgeHtml}</div>`;
  } else if (project.stats) {
    statsOrBadge = `<div class="project-stats-pill">★ ${project.stats}</div>`;
  }

  return `
    <div class="project-card" data-id="${project.id}">
      <div class="project-card-header">
        <span class="project-badge">${project.category || "Project"}</span>
        <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-dim);">${project.date || ""}</span>
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
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    const activeCategory = document.querySelector("#filter-buttons-container .filter-btn.active")?.dataset.filter || "all";
    filterProjects(activeCategory, query);
  });
}

function filterProjects(category, query) {
  let filtered = allProjects;

  if (category && category !== "all") {
    filtered = filtered.filter(p => p.category === category);
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

  modalBody.innerHTML = `
    <div style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center;">
      <span class="project-badge">${project.category || "Project"}</span>
      <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-amber);">${project.status || ""}</span>
    </div>
    <h2 style="font-size: 1.8rem; color: #fff; margin-bottom: 0.5rem;">${project.title}</h2>
    <p style="color: var(--text-muted); font-size: 1.05rem; margin-bottom: 0.5rem;">${project.subtitle || project.summary}</p>
    
    ${badgeOrStats}
    ${specsHTML}
    ${highlightsHTML}

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
};

/**
 * Click off to the side (backdrop) to close modal!
 */
function initModalBackdropClose() {
  const modal = document.getElementById("project-modal");
  if (!modal) return;

  modal.addEventListener("click", (e) => {
    // If user clicked the backdrop itself (not inner content)
    if (e.target === modal) {
      closeProjectModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeProjectModal();
  });
}

/**
 * Copy email helper function
 */
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

/* Mini Terminal */
function initTerminal() {
  const input = document.getElementById("term-input");
  const output = document.getElementById("term-output-area");
  if (!input || !output) return;

  const commands = {
    help: "Available commands: [whoami, certs, projects, contact, clear]",
    whoami: "Jacek Szewczyk // Network Systems & IT Infrastructure Specialist. Location: Illinois.",
    certs: "CCNA, Security+, Network+, Linux+, A+, AZ-900. Click any badge to verify directly.",
    projects: "AMV Converter, Enterprise Cisco Home Lab, DIY TrueNAS Cloud. See Projects tab.",
    contact: "Email: jacek@notatestlol.com | Location: Illinois",
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
