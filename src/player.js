class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 16;
    this.speed = 5;
    this.time = 0;
    this.targetX = null;
    this.targetY = null;
  }

  setTarget(worldX, worldY) {
    this.targetX = worldX;
    this.targetY = worldY;
  }

  update(dt, keys) {
    this.time += dt;
    const spd = this.speed * dt;

    let moved = false;

    // Keyboard
    if (keys['ArrowUp']    || keys['w'] || keys['W']) { this.x -= spd * 0.5; this.y -= spd * 0.5; moved = true; }
    if (keys['ArrowDown']  || keys['s'] || keys['S']) { this.x += spd * 0.5; this.y += spd * 0.5; moved = true; }
    if (keys['ArrowLeft']  || keys['a'] || keys['A']) { this.x -= spd * 0.5; this.y += spd * 0.5; moved = true; }
    if (keys['ArrowRight'] || keys['d'] || keys['D']) { this.x += spd * 0.5; this.y -= spd * 0.5; moved = true; }

    // Tap-to-move
    if (!moved && this.targetX !== null) {
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 0.15) {
        this.x += (dx / dist) * spd;
        this.y += (dy / dist) * spd;
      } else {
        this.targetX = null;
        this.targetY = null;
      }
    }

    this.x = Math.max(0.5, Math.min(ISO.GRID_SIZE - 1.5, this.x));
    this.y = Math.max(0.5, Math.min(ISO.GRID_SIZE - 1.5, this.y));
  }

  absorb(obj) {
    this.size = Math.min(this.size + obj.size * 0.25, 80);
  }

  draw(ctx, sx, sy) {
    const pulse = Math.sin(this.time * 3) * 0.12 + 0.88;
    const r = this.size * pulse;
    const cx = sx;
    const cy = sy - r * 0.4;

    // Outer glow
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 3.5);
    glow.addColorStop(0, 'rgba(0, 212, 255, 0.35)');
    glow.addColorStop(1, 'rgba(0, 212, 255, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Shadow on tile
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(sx, sy, r * 0.9, r * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Orb body
    const orb = ctx.createRadialGradient(cx - r * 0.25, cy - r * 0.35, r * 0.05, cx, cy, r);
    orb.addColorStop(0, '#FFFFFF');
    orb.addColorStop(0.35, '#00D4FF');
    orb.addColorStop(1, '#003D6B');
    ctx.fillStyle = orb;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // Lightning sparks
    ctx.strokeStyle = '#FFE700';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + this.time * 2.5;
      const x1 = cx + Math.cos(angle) * r;
      const y1 = cy + Math.sin(angle) * r;
      const mx = cx + Math.cos(angle) * (r * 1.6) + (Math.random() - 0.5) * 6;
      const my = cy + Math.sin(angle) * (r * 1.6) + (Math.random() - 0.5) * 6;
      const x2 = cx + Math.cos(angle) * (r * 2.1);
      const y2 = cy + Math.sin(angle) * (r * 2.1);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(mx, my);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }
}