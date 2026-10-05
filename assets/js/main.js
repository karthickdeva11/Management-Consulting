/* ==========================================================================
   STACKLY CONSULTING - ADVANCED GSAP & INTERACTIVE ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- 01. DESKTOP CURSOR FOLLOWER ---
  if (window.innerWidth >= 992) {
    const cursorDot = document.createElement('div');
    cursorDot.className = 'custom-cursor-dot';
    const cursorRing = document.createElement('div');
    cursorRing.className = 'custom-cursor-ring';
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorRing);

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function renderCursorRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(renderCursorRing);
    }
    renderCursorRing();

    const hoverables = document.querySelectorAll('a, button, .card-unique, .stat-card, .solution-step-item, .trans-card, .pillar-card, .team-card');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // --- 02. HERO SLIDER ENGINE & GSAP STAGGER REVEAL ---
  const slides = document.querySelectorAll('.hero-slide');
  const slideNumbers = document.querySelectorAll('.slide-number');
  let currentSlide = 0;
  let slideInterval;

  function triggerHeroGSAP() {
    if (typeof gsap !== 'undefined') {
      gsap.fromTo('.hero-eyebrow', 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
      gsap.fromTo('.hero-title', 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, delay: 0.15, ease: 'power3.out' }
      );
      gsap.fromTo('.hero-description', 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.9, delay: 0.3, ease: 'power3.out' }
      );
      gsap.fromTo('.hero-buttons', 
        { y: 25, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, delay: 0.45, ease: 'power3.out' }
      );
    }
  }

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    slideNumbers.forEach((num, i) => {
      num.classList.toggle('active', i === index);
    });
    currentSlide = index;
    triggerHeroGSAP();
  }

  function nextSlide() {
    let next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  function startSlider() {
    if (slides.length > 0) {
      slideInterval = setInterval(nextSlide, 6000);
    }
  }

  function pauseSlider() {
    clearInterval(slideInterval);
  }

  slideNumbers.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      pauseSlider();
      showSlide(i);
      startSlider();
    });
  });

  const heroSliderSection = document.querySelector('.hero-slider-section');
  if (heroSliderSection) {
    heroSliderSection.addEventListener('mouseenter', pauseSlider);
    heroSliderSection.addEventListener('mouseleave', startSlider);
    startSlider();
    triggerHeroGSAP();
  }

  // --- 03. MOUSE PARALLAX EFFECT FOR HERO & BLOBS ---
  if (heroSliderSection) {
    heroSliderSection.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const moveX = (clientX - window.innerWidth / 2) * 0.015;
      const moveY = (clientY - window.innerHeight / 2) * 0.015;

      const heroContent = document.querySelector('.hero-content');
      if (heroContent && typeof gsap !== 'undefined') {
        gsap.to(heroContent, {
          x: moveX,
          y: moveY,
          duration: 0.6,
          ease: 'power1.out'
        });
      }
    });
  }

  // --- 04. MOBILE MENU TOGGLE ---
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  // Create mobile backdrop overlay if not present
  let navBackdrop = document.querySelector('.nav-backdrop');
  if (!navBackdrop && navMenu) {
    navBackdrop = document.createElement('div');
    navBackdrop.className = 'nav-backdrop';
    document.body.appendChild(navBackdrop);
  }

  function toggleMobileMenu(open) {
    if (!navMenu || !mobileToggle) return;
    const shouldOpen = open !== undefined ? open : !navMenu.classList.contains('active');
    
    if (shouldOpen) {
      navMenu.classList.add('active');
      if (navBackdrop) navBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      }
    } else {
      navMenu.classList.remove('active');
      if (navBackdrop) navBackdrop.classList.remove('active');
      document.body.style.overflow = '';
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    }
  }

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    if (navBackdrop) {
      navBackdrop.addEventListener('click', () => toggleMobileMenu(false));
    }

    // Close menu when a link inside navMenu is clicked
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => toggleMobileMenu(false));
    });
  }

  // --- 04B. DASHBOARD MOBILE HAMBURGER TOGGLE ---
  const dashToggle = document.querySelector('.dashboard-mobile-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (dashToggle && sidebar) {
    if (!navBackdrop) {
      navBackdrop = document.createElement('div');
      navBackdrop.className = 'nav-backdrop';
      document.body.appendChild(navBackdrop);
    }

    dashToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = sidebar.classList.toggle('active');
      const icon = dashToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars', !isActive);
        icon.classList.toggle('fa-xmark', isActive);
      }
      if (navBackdrop) navBackdrop.classList.toggle('active', isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';
    });

    if (navBackdrop) {
      navBackdrop.addEventListener('click', () => {
        sidebar.classList.remove('active');
        if (navBackdrop) navBackdrop.classList.remove('active');
        document.body.style.overflow = '';
        const icon = dashToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    }

    const sidebarLinks = sidebar.querySelectorAll('a, button, .sidebar-link');
    sidebarLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 991) {
          sidebar.classList.remove('active');
          if (navBackdrop) navBackdrop.classList.remove('active');
          document.body.style.overflow = '';
          const icon = dashToggle.querySelector('i');
          if (icon) {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
          }
        }
      });
    });
  }

  // --- 05. COUNTER ANIMATION FOR STATS ---
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');
  let counted = false;

  function runCounters() {
    statNumbers.forEach(stat => {
      const target = parseFloat(stat.getAttribute('data-count'));
      const prefix = stat.getAttribute('data-prefix') || '';
      const suffix = stat.getAttribute('data-suffix') || '';
      const decimals = parseInt(stat.getAttribute('data-decimals') || '0');
      
      let count = 0;
      const duration = 2000;
      const stepTime = 30;
      const steps = duration / stepTime;
      const increment = target / steps;

      const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
          count = target;
          clearInterval(timer);
        }
        stat.textContent = prefix + (decimals > 0 ? count.toFixed(decimals) : Math.floor(count)) + suffix;
      }, stepTime);
    });
  }

  const statsSection = document.querySelector('.stats-grid');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counted) {
          runCounters();
          counted = true;
        }
      });
    }, { threshold: 0.3 });
    observer.observe(statsSection);
  }

  // --- 06. STRATEGIC SOLUTIONS TAB INTERACTION ---
  const solutionItems = document.querySelectorAll('.solution-step-item');
  const solutionImage = document.querySelector('.solution-image');
  const solutionDesc = document.querySelector('.solution-desc-target');
  const solutionTitle = document.querySelector('.solution-title-target');

  const solutionData = {
    1: {
      title: "01. Diagnostics & Opportunity Mapping",
      desc: "Our senior advisors conduct in-depth data audits, stakeholder interviews, and market benchmarking to pinpoint high-margin revenue gaps and operating bottlenecks.",
      image: "assets/images/case_1.webp"
    },
    2: {
      title: "02. Strategic Architecture & Modeling",
      desc: "We build tailored financial models, competitive positioning frameworks, and scalable operational blueprints designed for sustainable enterprise performance.",
      image: "assets/images/case_2.webp"
    },
    3: {
      title: "03. Execution & Agile Transformation",
      desc: "Deploying embedded experts alongside your leadership team, we manage program execution, change management, and technology adoption with zero disruption.",
      image: "assets/images/hero_slide_2.webp"
    },
    4: {
      title: "04. Performance Optimization & Value Creation",
      desc: "Continuous metric tracking, leadership alignment reviews, and governance frameworks ensure long-term value capture and ROI optimization.",
      image: "assets/images/hero_slide_3.webp"
    }
  };

  solutionItems.forEach(item => {
    item.addEventListener('click', () => {
      const step = item.getAttribute('data-step');
      solutionItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      if (solutionData[step]) {
        if (solutionImage) {
          if (typeof gsap !== 'undefined') {
            gsap.to(solutionImage, { opacity: 0, scale: 0.95, duration: 0.2, onComplete: () => {
              solutionImage.src = solutionData[step].image;
              gsap.to(solutionImage, { opacity: 1, scale: 1, duration: 0.3 });
            }});
          } else {
            solutionImage.src = solutionData[step].image;
          }
        }
        if (solutionTitle) solutionTitle.textContent = solutionData[step].title;
        if (solutionDesc) solutionDesc.textContent = solutionData[step].desc;
      }
    });
  });

  // --- 07. GSAP SCROLLTRIGGER & AOS REVEAL OBSERVER ---
  const aosElements = document.querySelectorAll('[data-aos]');
  if (aosElements.length > 0) {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      aosElements.forEach(el => {
        const type = el.getAttribute('data-aos') || 'fade-up';
        const delay = parseFloat(el.getAttribute('data-aos-delay') || '0') / 1000;

        let fromProps = { opacity: 0, duration: 0.9, delay, ease: 'power2.out' };
        if (type === 'fade-up' || type === 'slide-up') fromProps.y = 50;
        else if (type === 'fade-down') fromProps.y = -50;
        else if (type === 'fade-left' || type === 'slide-left') fromProps.x = -50;
        else if (type === 'fade-right') fromProps.x = 50;
        else if (type === 'zoom-in') fromProps.scale = 0.85;
        else if (type === 'zoom-out') fromProps.scale = 1.15;
        else if (type === 'flip-left') fromProps.rotationY = -90;
        else if (type === 'flip-right') fromProps.rotationY = 90;

        gsap.from(el, {
          ...fromProps,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        });
      });
    } else {
      // IntersectionObserver fallback
      const aosObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
          }
        });
      }, { threshold: 0.15 });

      aosElements.forEach(el => aosObserver.observe(el));
    }
  }

  // --- 08. MAGNETIC BUTTON EFFECT ---
  const magneticButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = `translate(0px, 0px)`;
    });
  });

  // --- 09. MODAL SYSTEM ---
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modalOverlay = document.querySelector('.modal-overlay');
  const modalCloses = document.querySelectorAll('.modal-close');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal-target');
      const targetModal = document.getElementById(targetId);
      if (targetModal) {
        targetModal.classList.add('active');
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(targetModal.querySelector('.modal-box'), 
            { scale: 0.9, opacity: 0 }, 
            { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.5)' }
          );
        }
      }
    });
  });

  modalCloses.forEach(close => {
    close.addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    });
  });

  if (modalOverlay) {
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('active');
        }
      });
    });
  }

  // --- 10. FORM VALIDATION & 404 REDIRECT ---
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      // Validated successfully -> redirect to custom 404 page
      window.location.href = '404.html';
    });
  });

  function showToast(message, type = 'info') {
    let toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: rgba(14, 21, 37, 0.95);
      backdrop-filter: blur(12px);
      color: #F8FAFC;
      border: 1px solid #E5A00D;
      padding: 16px 24px;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      z-index: 9999;
      font-size: 0.95rem;
      max-width: 400px;
    `;
    toast.innerHTML = `<i class="fa-solid fa-circle-check text-gold" style="margin-right:10px;"></i> ${message}`;
    document.body.appendChild(toast);

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(toast, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 });
      setTimeout(() => {
        gsap.to(toast, { y: 30, opacity: 0, duration: 0.4, onComplete: () => toast.remove() });
      }, 4500);
    } else {
      setTimeout(() => toast.remove(), 4500);
    }
  }

  // --- 11. BLOG & SERVICE FILTERING ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterItems = document.querySelectorAll('.filter-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-filter');
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      filterItems.forEach(item => {
        if (cat === 'all' || item.getAttribute('data-category') === cat) {
          item.style.display = 'block';
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(item, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 });
          }
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
});
