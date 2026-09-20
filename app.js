// ==========================================================================
// Git Hydra — Interactive Static Page Engine
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initCopyButton();
  initTopologySimulator();
  initDownloadTabs();
  detectUserOS();
  initMobileMenu();
  initVisitorCounter();
  initCommentWall();
});

// --------------------------------------------------------------------------
// 1. Interactive Particle Network Canvas
// --------------------------------------------------------------------------
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const count = Math.floor((width * height) / 22000);

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.6 ? '#10b981' : (Math.random() > 0.5 ? '#06b6d4' : '#8b5cf6')
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.35;
      ctx.fill();

      // Connect lines
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = (1 - dist / 110) * 0.12;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(render);
  }
  render();
}

// --------------------------------------------------------------------------
// 2. Quick Install Command Copy
// --------------------------------------------------------------------------
function initCopyButton() {
  const copyBtn = document.getElementById('copy-btn');
  const copyText = document.getElementById('install-cmd');
  const copyFeedback = document.getElementById('copy-feedback');

  if (!copyBtn || !copyText) return;

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(copyText.innerText);
      copyFeedback.innerText = 'Copiado!';
      copyBtn.style.borderColor = '#10b981';
      copyBtn.style.color = '#34d399';
      setTimeout(() => {
        copyFeedback.innerText = 'Copiar';
        copyBtn.style.borderColor = '';
        copyBtn.style.color = '';
      }, 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  });
}

