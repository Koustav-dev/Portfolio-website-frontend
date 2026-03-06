import { useRef, useEffect } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
}

const HeroCanvas = () => {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const mouseRef     = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    // Do not run canvas on touch/mobile devices — saves huge GPU cost
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth  * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const w = () => canvas.offsetWidth;
    const h = () => canvas.offsetHeight;

    // Reduced particle count from 80 → 50 on desktop
    const count = Math.min(50, Math.floor((w() * h()) / 20000));
    particlesRef.current = Array.from({ length: count }, () => ({
      x:       Math.random() * w(),
      y:       Math.random() * h(),
      vx:      (Math.random() - 0.5) * 0.3,
      vy:      (Math.random() - 0.5) * 0.3,
      size:    Math.random() * 1.8 + 0.4,
      opacity: Math.random() * 0.25 + 0.08,
      hue:     230 + Math.random() * 30,
    }));

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.addEventListener("mousemove", handleMouse);

    // Spatial grid for O(n) connection check instead of O(n²)
    const CELL = 120;
    const buildGrid = (particles: Particle[], cw: number, ch: number) => {
      const cols = Math.ceil(cw / CELL) + 1;
      const grid: Map<number, number[]> = new Map();
      particles.forEach((p, idx) => {
        const cx = Math.floor(p.x / CELL);
        const cy = Math.floor(p.y / CELL);
        const key = cy * cols + cx;
        if (!grid.has(key)) grid.set(key, []);
        grid.get(key)!.push(idx);
      });
      return { grid, cols };
    };

    // Frame counter — only rebuild grid every 3 frames
    let frame = 0;
    let cachedGrid: ReturnType<typeof buildGrid> | null = null;

    const render = () => {
      ctx.clearRect(0, 0, w(), h());
      const particles = particlesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const cw = w();
      const ch = h();

      // Update positions
      particles.forEach((p) => {
        const dx   = p.x - mx;
        const dy   = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 && dist > 0) {
          const force = ((150 - dist) / 150) * 0.5;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x  += p.vx;
        p.y  += p.vy;
        if (p.x < 0) p.x = cw;
        if (p.x > cw) p.x = 0;
        if (p.y < 0) p.y = ch;
        if (p.y > ch) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 50%, 60%, ${p.opacity})`;
        ctx.fill();
      });

      // Rebuild grid every 3 frames only
      frame++;
      if (frame % 3 === 0 || !cachedGrid) {
        cachedGrid = buildGrid(particles, cw, ch);
      }
      const { grid, cols } = cachedGrid;

      // Draw connections using spatial grid — only check nearby cells
      ctx.lineWidth = 0.5;
      particles.forEach((p, i) => {
        const cx = Math.floor(p.x / CELL);
        const cy = Math.floor(p.y / CELL);
        for (let ox = -1; ox <= 1; ox++) {
          for (let oy = -1; oy <= 1; oy++) {
            const key = (cy + oy) * cols + (cx + ox);
            const cell = grid.get(key);
            if (!cell) continue;
            cell.forEach((j) => {
              if (j <= i) return;
              const dx   = p.x - particles[j].x;
              const dy   = p.y - particles[j].y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `hsla(230, 40%, 60%, ${0.06 * (1 - dist / 120)})`;
                ctx.stroke();
              }
            });
          }
        }
      });

      animationRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouse);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ opacity: 0.6 }}
    />
  );
};

export default HeroCanvas;
