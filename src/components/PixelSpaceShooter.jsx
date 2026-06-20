/**
 * PixelSpaceShooter.jsx
 * Standalone pixel-art space shooter mini-game.
 * Controls: Arrow keys / A·D to move, Space to fire.
 * Props: onGameOver(finalScore) — called when the player dies.
 */
import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Canvas ────────────────────────────────────────────────────────────────
const W = 480;
const H = 580;
const PX = 3; // sprite pixel size

// ─── Palette ───────────────────────────────────────────────────────────────
const BG         = '#0A1C2A';
const WHITE      = '#FFFFFF';
const RED        = '#E30613';
const HUD_BG     = 'rgba(10,28,42,0.95)';
const HEART_OFF  = 'rgba(255,255,255,0.12)';
const STAR_BASE  = 'rgba(255,255,255,';

// ─── Pixel sprites (col × row, 1 = filled) ────────────────────────────────
const SHIP = [
  [0,0,0,1,0,0,0],
  [0,0,1,1,1,0,0],
  [0,1,1,1,1,1,0],
  [1,1,1,1,1,1,1],
  [1,0,1,1,1,0,1],
];

const ALIEN_A = [           // rows 0-1 (harder, 15pts × wave)
  [0,1,0,0,0,1,0],
  [0,0,1,1,1,0,0],
  [0,1,1,1,1,1,0],
  [1,1,0,1,0,1,1],
  [1,1,1,1,1,1,1],
  [0,1,0,0,0,1,0],
];

const ALIEN_B = [           // rows 2-3 (10pts × wave)
  [0,0,1,1,1,0,0],
  [0,1,1,0,1,1,0],
  [1,1,1,1,1,1,1],
  [1,0,0,1,0,0,1],
  [0,1,1,0,1,1,0],
  [1,0,1,0,1,0,1],
];

// Alternate animation frame
const ALIEN_A2 = [
  [1,0,0,0,0,0,1],
  [0,0,1,1,1,0,0],
  [0,1,1,1,1,1,0],
  [1,1,0,1,0,1,1],
  [0,1,1,1,1,1,0],
  [0,0,1,0,1,0,0],
];
const ALIEN_B2 = [
  [0,0,1,1,1,0,0],
  [1,1,1,0,1,1,1],
  [1,1,1,1,1,1,1],
  [0,0,0,1,0,0,0],
  [1,1,1,0,1,1,1],
  [0,1,0,0,0,1,0],
];

// ─── Helpers ───────────────────────────────────────────────────────────────
function drawSprite(ctx, sprite, x, y, px, color) {
  ctx.fillStyle = color;
  for (let r = 0; r < sprite.length; r++)
    for (let c = 0; c < sprite[r].length; c++)
      if (sprite[r][c])
        ctx.fillRect((x + c * px) | 0, (y + r * px) | 0, px, px);
}

function aabb(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x &&
         a.y < b.y + b.h && a.y + a.h > b.y;
}

function stars(n) {
  return Array.from({ length: n }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    spd: 0.25 + Math.random() * 1.1,
    sz: Math.random() < 0.78 ? 1 : 2,
    a: 0.25 + Math.random() * 0.75,
  }));
}

function spawnEnemies(wave) {
  const cols = 8, rows = 4;
  const ew = 7 * PX, eh = 6 * PX;
  const gx = 14, gy = 12;
  const ox = (W - (cols * ew + (cols - 1) * gx)) / 2;
  const oy = 50;
  const grid = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      grid.push({
        x: ox + c * (ew + gx),
        y: oy + r * (eh + gy),
        w: ew, h: eh,
        alive: true,
        type: r < 2 ? 'A' : 'B',
        fireT: 60 + Math.floor(Math.random() * 100),
      });
    }
  }
  return grid;
}