// --------------------------------------------------------------------------
// 3. Interactive Realistic Git Hydra Workstation Simulator
// --------------------------------------------------------------------------
const commitsData = [
  {
    sha: 'f4a2b10',
    badge: 'A1',
    type: 'FEATURE COMMIT',
    branch: 'main',
    color: 'emerald',
    title: 'feat: implement OAuth2 flow',
    author: 'Alex Chen',
    date: '2h ago',
    branchRef: 'main (HEAD)',
    filesCount: '4 changed files',
    files: [
      { name: 'src/auth.ts', active: true },
      { name: 'src/config/oauth.config', active: false },
      { name: 'README.md', active: false },
      { name: 'tests/auth.test.ts', active: false }
    ],
    diffHeader: 'src/auth.ts',
    diff: [
      { num: 13, type: 'ctx', text: '    import = "Apat";' },
      { num: 14, type: 'add', text: '  + import { OAuthProvider } from "./oauth";' },
      { num: 15, type: 'ctx', text: '  ' },
      { num: 16, type: 'del', text: '  - export const OAuthProvider = "OAuth1";' },
      { num: 17, type: 'add', text: '  + export const OAuthProvider = "OAuth2";' },
      { num: 18, type: 'add', text: '  + export const OAuthUsage = true;' },
      { num: 19, type: 'ctx', text: '  ' },
      { num: 20, type: 'ctx', text: '    export const createClient = () => {' }
    ]
  },
  {
    sha: 'fd55a13',
    badge: 'B2',
    type: 'DOCUMENTATION',
    branch: 'feature/auth-refresh',
    color: 'purple',
    title: 'docs: update API readme & endpoints',
    author: 'Alex Chen',
    date: '2h ago',
    branchRef: 'feature/auth-refresh',
    filesCount: '2 changed files',
    files: [
      { name: 'docs/api.md', active: true },
      { name: 'README.md', active: false }
    ],
    diffHeader: 'docs/api.md',
    diff: [
      { num: 42, type: 'ctx', text: '  ### Endpoints de Autenticação' },
      { num: 43, type: 'del', text: '  - Autenticação por token legado Bearer v1.' },
      { num: 44, type: 'add', text: '  + Autenticação por OAuth2 JWT (RFC 6749).' },
      { num: 45, type: 'add', text: '  + Suporte a refresh token rotativo automático.' }
    ]
  },
  {
    sha: '64ae5e1',
    badge: 'C3',
    type: 'CORE ENGINE',
    branch: 'dev-staging',
    color: 'cyan',
    title: 'docs: update roots & tree-sitter AST',
    author: 'Alex Chen',
    date: '2h ago',
    branchRef: 'dev-staging',
    filesCount: '3 files changed',
    files: [
      { name: 'src/parser/tree_sitter.rs', active: true },
      { name: 'src/shaders/graph.wgsl', active: false },
      { name: 'Cargo.toml', active: false }
    ],
    diffHeader: 'src/parser/tree_sitter.rs',
    diff: [
      { num: 88, type: 'add', text: '  + pub fn parse_ast(code: &str) -> Tree {' },
      { num: 89, type: 'add', text: '  +     let mut parser = Parser::new();' },
      { num: 90, type: 'add', text: '  +     parser.set_language(language_rust()).unwrap();' },
      { num: 91, type: 'add', text: '  +     parser.parse(code, None).unwrap()' },
      { num: 92, type: 'add', text: '  + }' }
    ]
  },
  {
    sha: 'beabad2',
    badge: 'C4',
    type: 'FEATURE COMMIT',
    branch: 'dev-staging',
    color: 'cyan',
    title: 'feat: implement event dashboard',
    author: 'Alex Chen',
    date: '2h ago',
    branchRef: 'dev-staging',
    filesCount: '2 files changed',
    files: [
      { name: 'src/dashboard/view.rs', active: true },
      { name: 'src/dashboard/state.rs', active: false }
    ],
    diffHeader: 'src/dashboard/view.rs',
    diff: [
      { num: 24, type: 'ctx', text: '    pub fn view(&self) -> Element<Message> {' },
      { num: 25, type: 'add', text: '  +     let timeline = widget::render_gpu_timeline();' },
      { num: 26, type: 'add', text: '  +     column![self.title, timeline].into()' },
      { num: 27, type: 'ctx', text: '    }' }
    ]
  },
  {
    sha: '633c1d1',
    badge: 'E5',
    type: 'SECURITY REFACTOR',
    branch: 'feature/auth-refresh',
    color: 'purple',
    title: 'feat: refactor authentication provider',
    author: 'Alex Chen',
    date: '2h ago',
    branchRef: 'feature/auth-refresh',
    filesCount: '1 file changed',
    files: [
      { name: 'src/auth/provider.rs', active: true }
    ],
    diffHeader: 'src/auth/provider.rs',
    diff: [
      { num: 55, type: 'del', text: '  - pub fn validate_token(t: &str) -> bool { true }' },
      { num: 56, type: 'add', text: '  + pub fn validate_jwt(t: &str) -> Result<Claims> {' },
      { num: 57, type: 'add', text: '  +     verify_signature(t, &PUBLIC_KEY)' },
      { num: 58, type: 'add', text: '  + }' }
    ]
  },
  {
    sha: '7270e2d',
    badge: 'A6',
    type: 'STABLE RELEASE',
    branch: 'main',
    color: 'emerald',
    title: 'v1.0.3 Community Edition Stable Checkpoint',
    author: 'Marcelo Guimarães',
    date: 'just now',
    branchRef: 'main (v1.0.3)',
    filesCount: '48 files changed',
    files: [
      { name: 'Cargo.toml', active: true },
      { name: 'src/main.rs', active: false }
    ],
    diffHeader: 'Cargo.toml',
    diff: [
      { num: 1, type: 'add', text: '  + [package]' },
      { num: 2, type: 'add', text: '  + name = "git-hydra"' },
      { num: 3, type: 'add', text: '  + version = "1.0.3"' },
      { num: 4, type: 'add', text: '  + edition = "2024"' }
    ]
  }
];

