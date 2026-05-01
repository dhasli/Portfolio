/* ============================================================
   SHIBU A — PORTFOLIO  |  Complete Script
   ============================================================ */

// ── Navbar scroll effect ──
window.addEventListener('scroll', () => {
  document.querySelector('.navbar')
    .classList.toggle('scrolled', window.scrollY > 50);
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
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ════════════════════════════════════════
   SKILLS — click-based inline panel
════════════════════════════════════════ */

const skillData = {
  infra: {
    icon: '🖥️',
    title: 'IT Infrastructure & Support',
    sections: [
      {
        subtitle: 'Support Services',
        items: ['Technical Support & Helpdesk Operations', 'Remote Technical Support', 'End-user Training & Documentation']
      },
      {
        subtitle: 'Incident Management',
        items: ['Incident Management & SLA Compliance', 'Escalation Handling', 'Root Cause Analysis (RCA)']
      },
      {
        subtitle: 'ITSM Tools',
        items: ['ServiceNow', 'Remedy', 'Jira Service Desk']
      },
      {
        subtitle: 'Maintenance',
        items: ['System Monitoring', 'Hardware/Software Troubleshooting', 'Patch Management', 'System Hardening']
      }
    ]
  },
  systems: {
    icon: '⚙️',
    title: 'Systems Administration',
    sections: [
      {
        subtitle: 'Operating Systems',
        items: ['Windows Server 2012–2022', 'Linux: RHEL, CentOS, Ubuntu']
      },
      {
        subtitle: 'Windows Administration',
        items: ['Active Directory (AD)', 'Group Policy Objects (GPO)', 'DNS, DHCP', 'User Account Management']
      },
      {
        subtitle: 'Linux Administration',
        items: ['User & Permission Management', 'Package Management (YUM, APT)', 'Systemctl & Shell Scripting']
      }
    ]
  },
  backup: {
    icon: '💾',
    title: 'Backup & Storage',
    sections: [
      {
        subtitle: 'Backup Solutions',
        items: ['Dell EMC NetWorker — Backup & Recovery', 'Enterprise Backup Monitoring', 'PowerProtect DD']
      },
      {
        subtitle: 'Storage Technologies',
        items: ['NetApp ONTAP', 'Data Domain Deduplication Storage']
      },
      {
        subtitle: 'Business Continuity',
        items: ['Disaster Recovery Planning', 'Data Integrity Verification', 'System Performance Monitoring']
      }
    ]
  },
  virtual: {
    icon: '☁️',
    title: 'Virtualization & Cloud',
    sections: [
      {
        subtitle: 'Hypervisors',
        items: ['VMware ESXi', 'vSphere & vCenter', 'Microsoft Hyper-V', 'VMware Workstation']
      },
      {
        subtitle: 'Remote Access',
        items: ['RDP & SSH', 'AnyDesk', 'TeamViewer']
      }
    ]
  },
  network: {
    icon: '🔗',
    title: 'Networking',
    sections: [
      {
        subtitle: 'Protocols',
        items: ['TCP/IP, DNS, DHCP', 'OSPF, NAT, STP']
      },
      {
        subtitle: 'Network Operations',
        items: ['VLAN Configuration', 'Routing & Switching', 'Firewall (OPNsense)']
      },
      {
        subtitle: 'Troubleshooting',
        items: ['LAN/Wi-Fi Diagnostics', 'Network Connectivity Issues', 'Basic Topology Design']
      }
    ]
  }
};

let activeSkill = null;

document.querySelectorAll('.skill-box').forEach(box => {
  box.addEventListener('click', () => {
    const skillKey = box.dataset.skill;

    // Toggle off if same skill clicked again
    if (activeSkill === skillKey) {
      closeSkillPanel();
      return;
    }

    activeSkill = skillKey;
    const data = skillData[skillKey];
    if (!data) return;

    // Mark active pill
    document.querySelectorAll('.skill-box').forEach(b => b.classList.remove('active-skill'));
    box.classList.add('active-skill');

    // Populate panel
    document.getElementById('skillPanelIcon').textContent = data.icon;
    document.getElementById('skillPanelTitle').textContent = data.title;
    document.getElementById('skillPanelSections').innerHTML = data.sections.map(s => `
      <div class="skill-panel-section">
        <h4>${s.subtitle}</h4>
        <ul>
          ${s.items.map(i => `<li>${i}</li>`).join('')}
        </ul>
      </div>
    `).join('');

    // Show panel
    const panel = document.getElementById('skillDetailPanel');
    panel.classList.add('visible');

    // Scroll panel into view smoothly
    setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
  });
});

function closeSkillPanel() {
  activeSkill = null;
  document.querySelectorAll('.skill-box').forEach(b => b.classList.remove('active-skill'));
  document.getElementById('skillDetailPanel').classList.remove('visible');
}


/* ════════════════════════════════════════
   EXPERIENCE — click-triggered modal
════════════════════════════════════════ */

const expData = {
  wipro: {
    client: 'Dell EMC',
    clientDesc: 'Enterprise Backup & Data Protection (NetWorker)',
    designation: 'Technical Support Engineer L2',
    achievements: [
      'Reduced resolution time for critical issues by 10% through advanced troubleshooting and effective customer communication.',
      'Introduced a streamlined documentation process, boosting team efficiency and knowledge sharing.',
      'Consistently achieved 100% customer satisfaction via proactive engagement and problem resolution.',
      'Optimized NetWorker configurations to enhance backup performance and reliability.',
      'Successfully executed standalone and cluster migrations for NetWorker applications.',
      'Specialized in root cause analysis (RCA) for complex technical issues.',
      'Recognized as a critical resource by Wipro and Dell, handling high-priority customers and receiving multiple management appreciations.',
      'Assigned as dedicated engineer for LIC (Life Insurance Corporation of India), earning two formal commendations from Dell EMC for on-site issue resolution.',
      'Awarded three certificates from Wipro for dedication and excellence.',
      'Transformed multiple dissatisfied regional customers into highly appreciative accounts.',
      'Earned over 50 customer appreciations in two years for reducing service request effort and resolving multiple issues efficiently.'
    ],
    responsibilities: [
      'Provide end-to-end technical support for Dell EMC NetWorker, ensuring high availability and minimal downtime.',
      'Troubleshoot and resolve complex backup, recovery, and migration issues across cluster and standalone environments.',
      'Manage and maintain backup infrastructures using Data Domain storage, safeguarding data integrity and availability.',
      'Monitor backup operations to ensure SLA compliance and optimal performance.',
      'Document technical solutions, processes, and case studies for knowledge sharing and future reference.',
      'Collaborate with SMEs, Development teams, and external vendors to resolve product bugs and customer issues.',
      'Train and mentor new team members on technical expertise and customer engagement best practices.',
      'Demonstrate expertise in NetWorker Core, devices, tape management, backup/recovery, and migration.'
    ]
  },
  sutherland: {
    client: 'NetApp Inc',
    clientDesc: 'Storage & Cloud Data Management (ONTAP)',
    designation: 'Hardware Technical Support Engineer L2',
    achievements: [
      'Delivered 99.999% uptime for NetApp storage in mission-critical enterprise environments, ensuring zero data loss or unplanned outages.',
      'Certified expertise through SSRT (Storage System Recovery & Troubleshooting Training), validating advanced skills in hardware replacement, RCA, and complex troubleshooting.',
      'Reduced Mean Time to Repair (MTTR) by accelerating FRU identification and streamlining coordination with on-site technicians.',
      'Proactively mitigated risks by leveraging AutoSupport (ASUP) to identify and replace 100% of at-risk hardware components before failure.',
      'Led firmware and microcode upgrades across dozens of storage nodes, improving performance and efficiency without service disruption.',
      'Contributed to knowledge growth by authoring technical articles and mentoring junior engineers on advanced recovery procedures.',
      'Handled 500+ cases in a single year with zero dissatisfaction, earning standout recognition for consistent excellence and customer-first delivery.'
    ],
    responsibilities: [
      'Diagnose failures in Field Replaceable Units (FRUs) including controllers, disk drives, PSUs, fans, and NVDIMMs, ensuring rapid fault isolation.',
      'Coordinate hardware replacement end-to-end, from fault identification to on-site technician support, minimizing downtime.',
      'Troubleshoot chassis and expansion shelves (DS2246, DS212C) and resolve SAS/FC/ACP cabling path issues.',
      'Manage firmware and microcode upgrades for drives, shelves, and controllers to address hardware bugs and compatibility challenges.',
      'Maintain and configure Service Processor (SP), BMC, and RLM functionalities to ensure reliable out-of-band management and remote recovery.',
      'Verify cabling and storage topology (SAS, FC, ACP) against NetApp best practices to eliminate single points of failure and optimize performance.',
      'Monitor system health using AutoSupport (ASUP) and internal logs, tracking environmental metrics such as temperature, voltage, and shelf ID conflicts.'
    ]
  },
  ctas: {
    client: 'Internal IT',
    clientDesc: 'Enterprise Server & Platform Administration',
    designation: 'System Associate Engineer',
    achievements: [
      'Administered 150+ Linux & Windows servers, consistently delivering 99.9% uptime and stable enterprise operations.',
      'Managed Active Directory, DNS, DHCP, and file services for 500+ users, ensuring seamless access and reliability.',
      'Reduced recurring incidents by leading root-cause analysis across OS, network, and hardware domains.',
      'Strengthened system security, cutting incidents by 25% through proactive maintenance and compliance enforcement.',
      'Achieved 95%+ SLA compliance, maintaining high ticket-closure rates across Windows, Linux, and networking incidents.',
      'Automated health reporting, reducing manual monitoring effort by 30% with custom scripts/dashboards.',
      'Delivered 100% backup reliability, ensuring zero data loss and flawless file-level restorations over 12 months.',
      'Improved troubleshooting efficiency by 20% through infrastructure documentation revamp (server room maps & cabling diagrams).',
      'Supported hardware lifecycle refresh, migrating 50+ server nodes with zero downtime.',
      'Maintained 99% patch compliance by deploying critical OS updates across 200+ servers in a single maintenance window.'
    ],
    responsibilities: [
      'Administer cross-platform servers, including Windows (Active Directory password resets, OU management) and Linux (log analysis, file permissions, service recovery).',
      'Monitor physical and virtual infrastructure health using monitoring tools and escalating critical alerts to prevent business impact.',
      'Manage daily backup operations with NetWorker, troubleshooting failures and performing data restoration requests.',
      'Provide first-response support for network issues, including cable patching, VLAN verification, and VPN troubleshooting for remote users.',
      'Assist in storage and hardware provisioning, including racking/stacking servers, replacing failed disks, and monitoring capacity alerts.',
      'Execute Standard Operating Procedures (SOPs) for patching, firmware updates, and OS deployments via imaging or PXE boot.',
      'Document incidents in ServiceNow or Jira, ensuring SLA compliance across the full lifecycle of hardware and software issues.'
    ]
  }
};

function renderExperienceModal(data) {
  return `
    <div class="exp-modal">
      <button class="overlay-close" onclick="closeExpModal()">✕</button>

      <div class="exp-modal-header">
        <div class="exp-modal-badge">
          <span class="exp-modal-client">${data.client}</span>
        </div>
        <div class="exp-modal-title-block">
          <p class="exp-modal-label">${data.clientDesc}</p>
          <h3 class="exp-modal-designation">${data.designation}</h3>
        </div>
      </div>

      <div class="exp-tabs">
        <button class="exp-tab active" onclick="switchTab(this, 'achievements')">🏆 Achievements</button>
        <button class="exp-tab" onclick="switchTab(this, 'responsibilities')">📋 Responsibilities</button>
      </div>

      <div class="exp-panel-wrap">
        <div class="exp-panel active" id="panel-achievements">
          <ul class="exp-fancy-list">
            ${data.achievements.map((item, i) => `
              <li class="exp-fancy-item" style="animation-delay:${i * 0.045}s">
                <span class="item-dot"></span><span>${item}</span>
              </li>`).join('')}
          </ul>
        </div>
        <div class="exp-panel" id="panel-responsibilities">
          <ul class="exp-fancy-list">
            ${data.responsibilities.map((item, i) => `
              <li class="exp-fancy-item" style="animation-delay:${i * 0.045}s">
                <span class="item-dot item-dot--purple"></span><span>${item}</span>
              </li>`).join('')}
          </ul>
        </div>
      </div>
    </div>
  `;
}

function switchTab(btn, panelId) {
  document.querySelectorAll('.exp-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.exp-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('panel-' + panelId);
  if (panel) {
    panel.classList.add('active');
    // Re-trigger item animations
    panel.querySelectorAll('.exp-fancy-item').forEach(item => {
      item.style.animation = 'none';
      item.offsetHeight; // reflow
      item.style.animation = '';
    });
  }
}

// Open experience modal on CLICK (not hover)
document.querySelectorAll('.exp-module').forEach(module => {
  module.addEventListener('click', () => {
    const key = module.dataset.exp;
    const data = expData[key];
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

// Close on backdrop click
document.getElementById('expOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeExpModal();
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeExpModal();
});
