/* ============================================
   APP TECH HUB — Portfolio Website
   Interactions & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============== PAGE LOAD ANIMATION ==============
  requestAnimationFrame(() => {
    document.body.classList.remove('loading');
  });

  // ============== NAVBAR SCROLL ==============
  const navbar = document.getElementById('navbar');

  const handleNavScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ============== MOBILE NAV TOGGLE ==============
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ============== SMOOTH SCROLL ==============
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ============== SCROLL TO TOP BUTTON ==============
  const scrollTopBtn = document.getElementById('scrollTop');

  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============== SCROLL REVEAL ANIMATIONS ==============
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ============== PARALLAX ON HERO ORBS ==============
  const orbs = document.querySelectorAll('.gradient-orb');
  
  document.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 768) return;
    const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    orbs.forEach((orb, index) => {
      const speed = (index + 1) * 15;
      orb.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
    });
  });

  // ============== STAT COUNTER ANIMATION ==============
  const statNumbers = document.querySelectorAll('.stat-number');
  let statAnimated = false;

  const animateStats = () => {
    if (statAnimated) return;
    const heroSection = document.querySelector('.hero');
    const rect = heroSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      statAnimated = true;
      statNumbers.forEach(stat => {
        const text = stat.textContent.trim();
        if (/^\d/.test(text)) {
          const target = parseInt(text);
          const suffix = text.replace(/^\d+/, '');
          const duration = 1500;
          const startTime = performance.now();
          const updateCount = (currentTime) => {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            stat.textContent = Math.round(target * easeProgress) + suffix;
            if (progress < 1) requestAnimationFrame(updateCount);
          };
          requestAnimationFrame(updateCount);
        }
      });
    }
  };

  window.addEventListener('scroll', animateStats, { passive: true });
  animateStats();

  // ============== CENTER-MODE CAROUSEL ==============
  const carousels = document.querySelectorAll('.product-screenshots');

  carousels.forEach(container => {
    const carousel = container.querySelector('.screenshot-carousel');
    const dotsContainer = container.querySelector('.carousel-dots');
    const captionEl = container.querySelector('.carousel-caption');
    const prevBtn = container.querySelector('.carousel-prev');
    const nextBtn = container.querySelector('.carousel-next');
    if (!carousel || !dotsContainer) return;

    const items = carousel.querySelectorAll('.carousel-item');
    if (items.length === 0) return;

    let currentIndex = 0;
    let isDragging = false;
    let startX = 0;
    let dragDelta = 0;
    let autoPlayTimer = null;

    // Create dots
    items.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.carousel-dot');

    function updateCarousel() {
      items.forEach((item, i) => {
        item.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next');

        const diff = i - currentIndex;

        if (diff === 0) {
          item.classList.add('active');
        } else if (diff === -1 || (currentIndex === 0 && i === items.length - 1)) {
          if (diff === -1) item.classList.add('prev');
          else if (items.length > 2) item.classList.add('prev');
          else item.classList.add('far-prev');
        } else if (diff === 1 || (currentIndex === items.length - 1 && i === 0)) {
          if (diff === 1) item.classList.add('next');
          else if (items.length > 2) item.classList.add('next');
          else item.classList.add('far-next');
        } else if (diff < -1) {
          item.classList.add('far-prev');
        } else if (diff > 1) {
          item.classList.add('far-next');
        }
      });

      // Update dots
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });

      // Update caption
      if (captionEl) {
        const activeItem = items[currentIndex];
        captionEl.textContent = activeItem.dataset.caption || '';
      }
    }

    function goTo(index) {
      currentIndex = ((index % items.length) + items.length) % items.length;
      updateCarousel();
      resetAutoPlay();
    }

    function next() {
      goTo(currentIndex + 1);
    }

    function prev() {
      goTo(currentIndex - 1);
    }

    // Arrow buttons
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prev(); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); next(); });

    // Mouse drag
    carousel.addEventListener('mousedown', (e) => {
      if (e.target.closest('.carousel-arrow')) return;
      isDragging = true;
      startX = e.clientX;
      dragDelta = 0;
      carousel.style.cursor = 'grabbing';
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      dragDelta = e.clientX - startX;
    });

    window.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      carousel.style.cursor = 'grab';
      
      if (Math.abs(dragDelta) > 50) {
        if (dragDelta > 0) prev();
        else next();
      }
      dragDelta = 0;
    });

    // Touch support
    carousel.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].clientX;
      dragDelta = 0;
    }, { passive: true });

    carousel.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      dragDelta = e.touches[0].clientX - startX;
    }, { passive: true });

    carousel.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      if (Math.abs(dragDelta) > 50) {
        if (dragDelta > 0) prev();
        else next();
      }
      dragDelta = 0;
    });

    // Click on prev/next items to navigate
    items.forEach((item, i) => {
      item.addEventListener('click', () => {
        if (i !== currentIndex) goTo(i);
      });
    });

    // Auto-play
    function startAutoPlay() {
      autoPlayTimer = setInterval(next, 4000);
    }

    function resetAutoPlay() {
      clearInterval(autoPlayTimer);
      startAutoPlay();
    }

    // Pause on hover
    carousel.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
    carousel.addEventListener('mouseleave', () => startAutoPlay());

    // Initialize
    updateCarousel();
    startAutoPlay();
  });

  // ============== PRODUCT CARD TILT EFFECT ==============
  const productCards = document.querySelectorAll('.product-card');

  productCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 768) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-4px) perspective(1000px) rotateX(${-y * 2}deg) rotateY(${x * 2}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ============== ACTIVE NAV LINK HIGHLIGHT ==============
  const sections = document.querySelectorAll('section[id]');
  const navLinkItems = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  const highlightNav = () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinkItems.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.style.color = 'var(--text-primary)';
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

  // ============== TECH BADGE HOVER GLOW ==============
  document.querySelectorAll('.tech-badge').forEach(badge => {
    badge.addEventListener('mouseenter', () => {
      badge.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.2)';
    });
    badge.addEventListener('mouseleave', () => {
      badge.style.boxShadow = '';
    });
  });

});