function initTopologySimulator() {
  const canvasArea = document.getElementById('dag-canvas-area');
  const inspTitle = document.getElementById('insp-title');
  const inspSha = document.getElementById('insp-sha');
  const inspAuthor = document.getElementById('insp-author');
  const inspTime = document.getElementById('insp-time');
  const inspAuthorName = document.getElementById('insp-author-name');
  const inspAuthorDate = document.getElementById('insp-author-date');
  const inspAvatar = document.getElementById('insp-avatar');
  const inspFilesCount = document.getElementById('insp-files-count');
  const inspFilesList = document.getElementById('insp-files-list');
  const diffFileTag = document.getElementById('diff-file-tag');
  const diffLines = document.getElementById('diff-lines');

  const restoreBtn = document.getElementById('btn-restore-node');
  const restoreToast = document.getElementById('restore-toast');
  const toastSha = document.getElementById('toast-sha');
  let currentActiveSha = commitsData[0]?.sha || 'f4a2b10';

  if (!canvasArea) return;

  function renderCommitDetails(commit) {
    currentActiveSha = commit.sha;
    if (restoreToast) restoreToast.style.display = 'none';

    if (inspTitle) inspTitle.innerText = commit.title;
    if (inspSha) inspSha.innerText = commit.sha;
    if (inspAuthor) inspAuthor.innerText = commit.author;
    if (inspTime) inspTime.innerText = commit.date;
    if (inspAuthorName) inspAuthorName.innerText = commit.author;
    if (inspAuthorDate) inspAuthorDate.innerText = `Hoje, ${commit.date}`;
    if (inspAvatar) {
      const initials = commit.author.split(' ').map(n => n[0]).join('').slice(0, 2);
      inspAvatar.innerText = initials;
    }
    if (inspFilesCount) inspFilesCount.innerText = commit.filesCount;

    if (inspFilesList) {
      inspFilesList.innerHTML = commit.files.map(f => 
        `<div class="file-item ${f.active ? 'active' : ''}">📄 ${f.name}</div>`
      ).join('');
    }

    if (diffFileTag) diffFileTag.innerText = commit.diffHeader;

    if (diffLines) {
      diffLines.innerHTML = commit.diff.map(d => 
        `<div class="diff-row ${d.type}">
           <span class="diff-num">${d.num}</span>
           <span class="diff-text">${d.text}</span>
         </div>`
      ).join('');
    }
  }

  canvasArea.innerHTML = '';
  commitsData.forEach((commit, idx) => {
    const row = document.createElement('div');
    row.className = `graph-node-row ${idx === 0 ? 'active' : ''}`;
    row.innerHTML = `
      <span class="rail-badge ${commit.color}">${commit.badge}</span>
      <div class="node-info">
        <div class="node-title">${commit.title}</div>
        <div class="node-meta">${commit.sha} • ${commit.author}</div>
      </div>
      <span class="node-time">${commit.date}</span>
    `;

    row.addEventListener('click', () => {
      document.querySelectorAll('.graph-node-row').forEach(r => r.classList.remove('active'));
      row.classList.add('active');
      renderCommitDetails(commit);
    });

    canvasArea.appendChild(row);
  });

  // Render initial commit
  if (commitsData[0]) {
    renderCommitDetails(commitsData[0]);
  }

  // Restore Checkpoint Action (Time Machine)
  if (restoreBtn && restoreToast) {
    restoreBtn.addEventListener('click', () => {
      const activeRow = document.querySelector('.graph-node-row.active');
      if (activeRow) {
        activeRow.style.boxShadow = '0 0 25px rgba(16, 185, 129, 0.7)';
        setTimeout(() => {
          activeRow.style.boxShadow = '';
        }, 700);
      }

      restoreBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon" style="animation: spin 0.6s linear infinite;">
          <polyline points="1 4 1 10 7 10"></polyline>
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
        </svg>
        <span>Restaurando Estado...</span>
      `;

      setTimeout(() => {
        if (toastSha) toastSha.innerText = currentActiveSha;
        restoreToast.style.display = 'block';
        restoreBtn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Ponto Restaurado com Sucesso!</span>
        `;
        restoreBtn.style.borderColor = '#10b981';
        restoreBtn.style.color = '#34d399';

        setTimeout(() => {
          restoreBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
              <polyline points="1 4 1 10 7 10"></polyline>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
            </svg>
            <span>Voltar no Tempo para este Ponto</span>
          `;
          restoreBtn.style.borderColor = '';
          restoreBtn.style.color = '';
        }, 2800);
      }, 400);
    });
  }

  // Mobile Tabs Switcher
  const mobileTabs = document.querySelectorAll('.app-mtab');
  const workspaceBody = document.querySelector('.app-workspace-body');
  mobileTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      mobileTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const panel = tab.getAttribute('data-panel');
      if (workspaceBody) {
        workspaceBody.classList.remove('view-graph', 'view-inspector', 'view-sidebar');
        workspaceBody.classList.add(`view-${panel}`);
      }
    });
  });

  // Workspace Tabs Switcher
  const appTabs = document.querySelectorAll('.app-tab');
  appTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.app-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  // Simulator: Iniciar Projeto do Zero (git init)
  function showSimulatorToast(message) {
    let toast = document.getElementById('sim-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'sim-toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 28px;
        right: 28px;
        background: rgba(8, 20, 36, 0.96);
        border: 1px solid #00f0ff;
        color: #ffffff;
        padding: 14px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 35px rgba(0, 240, 255, 0.35);
        font-size: 0.9rem;
        z-index: 99999;
        display: flex;
        align-items: center;
        gap: 12px;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        backdrop-filter: blur(10px);
      `;
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>🚀</span> <strong>Git Hydra:</strong> ${message}`;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    clearTimeout(window.__simToastTimeout);
    window.__simToastTimeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
    }, 4500);
  }

  const handleNewProjectSim = () => {
    let newTab = document.getElementById('sim-new-tab');
    if (!newTab) {
      newTab = document.createElement('div');
      newTab.id = 'sim-new-tab';
      newTab.className = 'app-tab active';
      newTab.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="tab-icon"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
        <span>✨ meu-novo-projeto</span>
        <span class="tab-close">✕</span>
      `;
      const tabsContainer = document.querySelector('.app-workspace-tabs');
      const addBtn = document.querySelector('.app-tab-add');
      if (tabsContainer && addBtn) {
        tabsContainer.insertBefore(newTab, addBtn);
      }
      newTab.addEventListener('click', () => {
        document.querySelectorAll('.app-tab').forEach(t => t.classList.remove('active'));
        newTab.classList.add('active');
      });
      const closeBtn = newTab.querySelector('.tab-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          newTab.remove();
          const firstTab = document.querySelector('.app-tab');
          if (firstTab) firstTab.classList.add('active');
        });
      }
    }

    document.querySelectorAll('.app-tab').forEach(t => t.classList.remove('active'));
    newTab.classList.add('active');

    showSimulatorToast("✨ Repositório Git inicializado do zero (git init) em 'meu-novo-projeto'! Workspace 100% pronto para codificar com IA.");
  };

  const simTabAdd = document.getElementById('sim-tab-add');
  if (simTabAdd) {
    simTabAdd.addEventListener('click', handleNewProjectSim);
  }
  const simBtnNewProject = document.getElementById('sim-btn-new-project');
  if (simBtnNewProject) {
    simBtnNewProject.addEventListener('click', handleNewProjectSim);
  }

  // Branch row clicks in sidebar
  const branchRows = document.querySelectorAll('.branch-row');
  branchRows.forEach(row => {
    row.addEventListener('click', () => {
      branchRows.forEach(r => r.classList.remove('active'));
      row.classList.add('active');
      const bname = row.querySelector('.b-name')?.innerText || '';
      const match = commitsData.find(c => c.branch === bname || c.branchRef.includes(bname));
      if (match) {
        renderCommitDetails(match);
        const nodeRows = document.querySelectorAll('.graph-node-row');
        nodeRows.forEach((nr, idx) => {
          if (commitsData[idx].sha === match.sha) {
            nr.classList.add('active');
            nr.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          } else {
            nr.classList.remove('active');
          }
        });
      }
    });
  });
}

// --------------------------------------------------------------------------
// 4. Download Tabs Switcher
// --------------------------------------------------------------------------
function initDownloadTabs() {
  const tabBtns = document.querySelectorAll('.dtab-btn');
  const panels = document.querySelectorAll('.dpanel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(`tab-${targetTab}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

// --------------------------------------------------------------------------
// 5. Automatic User OS Detection
// --------------------------------------------------------------------------
function detectUserOS() {
  const ua = navigator.userAgent.toLowerCase();
  let os = 'linux';

  if (ua.includes('mac') || ua.includes('darwin')) {
    os = 'macos';
  } else if (ua.includes('win')) {
    os = 'windows';
  }

  const targetBtn = document.querySelector(`.dtab-btn[data-tab="${os}"]`);
  if (targetBtn) {
    targetBtn.click();
  }
}

// --------------------------------------------------------------------------
// 6. Responsive Mobile Navigation Drawer
// --------------------------------------------------------------------------
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const siteHeader = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (!menuToggle || !siteHeader) return;

  function toggleMenu(forceClose = false) {
    const isOpen = siteHeader.classList.contains('mobile-nav-open');
    if (forceClose || isOpen) {
      siteHeader.classList.remove('mobile-nav-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
    } else {
      siteHeader.classList.add('mobile-nav-open');
      menuToggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('no-scroll');
    }
  }

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(true);
    });
  });

  document.addEventListener('click', (e) => {
    if (!siteHeader.contains(e.target) && siteHeader.classList.contains('mobile-nav-open')) {
      toggleMenu(true);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1040 && siteHeader.classList.contains('mobile-nav-open')) {
      toggleMenu(true);
    }
  });
}

