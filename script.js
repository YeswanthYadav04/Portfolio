// ===================== CURSOR (INSANE MODE) =====================
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');

let mx = 0, my = 0;
let rx = 0, ry = 0;

// 🏏 TRAIL
const trail = [];
const maxTrail = 10;

// speed detection
let lastX = 0, lastY = 0;
let speed = 0;

// mouse move
document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;

  cur.style.left = mx + 'px';
  cur.style.top = my + 'px';

  // calculate speed
  const dx = mx - lastX;
  const dy = my - lastY;
  speed = Math.sqrt(dx * dx + dy * dy);

  lastX = mx;
  lastY = my;

  // 🌀 dynamic spin based on speed
  cur.style.animationDuration = Math.max(0.3, 1 - speed * 0.01) + 's';

  // 💨 add trail
  trail.push({ x: mx, y: my, life: 1 });
  if (trail.length > maxTrail) trail.shift();
});

// smooth ring follow
function animateCursor() {
  rx += (mx - rx) * 0.15;
  ry += (my - ry) * 0.15;

  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';

  requestAnimationFrame(animateCursor);
}
animateCursor();


// ================= TRAIL CANVAS =================
const trailCanvas = document.createElement('canvas');
trailCanvas.style.position = 'fixed';
trailCanvas.style.top = 0;
trailCanvas.style.left = 0;
trailCanvas.style.pointerEvents = 'none';
trailCanvas.style.zIndex = 9997;
document.body.appendChild(trailCanvas);

const tctx = trailCanvas.getContext('2d');

function resizeTrail() {
  trailCanvas.width = window.innerWidth;
  trailCanvas.height = window.innerHeight;
}
resizeTrail();
window.addEventListener('resize', resizeTrail);

// draw trail
function drawTrail() {
  tctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

  for (let i = 0; i < trail.length; i++) {
    const p = trail[i];

    tctx.beginPath();
    tctx.arc(p.x, p.y, 5 * p.life, 0, Math.PI * 2);
    tctx.fillStyle = `rgba(255,80,80,${p.life})`;
    tctx.fill();

    p.life *= 0.8;
  }

  requestAnimationFrame(drawTrail);
}
drawTrail();


// ===================== 🎮 MAGNETIC EFFECT =====================
document.querySelectorAll('a,button,.proj-card').forEach(el => {
  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  });

  el.addEventListener('mouseleave', () => {
    el.style.transform = `translate(0,0)`;
  });
});


// ===================== HOVER EFFECT =====================
document.querySelectorAll('a,button,.tag,.stat,.proj-card,.cert,.coding-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>{
    cur.style.transform='translate(-50%,-50%) scale(1.8)';
    ring.style.width='70px';
    ring.style.height='70px';
    ring.style.borderColor='var(--gold)';
  });

  el.addEventListener('mouseleave',()=>{
    cur.style.transform='translate(-50%,-50%) scale(1)';
    ring.style.width='40px';
    ring.style.height='40px';
    ring.style.borderColor='rgba(46,204,113,.5)';
  });
});


// ===================== CANVAS BACKGROUND (ENHANCED) =====================
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let W, H;
let pts = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function Pt() {
  this.x = Math.random() * W;
  this.y = Math.random() * H;
  this.vx = (Math.random() - 0.5) * 0.4;
  this.vy = (Math.random() - 0.5) * 0.4;
  this.r = Math.random() * 1.5 + 0.5;
}

for (let i = 0; i < 120; i++) pts.push(new Pt());

function draw() {
  ctx.clearRect(0, 0, W, H);

  for (let p of pts) {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(180,30,30,0.18)'; // cricket ball red particles
    ctx.fill();
  }

  requestAnimationFrame(draw);
}
draw();


// ===================== TYPING =====================
const phrases = [
  'Backend Developer.',
  'Python & Django Engineer.',
  'REST API Architect.',
  'AI/ML Explorer.',
  'RAG Pipeline Builder.',
  'Competitive Programmer.'
];

let pi = 0, ci = 0, del = false;
const typed = document.getElementById('typed');

function type() {
  if (!typed) return;

  const ph = phrases[pi];

  if (!del) {
    ci++;
    typed.textContent = ph.slice(0, ci);
    if (ci === ph.length) {
      del = true;
      setTimeout(type, 1500);
      return;
    }
  } else {
    ci--;
    typed.textContent = ph.slice(0, ci);
    if (ci === 0) {
      del = false;
      pi = (pi + 1) % phrases.length;
    }
  }

  setTimeout(type, del ? 40 : 70);
}
type();


// ===================== NAV =====================
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', scrollY > 50);
});

// ===================== HAMBURGER MENU =====================
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// close menu when a link is clicked
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});
// ===================== OBSERVER =====================
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.observe').forEach(el => io.observe(el));


