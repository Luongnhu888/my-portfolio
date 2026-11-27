// ══════════════════════════════════════════════
// SCENE SYSTEM
// ══════════════════════════════════════════════

const scenes = [
  document.getElementById('sceneHero'),
  document.getElementById('sceneMarquee'),
  document.getElementById('sceneAbout'),
  document.getElementById('sceneEdu'),
  document.getElementById('sceneContact')
];

const navSteps      = document.querySelectorAll('.nav-step');
const glow1         = document.querySelector('.glow-1');
const glow2         = document.querySelector('.glow-2');
const glow3         = document.querySelector('.glow-3');
const transition    = document.getElementById('pageTransition');
const sceneCounter  = document.getElementById('sceneCounter');

let currentSceneIndex = 0;
let pendingSceneIndex = 0;
let isTransitioning   = false;

// Timing constants (match CSS)
const CLOSE_MS = 760; // var(--tt) 0.72s + stagger 0.16s
const OPEN_MS  = 760;

// ══════════════════════════════════════════════
// WEFLASH-STYLE TRANSITION
// ══════════════════════════════════════════════
function switchScene(nextIndex) {
  pendingSceneIndex = nextIndex;
  if (nextIndex === currentSceneIndex || isTransitioning) return;
  isTransitioning = true;

  // --- Phase 1: Blocks drop down (cover screen) ---
  transition.classList.remove('opening');
  transition.classList.add('closing');

  setTimeout(() => {
    const target = pendingSceneIndex;
    // Hidden behind blocks — swap scenes
    scenes[currentSceneIndex].classList.remove('active');
    scenes[target].classList.add('active');

    navSteps.forEach((step, i) => step.classList.toggle('active', i === target));
    document.body.classList.toggle('contact-active', target === 4);

    // Update scene counter
    if (sceneCounter) sceneCounter.textContent = `0${target + 1} / 05`;

    if (target === 2) animateCounters();
    currentSceneIndex = target;

    // --- Phase 2: Blocks retract upward (reveal new scene) ---
    transition.classList.remove('closing');
    transition.classList.add('opening');

    setTimeout(() => {
      transition.classList.remove('opening');
      isTransitioning = false;
      if (pendingSceneIndex !== currentSceneIndex) {
        switchScene(pendingSceneIndex);
      }
    }, OPEN_MS);

  }, CLOSE_MS);
}

// ══════════════════════════════════════════════
// SCROLL HANDLER
// ══════════════════════════════════════════════
function handleScroll() {
  const scrollY   = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress  = Math.max(0, Math.min(scrollY / (maxScroll || 1), 1));

  const targetIndex = Math.min(
    Math.round(progress * (scenes.length - 1)),
    scenes.length - 1
  );

  switchScene(targetIndex);

  // Ambient glow parallax
  if (glow1 && glow2 && glow3) {
    glow1.style.transform = `translate(${progress * -80}px, ${progress * 150}px) scale(${1 + progress * 0.3})`;
    glow2.style.transform = `translate(${progress * 100}px, ${progress * -120}px) scale(${1 - progress * 0.2})`;
    glow3.style.transform = `translate(${Math.sin(progress * Math.PI) * 120}px, ${progress * 80}px)`;
  }
}

window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();

// ══════════════════════════════════════════════
// NAV STEP CLICK → SMOOTH SCROLL
// ══════════════════════════════════════════════
navSteps.forEach(step => {
  step.addEventListener('click', () => {
    const idx = parseInt(step.dataset.step, 10);
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const target    = (idx / (scenes.length - 1)) * maxScroll;
    window.scrollTo({ top: target, behavior: 'smooth' });
  });
});

// Contact link
const navContactLink = document.getElementById('navContactLink');
if (navContactLink) {
  navContactLink.addEventListener('click', (e) => {
    e.preventDefault();
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: maxScroll, behavior: 'smooth' });
  });
}

// ══════════════════════════════════════════════
// 3D TILT EFFECT FOR HERO CARD
// ══════════════════════════════════════════════
const heroVisualWrap = document.getElementById('heroVisualWrap');
if (heroVisualWrap && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('mousemove', (e) => {
    if (currentSceneIndex !== 0) return;
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth  - 0.5) * 2;
    const y = (e.clientY / innerHeight - 0.5) * 2;
    heroVisualWrap.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
  });
}

// ══════════════════════════════════════════════
// COUNTER ANIMATION
// ══════════════════════════════════════════════
let countersAnimated = false;
function animateCounters() {
  if (countersAnimated) return;
  countersAnimated = true;
  document.querySelectorAll('.stat-big[data-target]').forEach(el => {
    const target = +el.dataset.target;
    let count = 0;
    const id = setInterval(() => {
      count = Math.min(count + 1, target);
      el.textContent = count;
      if (count >= target) clearInterval(id);
    }, 60);
  });
}

// ══════════════════════════════════════════════
// GLITCH HOVER ON HERO HEADLINE LINES
// ══════════════════════════════════════════════
const glitchChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#%&';

document.querySelectorAll('.hero-headline .rl').forEach(line => {
  const original = line.textContent.trim();
  line.addEventListener('mouseenter', () => {
    let iter = 0;
    clearInterval(line._glitch);
    line._glitch = setInterval(() => {
      line.textContent = original.split('').map((ch, idx) => {
        if (ch === ' ') return ' ';
        if (idx < iter) return original[idx];
        return glitchChars[Math.floor(Math.random() * glitchChars.length)];
      }).join('');
      iter += 0.5;
      if (iter >= original.length) {
        line.textContent = original;
        clearInterval(line._glitch);
      }
    }, 35);
  });
});