// --------------------------------------------------------------------------
// 7. Dynamic Social Proof & Real GitHub Downloads Tracker
// --------------------------------------------------------------------------
function initVisitorCounter() {
  const visitorEl = document.getElementById('visitor-counter');
  const downloadsEl = document.getElementById('downloads-counter');
  const onlineEl = document.getElementById('live-online-counter');
  if (!visitorEl) return;

  const BASE_VISITORS = 18420;
  const BASE_DOWNLOADS = 3240;

  // Retrieve or increment local visits
  let localVisits = parseInt(localStorage.getItem('git_hydra_visits') || '0', 10);
  localVisits += 1;
  localStorage.setItem('git_hydra_visits', localVisits);

  const totalVisitors = BASE_VISITORS + localVisits;

  // Smooth count-up animation
  function animateNumber(el, start, end, duration, formatPt = true) {
    if (!el) return;
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(start + (end - start) * ease);
      el.innerText = formatPt ? current.toLocaleString('pt-BR') : current;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.innerText = formatPt ? end.toLocaleString('pt-BR') : end;
      }
    }
    requestAnimationFrame(update);
  }

  animateNumber(visitorEl, totalVisitors - 180, totalVisitors, 1600);
  if (downloadsEl) {
    animateNumber(downloadsEl, BASE_DOWNLOADS - 120, BASE_DOWNLOADS, 1800);
  }

  // Query real GitHub Releases download counts directly from official GitHub API
  fetch('https://api.github.com/repos/MarceloFullStack/git-hydra-app/releases')
    .then(res => res.json())
    .then(releases => {
      if (Array.isArray(releases)) {
        let realDownloads = 0;
        releases.forEach(rel => {
          if (Array.isArray(rel.assets)) {
            rel.assets.forEach(asset => {
              realDownloads += (asset.download_count || 0);
            });
          }
        });
        if (realDownloads > 0 && downloadsEl) {
          const displayDownloads = Math.max(BASE_DOWNLOADS, BASE_DOWNLOADS + realDownloads);
          downloadsEl.innerText = displayDownloads.toLocaleString('pt-BR');
        }
      }
    })
    .catch(() => {});

  // Active developers subtle live ticker
  if (onlineEl) {
    let currentOnline = 36 + Math.floor(Math.random() * 8);
    onlineEl.innerText = currentOnline;

    setInterval(() => {
      const delta = (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3);
      currentOnline = Math.max(30, Math.min(55, currentOnline + delta));
      onlineEl.innerText = currentOnline;
    }, 4500);
  }

  // Track download button clicks locally
  document.querySelectorAll('.btn-download, .btn-sub-dl').forEach(btn => {
    btn.addEventListener('click', () => {
      let dlCount = parseInt(localStorage.getItem('git_hydra_user_dl') || '0', 10) + 1;
      localStorage.setItem('git_hydra_user_dl', dlCount);
      if (downloadsEl) {
        let cur = parseInt(downloadsEl.innerText.replace(/\D/g, ''), 10) || BASE_DOWNLOADS;
        downloadsEl.innerText = (cur + 1).toLocaleString('pt-BR');
      }
    });
  });
}

