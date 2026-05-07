/* ============================================================
   SHIBU A — PORTFOLIO  |  Complete Script v2
   ============================================================ */

// ── Availability banner dismiss ──
function closeBanner() {
  const banner = document.getElementById('availBanner');
  const navbar = document.querySelector('.navbar');
  if (banner) {
    banner.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(-100%)';
    setTimeout(() => {
      banner.style.display = 'none';
      navbar.style.transition = 'top 0.3s ease, background 0.4s ease, box-shadow 0.4s ease';
      navbar.style.top = '0';
    }, 300);
  }
}

// ── Navbar scroll effect ──
window.addEventListener('scroll', () => {
  document.querySelector('.navbar').classList.toggle('scrolled', window.scrollY > 50);
});

// ── Smooth scroll for nav links ──
document.querySelectorAll('nav a').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ── Scroll reveal ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Animated counters ──
function animateCounter(el, target, suffix) {
  const duration = 1800;
  const start = performance.now();
  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + (suffix || '');
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target + (suffix || '');
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      const suffixMap = { 5: '+', 1000: '+', 50: '+', 3: '' };
      animateCounter(el, target, suffixMap[target] !== undefined ? suffixMap[target] : '');
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.hstat-num').forEach(el => counterObserver.observe(el));

// ── Contact form (Formspree) ──
// SETUP (one-time, 2 minutes):
//   1. Go to https://formspree.io and sign up free
//   2. Click "New Form" → give it a name → copy your Form ID (looks like: xpwzabcd)
//   3. Replace 'YOUR_FORM_ID' below with that ID
//   4. Done — all messages arrive in your email inbox, no server needed
const FORMSPREE_ID = 'xykokjjo'; // ✅ Your Formspree ID — configured correctly

async function sendContactForm() {
  const name    = document.getElementById('cf-name').value.trim();
  const email   = document.getElementById('cf-email').value.trim();
  const subject = document.getElementById('cf-subject').value.trim();
  const message = document.getElementById('cf-message').value.trim();
  const btn     = document.querySelector('.cf-submit-btn');

  if (!name || !email || !message) {
    ['cf-name','cf-email','cf-message'].forEach(id => {
      const el = document.getElementById(id);
      if (!el.value.trim()) { el.style.borderColor = '#f87171'; setTimeout(() => el.style.borderColor = '', 2000); }
    });
    return;
  }

  // Fallback to mailto only if Formspree ID is still unconfigured
  if (FORMSPREE_ID === 'YOUR_FORM_ID') {
    const mailto = 'mailto:shibudhaslove@gmail.com?subject=' +
      encodeURIComponent(subject || 'Portfolio Contact — ' + name) +
      '&body=' + encodeURIComponent('From: ' + name + ' <' + email + '>\n\n' + message);
    window.location.href = mailto;
    document.getElementById('cfSuccess').style.display = 'block';
    ['cf-name','cf-email','cf-subject','cf-message'].forEach(id => document.getElementById(id).value = '');
    return;
  }

  // Formspree submission
  btn.textContent = 'Sending…';
  btn.disabled = true;
  try {
    const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name, email, _subject: subject || 'Portfolio Contact — ' + name, message })
    });
    if (res.ok) {
      document.getElementById('cfSuccess').style.display = 'block';
      ['cf-name','cf-email','cf-subject','cf-message'].forEach(id => document.getElementById(id).value = '');
    } else {
      alert('Something went wrong. Please email shibudhaslove@gmail.com directly.');
    }
  } catch(e) {
    alert('Network error. Please email shibudhaslove@gmail.com directly.');
  } finally {
    btn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
    btn.disabled = false;
  }
}

