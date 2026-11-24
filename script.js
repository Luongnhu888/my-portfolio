// ═══════════════════════════════════════
// CUSTOM CURSOR
// ═══════════════════════════════════════
const dot = document.createElement('div');
const ring = document.createElement('div');
dot.className = 'cursor-dot';
ring.className = 'cursor-ring';
document.body.append(dot, ring);

let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function animateCursor() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';

  // change cursor color in dark contact section
  const contact = document.getElementById('contact');
  if (contact) {
    const rect = contact.getBoundingClientRect();
    document.body.classList.toggle('contact-section', my >= rect.top);
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .edu-item').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hover'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
});

// ═══════════════════════════════════════
// SCROLL REVEAL
// ═══════════════════════════════════════
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObs.observe(el));

// Add data-reveal to key elements dynamically
document.querySelectorAll('.edu-item, .contact-col, .about-right > *').forEach((el, i) => {
  el.setAttribute('data-reveal', i < 3 ? `delay-${i}` : '');
  revealObs.observe(el);
});

// ═══════════════════════════════════════
// COUNTER ANIMATION
// ═══════════════════════════════════════
const counters = document.querySelectorAll('.stat-big[data-target]');
const countObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.target;
    let count = 0;
    const step = Math.ceil(target / 40);
    const id = setInterval(() => {
      count = Math.min(count + step, target);
      el.textContent = count;
      if (count >= target) clearInterval(id);
    }, 35);
    countObs.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => countObs.observe(c));

// ═══════════════════════════════════════
// HERO HEADLINE — text glitch on hover
// ═══════════════════════════════════════
document.querySelectorAll('.hero-headline .line').forEach(line => {
  const original = line.textContent.trim();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#%&';
  line.addEventListener('mouseenter', () => {
    let iter = 0;
    clearInterval(line._glitch);
    line._glitch = setInterval(() => {
      line.textContent = original.split('').map((ch, idx) => {
        if (ch === ' ') return ' ';
        if (idx < iter) return original[idx];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      iter += 0.5;
      if (iter >= original.length) { line.textContent = original; clearInterval(line._glitch); }
    }, 40);
  });
});

// ═══════════════════════════════════════
// NAVBAR — scroll shrink (frame-top)
// ═══════════════════════════════════════
const frameTop = document.querySelector('.frame-top');
window.addEventListener('scroll', () => {
  frameTop.style.borderBottomWidth = window.scrollY > 10 ? '1px' : '1px';
}, { passive: true });

// ═══════════════════════════════════════
// MARQUEE — pause on hover
// ═══════════════════════════════════════
const track = document.querySelector('.marquee-track');
document.querySelector('.marquee-wrap').addEventListener('mouseenter', () => {
  track.style.animationPlayState = 'paused';
});
document.querySelector('.marquee-wrap').addEventListener('mouseleave', () => {
  track.style.animationPlayState = 'running';
});