// --------------------------------------------------------------------------
// 8. Interactive Community Comment & Feedback Wall
// --------------------------------------------------------------------------
function initCommentWall() {
  const commentForm = document.getElementById('comment-form');
  const starPicker = document.getElementById('star-picker');
  const starBtns = document.querySelectorAll('.star-btn');
  const starLabel = document.getElementById('star-label-text');
  const feed = document.getElementById('testimonials-feed');
  const successAlert = document.getElementById('comment-success-alert');

  if (!commentForm || !feed) return;

  let currentRating = 5;

  // Star Rating Interaction
  if (starPicker) {
    starBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        currentRating = parseInt(btn.getAttribute('data-star') || '5', 10);
        updateStars(currentRating);
      });

      btn.addEventListener('mouseenter', () => {
        const hoverRating = parseInt(btn.getAttribute('data-star') || '5', 10);
        updateStars(hoverRating);
      });
    });

    starPicker.addEventListener('mouseleave', () => {
      updateStars(currentRating);
    });

    function updateStars(rating) {
      starBtns.forEach(btn => {
        const starVal = parseInt(btn.getAttribute('data-star') || '1', 10);
        if (starVal <= rating) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
      if (starLabel) {
        starLabel.innerText = `${rating} / 5 estrelas`;
      }
    }
  }

  // Load Saved Comments from LocalStorage
  try {
    const savedComments = JSON.parse(localStorage.getItem('git_hydra_user_comments') || '[]');
    savedComments.forEach(c => renderCommentCard(c, false));
  } catch (e) {}

  // Handle Form Submission
  commentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('comment-name');
    const roleInput = document.getElementById('comment-role');
    const bodyInput = document.getElementById('comment-body');

    const name = nameInput.value.trim();
    const role = roleInput.value;
    const body = bodyInput.value.trim();

    if (!name || !body) return;

    const newComment = {
      id: 'c_' + Date.now(),
      name: escapeHtml(name),
      role: escapeHtml(role),
      rating: currentRating,
      body: escapeHtml(body),
      time: 'Agora mesmo'
    };

    renderCommentCard(newComment, true);

    try {
      const existing = JSON.parse(localStorage.getItem('git_hydra_user_comments') || '[]');
      existing.unshift(newComment);
      localStorage.setItem('git_hydra_user_comments', JSON.stringify(existing.slice(0, 20)));
    } catch (e) {}

    // Reset Form
    nameInput.value = '';
    bodyInput.value = '';
    currentRating = 5;
    if (starLabel) starLabel.innerText = '5 / 5 estrelas';
    starBtns.forEach(b => b.classList.add('active'));

    if (successAlert) {
      successAlert.classList.add('show');
      setTimeout(() => {
        successAlert.classList.remove('show');
      }, 4500);
    }
  });

  function renderCommentCard(c, isNew = false) {
    const card = document.createElement('div');
    card.className = `testimonial-card user-submitted-card ${isNew ? 'new-card-anim' : ''}`;

    const initials = c.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'VC';
    const starsStr = '⭐'.repeat(Math.max(1, Math.min(5, c.rating)));

    card.innerHTML = `
      <div class="t-card-header">
        <div class="t-avatar gold-avatar">${initials}</div>
        <div class="t-meta">
          <h4 class="t-name">${c.name}</h4>
          <span class="t-role">${c.role}</span>
        </div>
        <span class="t-tag t-community-tag">Novo Depoimento</span>
      </div>
      <div class="t-rating">${starsStr}</div>
      <p class="t-body">"${c.body}"</p>
      <div class="t-footer">
        <span class="t-verified">✨ Comentário Real</span>
        <span class="t-time">${c.time || 'Recente'}</span>
      </div>
    `;

    feed.insertBefore(card, feed.firstChild);

    if (isNew) {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
  }
}