/* ════════════════════════════════════════
   SKILLS
════════════════════════════════════════ */
const skillData = {
  infra: {
    icon: '🖥️', title: 'IT Infrastructure & Support',
    sections: [
      { subtitle: 'Support Services', items: ['Technical Support & Helpdesk (L1/L2)', 'Remote Technical Support', 'End-user Training & Documentation'] },
      { subtitle: 'Incident Management (ITIL)', items: ['Incident Management & SLA Compliance', 'Escalation Handling & RCA', 'ServiceNow · Remedy · Jira Service Desk'] },
      { subtitle: 'Maintenance', items: ['System Monitoring & Alerting', 'Hardware/Software Troubleshooting', 'Patch Management & Hardening'] }
    ]
  },
  systems: {
    icon: '⚙️', title: 'Systems Administration',
    sections: [
      { subtitle: 'Operating Systems', items: ['Windows Server 2012–2022', 'Linux: RHEL · CentOS · Ubuntu'] },
      { subtitle: 'Windows Admin', items: ['Active Directory (AD)', 'Group Policy Objects (GPO)', 'DNS · DHCP · File Services', 'User & Permission Management'] },
      { subtitle: 'Linux Admin', items: ['Shell Scripting (Bash)', 'Package Management (YUM/APT)', 'Systemctl · Cron · Log analysis', 'File permissions & security hardening'] }
    ]
  },
  backup: {
    icon: '💾', title: 'Backup & Storage',
    sections: [
      { subtitle: 'Backup Tools', items: ['Dell EMC NetWorker (Advanced)', 'PowerProtect Data Domain (DD)', 'Bootstrap recovery · UASM', 'LTO Tape Library management'] },
      { subtitle: 'Storage Systems', items: ['NetApp ONTAP (AFF/FAS)', 'DS2246/DS212C shelf management', 'SAS · FC · ACP cabling & topology', 'FRU replacement & lifecycle mgmt'] },
      { subtitle: 'DR & Continuity', items: ['Disaster Recovery Planning', 'Data Integrity & Retention Compliance', 'RTO/RPO analysis'] }
    ]
  },
  virtual: {
    icon: '☁️', title: 'Virtualization & Cloud',
    sections: [
      { subtitle: 'Hypervisors', items: ['VMware ESXi · vSphere · vCenter', 'Microsoft Hyper-V', 'VMware Workstation (Lab)'] },
      { subtitle: 'Cloud (Learning)', items: ['Microsoft Azure', 'IAM fundamentals'] },
      { subtitle: 'Remote Access', items: ['RDP · SSH · AnyDesk · TeamViewer', 'VPN troubleshooting'] }
    ]
  },
  network: {
    icon: '🔗', title: 'Networking',
    sections: [
      { subtitle: 'Protocols', items: ['TCP/IP · DNS · DHCP', 'OSPF · NAT · STP · VLAN'] },
      { subtitle: 'Network Operations', items: ['VLAN Configuration', 'Routing & Switching', 'Firewall (OPNsense)'] },
      { subtitle: 'Troubleshooting', items: ['LAN/Wi-Fi Diagnostics', 'Network Connectivity Issues', 'SAS/FC topology validation'] }
    ]
  }
};

let activeSkill = null;
document.querySelectorAll('.skill-box').forEach(box => {
  box.addEventListener('click', () => {
    const skillKey = box.dataset.skill;
    if (activeSkill === skillKey) { closeSkillPanel(); return; }
    activeSkill = skillKey;
    const data = skillData[skillKey];
    if (!data) return;
    document.querySelectorAll('.skill-box').forEach(b => b.classList.remove('active-skill'));
    box.classList.add('active-skill');
    document.getElementById('skillPanelIcon').textContent = data.icon;
    document.getElementById('skillPanelTitle').textContent = data.title;
    document.getElementById('skillPanelSections').innerHTML = data.sections.map(s =>
      `<div class="skill-panel-section"><h4>${s.subtitle}</h4><ul>${s.items.map(i => `<li>${i}</li>`).join('')}</ul></div>`
    ).join('');
    const panel = document.getElementById('skillDetailPanel');
    panel.classList.add('visible');
    setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
  });
});
function closeSkillPanel() {
  activeSkill = null;
  document.querySelectorAll('.skill-box').forEach(b => b.classList.remove('active-skill'));
  document.getElementById('skillDetailPanel').classList.remove('visible');
}

