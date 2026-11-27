// ═══════════════════════════════════════════
// KINETIC LETTER WRAPPER (Chia từng chữ thành thẻ span nhảy múa)
// ═══════════════════════════════════════════
function wrapKineticLetters() {
  document.querySelectorAll('.kinetic-title').forEach(title => {
    // Traverse text nodes or specific child lines
    const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];
    while (walker.nextNode()) {
      if (walker.currentNode.nodeValue.trim().length > 0) {
        textNodes.push(walker.currentNode);
      }
    }
    textNodes.forEach(node => {
      const text = node.nodeValue;
      const frag = document.createDocumentFragment();
      let delay = 0.05;
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === ' ') {
          frag.appendChild(document.createTextNode(' '));
        } else {
          const span = document.createElement('span');
          span.className = 'kinetic-char';
          span.textContent = char;
          span.style.transitionDelay = `${delay}s`;
          delay += 0.035;
          frag.appendChild(span);
        }
      }
      node.parentNode.replaceChild(frag, node);
    });
  });
}
wrapKineticLetters();

const scenes = [
  document.getElementById('sceneHero'),
  document.getElementById('sceneMarquee'),
  document.getElementById('sceneAbout'),
  document.getElementById('sceneEdu'),
  document.getElementById('sceneContact')
];

const navSteps = document.querySelectorAll('.nav-step');
const glow1 = document.querySelector('.glow-1');
const glow2 = document.querySelector('.glow-2');
const glow3 = document.querySelector('.glow-3');
const curtain = document.getElementById('curtain');

let currentSceneIndex = 0;
let isTransitioning = false;

// ── Curtain transition between scenes ──────────────────────
function switchScene(nextIndex) {
  if (nextIndex === currentSceneIndex || isTransitioning) return;
  isTransitioning = true;

  // Phase 1: Close curtain (sweep down)
  curtain.classList.remove('opening');
  curtain.classList.add('closing');

  setTimeout(() => {
    // Hidden behind curtain — swap active scene
    scenes[currentSceneIndex].classList.remove('active');
    scenes[nextIndex].classList.add('active');

    navSteps.forEach((step, i) => step.classList.toggle('active', i === nextIndex));
    document.body.classList.toggle('contact-active', nextIndex === 4);

    if (nextIndex === 2) animateCounters();
    currentSceneIndex = nextIndex;

    // Phase 2: Open curtain (sweep up)
    curtain.classList.remove('closing');
    curtain.classList.add('opening');

    setTimeout(() => {
      curtain.classList.remove('opening');
      isTransitioning = false;
    }, 480);

  }, 480);
}

function handleScroll() {
  const scrollY = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = Math.max(0, Math.min(scrollY / (maxScroll || 1), 1));

  const targetIndex = Math.min(Math.floor(progress * scenes.length), scenes.length - 1);
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

// Click on left navigation steps to smoothly jump to scenes
navSteps.forEach(step => {
  step.addEventListener('click', () => {
    const targetIdx = parseInt(step.dataset.step, 10);
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetScroll = (targetIdx / (scenes.length - 1)) * maxScroll;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  });
});

// Navigation Contact link click
const navContactLink = document.getElementById('navContactLink');
if (navContactLink) {
  navContactLink.addEventListener('click', (e) => {
    e.preventDefault();
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: maxScroll, behavior: 'smooth' });
  });
}

// ═══════════════════════════════════════════
// 3D TILT EFFECT FOR HERO CARD
// ═══════════════════════════════════════════
const heroVisualWrap = document.getElementById('heroVisualWrap');
if (heroVisualWrap && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('mousemove', (e) => {
    if (currentSceneIndex !== 0) return;
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 2;
    const y = (e.clientY / innerHeight - 0.5) * 2;
    heroVisualWrap.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateY(-50%)`;
  });
}

// ═══════════════════════════════════════════
// COUNTER ANIMATION
// ═══════════════════════════════════════════
let countersAnimated = false;
function animateCounters() {
  if (countersAnimated) return;
  countersAnimated = true;
  document.querySelectorAll('.stat-big[data-target]').forEach(el => {
    const target = +el.dataset.target;
    let count = 0;
    const step = Math.ceil(target / 30);
    const id = setInterval(() => {
      count = Math.min(count + step, target);
      el.textContent = count;
      if (count >= target) clearInterval(id);
    }, 40);
  });
}

// ═══════════════════════════════════════════
// HEADLINE TEXT GLITCH HOVER
// ═══════════════════════════════════════════
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
    }, 35);
  });
});
