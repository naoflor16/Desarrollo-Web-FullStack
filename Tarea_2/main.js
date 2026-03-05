const canvas = document.getElementById("stars");

let ctx = null;
let stars = [];
let rockets = [
  { x: 200, y: 0, dir: 1 },
  { x: window.innerWidth - 200, y: -200, dir: 1 },
  { x: window.innerWidth / 2, y: window.innerHeight, dir: -1 }
];
let rafId = 0;

const NUM_STARS = 120;

const reduceMotion =
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const w = window.innerWidth;
  const h = window.innerHeight;

  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);

  canvas.style.width = w + "px";
  canvas.style.height = h + "px";

  ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  stars = Array.from({ length: NUM_STARS }, () => ({
    x: rand(0, w),
    y: rand(0, h),
    radius: rand(0.3, 1.8),
    alpha: rand(0.2, 1.0),
    speed: rand(0.004, 0.018) * (Math.random() < 0.5 ? 1 : -1)
  }));
}

function draw() {
  if (!ctx) return;

  const rect = canvas.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;

  ctx.clearRect(0, 0, w, h);

  for (const s of stars) {
    // Twinkle
    s.alpha += s.speed;
    if (s.alpha > 1 || s.alpha < 0.2) s.speed = -s.speed;

    ctx.globalAlpha = s.alpha;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
  }

  ctx.globalAlpha = 1;

  // cohetes
  for (const r of rockets) {

    drawRocket(r.x, r.y, r.dir);

    r.y += 1.5 * r.dir;

    if (r.dir === 1 && r.y > window.innerHeight + 100) {
      r.y = -100;
    }

    if (r.dir === -1 && r.y < -100) {
      r.y = window.innerHeight + 100;
    }
  }
}

function drawRocket(x, y, dir) {

  ctx.save();
  ctx.translate(x, y);

  if (dir === 1) {
    ctx.rotate(Math.PI); 
  }

  ctx.fillStyle = "#d9d9d9";
  ctx.fillRect(-10, -40, 20, 60);

  ctx.fillStyle = "#ff4d6d";
  ctx.beginPath();
  ctx.moveTo(-10, -40);
  ctx.lineTo(10, -40);
  ctx.lineTo(0, -60);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#4cc9f0";
  ctx.beginPath();
  ctx.arc(0, -15, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ff4d6d";

  ctx.beginPath();
  ctx.moveTo(-10, 10);
  ctx.lineTo(-25, 20);
  ctx.lineTo(-10, 20);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(10, 10);
  ctx.lineTo(25, 20);
  ctx.lineTo(10, 20);
  ctx.fill();

  ctx.fillStyle = "orange";
  ctx.beginPath();
  ctx.moveTo(-6, 20);
  ctx.lineTo(6, 20);
  ctx.lineTo(0, 35);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function loop() {
  draw();
  rafId = requestAnimationFrame(loop);
}

function stop() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = 0;
}

function onVisibilityChange() {
  if (document.hidden) stop();
  else if (!reduceMotion && !rafId) loop();
}

// Observa cambios de tamaño
const ro = new ResizeObserver(() => resizeCanvas());
ro.observe(canvas);

// Eventos
window.addEventListener("resize", resizeCanvas);
document.addEventListener("visibilitychange", onVisibilityChange);

// Init
resizeCanvas();
if (!reduceMotion) loop();
else draw();