// ══════════════════════════════════════════════
// CONTINUOUS 3D DEPTH & KINETIC SCENE SYSTEM
// ══════════════════════════════════════════════

const scenes = [
  document.getElementById('sceneHero'),
  document.getElementById('sceneMarquee'),
  document.getElementById('sceneAbout'),
  document.getElementById('sceneEdu'),
  document.getElementById('sceneContact')
];

const navSteps          = document.querySelectorAll('.nav-step');
const glow1             = document.querySelector('.glow-1');
const glow2             = document.querySelector('.glow-2');
const glow3             = document.querySelector('.glow-3');
const sceneCounter      = document.getElementById('sceneCounter');
const scrollProgressBar = document.getElementById('scrollProgressBar');
const portalHalo        = document.getElementById('portalHalo');

let currentSceneIndex = 0;
let targetProgress    = 0;
let smoothProgress    = 0;

// ══════════════════════════════════════════════
// DIRECTION-AWARE SCENE SWITCH (ZERO LOCKS)
// ══════════════════════════════════════════════
function setActiveScene(nextIndex) {
  if (nextIndex === currentSceneIndex) return;
  currentSceneIndex = nextIndex;

  // Assign depth state classes (.past / .active / .future)
  scenes.forEach((scene, i) => {
    scene.classList.remove('past', 'active', 'future');
    if (i < nextIndex)       scene.classList.add('past');
    else if (i === nextIndex) scene.classList.add('active');
    else                     scene.classList.add('future');
  });

  navSteps.forEach((step, i) => step.classList.toggle('active', i === nextIndex));
  document.body.classList.toggle('contact-active', nextIndex === 4);

  if (sceneCounter) sceneCounter.textContent = `0${nextIndex + 1} / 05`;

  // Pulse subtle portal ring
  if (portalHalo) {
    portalHalo.classList.remove('pulse');
    void portalHalo.offsetWidth; // restart keyframe cleanly
    portalHalo.classList.add('pulse');
  }

  if (nextIndex === 2) animateCounters();
}

// ══════════════════════════════════════════════
// SCROLL LISTENER + SILKY 60FPS RAF LOOP
// ══════════════════════════════════════════════
function updateScrollTarget() {
  const scrollY   = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  targetProgress  = Math.max(0, Math.min(scrollY / (maxScroll || 1), 1));

  const targetIndex = Math.min(
    Math.round(targetProgress * (scenes.length - 1)),
    scenes.length - 1
  );

  setActiveScene(targetIndex);
}

window.addEventListener('scroll', updateScrollTarget, { passive: true });
updateScrollTarget();

function renderLoop() {
  // Smooth lerp toward target scroll progress
  smoothProgress += (targetProgress - smoothProgress) * 0.1;

  // Hairline scroll progress bar
  if (scrollProgressBar) {
    scrollProgressBar.style.transform = `scaleX(${Math.max(0.02, smoothProgress)})`;
  }

  // Silky ambient glow parallax
  if (glow1 && glow2 && glow3) {
    glow1.style.transform = `translate3d(${smoothProgress * -90}px, ${smoothProgress * 160}px, 0) scale(${1 + smoothProgress * 0.25})`;
    glow2.style.transform = `translate3d(${smoothProgress * 110}px, ${smoothProgress * -130}px, 0) scale(${1 - smoothProgress * 0.18})`;
    glow3.style.transform = `translate3d(${Math.sin(smoothProgress * Math.PI) * 140}px, ${smoothProgress * 70}px, 0)`;
  }

  requestAnimationFrame(renderLoop);
}
requestAnimationFrame(renderLoop);

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
