// Shameem Portfolio — Folioblox Theme Interactions

document.addEventListener('DOMContentLoaded', () => {
  const heroFigureImg = document.getElementById('heroFigureImg');
  const viewButtons = document.querySelectorAll('.view-btn');
  const heroFigureStage = document.getElementById('heroFigureStage');
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const toast = document.getElementById('toast');

  // 1. Framing Mode Switcher: Full Body (Default) vs Portrait (Face to Half)
  const floorShadow = document.querySelector('.figure-floor-shadow');
  if (viewButtons && heroFigureImg) {
    viewButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        if (btn.classList.contains('active')) return;

        viewButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        // Animate transition
        heroFigureImg.style.opacity = '0';
        heroFigureImg.style.transform = 'translateY(10px) scale(0.97)';
        if (floorShadow) floorShadow.style.opacity = '0';

        setTimeout(() => {
          heroFigureImg.classList.remove('mode-full', 'mode-portrait');

          if (mode === 'portrait') {
            heroFigureImg.src = 'assets/shameem-portrait.png';
            heroFigureImg.classList.add('mode-portrait');
            if (floorShadow) floorShadow.style.opacity = '0';
          } else {
            heroFigureImg.src = 'assets/shameem-full.png';
            heroFigureImg.classList.add('mode-full');
            if (floorShadow) floorShadow.style.opacity = '1';
          }

          heroFigureImg.style.opacity = '1';
          heroFigureImg.style.transform = 'translateY(0) scale(1)';
        }, 180);
      });
    });
  }

  // 2. Subtle Parallax Effect on Hero Figure Stage
  if (heroFigureStage) {
    heroFigureStage.addEventListener('mousemove', (e) => {
      const rect = heroFigureStage.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateY = (x / (rect.width / 2)) * 5;
      const rotateX = -(y / (rect.height / 2)) * 5;

      heroFigureStage.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    heroFigureStage.addEventListener('mouseleave', () => {
      heroFigureStage.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      heroFigureStage.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      setTimeout(() => {
        heroFigureStage.style.transition = '';
      }, 600);
    });
  }

  // 3. Copy Email to Clipboard
  function copyEmailToClipboard(email) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(email).then(() => showToast('Email copied to clipboard!'));
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = email;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        showToast('Email copied to clipboard!');
      } catch (err) {
        showToast('Could not copy email');
      }
      document.body.removeChild(textArea);
    }
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      copyEmailToClipboard('kanancherishameem@gmail.com');
    });
  }

  // 4. Small Projects Filter Tabs & Layout Switcher
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-showcase-item');
  const layoutToggleBtns = document.querySelectorAll('.layout-toggle-btn');
  const projectsContainer = document.getElementById('projectsContainer');

  // Filter interaction
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      projectItems.forEach((item) => {
        const categories = (item.dataset.category || '').toLowerCase().split(/\s+/);
        if (filter === 'all' || categories.includes(filter)) {
          item.style.setProperty('display', '', 'important');
        } else {
          item.style.setProperty('display', 'none', 'important');
        }
      });
    });
  });

  // Layout switcher (List vs Grid)
  if (layoutToggleBtns && projectsContainer) {
    layoutToggleBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        layoutToggleBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const view = btn.dataset.view;
        if (view === 'grid') {
          projectsContainer.classList.remove('layout-list-mode');
          projectsContainer.classList.add('layout-grid-mode');
        } else {
          projectsContainer.classList.remove('layout-grid-mode');
          projectsContainer.classList.add('layout-list-mode');
        }
      });
    });
  }

  // Row / Card / Button click: Toggle inline video playback without opening external links
  projectItems.forEach((item) => {
    const video = item.querySelector('video');
    const playBtn = item.querySelector('.item-arrow-btn');

    const togglePlayback = () => {
      if (!video) return;
      if (video.paused) {
        // Pause any other playing showcase video first
        document.querySelectorAll('.item-video-el').forEach((v) => {
          if (v !== video && !v.paused) v.pause();
        });
        video.play().catch(() => {});
        if (playBtn) playBtn.classList.add('is-playing');
      } else {
        video.pause();
        if (playBtn) playBtn.classList.remove('is-playing');
      }
    };

    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlayback();
      });
    }

    item.addEventListener('click', (e) => {
      if (e.target.closest('video') || e.target.closest('a') || e.target.closest('button')) {
        return;
      }
      togglePlayback();
    });

    if (video) {
      video.addEventListener('play', () => {
        if (playBtn) playBtn.classList.add('is-playing');
      });
      video.addEventListener('pause', () => {
        if (playBtn) playBtn.classList.remove('is-playing');
      });
    }
  });

  // Video hover playback preview
  const showcaseVideos = document.querySelectorAll('.item-video-box video');
  showcaseVideos.forEach((video) => {
    const parentItem = video.closest('.project-showcase-item');
    if (parentItem) {
      parentItem.addEventListener('mouseenter', () => {
        if (video.paused) {
          video.play().catch(() => {});
        }
      });
      parentItem.addEventListener('mouseleave', () => {
        video.pause();
      });
    }
  });

  const resultCards = document.querySelectorAll('.result-card');
  resultCards.forEach((card) => {
    card.addEventListener('click', () => {
      const title = card.querySelector('.result-title')?.textContent || 'Outcome';
      showToast(`Impact focus: ${title} — High performance delivery.`);
    });
  });

  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach((card) => {
    card.addEventListener('click', () => {
      const title = card.querySelector('.service-title')?.textContent || 'Service';
      const msg = encodeURIComponent(`Hi Shameem, I'm interested in your ${title} service. Can we discuss scope and availability?`);
      showToast(`Selected service: ${title} — Opening WhatsApp inquiry...`);
      setTimeout(() => {
        window.open(`https://wa.me/919037745256?text=${msg}`, '_blank', 'noopener,noreferrer');
      }, 700);
    });
  });

  const toolCards = document.querySelectorAll('.tool-card');
  toolCards.forEach((card) => {
    card.addEventListener('click', () => {
      const name = card.querySelector('.tool-name')?.textContent || 'Tool';
      const type = card.querySelector('.tool-type')?.textContent || 'Software';
      showToast(`${name}: ${type}`);
    });
  });

  const certCards = document.querySelectorAll('.cert-card');
  certCards.forEach((card) => {
    card.addEventListener('click', () => {
      const name = card.querySelector('.cert-name')?.textContent || 'Certification';
      showToast(`Verified credential: ${name}`);
    });
  });

  const testimonialCards = document.querySelectorAll('.testimonial-card');
  testimonialCards.forEach((card) => {
    card.addEventListener('click', () => {
      showToast('Client Feedback: “Very creative, professional, and easy to work with.”');
    });
  });

  // 5. Active Nav Link on Scroll
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section, footer');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (current && link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
});