/* ════════════════════════════════════════
   EXPERIENCE MODAL
════════════════════════════════════════ */
const expData = {
  wipro: {
    client: 'Dell EMC', clientDesc: 'Enterprise Backup & Data Protection (NetWorker)',
    designation: 'Technical Support Engineer L2',
    achievements: [
      'Recovered 15TB of critical banking compliance data using UASM after a tape relabelling incident — unique recovery without full saveset integrity.',
      'Performed bootstrap time-machine analysis across 30 days of media database history to identify root cause of silent saveset expiration.',
      'Reduced resolution time for critical issues by 10% through advanced troubleshooting and effective customer communication.',
      'Consistently achieved 100% CSAT across all assigned accounts over 2 years.',
      'Earned 50+ customer appreciation letters for reducing effort and resolving multiple issues efficiently.',
      'Assigned as dedicated engineer for LIC (Life Insurance Corporation of India) — two formal commendations from Dell EMC.',
      'Awarded three certificates from Wipro for dedication and excellence.',
      'Transformed multiple dissatisfied regional customers into highly appreciative accounts.',
      'Optimised NetWorker configurations to enhance backup performance and reliability.',
      'Executed standalone and cluster migrations for NetWorker with zero data loss.',
      'Recognised as critical resource by Wipro and Dell, handling high-priority accounts.'
    ],
    responsibilities: [
      'Provide end-to-end L2 technical support for Dell EMC NetWorker across banking, insurance and enterprise clients.',
      'Troubleshoot complex backup, recovery and migration issues across cluster and standalone environments.',
      'Manage backup infrastructure using Data Domain storage, safeguarding data integrity and compliance.',
      'Monitor backup operations to ensure SLA compliance and optimal performance.',
      'Document technical solutions, processes and case studies for knowledge sharing.',
      'Collaborate with L3 SMEs, Development teams and vendors to resolve product bugs.',
      'Train and mentor new team members on NetWorker and customer engagement best practices.'
    ]
  },
  sutherland: {
    client: 'NetApp Inc', clientDesc: 'Storage & Cloud Data Management (ONTAP)',
    designation: 'Hardware Technical Support Engineer L2',
    achievements: [
      'Delivered 99.999% uptime for NetApp storage in mission-critical enterprise environments with zero data loss.',
      'Completed SSRT certification — advanced skills in hardware replacement, RCA and complex troubleshooting.',
      'Handled 500+ cases in a single year with zero dissatisfaction rating.',
      'Reduced MTTR by accelerating FRU identification and streamlining on-site technician coordination.',
      'Proactively mitigated risks via AutoSupport (ASUP) — replaced 100% of at-risk hardware before failure.',
      'Led firmware and microcode upgrades across dozens of storage nodes without service disruption.',
      'Authored technical articles and mentored junior engineers on advanced recovery procedures.'
    ],
    responsibilities: [
      'Diagnose failures in FRUs: controllers, disk drives, PSUs, fans and NVDIMMs.',
      'Coordinate hardware replacement from fault isolation to on-site technician support.',
      'Troubleshoot DS2246/DS212C shelves and resolve SAS/FC/ACP cabling path issues.',
      'Manage firmware and microcode upgrades for drives, shelves and controllers.',
      'Maintain Service Processor (SP), BMC and RLM for out-of-band management.',
      'Verify SAS/FC/ACP topology against NetApp best practices.',
      'Monitor system health using AutoSupport and internal logs.'
    ]
  },
  ctas: {
    client: 'Internal IT', clientDesc: 'Enterprise Server & Platform Administration',
    designation: 'System Associate Engineer',
    achievements: [
      'Administered 150+ Linux & Windows servers with consistent 99.9% uptime.',
      'Managed Active Directory, DNS, DHCP and file services for 500+ users with zero access outages.',
      'Reduced recurring incidents by 25% through root-cause analysis across OS, network and hardware.',
      'Achieved 95%+ SLA compliance across Windows, Linux and networking incidents.',
      'Automated health reporting — reduced manual monitoring effort by 30%.',
      'Delivered 100% backup reliability over 12 months — zero data loss.',
      'Supported hardware lifecycle refresh migrating 50+ servers with zero downtime.',
      'Maintained 99% patch compliance across 200+ servers in a single maintenance window.'
    ],
    responsibilities: [
      'Administer Windows (AD, OU, GPO) and Linux (permissions, services, logs) servers.',
      'Monitor physical and virtual infrastructure and escalate critical alerts.',
      'Manage daily backup operations with NetWorker and perform data restoration.',
      'Provide network support: cable patching, VLAN verification, VPN troubleshooting.',
      'Storage and hardware provisioning: racking, failed disk replacement, capacity alerts.',
      'Execute SOPs for patching, firmware updates and OS deployments.',
      'Document incidents in ServiceNow/Jira ensuring SLA compliance.'
    ]
  }
};

function renderExperienceModal(data) {
  return `<div class="exp-modal">
    <button class="overlay-close" onclick="closeExpModal()">✕</button>
    <div class="exp-modal-header">
      <div class="exp-modal-badge"><span class="exp-modal-client">${data.client}</span></div>
      <div class="exp-modal-title-block">
        <p class="exp-modal-label">${data.clientDesc}</p>
        <h3 class="exp-modal-designation">${data.designation}</h3>
      </div>
    </div>
    <div class="exp-tabs">
      <button class="exp-tab active" onclick="switchTab(this,'achievements')">🏆 Achievements</button>
      <button class="exp-tab" onclick="switchTab(this,'responsibilities')">📋 Responsibilities</button>
    </div>
    <div class="exp-panel-wrap">
      <div class="exp-panel active" id="panel-achievements">
        <ul class="exp-fancy-list">${data.achievements.map((item,i) =>
          `<li class="exp-fancy-item" style="animation-delay:${i*0.04}s"><span class="item-dot"></span><span>${item}</span></li>`).join('')}
        </ul>
      </div>
      <div class="exp-panel" id="panel-responsibilities">
        <ul class="exp-fancy-list">${data.responsibilities.map((item,i) =>
          `<li class="exp-fancy-item" style="animation-delay:${i*0.04}s"><span class="item-dot item-dot--purple"></span><span>${item}</span></li>`).join('')}
        </ul>
      </div>
    </div>
  </div>`;
}

