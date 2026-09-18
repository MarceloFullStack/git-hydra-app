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
// 3. Interactive Topology Simulator
// --------------------------------------------------------------------------
const commitsData = [
  {
    sha: '5da5f89',
    type: 'MERGE COMMIT',
    branch: 'main',
    color: 'emerald',
    title: "Merge branch 'feat/workflow-guide-and-branding'",
    author: 'Marcelo Guimarães',
    date: 'Wed Mar 11, 22:15:00 2026',
    file: 'Cargo.toml',
    diff: [
      { type: 'add', text: '+ [package.metadata.bundle]' },
      { type: 'add', text: '+ name = "Git Hydra"' },
      { type: 'add', text: '+ icon = ["packaging/icons/git-hydra.icns", ...]' },
      { type: 'del', text: '- icon = ["packaging/icons/git-hydra.png"]' }
    ],
    stats: { add: 14, del: 2, files: 3 }
  },
  {
    sha: '3060f07',
    type: 'FEATURE COMMIT',
    branch: 'feat/workflow-guide',
    color: 'cyan',
    title: 'fix(branding): open welcome splash screen from brand button',
    author: 'Marcelo Guimarães',
    date: 'Tue Mar 10, 21:30:15 2026',
    file: 'src/screens/welcome.rs',
    diff: [
      { type: 'add', text: '+ pub fn open_welcome_hud(&mut self) -> Task<Message> {' },
      { type: 'add', text: '+     self.active_tab = Tab::WelcomeScreen;' },
      { type: 'del', text: '-     // previously opened modal dialog' }
    ],
    stats: { add: 28, del: 5, files: 2 }
  },
  {
    sha: 'a7ddc02',
    type: 'CORE ENHANCEMENT',
    branch: 'feat/workflow-guide',
    color: 'cyan',
    title: 'feat: interactive workflow guide and brand HUD integration',
    author: 'Marcelo Guimarães',
    date: 'Fri Feb 20, 20:45:30 2026',
    file: 'src/view_model/topology.rs',
    diff: [
      { type: 'add', text: '+ pub struct DagTopologyViewer {' },
      { type: 'add', text: '+     cache: LruCache<Oid, RenderedNode>,' },
      { type: 'add', text: '+     wgpu_render_pipeline: Arc<RenderPipeline>,' },
      { type: 'add', text: '+ }' }
    ],
    stats: { add: 184, del: 12, files: 7 }
  },
  {
    sha: '1508b5c',
    type: 'INITIAL RELEASE',
    branch: 'main',
    color: 'purple',
    title: 'feat: initial release of Git Hydra v1.0.0',
    author: 'Marcelo Guimarães',
    date: 'Wed Dec 17, 03:33:00 2025',
    file: 'src/main.rs',
    diff: [
      { type: 'add', text: '+ fn main() -> iced::Result {' },
      { type: 'add', text: '+     configure_wgpu_backend();' },
      { type: 'add', text: '+     iced::application(App::new, App::update, App::view)' }
    ],
    stats: { add: 1420, del: 0, files: 45 }
  }
];

function initTopologySimulator() {
  const canvasArea = document.getElementById('dag-canvas-area');
  const inspType = document.getElementById('insp-type');
  const inspSha = document.getElementById('insp-sha');
  const inspTitle = document.getElementById('insp-title');
  const inspMeta = document.querySelector('.inspector-meta');
  const diffFile = document.querySelector('.diff-file');
  const diffLines = document.querySelector('.diff-lines');
  const inspStats = document.querySelector('.inspector-stats');

  if (!canvasArea) return;

  canvasArea.innerHTML = '';
  commitsData.forEach((commit, idx) => {
    const node = document.createElement('div');
    node.className = `commit-node ${idx === 0 ? 'active' : ''}`;
    node.innerHTML = `
      <span class="node-dot ${commit.color}"></span>
      <span class="node-sha">${commit.sha}</span>
      <span class="node-msg">${commit.title}</span>
    `;

    node.addEventListener('click', () => {
      document.querySelectorAll('.commit-node').forEach(n => n.classList.remove('active'));
      node.classList.add('active');

      inspType.innerText = commit.type;
      inspSha.innerText = commit.sha;
      inspTitle.innerText = commit.title;
      inspMeta.innerHTML = `
        <span><strong>Autor:</strong> ${commit.author}</span>
        <span><strong>Data:</strong> ${commit.date}</span>
      `;
      diffFile.innerText = commit.file;
      diffLines.innerHTML = commit.diff.map(d => 
        `<span class="diff-${d.type}">${d.text}</span>`
      ).join('');

      inspStats.innerHTML = `
        <span class="stat-badge stat-add">+${commit.stats.add} additions</span>
        <span class="stat-badge stat-del">-${commit.stats.del} deletions</span>
        <span class="stat-badge stat-files">${commit.stats.files} files</span>
      `;
    });

    canvasArea.appendChild(node);
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
    if (window.innerWidth > 900 && siteHeader.classList.contains('mobile-nav-open')) {
      toggleMenu(true);
    }
  });
}
