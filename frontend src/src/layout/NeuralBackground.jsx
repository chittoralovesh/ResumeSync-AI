import React, { useRef, useEffect } from 'react';

/* ── Config ── */
const N      = 110;
const R      = 360;   // sphere radius
const CONN_D = 260;   // 3D connection distance
const FOV    = 550;
const CAM_Z  = 610;

/* ── Color palette: [r, g, b] ── */
const PALETTE = [
  [0, 243, 255],   // cyan    ×2
  [0, 243, 255],
  [157, 78, 221],  // purple  ×2
  [157, 78, 221],
  [80, 160, 255],  // sky blue
  [180, 100, 255], // violet
  [215, 235, 255], // near-white
];

function mkParticle() {
  const u = Math.random(), v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi   = Math.acos(2 * v - 1);
  const r     = R * (0.35 + Math.random() * 0.65);
  return {
    x:  r * Math.sin(phi) * Math.cos(theta),
    y:  r * Math.sin(phi) * Math.sin(theta),
    z:  r * Math.cos(phi),
    vx: (Math.random() - 0.5) * 0.16,
    vy: (Math.random() - 0.5) * 0.16,
    vz: (Math.random() - 0.5) * 0.16,
    c:  PALETTE[Math.floor(Math.random() * PALETTE.length)],
    sz: 0.9 + Math.random() * 2.0,
  };
}

/* Rotation helpers — only transform x,y,z */
const rotY = (x, y, z, a) => ({
  x:  x * Math.cos(a) - z * Math.sin(a),
  y,
  z:  x * Math.sin(a) + z * Math.cos(a),
});
const rotX = (x, y, z, a) => ({
  x,
  y: y * Math.cos(a) - z * Math.sin(a),
  z: y * Math.sin(a) + z * Math.cos(a),
});

/* Perspective projection — only takes xyz, returns screen coords */
const project = (x, y, z, W, H) => {
  const Zc = z + CAM_Z;
  if (Zc <= 0) return null;
  const sc = FOV / Zc;
  return {
    sx:    W * 0.5 + x * sc,
    sy:    H * 0.5 + y * sc,
    depth: Math.max(0, Math.min(1, (sc - 0.25) / 1.6)),
    ox: x, oy: y, oz: z,
  };
};

export default function NeuralBackground() {
  const cvs = useRef(null);

  useEffect(() => {
    const canvas = cvs.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let raf;
    let t = 0, mx = 0, my = 0, tmx = 0, tmy = 0;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      tmx = (e.clientX / canvas.width  - 0.5) * 2;
      tmy = (e.clientY / canvas.height - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove);

    const pts = Array.from({ length: N }, mkParticle);

    const frame = () => {
      try {
        t  += 0.0028;
        mx += (tmx - mx) * 0.045;
        my += (tmy - my) * 0.045;

        const W = canvas.width, H = canvas.height;

        /* Background */
        ctx.fillStyle = '#03030c';
        ctx.fillRect(0, 0, W, H);

        /* Ambient glow blobs */
        [
          [W * 0.78, H * 0.18, 480, 'rgba(0,100,255,0.045)'],
          [W * 0.12, H * 0.82, 560, 'rgba(110,0,255,0.04)' ],
          [W * 0.50, H * 0.48, 320, 'rgba(0,180,255,0.025)'],
        ].forEach(([gx, gy, gr, col]) => {
          const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
          g.addColorStop(0, col);
          g.addColorStop(1, 'transparent');
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, W, H);
        });

        /* Rotation angles */
        const aY = t * 0.13 + mx * 0.65;
        const aX = Math.sin(t * 0.08) * 0.18 + my * 0.32;

        /* Drift */
        pts.forEach(p => {
          p.x += p.vx; p.y += p.vy; p.z += p.vz;
          const d = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
          if (d > R * 1.12) { p.vx *= -0.92; p.vy *= -0.92; p.vz *= -0.92; }
        });

        /* Project — preserve c and sz from original particle */
        const pj = [];
        for (let i = 0; i < pts.length; i++) {
          const p  = pts[i];
          const r1 = rotY(p.x, p.y, p.z, aY);
          const r2 = rotX(r1.x, r1.y, r1.z, aX);
          const pr = project(r2.x, r2.y, r2.z, W, H);
          if (pr) pj.push({ ...pr, c: p.c, sz: p.sz });
        }

        /* Back-to-front sort */
        pj.sort((a, b) => a.depth - b.depth);

        /* Connections */
        for (let i = 0; i < pj.length - 1; i++) {
          const a = pj[i];
          for (let j = i + 1; j < pj.length; j++) {
            const b  = pj[j];
            const dx = a.ox - b.ox, dy = a.oy - b.oy, dz = a.oz - b.oz;
            const d3 = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (d3 >= CONN_D) continue;

            const str   = 1 - d3 / CONN_D;
            const avgD  = (a.depth + b.depth) * 0.5;
            const alpha = str * str * avgD * 0.58;
            if (alpha < 0.012) continue;

            const [ar, ag, ab] = a.c;
            const [br, bg, bb] = b.c;
            const lg = ctx.createLinearGradient(a.sx, a.sy, b.sx, b.sy);
            lg.addColorStop(0, `rgba(${ar},${ag},${ab},${alpha})`);
            lg.addColorStop(1, `rgba(${br},${bg},${bb},${alpha})`);

            ctx.beginPath();
            ctx.moveTo(a.sx, a.sy);
            ctx.lineTo(b.sx, b.sy);
            ctx.strokeStyle = lg;
            ctx.lineWidth   = str * avgD * 1.3;
            ctx.stroke();
          }
        }

        /* Particles */
        for (let i = 0; i < pj.length; i++) {
          const p = pj[i];
          if (p.depth < 0.04) continue;

          const [r, g, b] = p.c;
          const s = p.sz * p.depth * 3.0;

          /* Outer halo */
          let grad = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, s * 6);
          grad.addColorStop(0, `rgba(${r},${g},${b},${p.depth * 0.11})`);
          grad.addColorStop(1, 'transparent');
          ctx.beginPath(); ctx.arc(p.sx, p.sy, s * 6, 0, 6.283);
          ctx.fillStyle = grad; ctx.fill();

          /* Mid bloom */
          grad = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, s * 2.2);
          grad.addColorStop(0, `rgba(${r},${g},${b},${p.depth * 0.48})`);
          grad.addColorStop(1, 'transparent');
          ctx.beginPath(); ctx.arc(p.sx, p.sy, s * 2.2, 0, 6.283);
          ctx.fillStyle = grad; ctx.fill();

          /* Core */
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, Math.max(0.4, s * 0.42), 0, 6.283);
          ctx.fillStyle = `rgba(${r},${g},${b},${0.65 + p.depth * 0.35})`;
          ctx.fill();
        }

        /* Vignette */
        const vig = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.68);
        vig.addColorStop(0,    'transparent');
        vig.addColorStop(0.55, 'transparent');
        vig.addColorStop(1,    'rgba(3,3,12,0.88)');
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, W, H);

      } catch (err) {
        /* Silently absorb canvas errors — never crash the React tree */
        console.warn('[NeuralBackground]', err);
      }

      raf = requestAnimationFrame(frame);
    };

    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <canvas
      ref={cvs}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
}