const loader = document.getElementById('loader');
const header = document.getElementById('header');
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav a');
const heroItems = document.querySelectorAll('.reveal-hero');
const revealItems = document.querySelectorAll('.reveal');
const filters = document.querySelectorAll('.filter');
const projectCards = document.querySelectorAll('.project-card');

window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('is-hidden');
    heroItems.forEach((item, index) => {
      setTimeout(() => item.classList.add('is-visible'), index * 180);
    });
  }, 650);
});

const toggleHeader = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 40);
};

toggleHeader();
window.addEventListener('scroll', toggleHeader, { passive: true });

menuBtn.addEventListener('click', () => {
  nav.classList.toggle('is-open');
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.16,
  rootMargin: '0px 0px -60px 0px'
});

revealItems.forEach(item => revealObserver.observe(item));

filters.forEach(button => {
  button.addEventListener('click', () => {
    filters.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const selected = button.dataset.filter;

    projectCards.forEach(card => {
      const match = selected === 'all' || card.dataset.category === selected;
      card.classList.toggle('is-hidden', !match);
    });
  });
});

const sections = document.querySelectorAll('section[id]');

const activeSection = () => {
  const scrollPosition = window.scrollY + 120;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    const activeLink = document.querySelector(`.nav a[href="#${sectionId}"]`);

    if (!activeLink) return;

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach(link => link.classList.remove('is-active'));
      activeLink.classList.add('is-active');
    }
  });
};

window.addEventListener('scroll', activeSection, { passive: true });
activeSection();

let lastScroll = window.scrollY;
const heroImage = document.querySelector('.hero__media img');

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;

  if (heroImage && currentScroll < window.innerHeight) {
    heroImage.style.transform = `scale(1.1) translateY(${currentScroll * 0.08}px)`;
  }

  lastScroll = currentScroll;
}, { passive: true });
