/**
 * RanFie Inc. — Main JavaScript
 * Handles theme toggling, scroll reveals, smooth anchor navigation,
 * product quick-view modal, contact form submission, and ambient micro-interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initScrollReveals();
  initNavbarBehavior();
  initMobileMenu();
  initProductFilters();
  initProductModal();
  initContactForm();
  initEmailCopy();
  initMouseSpotlight();
});

/* --------------------------------------------------------------------------
   Product Filter Tabs
   -------------------------------------------------------------------------- */
function initProductFilters() {
  const filterBtns = document.querySelectorAll('.filter-pill');
  const cards = document.querySelectorAll('.product-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('is-hidden');
          card.classList.add('revealed');
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   1. Theme Management (Dark by default, small day toggle)
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('ranfie-theme');

  // Dark is the default as specified
  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const targetTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-theme', targetTheme);
      localStorage.setItem('ranfie-theme', targetTheme);
    });
  }
}

/* --------------------------------------------------------------------------
   2. Scroll Reveal Animations (Subtle fade and slide)
   -------------------------------------------------------------------------- */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  if (!('IntersectionObserver' in window)) {
    // Fallback if IntersectionObserver isn't supported
    revealElements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* --------------------------------------------------------------------------
   3. Navbar Behavior (Scroll shrinkage & active section tracking)
   -------------------------------------------------------------------------- */
function initNavbarBehavior() {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Active link highlighting
    let currentSection = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // Smooth scroll with header offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId.startsWith('#')) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 84;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        const mobileNav = document.getElementById('mobileNavDrawer');
        const mobileBtn = document.getElementById('mobileMenuToggle');
        if (mobileNav?.classList.contains('open')) {
          mobileNav.classList.remove('open');
          mobileBtn?.classList.remove('open');
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. Mobile Menu Drawer
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const drawer = document.getElementById('mobileNavDrawer');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.remove('open');
      toggleBtn.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    } else {
      drawer.classList.add('open');
      toggleBtn.classList.add('open');
      toggleBtn.setAttribute('aria-expanded', 'true');
    }
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
      drawer.classList.remove('open');
      toggleBtn.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* --------------------------------------------------------------------------
   5. Product Quick Preview Modal (Interactive spec preview for all 7 apps)
   -------------------------------------------------------------------------- */
const productData = {
  'fresh-texfy': {
    name: 'Fresh Texfy',
    category: 'Design & Vector Composition',
    icon: 'assets/icon-fresh-texfy.svg',
    tagline: 'A fluid, distraction-free design editor engineered for rapid visual composition and vector creativity.',
    features: [
      'Sub-millisecond canvas rendering with GPU acceleration',
      'Non-destructive vector Boolean operations and bezier curvature',
      'Quiet, unobtrusive UI that recedes to let your artwork shine',
      'Universal export support (SVG, WebP, PDF, high-res PNG)'
    ]
  },
  'roafy': {
    name: 'RoaFy',
    category: 'Roadmap & Social Trajectory',
    icon: 'assets/icon-roafy.svg',
    tagline: 'Plan your trajectories, document milestones, and share your building journey with like-minded creators.',
    features: [
      'Visual timeline plotting with milestones and branching goals',
      'Follow creators, indie hackers, and studios building in public',
      'Rich progress notes, release updates, and changelog feeds',
      'Sync across desktop and mobile with zero latency'
    ]
  },
  'expendfy': {
    name: 'ExpendFy',
    category: 'Personal Finance & Spending Clarity',
    icon: 'assets/icon-expendfy.svg',
    tagline: 'Effortless, private expense tracking designed to bring calm and clarity to your personal spending.',
    features: [
      'Instant transaction entry with smart category auto-suggestions',
      'Strict local-first privacy: your financial data remains yours',
      'Gentle spending rhythm visualizers instead of stressful warning charts',
      'Multi-currency support and encrypted cloud backup'
    ]
  },
  'expendfy-business': {
    name: 'ExpendFy Business',
    category: 'Commerce, Cash Flow & Merchant Dashboard',
    icon: 'assets/icon-expendfy-business.svg',
    tagline: 'An all-in-one financial dashboard and sales tracker built specifically for modern independent shop owners.',
    features: [
      'Real-time cash flow overview, margin analytics, and daily tallies',
      'Inventory receipt tracking and vendor expense reconciliation',
      'Quick export for tax preparation and accountant review',
      'Customized multi-terminal sync for shop staff'
    ]
  },
  'pidifie': {
    name: 'PidiFie',
    category: 'Document Reader & PDF Studio',
    icon: 'assets/icon-pidifie.svg',
    tagline: 'A feather-light, lightning-fast PDF reader and editor that turns document workflows into pure breeze.',
    features: [
      'Opens massive multi-gigabyte PDFs instantly without memory lag',
      'Precision text editing, vector redaction, and crisp highlighter',
      'Cryptographic signature placement and page reordering',
      'Clean reader mode with customizable paper tints and typography'
    ]
  },
  'font-fruite': {
    name: 'Font Fruite',
    category: 'Typography & Font Discovery',
    icon: 'assets/icon-font-fruite.svg',
    tagline: 'An organic typography playground to discover, test, and pair expressive typefaces in real time.',
    features: [
      'Curated specimen gallery with real-time editorial previews',
      'Intelligent pairing engine for header, body, and monospace fonts',
      'Variable font axes manipulator (weight, slant, optical size)',
      '1-click CSS snippet generator and glyph inspection'
    ]
  },
  'rag-chatbots': {
    name: 'RanFie RAG Chatbots',
    category: 'Enterprise AI & Knowledge Retrieval',
    icon: 'assets/icon-rag-chatbots.svg',
    tagline: 'Private, enterprise-grade AI assistants trained directly on your business\'s proprietary documents.',
    features: [
      'Grounded semantic retrieval across PDFs, Notion, docs, and codebases',
      'Zero hallucination safeguards with precise footnote citations',
      'Enterprise security boundary: your internal data is never trained upon',
      'Deployable via web widget, Slack, Microsoft Teams, or custom API'
    ]
  }
};

function initProductModal() {
  const modalBackdrop = document.getElementById('productModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const modalIcon = document.getElementById('modalIcon');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalDescription = document.getElementById('modalDescription');
  const modalFeaturesList = document.getElementById('modalFeaturesList');
  const modalContactLink = document.getElementById('modalContactLink');

  if (!modalBackdrop) return;

  // Open modal on card link or card click
  document.querySelectorAll('[data-product-id]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const productId = trigger.getAttribute('data-product-id');
      const data = productData[productId];
      if (!data) return;

      modalIcon.src = data.icon;
      modalIcon.alt = data.name;
      modalTitle.textContent = data.name;
      modalCategory.textContent = data.category;
      modalDescription.textContent = data.tagline;

      modalFeaturesList.innerHTML = '';
      data.features.forEach(feature => {
        const item = document.createElement('div');
        item.className = 'modal-feature-item';
        item.innerHTML = `
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          <span>${feature}</span>
        `;
        modalFeaturesList.appendChild(item);
      });

      if (modalContactLink) {
        modalContactLink.href = `#contact`;
        modalContactLink.onclick = () => {
          closeModal();
          // Prefill interest dropdown
          const select = document.getElementById('productInterestSelect');
          if (select) {
            select.value = data.name;
          }
        };
      }

      openModal();
    });
  });

  function openModal() {
    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn?.addEventListener('click', closeModal);

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   6. Contact Form Interaction
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('ranfieContactForm');
  const feedback = document.getElementById('formFeedback');

  if (!form || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('.form-submit-btn');
    const originalText = submitBtn.innerHTML;

    // Gentle loading state
    submitBtn.innerHTML = `
      <svg class="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 0.8s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
      </svg>
      Sending...
    `;
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      form.reset();

      feedback.classList.add('show');
      feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      setTimeout(() => {
        feedback.classList.remove('show');
      }, 7000);
    }, 700);
  });
}