// ===================== CONTACT (UPDATED WITH EMAILJS) =====================
function handleSubmit(e) {
  e.preventDefault();

  const name = e.target[0].value;
  const email = e.target[1].value;
  const message = e.target[2].value;

  emailjs.send("service_y3ve49r", "template_zh1rst8", {
    name: name,
    email: email,
    message: message
  })
  .then(() => {
    alert("🔥 Message sent successfully!");
    e.target.reset();
  })
  .catch((error) => {
    alert("❌ Failed to send message");
    console.error(error);
  });
}

// ===================== 🏏 CRICKET ENHANCEMENTS =====================

// --- CRICKET BALL HIT EFFECT on click ---
document.addEventListener('click', e => {
  const burst = document.createElement('div');
  burst.style.cssText = `
    position:fixed;
    left:${e.clientX}px;
    top:${e.clientY}px;
    width:6px;height:6px;
    border-radius:50%;
    background:radial-gradient(circle, #e74c3c, #8B0000);
    pointer-events:none;
    z-index:9996;
    transform:translate(-50%,-50%);
    animation:cricketBurst .5s ease forwards;
  `;
  document.body.appendChild(burst);

  for (let i = 0; i < 3; i++) {
    const ring = document.createElement('div');
    ring.style.cssText = `
      position:fixed;
      left:${e.clientX}px;
      top:${e.clientY}px;
      width:8px;height:8px;
      border-radius:50%;
      border:1.5px solid rgba(231,76,60,${0.6 - i * 0.15});
      pointer-events:none;
      z-index:9995;
      transform:translate(-50%,-50%);
      animation:cricketRing ${0.5 + i * 0.15}s ${i * 0.08}s ease forwards;
    `;
    document.body.appendChild(ring);
    setTimeout(() => ring.remove(), 700 + i * 150);
  }

  setTimeout(() => burst.remove(), 500);
});

const criStyle = document.createElement('style');
criStyle.textContent = `
  @keyframes cricketBurst {
    0%   { transform:translate(-50%,-50%) scale(1); opacity:1; }
    100% { transform:translate(-50%,-50%) scale(5); opacity:0; }
  }
  @keyframes cricketRing {
    0%   { width:8px; height:8px; opacity:.8; }
    100% { width:70px; height:70px; opacity:0; }
  }
  @keyframes stumpWobble {
    0%,100% { transform:rotate(0deg); }
    25%     { transform:rotate(-15deg); }
    75%     { transform:rotate(12deg); }
  }
`;
document.head.appendChild(criStyle);


// --- OVER COUNTER in nav ---
(function() {
  const overDisplay = document.createElement('div');
  overDisplay.style.cssText = `
    font-family:'Fira Code',monospace;
    font-size:.52rem;
    color:rgba(46,204,113,.35);
    letter-spacing:.2em;
    padding:.2rem .5rem;
    border:1px solid rgba(46,204,113,.12);
    border-radius:2px;
    pointer-events:none;
    margin-left:.8rem;
    white-space:nowrap;
  `;
  overDisplay.textContent = 'OVER 0.0';
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) navLinks.parentNode.insertBefore(overDisplay, navLinks.nextSibling);

  let ball = 0, over = 0, lastY = 0;
  window.addEventListener('scroll', () => {
    if (Math.abs(window.scrollY - lastY) > 90) {
      lastY = window.scrollY;
      ball++;
      if (ball > 5) { ball = 1; over++; }
      overDisplay.textContent = `OVER ${over}.${ball}`;
    }
  });
})();


// --- STUMP WOBBLE on timeline dot hover ---
document.querySelectorAll('.tl-dot').forEach(dot => {
  dot.addEventListener('mouseenter', () => {
    dot.style.animation = 'stumpWobble .35s ease';
    setTimeout(() => dot.style.animation = '', 350);
  });
});


// --- COUNT-UP ANIMATION for coding rating cards ---
const ratingEls = document.querySelectorAll('.coding-rating[data-target]');
const ratingObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target);
    let current = 0;
    const step = Math.ceil(target / 55);
    const iv = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(iv);
    }, 18);
    ratingObserver.unobserve(el);
  });
}, { threshold: 0.5 });
ratingEls.forEach(el => ratingObserver.observe(el));


// ===================== TAG VISIBILITY FIX =====================
// Tags start opacity:0 and need .vis class to appear
const tagObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const tags = entry.target.querySelectorAll('.tag');
    tags.forEach((tag, i) => {
      setTimeout(() => tag.classList.add('vis'), i * 40);
    });
    tagObserver.unobserve(entry.target);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.skill-groups > div').forEach(group => {
  tagObserver.observe(group);
});

// Also make any already-visible tags show immediately
document.querySelectorAll('.tag').forEach(tag => {
  if (!tag.classList.contains('vis')) {
    const rect = tag.getBoundingClientRect();
    if (rect.top < window.innerHeight) tag.classList.add('vis');
  }
});