function fresh(wave = 1, score = 0, health = 3) {
  return {
    player: { x: W / 2 - (7 * PX) / 2, y: H - 72, w: 7 * PX, h: 5 * PX, spd: 4.5, inv: 0 },
    enemies: spawnEnemies(wave),
    pLasers: [],
    eLasers: [],
    stars: stars(90),
    keys: {},
    score,
    health,
    wave,
    tick: 0,
    shootCD: 0,
    eDir: 1,
    eSpd: Math.min(2.8, 0.55 + wave * 0.22),
    eDrop: 0,
    done: false,
    explosions: [],
    announce: 0,     // frames to show "WAVE N" text
    combo: 0,
  };
}

// ─── Component ─────────────────────────────────────────────────────────────
export default function PixelSpaceShooter({ onGameOver = () => {} }) {
  const canvasRef = useRef(null);
  const gRef      = useRef(null);
  const rafRef    = useRef(null);

  const [phase, setPhase]           = useState('start');  // 'start' | 'playing' | 'over'
  const [hudScore, setHudScore]     = useState(0);
  const [hudHealth, setHudHealth]   = useState(3);
  const [hudWave, setHudWave]       = useState(1);
  const [finalScore, setFinalScore] = useState(0);

  // ── Start / restart ────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    gRef.current = fresh(1, 0, 3);
    setHudScore(0);
    setHudHealth(3);
    setHudWave(1);
    setPhase('playing');
  }, []);

  // ── Game loop ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing') return;

    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    const g      = gRef.current;

    const onDown = (e) => {
      g.keys[e.code] = true;
      if (e.code === 'Space') e.preventDefault();
    };
    const onUp = (e) => { g.keys[e.code] = false; };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup',   onUp);

    const loop = () => {
      if (g.done) return;
      g.tick++;
      const t = g.tick;

      // ── Stars ────────────────────────────────────────────────────────
      g.stars.forEach(s => {
        s.y += s.spd;
        if (s.y > H) { s.y = 0; s.x = Math.random() * W; }
      });

      // ── Explosions ───────────────────────────────────────────────────
      g.explosions = g.explosions.filter(ex => ex.life > 0);
      g.explosions.forEach(ex => ex.life--);

      // ── Player move ──────────────────────────────────────────────────
      const p = g.player;
      if (g.keys['ArrowLeft'] || g.keys['KeyA'])
        p.x = Math.max(0, p.x - p.spd);
      if (g.keys['ArrowRight'] || g.keys['KeyD'])
        p.x = Math.min(W - p.w, p.x + p.spd);

      // ── Player shoot ─────────────────────────────────────────────────
      if (g.shootCD > 0) g.shootCD--;
      if (g.keys['Space'] && g.shootCD === 0) {
        g.pLasers.push({ x: p.x + p.w / 2 - 1.5, y: p.y - 4, w: 3, h: 14, spd: 9 });
        g.shootCD = 15;
      }

      // ── Laser movement ───────────────────────────────────────────────
      g.pLasers.forEach(l => { l.y -= l.spd; });
      g.pLasers = g.pLasers.filter(l => l.y + l.h > 0 && !l.dead);

      g.eLasers.forEach(l => { l.y += l.spd; });
      g.eLasers = g.eLasers.filter(l => l.y < H + 20 && !l.dead);

      // ── Enemy logic ──────────────────────────────────────────────────
      const alive = g.enemies.filter(e => e.alive);

      if (alive.length === 0) {
        // Wave clear
        g.wave++;
        g.enemies  = spawnEnemies(g.wave);
        g.eSpd     = Math.min(2.8, 0.55 + g.wave * 0.22);
        g.eDir     = 1;
        g.eDrop    = 0;
        g.eLasers  = [];
        g.announce = 100;
        setHudWave(g.wave);
      } else {
        // Boundary check → reverse + drop
        let minX = Infinity, maxX = -Infinity;
        alive.forEach(e => {
          if (e.x < minX) minX = e.x;
          if (e.x + e.w > maxX) maxX = e.x + e.w;
        });

        if (g.eDrop <= 0) {
          if ((g.eDir > 0 && maxX + g.eSpd > W - 2) ||
              (g.eDir < 0 && minX + g.eDir * g.eSpd < 2)) {
            g.eDir *= -1;
            g.eDrop = 20;
          }
        }

        const dy = g.eDrop > 0 ? Math.min(g.eDrop, 4) : 0;
        if (g.eDrop > 0) g.eDrop -= dy;

        alive.forEach(e => {
          e.x += g.eDir * g.eSpd;
          e.y += dy;

          // Enemy fire (only if no friendly in col below — simplified: random front-line)
          e.fireT--;
          if (e.fireT <= 0) {
            const rate = Math.max(28, 90 - g.wave * 7);
            e.fireT = rate + Math.floor(Math.random() * 50);
            g.eLasers.push({
              x: e.x + e.w / 2 - 1.5,
              y: e.y + e.h,
              w: 3, h: 12,
              spd: 2.8 + g.wave * 0.35,
            });
          }

          // Enemy breaches player line
          if (e.y + e.h > p.y + 8 && p.inv <= 0) {
            e.alive = false;
            g.health--;
            p.inv = 80;
            g.explosions.push({ x: e.x + e.w / 2, y: e.y + e.h / 2, r: 18, life: 22, max: 22 });
          }
        });
      }

      // ── Collision: player lasers ↔ enemies ───────────────────────────
      g.pLasers.forEach(l => {
        g.enemies.forEach(e => {
          if (!e.alive || l.dead) return;
          if (aabb(l, e)) {
            e.alive = false;
            l.dead  = true;
            const pts = (e.type === 'A' ? 15 : 10) * g.wave;
            g.score += pts;
            g.explosions.push({ x: e.x + e.w / 2, y: e.y + e.h / 2, r: 20, life: 24, max: 24 });
          }
        });
      });
      g.pLasers = g.pLasers.filter(l => !l.dead);

      // ── Collision: enemy lasers ↔ player ────────────────────────────
      if (p.inv <= 0) {
        g.eLasers.forEach(l => {
          if (l.dead) return;
          if (aabb(l, p)) {
            l.dead = true;
            g.health--;
            p.inv = 80;
            g.explosions.push({ x: p.x + p.w / 2, y: p.y + p.h / 2, r: 24, life: 28, max: 28 });
          }
        });
        g.eLasers = g.eLasers.filter(l => !l.dead);
      }
      if (p.inv > 0) p.inv--;

      // ── Game over check ──────────────────────────────────────────────
      if (g.health <= 0) {
        g.health = 0;
        g.done   = true;
        setFinalScore(g.score);
        setPhase('over');
        onGameOver(g.score);
      }

      // ── HUD sync (throttled) ─────────────────────────────────────────
      if (t % 3 === 0) {
        setHudScore(g.score);
        setHudHealth(g.health);
      }

      // ════════════════════════════════════════════════════════════════
      //  RENDER
      // ════════════════════════════════════════════════════════════════

      // Background
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, W, H);

      // Stars
      g.stars.forEach(s => {
        ctx.fillStyle = `${STAR_BASE}${s.a})`;
        ctx.fillRect(s.x | 0, s.y | 0, s.sz, s.sz);
      });

      // ── HUD bar ──────────────────────────────────────────────────────
      ctx.fillStyle = HUD_BG;
      ctx.fillRect(0, 0, W, 38);
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, 38); ctx.lineTo(W, 38); ctx.stroke();

      ctx.font = 'bold 13px "Courier New",monospace';
      ctx.textAlign = 'left';
      ctx.fillStyle = WHITE;
      ctx.fillText(`SCORE  ${String(g.score).padStart(7, '0')}`, 12, 24);

      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.font = '11px "Courier New",monospace';
      ctx.fillText(`WAVE ${g.wave}`, W / 2, 24);

      // Hearts (right side)
      ctx.font = '15px serif';
      ctx.textAlign = 'right';
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = i < g.health ? RED : HEART_OFF;
        ctx.fillText('♥', W - 10 - i * 22, 25);
      }

      // ── Explosions ───────────────────────────────────────────────────
      g.explosions.forEach(ex => {
        const frac   = 1 - ex.life / ex.max;
        const radius = ex.r * (0.3 + frac * 0.7);
        const alpha  = ex.life / ex.max;
        const grad   = ctx.createRadialGradient(ex.x, ex.y, 0, ex.x, ex.y, radius);
        grad.addColorStop(0,   `rgba(255,240,180,${alpha})`);
        grad.addColorStop(0.35,`rgba(255,90,0,${alpha * 0.9})`);
        grad.addColorStop(0.7, `rgba(227,6,19,${alpha * 0.5})`);
        grad.addColorStop(1,   'rgba(10,28,42,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(ex.x, ex.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // ── Player ───────────────────────────────────────────────────────
      const showPlayer = p.inv === 0 || Math.floor(t / 4) % 2 === 0;
      if (showPlayer) {
        // Engine flame (animated)
        const fh = 4 + (t % 6 < 3 ? 2 : 0);
        const cx = (p.x + p.w / 2) | 0;
        const py2 = (p.y + p.h) | 0;
        ctx.fillStyle = 'rgba(255,140,0,0.95)';
        ctx.fillRect(cx - 3, py2, 6, fh + 2);
        ctx.fillStyle = 'rgba(255,220,60,0.8)';
        ctx.fillRect(cx - 1, py2, 3, fh);
        ctx.fillStyle = 'rgba(255,255,200,0.5)';
        ctx.fillRect(cx, py2, 1, fh - 1);

        // Ship glow
        ctx.shadowColor = 'rgba(180,200,255,0.4)';
        ctx.shadowBlur  = 8;
        drawSprite(ctx, SHIP, p.x | 0, p.y | 0, PX, WHITE);
        ctx.shadowBlur = 0;
      }

      // ── Player lasers ────────────────────────────────────────────────
      ctx.shadowColor = 'rgba(180,220,255,0.9)';
      ctx.shadowBlur  = 8;
      ctx.fillStyle   = WHITE;
      g.pLasers.forEach(l => {
        ctx.fillRect(l.x | 0, l.y | 0, l.w, l.h);
      });
      ctx.shadowBlur = 0;

      // ── Enemies ──────────────────────────────────────────────────────
      const frame = Math.floor(t / 28) % 2; // animate every 28 ticks
      ctx.shadowColor = RED;
      ctx.shadowBlur  = 10;
      g.enemies.forEach(e => {
        if (!e.alive) return;
        const sp = e.type === 'A'
          ? (frame === 0 ? ALIEN_A : ALIEN_A2)
          : (frame === 0 ? ALIEN_B : ALIEN_B2);
        drawSprite(ctx, sp, e.x | 0, e.y | 0, PX, RED);
      });
      ctx.shadowBlur = 0;

      // ── Enemy lasers ─────────────────────────────────────────────────
      ctx.shadowColor = RED;
      ctx.shadowBlur  = 7;
      ctx.fillStyle   = RED;
      g.eLasers.forEach(l => {
        ctx.fillRect(l.x | 0, l.y | 0, l.w, l.h);
      });
      ctx.shadowBlur = 0;

      // ── Wave announcement ────────────────────────────────────────────
      if (g.announce > 0) {
        const a = g.announce > 70 ? (100 - g.announce) / 30
                : g.announce < 30  ? g.announce / 30 : 1;
        ctx.globalAlpha = a;
        ctx.fillStyle   = WHITE;
        ctx.font        = 'bold 30px "Courier New",monospace';
        ctx.textAlign   = 'center';
        ctx.shadowColor = RED;
        ctx.shadowBlur  = 16;
        ctx.fillText(`— WAVE ${g.wave} —`, W / 2, H / 2);
        ctx.shadowBlur  = 0;
        ctx.globalAlpha = 1;
        g.announce--;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup',   onUp);
    };
  }, [phase, onGameOver]);

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div style={styles.wrap}>
      {/* Title bar */}
      <div style={styles.titleBar}>
        <span style={styles.titleText}>⚡ PIXEL SPACE SHOOTER</span>
        <span style={styles.subtitle}>Arrow Keys / A·D · Space to fire</span>
      </div>

      <div style={styles.canvasWrap}>
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          style={styles.canvas}
        />

        {/* ── Start overlay ─────────────────────────────────────────── */}
        {phase === 'start' && (
          <div style={styles.overlay}>
            <div style={styles.pixelTitle}>PIXEL</div>
            <div style={styles.pixelSubtitle}>SPACE SHOOTER</div>
            <div style={styles.divider} />
            <div style={styles.controlsGrid}>
              <span style={styles.key}>←  →</span><span style={styles.keyLabel}>Move ship</span>
              <span style={styles.key}>A  D</span><span style={styles.keyLabel}>Move ship</span>
              <span style={styles.key}>SPACE</span><span style={styles.keyLabel}>Fire laser</span>
            </div>
            <div style={styles.divider} />
            <div style={{ marginBottom: 28 }}>
              <div style={styles.legend}>
                <span style={{ color: WHITE }}>▮</span>
                <span style={styles.legendText}>Your ship &amp; lasers</span>
              </div>
              <div style={styles.legend}>
                <span style={{ color: RED }}>▮</span>
                <span style={styles.legendText}>Enemy ships &amp; fire</span>
              </div>
            </div>
            <button style={styles.btn} onClick={startGame}
              onMouseEnter={e => e.target.style.background = '#c00510'}
              onMouseLeave={e => e.target.style.background = RED}>
              ▶  START GAME
            </button>
          </div>
        )}

        {/* ── Game Over overlay ──────────────────────────────────────── */}
        {phase === 'over' && (
          <div style={styles.overlay}>
            <div style={styles.gameOverTitle}>GAME OVER</div>
            <div style={styles.finalLabel}>FINAL SCORE</div>
            <div style={styles.finalScore}>{String(finalScore).padStart(7, '0')}</div>

            {finalScore >= 500 && (
              <div style={styles.medal}>
                {finalScore >= 2000 ? '🏆 LEGENDARY' : finalScore >= 1000 ? '🥇 ACE PILOT' : '🥈 SHARP SHOT'}
              </div>
            )}

            <div style={styles.divider} />
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'monospace', marginBottom: 24 }}>
              Score logged via onGameOver callback
            </div>
            <button style={styles.btn} onClick={startGame}
              onMouseEnter={e => e.target.style.background = '#c00510'}
              onMouseLeave={e => e.target.style.background = RED}>
              ↺  PLAY AGAIN
            </button>
          </div>
        )}
      </div>

      {/* Live HUD below canvas (mirrors canvas HUD for accessibility) */}
      {phase === 'playing' && (
        <div style={styles.liveHud}>
          <span style={styles.hudItem}>SCORE <strong style={{ color: WHITE }}>{String(hudScore).padStart(7,'0')}</strong></span>
          <span style={styles.hudItem}>WAVE <strong style={{ color: RED }}>{hudWave}</strong></span>
          <span style={styles.hudItem}>
            {[0,1,2].map(i => (
              <span key={i} style={{ color: i < hudHealth ? RED : 'rgba(255,255,255,0.15)', marginLeft: 4, fontSize: 16 }}>♥</span>
            ))}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = {
  wrap: {
    display:        'flex',
    flexDirection:  'column',
    alignItems:     'center',
    background:     '#060c14',
    borderRadius:   12,
    padding:        '0 0 16px',
    userSelect:     'none',
    boxShadow:      '0 0 40px rgba(227,6,19,0.15)',
    border:         '1px solid rgba(255,255,255,0.07)',
    maxWidth:       W + 2,
  },
  titleBar: {
    width:          '100%',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'space-between',
    padding:        '10px 16px',
    borderBottom:   '1px solid rgba(255,255,255,0.07)',
  },
  titleText: {
    color:          WHITE,
    fontFamily:     '"Courier New",monospace',
    fontWeight:     700,
    fontSize:       13,
    letterSpacing:  2,
  },
  subtitle: {
    color:          'rgba(255,255,255,0.35)',
    fontFamily:     '"Courier New",monospace',
    fontSize:       11,
  },
  canvasWrap: {
    position:       'relative',
    lineHeight:     0,
  },
  canvas: {
    display:        'block',
    borderLeft:     '1px solid rgba(255,255,255,0.06)',
    borderRight:    '1px solid rgba(255,255,255,0.06)',
  },
  overlay: {
    position:       'absolute',
    inset:          0,
    display:        'flex',
    flexDirection:  'column',
    alignItems:     'center',
    justifyContent: 'center',
    background:     'rgba(6,12,20,0.93)',
    backdropFilter: 'blur(3px)',
  },
  pixelTitle: {
    color:          WHITE,
    fontSize:       52,
    fontWeight:     900,
    fontFamily:     '"Courier New",monospace',
    letterSpacing:  10,
    lineHeight:     1,
    textShadow:     `0 0 20px rgba(255,255,255,0.3)`,
  },
  pixelSubtitle: {
    color:          RED,
    fontSize:       24,
    fontWeight:     900,
    fontFamily:     '"Courier New",monospace',
    letterSpacing:  6,
    lineHeight:     1,
    marginTop:      6,
    textShadow:     `0 0 16px ${RED}`,
  },
  divider: {
    width:          160,
    height:         1,
    background:     'rgba(255,255,255,0.12)',
    margin:         '22px 0',
  },
  controlsGrid: {
    display:        'grid',
    gridTemplateColumns: 'auto auto',
    gap:            '8px 16px',
    alignItems:     'center',
  },
  key: {
    background:     'rgba(255,255,255,0.08)',
    border:         '1px solid rgba(255,255,255,0.2)',
    color:          WHITE,
    fontFamily:     '"Courier New",monospace',
    fontSize:       12,
    fontWeight:     700,
    padding:        '3px 10px',
    borderRadius:   4,
    textAlign:      'center',
    letterSpacing:  2,
  },
  keyLabel: {
    color:          'rgba(255,255,255,0.55)',
    fontFamily:     '"Courier New",monospace',
    fontSize:       12,
  },
  legend: {
    display:        'flex',
    alignItems:     'center',
    gap:            8,
    marginBottom:   6,
  },
  legendText: {
    color:          'rgba(255,255,255,0.5)',
    fontFamily:     '"Courier New",monospace',
    fontSize:       12,
  },
  btn: {
    background:     RED,
    color:          WHITE,
    border:         'none',
    padding:        '13px 36px',
    fontSize:       14,
    fontWeight:     700,
    letterSpacing:  3,
    fontFamily:     '"Courier New",monospace',
    cursor:         'pointer',
    borderRadius:   4,
    transition:     'background 0.15s',
    boxShadow:      `0 0 20px rgba(227,6,19,0.4)`,
  },
  gameOverTitle: {
    color:          RED,
    fontSize:       38,
    fontWeight:     900,
    fontFamily:     '"Courier New",monospace',
    letterSpacing:  6,
    textShadow:     `0 0 20px ${RED}`,
  },
  finalLabel: {
    color:          'rgba(255,255,255,0.4)',
    fontFamily:     '"Courier New",monospace',
    fontSize:       12,
    letterSpacing:  4,
    marginTop:      16,
  },
  finalScore: {
    color:          WHITE,
    fontSize:       54,
    fontWeight:     900,
    fontFamily:     '"Courier New",monospace',
    margin:         '6px 0 12px',
    textShadow:     '0 0 16px rgba(255,255,255,0.4)',
  },
  medal: {
    color:          WHITE,
    fontFamily:     '"Courier New",monospace',
    fontSize:       13,
    letterSpacing:  2,
    background:     'rgba(255,255,255,0.07)',
    padding:        '6px 16px',
    borderRadius:   20,
    border:         '1px solid rgba(255,255,255,0.15)',
  },
  liveHud: {
    display:        'flex',
    alignItems:     'center',
    gap:            32,
    marginTop:      10,
    padding:        '6px 16px',
    background:     'rgba(10,28,42,0.6)',
    borderRadius:   6,
    border:         '1px solid rgba(255,255,255,0.07)',
  },
  hudItem: {
    color:          'rgba(255,255,255,0.5)',
    fontFamily:     '"Courier New",monospace',
    fontSize:       12,
    letterSpacing:  2,
    display:        'flex',
    alignItems:     'center',
    gap:            6,
  },
};