/* --------------------------------------------------------------------------
   7. 1-Click Email Copy Pill
   -------------------------------------------------------------------------- */
function initEmailCopy() {
  const copyBtn = document.getElementById('copyEmailBtn');
  const emailText = document.getElementById('emailAddressText');

  if (!copyBtn || !emailText) return;

  copyBtn.addEventListener('click', async () => {
    const email = emailText.textContent.trim();
    try {
      await navigator.clipboard.writeText(email);
      const originalLabel = copyBtn.getAttribute('data-original-label') || 'hello@ranfie.com';
      copyBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 20 20" fill="#10B981">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
        </svg>
        <span style="color: #10B981;">Copied to clipboard</span>
      `;
      setTimeout(() => {
        copyBtn.innerHTML = `
          <svg class="copy-indicator-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span id="emailAddressText">${originalLabel}</span>
        `;
      }, 2500);
    } catch (err) {
      // Fallback
      window.location.href = `mailto:${email}`;
    }
  });
}

/* --------------------------------------------------------------------------
   8. Mouse Spotlight (Subtle ambient desk glow)
   -------------------------------------------------------------------------- */
function initMouseSpotlight() {
  const spotlight = document.querySelector('.mouse-spotlight');
  if (!spotlight || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;
  let ticking = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        currentX += (mouseX - currentX) * 0.15;
        currentY += (mouseY - currentY) * 0.15;
        spotlight.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}
