/* ---------------- mobile menu toggle ---------------- */
const menuBtn = document.getElementById('menuBtn') || document.querySelector('.menu-btn');
const navLinks = document.querySelector('nav.links');
if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', isOpen);
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}
