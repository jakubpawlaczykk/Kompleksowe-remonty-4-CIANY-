const loader = document.getElementById('loader');
const header = document.getElementById('header');
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
const revealElements = document.querySelectorAll('.reveal');
const filterButtons = document.querySelectorAll('.filter');
const galleryCards = document.querySelectorAll('.gallery-card');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');

window.addEventListener('load', () => {
  window.setTimeout(() => loader?.classList.add('is-hidden'), 350);
});

const closeMenu = () => {
  nav?.classList.remove('is-open');
  menuBtn?.classList.remove('is-active');
  menuBtn?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
};

menuBtn?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  menuBtn.classList.toggle('is-active', isOpen);
  menuBtn.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('menu-open', isOpen);
});

navLinks.forEach(link => link.addEventListener('click', closeMenu));

document.addEventListener('click', event => {
  if (!nav?.contains(event.target) && !menuBtn?.contains(event.target)) closeMenu();
});

const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -45px' });

revealElements.forEach(element => revealObserver.observe(element));

const sections = [...document.querySelectorAll('main section[id]')];
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-35% 0px -58% 0px', threshold: 0 });

sections.forEach(section => sectionObserver.observe(section));

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(item => item.classList.remove('is-active'));
    button.classList.add('is-active');

    galleryCards.forEach(card => {
      const shouldShow = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('is-hidden', !shouldShow);
    });
  });
});

const openLightbox = card => {
  const source = card.dataset.image || card.querySelector('img')?.src;
  if (!source) return;
  lightboxImage.src = source;
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lightbox-open');
  lightboxClose.focus();
};

const closeLightbox = () => {
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lightbox-open');
  lightboxImage.src = '';
};

galleryCards.forEach(card => card.addEventListener('click', () => openLightbox(card)));
lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', event => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeMenu();
    if (lightbox?.classList.contains('is-open')) closeLightbox();
  }
});

document.getElementById('year').textContent = new Date().getFullYear();


// DODATKOWE EFEKTY WIZUALNE
const scrollProgress = document.getElementById('scrollProgress');
const cursorGlow = document.getElementById('cursorGlow');
const lazyImages = document.querySelectorAll('.lazy-img');
const counters = document.querySelectorAll('[data-counter]');

const updateProgress = () => {
  if (!scrollProgress) return;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
};

updateProgress();
window.addEventListener('scroll', updateProgress, { passive: true });

window.addEventListener('pointermove', event => {
  if (!cursorGlow || window.matchMedia('(max-width: 860px)').matches) return;
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
}, { passive: true });

lazyImages.forEach(img => {
  const markReady = () => {
    img.classList.add('is-loaded');
    img.closest('.gallery-card, .about__image')?.classList.add('image-ready');
  };

  if (img.complete) {
    window.setTimeout(markReady, 120);
  } else {
    img.addEventListener('load', markReady, { once: true });
    img.addEventListener('error', markReady, { once: true });
  }
});

galleryCards.forEach(card => {
  card.addEventListener('pointermove', event => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', `${x}%`);
    card.style.setProperty('--my', `${y}%`);
  });
});

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const element = entry.target;
    const target = Number(element.dataset.counter || 0);
    const isRating = target === 5;
    const duration = 1100;
    const start = performance.now();

    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;

      if (isRating) {
        element.textContent = value.toFixed(1).replace('.', ',');
      } else {
        element.textContent = `${Math.round(value)}${target === 58 ? '+' : ''}`;
      }

      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    counterObserver.unobserve(element);
  });
}, { threshold: .65 });

counters.forEach(counter => counterObserver.observe(counter));