function switchTab(btn, panelId) {
  document.querySelectorAll('.exp-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.exp-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('panel-' + panelId);
  if (panel) {
    panel.classList.add('active');
    panel.querySelectorAll('.exp-fancy-item').forEach(item => {
      item.style.animation = 'none'; item.offsetHeight; item.style.animation = '';
    });
  }
}

document.querySelectorAll('.exp-module').forEach(module => {
  module.addEventListener('click', () => {
    const data = expData[module.dataset.exp];
    if (!data) return;
    document.getElementById('overlayContent').innerHTML = renderExperienceModal(data);
    document.getElementById('expOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

function closeExpModal() {
  document.getElementById('expOverlay').classList.remove('active');
  document.body.style.overflow = '';
}
document.getElementById('expOverlay').addEventListener('click', function(e) { if (e.target === this) closeExpModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeExpModal(); });

/* ════════════════════════════════════════
   SCROLL PROGRESS BAR
════════════════════════════════════════ */
(function () {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
  }, { passive: true });
})();

/* ════════════════════════════════════════
   BACK TO TOP BUTTON
════════════════════════════════════════ */
(function () {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
})();

/* ════════════════════════════════════════
   ACTIVE NAV LINK HIGHLIGHT (desktop)
════════════════════════════════════════ */
(function () {
  const navLinks = document.querySelectorAll('.nav-right a');
  if (!navLinks.length) return;

  const sectionIds = ['about','skills','Experiences','certs','blog','contact'];
  const sections   = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(a => a.classList.remove('nav-active'));
      const active = document.querySelector(`.nav-right a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('nav-active');
    });
  }, { threshold: 0.35 });

  sections.forEach(s => obs.observe(s));
})();

/* ════════════════════════════════════════
   MOBILE DRAWER
════════════════════════════════════════ */
(function () {
  const hamburger   = document.getElementById('hamburger');
  const drawer      = document.getElementById('mobileDrawer');
  const overlay     = document.getElementById('drawerOverlay');
  const closeBtn    = document.getElementById('drawerClose');
  const drawerLinks = document.querySelectorAll('.drawer-link');
  if (!hamburger || !drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('visible');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-open');
  }
  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('visible');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drawer-open');
  }

  hamburger.addEventListener('click', () =>
    drawer.classList.contains('open') ? closeDrawer() : openDrawer());
  closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
  });

  drawerLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      closeDrawer();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 320);
    });
  });

  // Highlight active section in drawer
  const sections = document.querySelectorAll('section[id]');
  const dObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      drawerLinks.forEach(l => l.classList.remove('active'));
      const match = document.querySelector(`.drawer-link[href="#${entry.target.id}"]`);
      if (match) match.classList.add('active');
    });
  }, { threshold: 0.4 });
  sections.forEach(s => dObs.observe(s));
})();

/* ════════════════════════════════════════
   CERT MODAL
════════════════════════════════════════ */
function openCertModal(title, imgSrc) {
  document.getElementById('certModalTitle').textContent = title;
  document.getElementById('certModalImg').src = imgSrc;
  document.getElementById('certModalImg').alt = title;
  const modal = document.getElementById('certModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCertModal(e) {
  if (e && e.target !== document.getElementById('certModal')) return;
  document.getElementById('certModal').classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.getElementById('certModal')?.classList.remove('active');
    document.body.style.overflow = '';
  }
});

/* ════════════════════════════════════════
   BLOG VIEW COUNTS — load from Firebase
   Uses same firebase-config from blog pages
   but here just reads counts, doesn't increment
════════════════════════════════════════ */
(async function () {
  const viewSpans = document.querySelectorAll('.blog-view-count[data-blog]');
  if (!viewSpans.length) return;

  // Dynamically import Firebase only if needed (index page)
  try {
    const { initializeApp, getApps } = await import(
      'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
    const { getFirestore, doc, getDoc } = await import(
      'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
    const { firebaseConfig } = await import('./firebase-config.js');

    const app = getApps().length
      ? getApps()[0]
      : initializeApp(firebaseConfig);
    const db = getFirestore(app);

    viewSpans.forEach(async span => {
      const blogId = span.dataset.blog;
      try {
        const snap = await getDoc(doc(db, 'page-views', blogId));
        if (snap.exists()) {
          const count = snap.data().views || 0;
          span.textContent = count >= 1000
            ? (count / 1000).toFixed(1) + 'k'
            : count;
        } else {
          span.textContent = '0';
        }
      } catch { span.textContent = '—'; }
    });
  } catch (e) {
    console.warn('View count load skipped:', e.message);
  }
})();
