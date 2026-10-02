const root = document.documentElement;
const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const themeToggle = document.querySelector('.theme-toggle');
const navLinks = [...document.querySelectorAll('.nav-link')];
const sections = [...document.querySelectorAll('main section[id]')];
const toast = document.getElementById('toast');

const savedTheme = localStorage.getItem('nuel-theme');
if (savedTheme === 'dark') root.classList.add('dark');
updateThemeIcon();

function updateThemeIcon() {
  const dark = root.classList.contains('dark');
  themeToggle.textContent = dark ? '☀' : '☾';
  themeToggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
}

themeToggle.addEventListener('click', () => {
  root.classList.toggle('dark');
  localStorage.setItem('nuel-theme', root.classList.contains('dark') ? 'dark' : 'light');
  updateThemeIcon();
});

menuToggle.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

navLinks.forEach(link => link.addEventListener('click', () => {
  navMenu.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

function handleScroll() {
  header.classList.toggle('scrolled', window.scrollY > 10);
  const current = sections.find(section => {
    const rect = section.getBoundingClientRect();
    return rect.top <= 130 && rect.bottom >= 130;
  });
  navLinks.forEach(link => link.classList.toggle('active', current && link.getAttribute('href') === `#${current.id}`));
}
window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    projectCards.forEach(card => {
      card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.category !== filter);
    });
  });
});

document.querySelectorAll('.faq-item button').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const expanded = button.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.faq-item').forEach(other => {
      if (other !== item) {
        other.classList.remove('open');
        other.querySelector('button').setAttribute('aria-expanded', 'false');
      }
    });
    item.classList.toggle('open', !expanded);
    button.setAttribute('aria-expanded', String(!expanded));
  });
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 3500);
}

const form = document.getElementById('contact-form');
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const name = form.elements.name.value.trim();
  showToast(`Thanks, ${name || 'there'} — your message is ready to send.`);
  form.reset();
});

document.getElementById('year').textContent = new Date().getFullYear();
